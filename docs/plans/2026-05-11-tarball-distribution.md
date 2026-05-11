# Tarball Distribution + Docs Cleanup (Post-v1 Track #4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan task-by-task. Sonnet implementers + reviewers. Each task carries spec+quality review unless explicitly batched.

**Goal:** Stop assuming public npm publish. Update repo and docs to reflect tarball-only distribution: `npm pack` produces `adelphi-gsd-ic-<version>.tgz`, distributed via internal Adelphi channels. Consumers install via `npx /path/to/tarball install --customer=<slug>`. Add guards against accidental public publish. Document the maintainer release workflow.

**Architecture:** Distribution model is "local-tarball, internal-only" (per user decision). Package.json gets `"private": true` to harden against accidental `npm publish`. The existing `tools/release/release-pack.sh` is updated to drop the publish-related guidance. Consumer-facing docs (README, QUICKSTART, CONSUMER-UPGRADE, TROUBLESHOOTING, ADDING-A-CUSTOMER-OVERLAY) are corrected to show real tarball commands. A new `docs/ic-pack/MAINTAINER-RELEASE.md` documents the cut-a-release workflow. CLI usage string in `parse-args.cjs` updated to match.

**Tech Stack:** Markdown, JSON, bash, JavaScript.

**Branch:** `tarball-distribution`. Squash-merge after CI green.

---

## Operating mode

- Controller creates `tarball-distribution` off `main` before T2.
- **One commit per task.** Commit message: `<scope>: <one-line>`.
- **Subagent dispatch:** sonnet `staff-software-engineer` for tasks; sonnet `code-review-enforcer` for one combined review pass on each task (no separate spec/quality split — these are surgical edits).
- **Forbidden-language scan** on every doc touched: zero hits on `stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]`.
- **No agent / skill / hook / ref-body content changes.**
- **No pack VERSION bump.** v0.1.0 stays.

---

## Distribution model facts

