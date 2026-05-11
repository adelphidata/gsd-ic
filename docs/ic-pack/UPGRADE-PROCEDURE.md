<!-- CLASSIFICATION: UNCLASSIFIED -->
# Dev-Side Upgrade Procedure: Soft-Fork Sync from Upstream

## Audience and scope

This document is for **maintainers of the `adelphidata/gsd-ic` dev repo** performing an upstream sync — pulling improvements from `gsd-build/get-shit-done` into the soft-fork.

This is **not** for program engineers consuming the published `@adelphi/gsd-ic` npm package. Consumer upgrade (bumping the installed pack version inside a program repo) is covered in [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md).

## Prerequisites

1. **`upstream` remote configured.** If not already set:
   ```bash
   git remote add upstream https://github.com/gsd-build/get-shit-done.git
   ```
2. **Clean working tree.** The sync script enforces this; commit or stash any in-progress work before starting.
3. **On `main`** (or a dedicated sync-prep branch, e.g. `sync/upstream-YYYY-MM-DD`).
4. **Node 22+** — the script calls `node -e ...` to extract the upstream version from `package.upstream.json`.

## Step 1: Dry-run the sync

Before merging, scope the incoming changes:

```bash
npm run sync-upstream -- --no-merge
```

This calls `tools/sync/sync-from-upstream.sh --no-merge`, which fetches `upstream` and prints the list of commits that would be merged (`git log --oneline <branch>..upstream/main`) without touching the working tree. Use this output to identify whether the incoming commits touch conflict-prone zones (see Step 3) before committing to a full merge.

## Step 2: Run the sync

```bash
npm run sync-upstream
```

This calls `tools/sync/sync-from-upstream.sh` and performs the following in order:

1. Validates that the working tree is clean and the `upstream` remote is configured.
2. Fetches `upstream` and reports how many commits behind the local branch is.
3. Merges `upstream/main` with `--no-edit`. If the merge produces conflicts, the script exits non-zero and prompts you to resolve them manually before re-running validators.
4. Refreshes `package.upstream.json` with upstream's `package.json` content, then reads the upstream version from that file.
5. Updates `VERSION`'s `gsd_pinned:` field to the upstream version just merged (Step 4 covers the manual path if you resolved conflicts outside the script).
6. Strips upstream-only files that must not ship in the pack (localized READMEs, upstream GitHub Actions workflows that reference build targets the IC pack does not carry).
7. Reapplies workflow patches via `bash tools/patch-workflows.sh`.
8. Runs the full validator suite via `bash tools/ci/_run-all.sh --continue`.

If the script exits cleanly, all validators passed and the working tree is ready to review and push.

## Step 3: Resolve conflicts (if any)

The merge exits non-zero on conflicts. Common conflict zones:

| Zone | What to do |
|---|---|
| `package.json` | Keep the IC-pack `version`, `name`, `description`, `files`, and `scripts` fields. Take upstream additions to `dependencies`/`devDependencies`. |
| `agents/gsd-*.md` | If upstream renamed or removed an agent the IC pack extends, check whether the IC pack's version should follow the rename or remain separate. Cross-reference the completion-marker registry at `references/agent-contracts.ic-pack.md`. |
| `commands/` and `skills/` upstream | Take upstream additions unless they clash with a pack-owned override. Pack-owned overrides live in `workflow-patches/` and must remain intact. |
| `workflow-patches/` | Conflict here is a smell — upstream should not be touching pack-owned workflow patches. Treat as pack-wins and escalate if the upstream change was intentional. |

After resolving:

```bash
git add <resolved-files>
npm run ci
```

`npm run ci` re-runs the full validator suite and will surface any remaining issues before you continue.

## Step 4: Update gsd_pinned in VERSION

The sync script automatically updates `VERSION`'s `gsd_pinned:` field when it runs cleanly. If you resolved conflicts manually and ran the script piecemeal, verify the field is correct:

```bash
# Check current value:
cat VERSION

# If it needs updating:
# Edit VERSION: change gsd_pinned: <old> → gsd_pinned: <new-upstream-version>
```

