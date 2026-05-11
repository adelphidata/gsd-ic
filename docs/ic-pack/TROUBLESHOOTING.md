<!-- CLASSIFICATION: UNCLASSIFIED -->
# Troubleshooting

Eight known failure modes for install, CI, and runtime operation of
`@adelphi/gsd-ic`.

---

## Install: "GSD not detected"

**Symptom:**
```
error: GSD not detected in <target>. Run `npx get-shit-done-cc@latest` to install GSD first, then re-run the IC pack install.
```
Installer exits with code **3**.

**Cause:**
`bin/lib/gsd-ic/verify-gsd.cjs` probes for four GSD signatures: `.claude/skills/gsd-*`
(Claude Code), `.codex/skills/gsd-*` (Codex), `commands/gsd/*.md` (legacy), and
`.clinerules` containing `gsd` (Cline). If none match, the installer refuses.

**Fix:**
1. Navigate to the target directory (or set `--target`).
2. Install GSD: `npx get-shit-done-cc@latest`
3. Re-run: `npx @adelphi/gsd-ic install --customer=<name> [--target=<path>]`

**Validator / tool that catches it:**
`bin/lib/gsd-ic/verify-gsd.cjs` (exit code 3)

---

## Install: incompatible GSD version (peerDependencies range mismatch)

**Symptom:**
npm warns during install:
```
npm warn peer dep missing: get-shit-done-cc@">=1.39.0 <2.0.0"
```
`verify-gsd.cjs` checks GSD's _presence_ only. The version boundary is
enforced at npm-install time via `peerDependencies`.

**Cause:**
`package.json` declares `"get-shit-done-cc": ">=1.39.0 <2.0.0"` in
`peerDependencies`. GSD below `1.39.0` or at `2.x`+ raises a conflict. The
pack is pinned to GSD `1.39.0-rc.4` (see `VERSION`).

**Fix:**
1. Upgrade GSD: `npx get-shit-done-cc@latest`
2. If you cannot upgrade, pin the IC pack to a matching older release:
   `npx @adelphi/gsd-ic@<older-version> install --customer=<name>`
3. Confirm no peer-dep warnings remain, then re-run the installer.

**Validator / tool that catches it:**
`<none — npm peer resolution at install time>`

---

## Install: "unknown customer"

**Symptom:**
```
unknown customer "<slug>". Known: nga, nsa, nro, cia, dia
```
Installer exits with code **2**.

**Cause:**
`bin/lib/gsd-ic/parse-args.cjs` validates `--customer=<name>` against the
hard-coded `KNOWN_CUSTOMERS` set. Any other slug raises an error immediately.

**Fix:**
1. Use one of the five known slugs: `cia`, `dia`, `nga`, `nro`, `nsa`.
2. To add a new customer, create an overlay in `config-overlays/` and extend
   `KNOWN_CUSTOMERS` in `bin/lib/gsd-ic/parse-args.cjs`. See
   `docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md`.

**Validator / tool that catches it:**
`bin/lib/gsd-ic/parse-args.cjs` (exit code 2)

---

## CI: validate-completion-markers fails

**Symptom:**
```
[validate-completion-markers] FAIL: agents/gsd-<name>.md: completion marker '<marker>' not found in references/agent-contracts.ic-pack.md
```

**Cause:**
`tools/ci/validate-completion-markers.sh` extracts every line in IC pack agents
matching `^## [A-Z][A-Z0-9 _&-]*( COMPLETE| BLOCKED| FOUND| FAILED| UPDATE COMPLETE)$`
and verifies each appears verbatim in `references/agent-contracts.ic-pack.md`.
Failure means the marker violates the regex or is valid but unregistered.

**Fix:**
1. Locate the `## ` marker line in the failing agent.
2. Confirm all-uppercase words with only spaces, underscores, ampersands, or
   hyphens, ending in `COMPLETE`, `BLOCKED`, `FOUND`, `FAILED`, or
   `UPDATE COMPLETE` (e.g., `## THREAT MODEL COMPLETE`).
3. If text is correct but missing from the registry, add it verbatim to
   `references/agent-contracts.ic-pack.md`.
4. Re-run: `bash tools/ci/validate-completion-markers.sh`

**Validator / tool that catches it:**
`tools/ci/validate-completion-markers.sh`

---

## CI: validate-seamless-fork fails after upstream sync