- **Consumer install command** changes from `npx @adelphi/gsd-ic@latest install --customer=<slug>` (registry-based) to `npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<slug>` (tarball-based).
- **Tarball name:** `adelphi-gsd-ic-<version>.tgz` (this is what `npm pack` produces from `@adelphi/gsd-ic@<version>`).
- **Where consumers get the tarball:** internal Adelphi distribution channel — placeholder phrasing for the docs since the actual channel (shared drive / S3 bucket / artifact server) is an org decision, not a repo decision. Refer to "your internal Adelphi distribution channel" or equivalent.
- **No "latest" channel.** Consumers must reference a specific tarball file.
- **Package name `@adelphi/gsd-ic` is retained** as the internal package identifier (it's the `name` field in `package.json`). We just never publish it to public npm. Internal install commands keep using the package's bin entry via the tarball.

---

## Inventory of references to update (verified at plan-write time)

`grep -n` results from prior survey (lines may shift):

| File | Lines | Type |
|---|---|---|
| `docs/ic-pack/README.md` | 6, 9 | Intro text + install command |
| `docs/ic-pack/QUICKSTART.md` | 32, 44, 66, 135, 199 | Install/uninstall commands + expected stderr |
| `docs/ic-pack/CONSUMER-UPGRADE.md` | 8, 33, 39, 51, 110, 113, 114 | Multiple upgrade-flow commands |
| `docs/ic-pack/TROUBLESHOOTING.md` | 5, 25, 50 | Failure-mode entries |
| `docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md` | 158 | Single stale reference (line 133 already tarball-based) |
| `bin/lib/gsd-ic/parse-args.cjs` | USAGE constant | CLI usage string |
| `package.json` | 6, 7-9 | `"private": false` + `publishConfig` block |
| `tools/release/release-pack.sh` | comments + final-step instructions | Removes npm publish guidance |

The training docs (`HANDS-ON-SCAFFOLD-A-PROTOTYPE.md`) already use the tarball flow correctly — no changes needed there.

The `UPGRADE-PROCEDURE.md` (dev-side soft-fork sync) doesn't need changes — it's already tarball-based for smoke testing.

---

## Task 1: Plan + branch setup (controller-only)

- [ ] **Step 1: Branch + commit plan**

```bash
git checkout -b tarball-distribution
git add docs/plans/2026-05-11-tarball-distribution.md
git commit -m "docs(plans): post-v1 track #4 — tarball distribution plan"
```

---

## Task 2: Harden `package.json` against accidental publish

**File:** `/Users/romansky/gsd-ic/package.json`.

- [ ] **Step 1: Update `"private"` field**

Change `"private": false` to `"private": true`. This makes `npm publish` error out with "This package has been marked as private", preventing accidental publication.

- [ ] **Step 2: Remove or repurpose `publishConfig` block**

The `publishConfig: { "access": "restricted" }` block exists for npm registry publishing. With `"private": true` it becomes inert. Drop it to reduce surface area and confusion.

Verify the diff is small: only the `private` line + `publishConfig` block removal.

- [ ] **Step 3: Confirm `npm pack` still works**

```bash
npm pack --dry-run
```

Expected: lists files that would be packed. No errors. The `private` field does NOT block `npm pack`.

- [ ] **Step 4: Confirm `npm publish` errors out**

```bash
npm publish --dry-run 2>&1 || true
```

Expected: error message containing "private" or "This package has been marked as private". (Use `|| true` so the test command doesn't fail the task.)

- [ ] **Step 5: Verify nothing else breaks**

```bash
npm run ci
```

Expected: all 12 validators OK.

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "package: mark as private; drop publishConfig (no public npm publish)"
```

---

## Task 3: Update `release-pack.sh`

**File:** `/Users/romansky/gsd-ic/tools/release/release-pack.sh`.

- [ ] **Step 1: Update header comment**

Current header says "After this script succeeds, the maintainer runs `npm publish --access=restricted` manually". Replace with new flow:

```
# release-pack.sh — bump pack version, tag, validate, build tarball.
#
# Usage:
#   tools/release/release-pack.sh --version=YYYY.MM.N
#
# After this script succeeds, the maintainer:
#   1. git push origin <branch> && git push origin v<version>
#   2. npm pack    (produces adelphi-gsd-ic-<version>.tgz)
#   3. Upload the .tgz to Adelphi's internal distribution channel.
#
# The pack is NEVER published to a public npm registry. See package.json
# "private": true.
```

- [ ] **Step 2: Update final-message block**

Current ends with "Next steps: 1. Review npm pack..., 2. git push..., 3. npm publish --access=restricted". Replace step 3 with:

```
echo "      3. npm pack    (produces adelphi-gsd-ic-$new_version.tgz)"
echo "      4. Upload tarball to internal distribution channel."
echo "      (Do NOT run 'npm publish' — package is marked private.)"
```

- [ ] **Step 3: Verify script syntax**

```bash
bash -n tools/release/release-pack.sh
```

Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add tools/release/release-pack.sh
git commit -m "tools(release): release-pack.sh produces tarball; no npm publish"
```

---

## Task 4: Update `parse-args.cjs` USAGE string

**File:** `/Users/romansky/gsd-ic/bin/lib/gsd-ic/parse-args.cjs`.

- [ ] **Step 1: Read current USAGE constant**

The constant currently includes:
```
Usage:
  npx @adelphi/gsd-ic install --customer=<name> [--target=<path>]
  npx @adelphi/gsd-ic uninstall [--target=<path>]
```

- [ ] **Step 2: Update USAGE**

Replace registry-style commands with tarball-style:

```
Usage:
  npx <path-to-adelphi-gsd-ic-<version>.tgz> install --customer=<name> [--target=<path>]
  npx <path-to-adelphi-gsd-ic-<version>.tgz> uninstall [--target=<path>]

The pack is distributed as a local tarball (not published to a public npm registry).
Obtain the tarball from your Adelphi internal distribution channel, then invoke
the install/uninstall subcommand via npx pointing at the tarball path.
```

Also update Examples to use tarball-style paths.

- [ ] **Step 3: Verify `npm test:install` still passes**

```bash
npm run test:install
```

Expected: all install-flow tests pass. The USAGE string is shown to users in `--help`; if a test asserts on its content, update the test fixture too (read `tests/install/*.test.cjs` first to check).

- [ ] **Step 4: Commit**

```bash
git add bin/lib/gsd-ic/parse-args.cjs
# Add test files if they needed updating
git commit -m "bin: parse-args USAGE shows tarball-based install (no npm publish)"
```

---

## Task 5: Update `docs/ic-pack/README.md`

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/README.md`.

- [ ] **Step 1: Update intro text + install command**

Lines 4–10 currently say "It is distributed as the npm package `@adelphi/gsd-ic` and installed per program via: `npx @adelphi/gsd-ic@latest install --customer=...`". Replace with:

```markdown
It is distributed as a local npm tarball (`adelphi-gsd-ic-<version>.tgz`) — built locally with `npm pack` and shared via Adelphi's internal distribution channel. The pack is NOT published to a public npm registry. Per program install:

\`\`\`bash
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<nga|nsa|nro|cia|dia>
\`\`\`
```

- [ ] **Step 2: Verify length and forbidden-language scan**

```bash
wc -l docs/ic-pack/README.md   # was 65; expect 65-70 after edit (slight growth)
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/README.md
# expect zero hits
```

- [ ] **Step 3: Commit**

```bash
git add docs/ic-pack/README.md
git commit -m "docs(ic-pack): README shows tarball-based install (no public npm)"
```

---

## Task 6: Update `docs/ic-pack/QUICKSTART.md`

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/QUICKSTART.md` (currently 202 lines).

Five references to update (per the inventory table). Each one needs the same transform: `npx @adelphi/gsd-ic@latest install --customer=...` → `npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=...`.

- [ ] **Step 1: Add a "Obtaining the tarball" callout near Step 2**

Before showing the install command, add a brief paragraph:

```markdown
> **Prerequisite:** The IC pack ships as a tarball, not as a public npm package. Obtain `adelphi-gsd-ic-<version>.tgz` from your Adelphi distribution channel and note its local path. The install commands below use that path.
```

- [ ] **Step 2: Update each command-line reference**

Replace all 5 occurrences of `npx @adelphi/gsd-ic@latest` (and 1 occurrence of `npx @adelphi/gsd-ic@latest uninstall`) with `npx /path/to/adelphi-gsd-ic-<version>.tgz`.

The `expected output` block on line 44 quotes a literal `install complete: @adelphi/gsd-ic for customer=nga ...` — keep the `@adelphi/gsd-ic` in that line since it's the literal stderr from the install script (the package's internal identifier doesn't change).

- [ ] **Step 3: Verify length + forbidden-language scan**

```bash
wc -l docs/ic-pack/QUICKSTART.md   # was 202; expect 204-210
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/QUICKSTART.md
```

- [ ] **Step 4: Commit**

```bash
git add docs/ic-pack/QUICKSTART.md
git commit -m "docs(ic-pack): QUICKSTART shows tarball-based install flow"
```

---

## Task 7: Update `docs/ic-pack/CONSUMER-UPGRADE.md`

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/CONSUMER-UPGRADE.md` (currently 115 lines).

Seven references to update.

- [ ] **Step 1: Update "When to upgrade" section**

Line 8 currently says "Watch `@adelphi/gsd-ic` npm tags or the dev repo release notes." Replace with: "Watch the Adelphi internal distribution channel for new tarball releases, or the dev repo release notes."

- [ ] **Step 2: Update install/upgrade commands (lines 33, 39, 51)**

Replace `npx @adelphi/gsd-ic@latest install ...` with `npx /path/to/adelphi-gsd-ic-<new-version>.tgz install ...`. For version-pinned variants (line 39), replace `npx @adelphi/gsd-ic@<version>` with the appropriate `npx /path/to/adelphi-gsd-ic-<version>.tgz`.

- [ ] **Step 3: Update rollback commands (lines 110, 113, 114)**

Same transform: tarball-based.

- [ ] **Step 4: Verify length + forbidden-language scan**

```bash
wc -l docs/ic-pack/CONSUMER-UPGRADE.md   # was 115; expect 115-120
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/CONSUMER-UPGRADE.md
```

- [ ] **Step 5: Commit**

```bash
git add docs/ic-pack/CONSUMER-UPGRADE.md
git commit -m "docs(ic-pack): CONSUMER-UPGRADE shows tarball-based upgrade flow"
```

---

## Task 8: Update `docs/ic-pack/TROUBLESHOOTING.md`

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/TROUBLESHOOTING.md` (currently 234 lines).

Three references to update.

- [ ] **Step 1: Update intro/header (line 5)**

Line 5 references `@adelphi/gsd-ic` package — verify in context, may not need change if it's just naming the package by its identifier (which is fine). Read the line first.

- [ ] **Step 2: Update failure-mode entries (lines 25, 50)**

Line 25 (entry: "GSD not detected"): the re-run command currently shows `npx @adelphi/gsd-ic install --customer=...`. Replace with tarball form.

Line 50 (entry: "incompatible GSD version"): pin-to-older shown as `npx @adelphi/gsd-ic@<older> install`. Replace with: `npx /path/to/adelphi-gsd-ic-<older-version>.tgz install --customer=<name>`.

- [ ] **Step 3: Verify length + forbidden-language scan**

```bash
wc -l docs/ic-pack/TROUBLESHOOTING.md   # was 234; expect 234-238
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/TROUBLESHOOTING.md
```

- [ ] **Step 4: Commit**

```bash
git add docs/ic-pack/TROUBLESHOOTING.md
git commit -m "docs(ic-pack): TROUBLESHOOTING failure modes reference tarball install"
```

---

## Task 9: Update `docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md`

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md` (currently 170 lines).

One stale reference (line 158): `npx @adelphi/gsd-ic install --customer=<slug>`. Update to tarball form. Line 133 is already tarball-based — leave it alone.

- [ ] **Step 1: Update the one reference**

- [ ] **Step 2: Verify length + forbidden-language scan**

```bash
wc -l docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md
```

- [ ] **Step 3: Commit**

```bash
git add docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md
git commit -m "docs(ic-pack): ADDING-A-CUSTOMER-OVERLAY references tarball install"
```

---

## Task 10: Create `docs/ic-pack/MAINTAINER-RELEASE.md`

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/MAINTAINER-RELEASE.md`. Target 120–180 lines.

### Required outline (exact headings)

```
# Maintainer: Cutting a Pack Release
## Audience and scope
## Prerequisites
## Step 1: Decide the version number
## Step 2: Run the release script
## Step 3: Push the tag
## Step 4: Build the tarball
## Step 5: Upload to the internal distribution channel
## Step 6: Notify consumers
## What the release script automates
## What the release script does NOT do
## Rollback
```

### Per-section content

- **Audience and scope:** for `gsd-ic` repo maintainers. Cutting a release means: bumping the pack version, tagging git, building a tarball, uploading to the internal channel. This is distinct from upstream-sync (covered by [UPGRADE-PROCEDURE.md](UPGRADE-PROCEDURE.md)).

- **Prerequisites:** clean working tree on `main`, all validators green (`npm run ci`), maintainer has access to the internal distribution channel.

- **Step 1: Version number:** format `YYYY.MM.N` (per existing `release-pack.sh` validation regex). Increment N for patch releases within a calendar month; bump YYYY.MM for monthly releases.

- **Step 2: Run release script:** `bash tools/release/release-pack.sh --version=YYYY.MM.N`. The script validates, bumps `VERSION`, mirrors to `package.json`, tags `v<version>` locally, runs `npm pack --dry-run` preview.

- **Step 3: Push tag:** `git push origin main && git push origin v<version>`. The tag is the audit trail.

- **Step 4: Build tarball:** `npm pack` produces `adelphi-gsd-ic-<version>.tgz` in repo root. The tarball file size and contents should match the `--dry-run` preview from step 2.

- **Step 5: Upload to internal channel:** placeholder for org-specific instructions. Document the expectation: tarballs go to "Adelphi's internal distribution channel" (shared drive / S3 / artifact server — implementer should use neutral wording since the actual mechanism is org-decided, not in-repo).

- **Step 6: Notify consumers:** send release notes (commit message + tag) + tarball location to consuming programs. Consumers re-run install per [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md).

- **What the release script automates:** version validation, working-tree-clean check, validator suite, VERSION + package.json sync, git tag, `npm pack --dry-run` preview.

- **What it does NOT do:** push to remote, run `npm pack` (the actual build — done by maintainer afterward), upload tarball, notify consumers, publish to any npm registry.

- **Rollback:** delete the local tag (`git tag -d v<version>`), git reset to the pre-bump commit, do not push.

### Verification you MUST run

1. `wc -l docs/ic-pack/MAINTAINER-RELEASE.md` — 120-180.
2. Forbidden-language scan: zero hits.
3. All internal links resolve.
4. Classification banner at line 1.

### Commit

```bash
git add docs/ic-pack/MAINTAINER-RELEASE.md
git commit -m "docs(ic-pack): add MAINTAINER-RELEASE for tarball-cut workflow"
```

---

## Task 11: Update `docs/ic-pack/README.md` doc map (MAINTAINER-RELEASE link)

**File:** Modify `/Users/romansky/gsd-ic/docs/ic-pack/README.md`.

Add `MAINTAINER-RELEASE.md` to the doc map under "Contributing (dev-side)" subsection:

```markdown
- [MAINTAINER-RELEASE.md](MAINTAINER-RELEASE.md) — cut a pack release (version bump → tag → tarball → distribute)
```

Insert near the other dev-side docs (after UPGRADE-PROCEDURE.md is reasonable).

- [ ] **Step 1: Edit + verify**

```bash
wc -l docs/ic-pack/README.md
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/README.md
ls docs/ic-pack/MAINTAINER-RELEASE.md   # confirms link resolves
```

- [ ] **Step 2: Commit**

```bash
git add docs/ic-pack/README.md
git commit -m "docs(ic-pack): add MAINTAINER-RELEASE to README doc map"
```

---

## Task 12: Controller cross-ref sweep + PR

**Audience:** controller (you), not subagents.

- [ ] **Step 1: Confirm all task commits landed**

```bash
git log main..tarball-distribution --oneline | wc -l   # expect ~11-13
```

- [ ] **Step 2: Run forbidden-language scan across all touched docs**

```bash
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/README.md docs/ic-pack/QUICKSTART.md docs/ic-pack/CONSUMER-UPGRADE.md docs/ic-pack/TROUBLESHOOTING.md docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md docs/ic-pack/MAINTAINER-RELEASE.md
```

Expected: zero hits.

- [ ] **Step 3: Confirm no remaining `@adelphi/gsd-ic@latest` references in user-facing docs**

```bash
grep -n "npx @adelphi/gsd-ic@latest\|npx @adelphi/gsd-ic install\|@adelphi/gsd-ic@<" docs/ic-pack/*.md docs/ic-pack/training/*.md
```

Expected: zero hits except inside literal expected-stderr blocks (which echo the install script's internal package-identifier output).

- [ ] **Step 4: Confirm internal links resolve**

```bash
for f in docs/ic-pack/*.md docs/ic-pack/training/*.md; do
  grep -oE "\]\([^)]+\.md[^)]*\)" "$f" | sed -E 's/\]\(([^)]+)\)/\1/' | while read -r link; do
    target="${link%%#*}"
    base="$(dirname "$f")"
    [ -f "$base/$target" ] || echo "BROKEN: $f -> $link"
  done
done
```

Expected: no BROKEN lines.

- [ ] **Step 5: Run CI**

```bash
npm run ci
npm run test:validators
npm run test:install
```

Expected: all green.

- [ ] **Step 6: Confirm publish guard**

```bash
npm publish --dry-run 2>&1 | grep -i "private" || echo "WARN: private guard didn't trigger"
```

Expected: error message containing "private" (or similar — confirming `"private": true` blocks publish).

- [ ] **Step 7: Push + open PR**

```bash
git push -u origin tarball-distribution
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "feat: tarball-based distribution (no public npm publish) — post-v1 track #4" \
  --body "$(cat <<'EOF'
## Summary

Post-v1 track #4 — establishes tarball-based distribution as the v1 install model. Pack is NOT published to a public npm registry. Updates all consumer-facing docs to reflect the real install flow. Adds guard against accidental `npm publish`.

### What ships

- `package.json` marked `"private": true`. `publishConfig` block removed (inert under private mode). `npm publish` now errors out.
- `tools/release/release-pack.sh` updated to drop npm publish guidance; new flow is version-bump → tag → tarball → internal-channel upload.
- `bin/lib/gsd-ic/parse-args.cjs` USAGE string shows tarball-based install commands.
- 5 consumer-facing docs updated (README, QUICKSTART, CONSUMER-UPGRADE, TROUBLESHOOTING, ADDING-A-CUSTOMER-OVERLAY) to reference `npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=...` instead of `npx @adelphi/gsd-ic@latest install ...`.
- New `docs/ic-pack/MAINTAINER-RELEASE.md` documenting the cut-a-release workflow (version → tag → tarball → distribute).
- `docs/ic-pack/README.md` doc map updated.

### What does NOT change

- `package.json` package name (`@adelphi/gsd-ic`) stays — it's the internal identifier.
- `bin/gsd-ic-install.js` install script (no behavior change; just CLI usage string).
- Agent / skill / hook / ref content.
- Pack VERSION (still `0.1.0`).
- `tools/release/release-pack.sh` core logic (still bumps + tags + dry-run); only comments and final-step message updated.

### Distribution mechanism

Per user direction: tarballs are produced by maintainers via `npm pack`, distributed to consuming programs through Adelphi's internal channel (shared drive / S3 / artifact server — org-decided, not in-repo). Consumers install via `npx /path/to/tarball install --customer=<slug>`.

## Test plan

- [x] `npm run ci` green (all 12 validators)
- [x] `npm run test:validators` green
- [x] `npm run test:install` green
- [x] `npm publish --dry-run` errors out due to `"private": true`
- [x] `npm pack --dry-run` works (private mode does NOT block pack)
- [x] Forbidden-language scan across 5 updated docs + new MAINTAINER-RELEASE.md: zero hits
- [x] No remaining `npx @adelphi/gsd-ic@latest` references in user-facing docs
- [x] All internal links resolve

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 8: Squash-merge after CI green**

```bash
gh pr merge --repo adelphidata/gsd-ic --squash --delete-branch <PR-number>
git checkout main
git pull origin main
```

---

## Self-review checklist

- [x] **Spec coverage:** track #4 was "npm publish prep"; reframed per user constraint to "tarball distribution + docs cleanup". All consumer-facing references updated.
- [x] **Placeholder scan:** zero `TBD`/`TODO` in plan body.
- [x] **Type consistency:** "tarball" / "internal distribution channel" / "private" used consistently.
- [x] **Inventory facts:** verified by grep at plan-write time. If line numbers drift before tasks run, implementers should re-grep.
- [x] **No behavior change to install script:** only the CLI usage string changes; arg parsing, install logic, validator behavior all unchanged.
- [x] **Hardening change is minimal:** `"private": true` is well-supported npm semantics; `npm pack` is unaffected.

## Out of scope

- Setting up an actual private npm registry (GitHub Packages, AWS CodeArtifact, etc.) — deferred.
- Automated tarball upload to a specific internal channel — that's org infra, not a repo decision.
- Notification mechanism for consumers (Slack channel, email, etc.) — org decision.
- Changing the package `name` from `@adelphi/gsd-ic` to anything else.
- Bumping pack VERSION.
- Agent / skill / hook / ref content changes.