The `gsd_pinned:` value must match the `version` field in upstream's `package.json` at the merged commit. Also check `package.json`'s `peerDependencies` range — if upstream performed a major version bump, update the range to include the new major:

```json
"peerDependencies": {
  "get-shit-done-cc": ">=1.39.0-rc.4 <3.0.0"
}
```

## Step 5: Run the full validator suite

```bash
npm run ci           # canonical gate — runs all 12 validators via tools/ci/_run-all.sh
npm run test:validators  # same validators via the test harness
npm test             # full test suite including install tests
```

The 12 validators and what each checks:

| Validator | What it checks |
|---|---|
| `validate-manifest.sh` | `intel-refs/MANIFEST.json` schema, required fields, no orphaned entries |
| `validate-completion-markers.sh` | Every agent emits exactly one marker matching the enforced regex |
| `validate-classification.sh` | Every shipped markdown has a valid `classification:` frontmatter field and banner |
| `validate-workflow-patches.sh` | Workflow-patch templates are syntactically valid and apply cleanly |
| `validate-triggers.sh` | All trigger strings in gates/patches match the `<workflow>.<step>` slug form |
| `validate-reference-staleness.sh` | No reference doc has a `last_reviewed` date older than the staleness threshold |
| `validate-audit-log.sh` | Audit-log entries are well-formed and in chronological order |
| `validate-agents.sh` | Agent frontmatter fields are present and valid; agent names match filename |
| `validate-skills.sh` | Skill files are well-formed and listed in the manifest |
| `validate-publish-scope.sh` | `package.json` `files[]` contains only pack-owned paths (no upstream source leak) |
| `validate-no-classified-leak.sh` | No file in the pack contains a classified-marking pattern from `hooks/patterns/classified-markings.json` |
| `validate-seamless-fork.sh` | With all IC gates and hooks disabled, stock GSD behavior is unaltered (see Step 6) |

## Step 6: Run the seamless-fork validator

This is the most load-bearing validator for syncs because an upstream merge can inadvertently alter pack-owned workflow patches or introduce content that bleeds into the stock GSD execution path:

```bash
bash tools/ci/validate-seamless-fork.sh
```

The validator verifies that with every IC gate in `.planning/intel-gates.json` set to `enabled: false` and hooks disabled, no IC-pack content modifies a stock GSD program's behavior. Workflow patches must be idempotent; hooks must respect `enabled: false`; refs must not auto-load; agents must not auto-spawn.

If this validator fails after an upstream sync, treat it as a blocking issue — do not push until resolved.

## Step 7: Smoke-test install

After all validators pass, confirm the published artifact installs cleanly against a stock GSD environment:

```bash
# Pack the artifact
npm pack
# → adelphi-gsd-ic-0.1.0.tgz (name will match VERSION pack field)

# In a scratch directory with a stock GSD install:
cd /tmp/smoke-test
npx get-shit-done-cc@latest           # install stock GSD if not already present
npx /path/to/adelphi-gsd-ic-0.1.0.tgz install --customer=nga
```

Expected: install completes without errors, agents appear under `.claude/agents/gsd-*.md`, hooks are registered in `.claude/settings.json`, and the manifest validates:

```bash
bash .claude/get-shit-done/tools/ci/validate-manifest.sh
```

## Step 8: Commit + open PR

```bash
git add -p    # stage reviewed changes; avoid bulk-staging unreviewed files
git commit -m "chore(sync): upstream sync to gsd-build/get-shit-done@<upstream-version>"

git push origin <branch>
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "chore(sync): upstream sync to <upstream-version>" \
  --body "Merges upstream changes through <upstream-version>. All 12 validators pass. Seamless-fork validator green. Smoke-tested install against nga overlay."
```

After CI is green, squash-merge the PR. Do not force-push or skip hooks.

## Reference: soft-fork tracking procedure (spec §11.1)

The authoritative procedure is in the design spec at:

```
docs/specs/2026-05-05-ic-agent-pack-design.md
```

Section **§11.1 Soft Fork Tracking Procedure (dev-side workflow)** at line 958. The spec section provides the architectural rationale for the soft-fork model and the VERSION-file format (`pack:` + `gsd_pinned:`). This document is the operational runbook derived from that section.