**Symptom:**
```
[validate-seamless-fork] FAIL: <workflow>.md: stock line removed: '<line>'
[validate-seamless-fork] FAIL: <workflow>.md: non-inert insertion '<line>'
```

**Cause:**
`tools/ci/validate-seamless-fork.sh` applies `tools/patch-workflows.sh` to a
snapshot of the upstream workflow files and diffs the result. Every inserted
line must be semantically inert: an HTML comment, a blank line, or an explicit
`if config.intel_gates.<gate>.enabled` guard. Deleting or modifying a stock
line — or inserting non-gated content — fails the check.

**Fix:**
1. Run: `bash tools/ci/validate-seamless-fork.sh`
2. For each "stock line removed": restore the original stock line verbatim.
3. For each "non-inert insertion": wrap the content in an intel-gate guard
   (`if config.intel_gates.<gate>.enabled then Skill(...)`) or an HTML comment.
4. Re-run until clear; commit only patch-workflow changes in this commit.

**Validator / tool that catches it:**
`tools/ci/validate-seamless-fork.sh`

---

## Runtime: agent never fires from gate trigger

**Symptom:**
A Family L agent (e.g., `gsd-ci-analyst`) is configured in
`.planning/intel-gates.json` but never runs during the expected workflow step.
No error is emitted — the gate is silently skipped.

**Cause:**
Two conditions block gate firing. First, all gates ship with `"enabled": false`
in `workflow-patches/intel-gates.template.json`; a gate never fires until set
to `true`. Second, the `trigger` value must resolve to a real heading slug in
`get-shit-done/workflows/<workflow>.md` (lowercase, spaces replaced by hyphens).
`tools/ci/validate-triggers.sh` checks this at build time.

**Fix:**
1. In `.planning/intel-gates.json`, set `"enabled": true` for the gate.
2. Run: `bash tools/ci/validate-triggers.sh`
3. If the trigger is unresolvable, fix the `trigger` string to match the actual
   heading slug.
4. Re-run the workflow step to confirm the gate fires.

**Validator / tool that catches it:**
`tools/ci/validate-triggers.sh`

---

## Runtime: classification banner false positive

**Symptom:**
`hooks/gsd-classified-leak-detector.js` emits an advisory on a file with no
classified content:
```
[gsd-classified-leak-detector] <N> marking(s) detected in <file>: <pattern-ids>.
```

**Cause:**
The detector scans every Write/Edit against patterns in
`hooks/patterns/classified-markings.json` (`S//`, `TS//`, `SI//`, `TK//`,
`HCS//`, `KDK//`, `G//`, `NOFORN`, `ORCON`, `CUI//`). Patterns are uppercase-only
(lowercase excluded to avoid URL/code collisions). A false positive occurs when
source code, comments, or test data contain an uppercase token matching a pattern.

**Fix:**
1. Identify the pattern ID in the advisory; cross-reference the exact regex in
   `hooks/patterns/classified-markings.json`.
2. Rephrase the matched text — change casing, split the token, or reword.
3. If rephrasing is not feasible, set in `.planning/intel-gates.json`:
   `"classified_leak": { "enabled": false }` to disable, or
   `"block_on_match": false` to downgrade to advisory-only.
4. Confirm the text is non-sensitive before suppressing the hook.

**Validator / tool that catches it:**
`tools/ci/validate-no-classified-leak.sh` (static repo scan)

---

## Runtime: hook crashes (Node version mismatch)

**Symptom:**
An IC pack hook crashes immediately on any Write or Edit tool use:
```
SyntaxError: Unexpected token '?.'
```
or the Claude Code hook runner reports a non-zero exit from the hook process.

**Cause:**
IC pack hooks use optional chaining (`?.`) and nullish coalescing (`??`).
`package.json` declares `"engines": { "node": ">=22.0.0" }`. A Node version
below 22 in the shell that spawns Claude Code's hook runner causes a parse
failure on first invocation.

**Fix:**
1. Check: `node --version`
2. If below 22, upgrade:
   ```bash
   nvm install 22 && nvm use 22    # nvm
   fnm install 22 && fnm use 22    # fnm
   ```
3. Confirm: `node --version` should print `v22.x.x` or higher.
4. Restart Claude Code to pick up the updated binary.

**Validator / tool that catches it:**
`<none — runtime only>`
