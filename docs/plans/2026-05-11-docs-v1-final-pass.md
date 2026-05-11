# Docs Polish — v1 Final Pass for 58-Agent Reality (Post-v1 Track #1)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Two-stage review (spec compliance, then code quality) after every task. Sonnet implementers for content tasks; sonnet reviewers.

**Goal:** Rewrite the 11 stub or near-stub markdown files in `docs/ic-pack/` so they accurately reflect the shipped v1 reality (58 agents, 5 customer overlays, 5 skills, 3 hooks, 12 CI validators, npm-published `@adelphi/gsd-ic` install entry, working sync-upstream tooling). Eliminate every "Stub", "Fleshed out by Task N of Plan N", "(More detail to come)", and stale forward-reference; replace with content a real consumer or contributor can act on without reading the spec.

**Architecture:** Each doc lives at one absolute path; rewrites are self-contained per file (DRY-violation only at the README index level, which is intentional). Spec is the source of truth for templates (Appendix A/B/C) and for the layered model (§4); the docs are a customer-friendly subset. No code changes; no validator changes; pack VERSION not bumped. The pack stays on `0.1.0`/`gsd_pinned: 1.39.0-rc.4`.

**Tech Stack:** Markdown only. Validators do not gate `docs/` content; the only mechanical check is that internal links resolve.

**Branch:** `docs-v1-final-pass`. Squash-merge with `--delete-branch` after CI green.

---

## Operating mode (controller-side, do not delegate to implementers)

- **Branch setup first.** Controller (you) creates `docs-v1-final-pass` off `main` once before Task 1. Implementers commit on this branch; no per-task branch.
- **One commit per task.** Implementer commits with message format below. No bundling.
- **Subagent dispatch.** Each task uses one `staff-software-engineer` (sonnet) implementer, then one `code-review-enforcer` (sonnet) spec-compliance reviewer, then one `code-review-enforcer` (sonnet) code-quality reviewer. Two-stage review per skill. Use `Agent` tool with explicit `model: "sonnet"`.
- **Verification per task.** Implementer runs: `wc -l <file>` (length check), `grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder" <file>` (forbidden-language scan, must return zero lines), and validates every inline link target exists with `ls`/`test -f` for relative file links and `grep -n "^### ${anchor}" <target>` for in-spec anchors.
- **No new files.** Every task targets an existing file. No tree restructuring.
- **No spec changes.** If a task wants to amend the spec, halt + escalate to controller.
- **Commit format:** `docs(ic-pack): <one-line summary>` (one commit per task; subject ≤72 chars).
- **Forbidden language scan (applied to every output file):** `stub`, `TBD`, `TODO`, `fleshed out`, `more detail to come`, `placeholder`, `coming soon`, `(populated later)`, `Plan N`. If any match, the file is not done.

---

## Sibling-anchored length targets

Existing substantive ic-pack docs and their sizes (use as length anchors):

- `ADDING-A-HOOK.md` — 168 lines (5511 bytes) — full-hook how-to with code blocks
- `intel-gates-schema.md` — 124 lines (4143 bytes) — schema reference with examples
- `REF-FRONTMATTER-SCHEMA.md` — 44 lines (1440 bytes) — schema reference compact

Stub files (current) and target lengths:

| File | Current | Target | Anchor |
|---|---|---|---|
| README.md | 38 | 60–90 | refresh, not rewrite |
| ARCHITECTURE.md | 22 | 180–250 | most substantial doc (customer-friendly subset of spec §4) |
| QUICKSTART.md | 25 | 140–200 | actual 30-min path with real CLI output |
| ADDING-AN-AGENT.md | 14 | 150–200 | full how-to with template embedded |
| ADDING-A-REFERENCE.md | 9 | 130–180 | full how-to incl. per-dir frontmatter convention |
| ADDING-A-SKILL.md | 14 | 100–140 | shorter; spec §11.6 is short |
| ADDING-A-CUSTOMER-OVERLAY.md | 11 | 130–170 | wiring section is non-trivial |
| UPGRADE-PROCEDURE.md | 14 | 130–180 | sync tool already exists; document its use |
| CONSUMER-UPGRADE.md | 11 | 80–120 | shorter; idempotent re-run is the main story |
| TROUBLESHOOTING.md | 19 | 160–220 | 6–8 seeded entries, ~25 lines each |
| PER-CUSTOMER-PLAYBOOK.md | 13 | 120–180 | 5 customer sections × ~25 lines each |

---

## Inventory facts (verified at plan time, use as ground truth)

- **58 IC-pack agents** (`agents/gsd-*.md` listed in `package.json` `files[]`). 91 total `gsd-*.md` on disk; 33 are upstream-vendored from `get-shit-done/` and are not counted in the pack roster.
- **5 customer overlays:** `cia, dia, nga, nro, nsa` (enforced by `KNOWN_CUSTOMERS` in `bin/lib/gsd-ic/parse-args.cjs`).
- **5 skills:** `adelphi-house-style, classification-conventions, intel-coding-conventions, poam-conventions, prototyping-discipline`. Spec §7 names 4; `poam-conventions` was added during Phase 5/6.
- **3 hooks:** `gsd-classification-banner.js, gsd-classified-leak-detector.js, gsd-prompt-injection-scan-intel.js`.
- **12 CI validators** under `tools/ci/validate-*.sh`, each with a sibling `tests/validate-*.test.sh`.
- **10 INT-discipline refs:** cybint, finint, geoint, humint, masint, medint, osint, sigint, techint, techsigint.
- **13 tradecraft refs:** ato-document-suite, ato-process-overview, cmmc-2.0, dfars-252-204-7012, eo-14028, fips-140-3, icd-203, icd-206, itar-ear, nist-800-171, nist-800-53-rev5, poam-format, words-of-estimative-probability.
- **Install CLI subcommands:** `install`, `uninstall`, `--help`.
- **npm scripts:** `test`, `test:install`, `test:validators`, `test:all`, `ci`, `release`, `sync-upstream`.
- **VERSION format (top of `VERSION`):** `pack: 0.1.0` + `gsd_pinned: 1.39.0-rc.4`.

If any of these change while the plan is in flight, halt and escalate.

---

## Spec line refs (current state of `docs/specs/2026-05-05-ic-agent-pack-design.md`)

- §4 Architecture — line 95
- §4.1 Layer Model — line 97
- §4.5 User-declared classification convention — line 162
- §5 Agent Slate — line 252
- §6 Hooks — line 395
- §7 Skills — line 443
- §7.0 Skill → Agent promotion rule — line 447
- §8 Knowledge Layer — line 497
- §8.1 Manifest Schema — line 499
- §9 Workflow Integration — line 671
- §9.6 Trigger string vocabulary — line 785
- §11 Maintenance & Upgradability — line 938
- §11.1 Soft Fork Tracking Procedure — line 958
- §11.2 NPM Distribution & Consumer Install — line 982
- §11.3 Adding a New Agent — line 1012
- §11.4 Adding a New Reference — line 1021
- §11.5 Adding a New Customer Overlay — line 1028
- §11.6 Adding a New Skill — line 1035
- §15 Rollout Plan — line 1098
- §15.2 Documentation — line 1118
- Appendix A — Agent File Template — line 1156
- Appendix B — Reference Doc Template — line 1208
- Appendix C — Skill File Template — line 1235
- Appendix D — Completion Marker Registry — line 1259
- Appendix E — Manifest Topic Tag Vocabulary — line 1322

Implementers MUST verify each spec line ref before citing (the spec has been re-edited; if a `^### Foo` anchor moved, the implementer fixes the link, not the spec).

---

## Task 1: README.md refresh

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/README.md`
**Length target:** 60–90 lines

- [ ] **Step 1: Read current README.md and note what to keep**

The existing intro (lines 1–13) and "When to use / When not to use" (lines 14–24) are accurate; reuse verbatim. The doc map (lines 26–37) is the part that needs polish: add the 3 already-substantive docs (ADDING-A-HOOK, intel-gates-schema, REF-FRONTMATTER-SCHEMA) that the current map omits.

- [ ] **Step 2: Verify inventory numbers in intro**

Current intro says "58 specialized agents, 3 deterministic hooks, and 4 behavioral skills". Update "4 behavioral skills" → "5 behavioral skills". Leave the 58/3 figures.

- [ ] **Step 3: Add a "What v1 ships" section after "When not to use"**

A six-bullet quick inventory (counts only; no per-item enumeration):

```markdown
## What v1 ships

- **58 agents** across 15 families (compliance, security personas, ATO docs, customer artifacts, capture/BD, mission design, per-INT researchers, all-source/tradecraft, mission-framing analysts, fusion architecture, engineering enablement, transition). See [agent-contracts.ic-pack.md](../../references/agent-contracts.ic-pack.md) for the full roster and completion-marker registry.
- **5 customer overlays:** `cia`, `dia`, `nga`, `nro`, `nsa` (select at install time via `--customer=`).
- **3 deterministic hooks:** classification banner, classified-leak detector, prompt-injection scan.
- **5 behavioral skills:** classification conventions, intel coding conventions, prototyping discipline, Adelphi house style, POA&M conventions.
- **36 reference docs** spanning 10 INT disciplines, 13 tradecraft / compliance / ATO topics, 2 capability patterns, 5 IC-customer ecosystem briefs, 3 house-style guides, and 3 cross-cutting topics (AI/ML eval patterns, classification partitions, modernization themes).
- **12 CI validators** that gate every change to the pack (manifest schema, completion markers, classification banners, workflow patches, trigger strings, seamless-fork guarantee, etc.).
```

- [ ] **Step 4: Rewrite the doc map to cover all 11 current docs**

Replace lines 26–37 with a map that includes (in this order):

```markdown
## Documentation map

### Consumer-facing
- [QUICKSTART.md](QUICKSTART.md) — `npx install` to first agent invocation in 30 minutes
- [ARCHITECTURE.md](ARCHITECTURE.md) — layered architecture (customer-friendly subset of the design spec)
- [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md) — bumping the installed pack version
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — known install / CI / runtime failure modes
- [PER-CUSTOMER-PLAYBOOK.md](PER-CUSTOMER-PLAYBOOK.md) — AO-specific gotchas, tradecraft notes, and watch-outs

### Contributing (dev-side)
- [ADDING-AN-AGENT.md](ADDING-AN-AGENT.md) — author and register a new agent
- [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md) — add a knowledge-layer reference doc
- [ADDING-A-SKILL.md](ADDING-A-SKILL.md) — author a behavioral skill (promotion criteria included)
- [ADDING-A-HOOK.md](ADDING-A-HOOK.md) — add a deterministic hook with patterns + tests
- [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md) — onboard a new customer to the catalog
- [UPGRADE-PROCEDURE.md](UPGRADE-PROCEDURE.md) — dev-side soft-fork sync from upstream `gsd-build/get-shit-done`

### Schemas
- [intel-gates-schema.md](intel-gates-schema.md) — `.planning/intel-gates.json` structure
- [REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md) — `intel-refs/**/*.md` frontmatter contract
```

- [ ] **Step 5: Forbidden-language scan**

Run: `grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" /Users/romansky/gsd-ic/docs/ic-pack/README.md`
Expected: zero lines.

- [ ] **Step 6: Link existence check**

For every relative link added/kept, run `ls /Users/romansky/gsd-ic/docs/ic-pack/<target>` (or for `../../references/...`, the corresponding path). Expected: all targets exist.

- [ ] **Step 7: Commit**

```bash
git add docs/ic-pack/README.md
git commit -m "docs(ic-pack): refresh README for v1 (58 agents, 5 skills, full doc map)"
```

---

## Task 2: ARCHITECTURE.md — full v1 pass

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ARCHITECTURE.md`
**Length target:** 180–250 lines

- [ ] **Step 1: Outline the rewrite**

Required sections (use these exact headings):

```
# IC Pack Architecture
## Layered model (six layers)
### Layer 0: Hooks
### Layer 1: Agents
### Layer 2: Manifest-indexed reference docs
### Layer 3: Behavioral skills
### Layer 4: Customer skill overlay
### Layer 5: Per-program project context
## Workflow integration: gates and the dispatcher
## Completion-marker contract
## Classification model
## Seamless-fork guarantee
## CI surface
## What's deliberately not in v1
```

- [ ] **Step 2: Write the layered model section**

Open with the ASCII diagram from the current ARCHITECTURE.md (keep verbatim — it is accurate). Below each layer, write a 3–5 line paragraph covering:

- **Layer 0 (Hooks):** 3 files in `hooks/` — name each and one-line each. Hooks are deterministic, exit-code-driven, fire on every `Read`/`Write`/`Bash` tool call regardless of which agent is active. Built by `scripts/build-hooks.js` into `hooks/dist/`.
- **Layer 1 (Agents):** 58 thin markdown agents in `agents/gsd-*.md`. Each has frontmatter (`name`, `description`, `tools`, `applies_when`, `classification`), an execution flow, and a structured-return completion marker. Each agent matches exactly one completion-marker pattern enforced by `tools/ci/validate-completion-markers.sh`.
- **Layer 2 (Refs):** `intel-refs/MANIFEST.json` is the index; `intel-refs/{int-disciplines,tradecraft,capability-patterns,ai-ml,...}/*.md` are the actual content. Each entry has `applies_when`, `owner`, `last_reviewed`, `classification`. Agents load refs whose `applies_when` tags match the active phase scope. UNCLASSIFIED only.
- **Layer 3 (Skills):** 5 skills in `skills/<name>/` providing cross-agent behavioral guidance (classification conventions, intel coding conventions, prototyping discipline, Adelphi house style, POA&M conventions). Skills promote to agents per the §7.0 rule (2+ of: multi-step reasoning / own context-window benefit / produces distinct artifact).
- **Layer 4 (Customer overlay):** One of `cia, dia, nga, nro, nsa` selected at install time. Overlay maps agents to additional skills and may add customer-specific refs. Exactly one active per installed instance.
- **Layer 5 (Program context):** `.planning/intel-context.md` is per-program (NOT shipped in the pack). Engineers fill it with AO, mission, key contacts, transition target. Every agent reads it at startup.

- [ ] **Step 3: Write the workflow-integration section**

Cover:
- `.planning/intel-gates.json` is the workflow control file. Schema reference: link to [intel-gates-schema.md](intel-gates-schema.md).
- Gates have a `trigger` (e.g. `plan-phase.5-handle-research`) and an `agent` (or `agents` for fan-out).
- Family L is the canonical fan-out pattern: 4 always-on mission-framing agents (`gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler`) fire in parallel from a shared trigger, all defaulted to `enabled: false`. See `workflow-patches/intel-gates.template.json`.
- Trigger format and validation: `tools/ci/validate-triggers.sh` enforces `<workflow>.<step>` slug form (per spec §9.6).
- The dispatcher merges results back to the caller after fan-out completes.

- [ ] **Step 4: Write the completion-marker contract section**

- Every agent emits exactly one marker line on completion.
- Validator regex (must quote): `^## [A-Z][A-Z0-9 _&-]*( COMPLETE| BLOCKED| FOUND| FAILED| UPDATE COMPLETE)$`
- Registry: `references/agent-contracts.ic-pack.md` — every agent file × every marker × matching agent name.
- Validator: `tools/ci/validate-completion-markers.sh`.
- Six historical deviations are documented in the registry (Plan 6 × 1, Plan 7 × 5) where spec wording predates the regex; agent-file output was converted to match the regex while the registry footnotes the spec deviation.

- [ ] **Step 5: Write the classification-model section**

- Three valid classifications: `UNCLASSIFIED`, `CUI`, `CLASSIFIED`. v1 ships UNCLASSIFIED-only content.
- Frontmatter `classification:` field is mandatory on every shipped markdown (agents, refs, skills, hooks, docs).
- Hook `gsd-classification-banner.js` injects classification banner on every output. Hook `gsd-classified-leak-detector.js` scans for known classified-marking patterns (`hooks/patterns/classified-markings.json`) and halts on match.
- Agents never *determine* classification — they honor the user-declared value (spec §4.5).

- [ ] **Step 6: Write the seamless-fork section**

Keep the current paragraph (lines 19–22) verbatim. Expand with: validator `tools/ci/validate-seamless-fork.sh` runs in CI on every change; checks that with every gate and hook in `.planning/intel-gates.json` disabled, no IC-pack content alters a stock GSD program's behavior (workflow patches must be idempotent, hooks must respect `enabled: false`, refs must not auto-load, agents must not auto-spawn).

- [ ] **Step 7: Write the CI surface section**

Enumerate the 12 validators by name with one-line each (run `ls /Users/romansky/gsd-ic/tools/ci/validate-*.sh | xargs -n1 basename | sort` to get the canonical order). One paragraph noting the test sibling at `tools/ci/tests/*.test.sh` and the `npm run ci` / `npm run test:validators` entry points.

- [ ] **Step 8: Write the "deliberately not in v1" section**

Three to five bullets covering: CUI/classified-content handling (deferred per §16 O-05), spec-side agent-fan-out runtime exercise (not yet stress-tested with a real program — Family L gates ship `enabled: false`), gate-dispatcher result-merge contract beyond simple concatenation, and SME-curation completeness (refs ship as scaffolds-plus, awaiting per-INT SME deepening per §15.1.1).

- [ ] **Step 9: Forbidden-language scan + link check**

Run forbidden-language scan (per "Operating mode"). Then for every internal link, verify target exists. For every spec section reference, run:

```bash
grep -nE "^## [0-9]+\.|^### " /Users/romansky/gsd-ic/docs/specs/2026-05-05-ic-agent-pack-design.md | grep -i "<your-section>"
```

- [ ] **Step 10: Commit**

```bash
git add docs/ic-pack/ARCHITECTURE.md
git commit -m "docs(ic-pack): expand ARCHITECTURE.md to full v1 customer-friendly subset"
```

---

## Task 3: QUICKSTART.md — actual 30-min path

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/QUICKSTART.md`
**Length target:** 140–200 lines

- [ ] **Step 1: Outline**

```
# Quickstart: 30 Minutes from `npx` to First Agent Invocation
## Prerequisites
## Step 1: Install GSD upstream (if not already installed)
## Step 2: Install the IC pack
## Step 3: Select a customer overlay
## Step 4: Fill in program context
## Step 5: Verify the install
## Step 6: Run your first agent
## Step 7: Run your first gate (optional)
## What's next
## Uninstall
```

- [ ] **Step 2: Write Prerequisites**

- Node 22+, npm (cite `engines.node` in `package.json`).
- A program repo that has GSD installed (`npx get-shit-done-cc@latest`). Pinned GSD version: see `gsd_pinned` field in the IC pack `VERSION` file.
- SME readiness check: per spec §15.1, your program should have at least one SME assigned per primary INT discipline in scope before enabling the pack. Without SMEs, refs decay; defer install until staffed.

- [ ] **Step 3: Write Step 1 (install GSD)**

Verbatim shell block:

```bash
cd /path/to/your/program
npx get-shit-done-cc@latest
```

Note: if GSD is already installed, this is a no-op refresh.

- [ ] **Step 4: Write Step 2 (install pack)**

```bash
npx @adelphi/gsd-ic@latest install --customer=<nga|nsa|nro|cia|dia>
```

Note: `--customer` is required (no default). The five valid values are enforced by the CLI; an unknown name exits with code 2.

Expected output (paraphrase, do not invent literal log lines beyond what `bin/lib/gsd-ic/install-pack.cjs` actually prints — implementer should `grep -n "process.stderr.write" bin/lib/gsd-ic/*.cjs` to copy real strings):

```
[gsd-ic] GSD detected (<version>); pack pinned to GSD <gsd_pinned>
[gsd-ic] pack content installed under <target>/.claude/
[gsd-ic] customer overlay wired (<customer>)
[gsd-ic] hooks registered in .claude/settings.json
```

- [ ] **Step 5: Write Step 3 (customer overlay)**

The overlay was selected in Step 2 via `--customer=`. To switch overlays later: re-run install with the new `--customer=` and add `--confirm-customer-switch`. (Refer reader to CONSUMER-UPGRADE.md for full upgrade flow.)

- [ ] **Step 6: Write Step 4 (program context)**

Create `.planning/intel-context.md` per spec §8.4 schema. Show a minimal template (use the spec §8.4 example verbatim, then trim to the required fields):

```markdown
---
classification: UNCLASSIFIED
ao: <area of operations / customer>
mission: <one-paragraph mission summary>
primary_ints: [<comma-separated INT disciplines in scope>]
transition_target: <eventual PoR or program-of-record target, if known>
---

# Program context

## Mission detail
<2-3 paragraphs>

## Key stakeholders
- PM: <name>
- Customer technical POC: <name>
- SMEs: <name> (<INT>), <name> (<INT>)

## Phase tempo / cadence
<e.g., 2-week prototype phases, demo every 8 weeks>
```

- [ ] **Step 7: Write Step 5 (verify)**

```bash
# 1. Pack agents present in your program:
ls .claude/agents/gsd-*.md | wc -l   # should be ~58 + stock GSD agents

# 2. Manifest is valid:
bash .claude/get-shit-done/tools/ci/validate-manifest.sh

# 3. Hooks wired:
grep -l "gsd-classification-banner\|gsd-classified-leak-detector\|gsd-prompt-injection-scan-intel" .claude/settings.json
```

(Note: validator paths under `.claude/` depend on how install copies them — implementer should `grep -n "tools/ci" bin/lib/gsd-ic/install-pack.cjs` to confirm the actual install destination and adjust the verify commands.)

- [ ] **Step 8: Write Step 6 (first agent)**

Pick `gsd-customer-context-mapper` as the canonical first run (the Phase 0 anchor agent). Show how to invoke it in Claude Code: the user mentions a customer-mapping question, the agent fires, the agent writes its output, the agent emits its completion marker. One-paragraph walkthrough; no fabricated log output.

- [ ] **Step 9: Write Step 7 (first gate)**

Family L gates ship `enabled: false`. To exercise the dispatcher, open `.planning/intel-gates.json` (created by install), flip one of the four Family L gates to `enabled: true`, run the program's normal `plan-phase` workflow, and observe the configured agent firing. Reference [intel-gates-schema.md](intel-gates-schema.md) for the full schema.

- [ ] **Step 10: Write "What's next" and "Uninstall"**

What's next:
- [ARCHITECTURE.md](ARCHITECTURE.md) for the full mental model
- [PER-CUSTOMER-PLAYBOOK.md](PER-CUSTOMER-PLAYBOOK.md) for AO-specific notes
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for failure modes
- [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md) for version bumps

Uninstall (one block):

```bash
npx @adelphi/gsd-ic@latest uninstall
```

Removes the pack from `.claude/`; leaves stock GSD and program-owned files untouched.

- [ ] **Step 11: Forbidden-language scan + link check**

- [ ] **Step 12: Commit**

```bash
git add docs/ic-pack/QUICKSTART.md
git commit -m "docs(ic-pack): expand QUICKSTART to actual 30-min path with real CLI flow"
```

---

## Task 4: ADDING-AN-AGENT.md — full how-to

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-AN-AGENT.md`
**Length target:** 150–200 lines

- [ ] **Step 1: Outline**

```
# Adding a New IC Pack Agent
## Decide: should this be a new agent at all?
## Step 1: Pick a family and name
## Step 2: Write the agent file
## Step 3: Register the completion marker
## Step 4: Register in package.json files[]
## Step 5: Wire workflow trigger (optional)
## Step 6: Run the validators
## Step 7: Smoke-test the agent
## Step 8: Commit
## Reference: agent file template (Appendix A of spec)
```

- [ ] **Step 2: Write "Decide: should this be a new agent at all?"**

Cite spec §7.0 promotion rule: promote a skill to an agent only if 2+ of: multi-step reasoning required, own context-window benefit, produces a distinct artifact. If fewer than 2 apply, keep it a skill (`skills/<name>/SKILL.md`). Cite spec §4.3 single-responsibility constraint: one agent, one job. If the new agent would overlap an existing one, refactor the existing agent instead.

- [ ] **Step 3: Write Step 1 (family and name)**

The 15 families are listed in spec §5. Pick the family that matches the agent's responsibility:

```
A — Compliance Specialists (8)
B — Privacy (1)
C — Security Personas (2 orchestrators)
D — ATO Documentation Specialists (8)
E — CDRL & Customer Artifacts (4)
F — Customer Engagement & Deliverables (4)
G — Capture / BD (4)
H — Mission & Prototype Design (4)
I — Per-INT Discipline Researchers (10)
J — All-Source Research & Tradecraft Compliance (2)
K — Specialty Domain (1)
L — Mission-Framing Analysts (4)
M — Architecture / Fusion (1)
N — Engineering Enablement (4)
O — Transition (1)
```

Naming: `gsd-<role-name>` (kebab-case, lowercase). The `gsd-` prefix is mandatory (validator: `tools/ci/validate-agents.sh`). Role names are typically `<domain>-<role-noun>` (e.g., `gsd-icd-203-enforcer`, `gsd-medint-researcher`).

- [ ] **Step 4: Write Step 2 (write the agent file)**

Quote Appendix A verbatim (current spec line 1156–~1208) as a fenced code block. Then call out the project-local conventions that extend the spec template:

- `applies_when:` array (frontmatter) — controls dispatch routing. Pull keywords from spec Appendix E (manifest topic tag vocabulary) where possible; one-off keywords are OK but require justification in PR description.
- `classification: UNCLASSIFIED` — mandatory.
- `ic_pack: true` — present on all 58 IC pack agents to distinguish from upstream-vendored.
- `tools:` array — minimal set (principle of least privilege). Most researcher agents use `[Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]`. Only `Edit`-tool agents are *implementers* (e.g., `gsd-fm-adaptation-engineer`).
- Length: pure researchers run 80–120 lines; auditors 100–150; dual-mode (design+audit) agents 200–260.
- Place the file at `agents/gsd-<name>.md`.

- [ ] **Step 5: Write Step 3 (register marker)**

Open `references/agent-contracts.ic-pack.md` and add one row to the table per (agent, marker) pair. Validator regex: `^## [A-Z][A-Z0-9 _&-]*( COMPLETE| BLOCKED| FOUND| FAILED| UPDATE COMPLETE)$`. The agent's emitted marker must match the registry row exactly. Validator: `bash tools/ci/validate-completion-markers.sh`.

- [ ] **Step 6: Write Step 4 (package.json files[])**

```bash
# Open package.json and add the new agent path to "files" array, alphabetically:
# "agents/gsd-<new-name>.md"
# This controls what npm pack ships to consumers.
```

Validator: `bash tools/ci/validate-publish-scope.sh` confirms every shipped path matches a real file and is sorted.

- [ ] **Step 7: Write Step 5 (workflow trigger, optional)**

Most new agents don't ship with a trigger (they're invoked ad-hoc by the user or by another agent's `Spawned by:` reference). For always-on gating, add an entry to `workflow-patches/intel-gates.template.json`:

```json
{
  "id": "family-<x>-<role>",
  "trigger": "plan-phase.<step>",
  "agent": "gsd-<name>",
  "enabled": false
}
```

`enabled: false` is the default for any new gate — consumers opt in. Trigger format is validated by `tools/ci/validate-triggers.sh`.

- [ ] **Step 8: Write Step 6 (validators)**

```bash
npm run ci   # runs all 12 validators
```

Or run individually:
- `bash tools/ci/validate-agents.sh` — frontmatter schema
- `bash tools/ci/validate-completion-markers.sh` — marker regex + registry
- `bash tools/ci/validate-publish-scope.sh` — package.json files[]
- `bash tools/ci/validate-classification.sh` — classification banners
- `bash tools/ci/validate-seamless-fork.sh` — gate/hook defaults

- [ ] **Step 9: Write Step 7 (smoke test)**

Install the pack into a scratch program (or use `npm pack` + manual unpack into a test dir), invoke the agent, confirm it emits the registered completion marker. Spec §C.6.5 — note: there is no automated end-to-end "fire-the-agent-in-Claude-Code" test yet (out-of-scope for v1; tracked in post-v1 backlog).

- [ ] **Step 10: Write Step 8 (commit)**

```bash
git add agents/gsd-<name>.md references/agent-contracts.ic-pack.md package.json
# + workflow-patches/intel-gates.template.json if a gate was added
git commit -m "agents: add gsd-<name> (Family <X>)"
```

- [ ] **Step 11: Write the reference section**

Quote spec Appendix A in full + link to spec line ref.

- [ ] **Step 12: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/ADDING-AN-AGENT.md
git commit -m "docs(ic-pack): expand ADDING-AN-AGENT to full author-and-register how-to"
```

---

## Task 5: ADDING-A-REFERENCE.md — full how-to

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-REFERENCE.md`
**Length target:** 130–180 lines

- [ ] **Step 1: Outline**

```
# Adding a New Reference Doc
## Decide: where does it go?
## Step 1: Pick a subdirectory and topic key
## Step 2: Write the file with classification frontmatter
## Step 3: Register in MANIFEST.json
## Step 4: Run the manifest validator
## Step 5: Cross-link from agents that should load it
## Step 6: Commit
## Reference: per-directory frontmatter convention
## Reference: manifest schema (full)
```

- [ ] **Step 2: Write "Decide: where does it go?"**

Subdirectories under `intel-refs/`:
- `int-disciplines/` — one file per INT discipline (humint, sigint, geoint, masint, osint, finint, cybint, medint, techint, techsigint)
- `tradecraft/` — analytic standards, sourcing rules, ATO doc structures, compliance frameworks
- `capability-patterns/` — cross-INT analytic patterns (entity resolution, pattern of life, etc.)
- `ai-ml/` — AI/ML-specific (eval patterns, foundation-model adaptation)
- `classification/`, `demo/`, `ecosystem/`, `house-style/`, `modernization/`, `agents/` — domain-specific
- New top-level subdirectory: only if 2+ refs would live there. Single-ref subdirs are wasteful.

- [ ] **Step 3: Write Step 1 (subdir + topic key)**

Topic key = file path relative to `intel-refs/` (e.g., `int-disciplines/sigint.md` — NOT `intel-refs/int-disciplines/sigint.md`). The topic key is the *primary key* under the manifest's top-level `"topics": { ... }` wrapper (not a separate `path` field — the key IS the path). This is the project-local convention; spec §8.1 is consistent with this.

- [ ] **Step 4: Write Step 2 (write the file with frontmatter)**

Per-directory frontmatter convention (established Plan 7+):

| Directory | Topic field |
|---|---|
| `intel-refs/int-disciplines/` | `topic_id:` |
| `intel-refs/tradecraft/` | `topic:` |
| `intel-refs/ai-ml/`, `capability-patterns/`, others | follow the most-recent sibling in that directory |

(The manifest validator inspects neither — both work. The convention exists for human readability, not enforcement.)

Required frontmatter fields (regardless of directory):

```yaml
---
{topic_id|topic}: <slug-of-filename>
title: <human-readable title>
classification: UNCLASSIFIED
last_reviewed: <YYYY-MM-DD>
owner: intel-pack@adelphi.ai
applies_when: [<keyword>, <keyword>, ...]
---
```

`applies_when` keywords drive routing: agents whose `applies_when` overlaps with a ref's `applies_when` will load that ref. Use Appendix E vocabulary where possible.

Body shape: see [REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md) for the full schema; consult an existing sibling for body conventions (sections, citation style, etc.).

- [ ] **Step 5: Write Step 3 (MANIFEST.json)**

Add one entry under the appropriate subdirectory section. Schema (project-local — keys are paths, no `path` field):

```json
{
  "version": "<YYYY.MM>",
  "topics": {
    "<subdir>/<name>.md": {
      "applies_when": ["<keyword>", "<keyword>"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "<YYYY-MM-DD>",
      "classification": "UNCLASSIFIED"
    }
  }
}
```

Note: `owner` is **singular** (not an array). `applies_when` is the only array field. Validator enforces the schema.

- [ ] **Step 6: Write Step 4 (validator)**

```bash
bash tools/ci/validate-manifest.sh
bash tools/ci/validate-reference-staleness.sh   # checks last_reviewed isn't too old
```

- [ ] **Step 7: Write Step 5 (cross-link from agents)**

If the new ref should auto-load for specific agents, add overlap between the ref's `applies_when` and the consuming agents' `applies_when`. Confirm by reading the agent's `## How you do the work` section — typically it lists which refs to load.

- [ ] **Step 8: Write Step 6 (commit)**

```bash
git add intel-refs/<subdir>/<name>.md intel-refs/MANIFEST.json
git commit -m "intel-refs: add <topic> (<subdir>)"
```

- [ ] **Step 9: Write the convention reference sections**

Per-directory frontmatter convention table (repeat from Step 4). Full manifest schema (link to spec §8.1 line 499).

- [ ] **Step 10: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/ADDING-A-REFERENCE.md
git commit -m "docs(ic-pack): expand ADDING-A-REFERENCE with per-dir frontmatter convention + manifest schema"
```

---

## Task 6: ADDING-A-SKILL.md — full how-to

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-SKILL.md`
**Length target:** 100–140 lines

- [ ] **Step 1: Outline**

```
# Adding a New Behavioral Skill
## Decide: skill or agent?
## Step 1: Pick a name and create the directory
## Step 2: Write SKILL.md
## Step 3: Validate
## Step 4: Wire into the customer overlay (optional)
## Step 5: Commit
## Reference: skill file template (Appendix C)
```

- [ ] **Step 2: Write "Decide: skill or agent?"**

Cite spec §7.0 promotion rule. Skill is appropriate when *fewer than 2* of: multi-step reasoning required / own context-window benefit / produces a distinct artifact. Otherwise promote to an agent (see [ADDING-AN-AGENT.md](ADDING-AN-AGENT.md)).

Existing skills (5):
- `adelphi-house-style` — voice, terminology, formatting conventions for customer artifacts
- `classification-conventions` — UNCLASSIFIED-only defaults, classification banner rules
- `intel-coding-conventions` — code-style rules specific to IC prototyping
- `poam-conventions` — POA&M (Plan of Action & Milestones) formatting
- `prototyping-discipline` — rapid-prototype mindset and constraints

- [ ] **Step 3: Write Step 1 (directory)**

`skills/<skill-name>/SKILL.md` — naming is kebab-case. The skill name *is* the directory name; consumers invoke it by name.

- [ ] **Step 4: Write Step 2 (SKILL.md)**

Quote Appendix C (spec line 1235) verbatim. Then note project-local conventions:
- `classification: UNCLASSIFIED` mandatory in frontmatter
- `applies_when:` array (consistent with agent frontmatter)
- One paragraph "When to invoke" at the top of the body
- Numbered or bulleted behavioral rules (the actual content the model uses)
- Cross-reference to related refs (`intel-refs/...`) where the skill draws on tradecraft

- [ ] **Step 5: Write Step 3 (validate)**

```bash
bash tools/ci/validate-skills.sh
```

Checks: frontmatter schema, classification field, naming convention.

- [ ] **Step 6: Write Step 4 (overlay wiring)**

If the skill should auto-engage for a specific customer, add it to that customer's overlay (`config-overlays/<customer>/overlay.json`):

```json
{
  "agent_skills": {
    "gsd-<agent>": ["skill-1", "skill-2", "<new-skill>"]
  }
}
```

See [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md) for the full overlay schema.

- [ ] **Step 7: Write Step 5 (commit)**

```bash
git add skills/<name>/SKILL.md
# + config-overlays/<customer>/overlay.json if wired
git commit -m "skills: add <name> skill"
```

Also remember to update `package.json` `files[]` if the skill directory is new (existing 5 are all listed via `skills/<name>/`).

- [ ] **Step 8: Write the reference section**

Quote Appendix C in full + link to spec §7 line 443.

- [ ] **Step 9: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/ADDING-A-SKILL.md
git commit -m "docs(ic-pack): expand ADDING-A-SKILL with promotion rule + 5-skill inventory"
```

---

## Task 7: ADDING-A-CUSTOMER-OVERLAY.md — full how-to

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md`
**Length target:** 130–170 lines

- [ ] **Step 1: Outline**

```
# Adding a Customer Overlay to the Catalog
## Decide: do you really need a new overlay?
## Step 1: Pick the customer slug
## Step 2: Create the overlay directory
## Step 3: Write overlay.json
## Step 4: (Optional) Add customer-specific refs
## Step 5: Register the slug in the install CLI
## Step 6: Validate
## Step 7: Test the install end-to-end
## Step 8: Commit + ship
## Reference: overlay schema
```

- [ ] **Step 2: Write "Decide" section**

The catalog currently ships 5 customer overlays (`cia, dia, nga, nro, nsa`). A new overlay is justified when a new IC customer (or major sub-org) adopts the pack and has distinct tradecraft, refs, or skill wiring needs. Per spec §2.3, one program = one customer overlay (exactly one active per installed instance). Sub-customer differences within one IC element can typically be handled with `.planning/intel-context.md` rather than a new overlay.

- [ ] **Step 3: Write Step 1 (slug)**

Slug is lowercase, 2–6 chars, matches the IC element's standard abbreviation. The five existing slugs (`cia, dia, nga, nro, nsa`) are 3-char IC element abbreviations; follow that pattern.

- [ ] **Step 4: Write Step 2 (directory)**

```bash
mkdir -p config-overlays/<slug>
mkdir -p config-overlays/<slug>/refs   # optional, only if shipping customer-specific refs
```

- [ ] **Step 5: Write Step 3 (overlay.json)**

Refer to spec §8.3 for the schema. Project-local example (the implementer should `cat config-overlays/nga/overlay.json` for a real reference):

```json
{
  "customer": "<slug>",
  "version": "0.1.0",
  "agent_skills": {
    "gsd-<agent>": ["<skill-1>", "<skill-2>"]
  },
  "agent_refs": {
    "gsd-<agent>": ["intel-refs/<path-to-customer-specific-ref>"]
  },
  "intel_context_template": {
    "ao": "<AO description hint>",
    "primary_ints": ["<comma-separated INTs typical for this customer>"]
  }
}
```

(Note: implementer should verify the exact schema by reading `bin/lib/gsd-ic/wire-overlay.cjs` — fields it expects determine what's load-bearing.)

- [ ] **Step 6: Write Step 4 (customer-specific refs)**

Optional. Place at `config-overlays/<slug>/refs/<topic>.md`. Same frontmatter conventions as `intel-refs/` (see [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md)). Customer overlay refs are loaded *in addition to* the main `intel-refs/` content during install — they do NOT replace anything.

- [ ] **Step 7: Write Step 5 (register slug)**

Open `bin/lib/gsd-ic/parse-args.cjs` and add the new slug to the `KNOWN_CUSTOMERS` Set:

```javascript
const KNOWN_CUSTOMERS = new Set(['nga', 'nsa', 'nro', 'cia', 'dia', '<new-slug>']);
```

Without this addition, the install CLI rejects the slug with exit code 2.

- [ ] **Step 8: Write Step 6 (validate)**

```bash
npm test                        # runs unit tests including install tests
npm run test:install            # runs install-flow tests specifically
bash tools/ci/validate-publish-scope.sh   # confirms the new overlay directory is shipped
```

Update `package.json` `files[]` if the overlay path isn't covered by the existing `"config-overlays/"` glob (it should be).

- [ ] **Step 9: Write Step 7 (end-to-end test)**

```bash
# In a scratch program directory:
mkdir -p /tmp/test-pack-install
cd /tmp/test-pack-install
npx get-shit-done-cc@latest
npx <local-pack-tarball> install --customer=<new-slug>
ls .claude/agents/gsd-*.md | wc -l   # should be ~58
cat .claude/.gsd-ic/install-manifest.json  # should record customer=<new-slug>
```

(Implementer: confirm the actual install-manifest path by `grep -n "install-manifest" bin/lib/gsd-ic/install-pack.cjs`.)

- [ ] **Step 10: Write Step 8 (commit + ship)**

```bash
git add config-overlays/<slug>/ bin/lib/gsd-ic/parse-args.cjs
git commit -m "config-overlays: add <slug> overlay"
```

Bump `VERSION` `pack:` field per `VERSIONING.md` minor/patch policy at next release; the overlay ships in that release.

- [ ] **Step 11: Write the overlay-schema reference section**

Link to spec §8.3 line 595. Note the actual schema is enforced by `bin/lib/gsd-ic/wire-overlay.cjs`, which is the source of truth — if the spec and code disagree, the code wins.

- [ ] **Step 12: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/ADDING-A-CUSTOMER-OVERLAY.md
git commit -m "docs(ic-pack): expand ADDING-A-CUSTOMER-OVERLAY with full schema + install-CLI wiring"
```

---

## Task 8: UPGRADE-PROCEDURE.md — dev-side soft-fork sync

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/UPGRADE-PROCEDURE.md`
**Length target:** 130–180 lines

- [ ] **Step 1: Outline**

```
# Dev-Side Upgrade Procedure: Soft-Fork Sync from Upstream
## Audience and scope
## Prerequisites
## Step 1: Dry-run the sync
## Step 2: Run the sync
## Step 3: Resolve conflicts (if any)
## Step 4: Update gsd_pinned in VERSION
## Step 5: Run the full validator suite
## Step 6: Run the seamless-fork validator
## Step 7: Smoke-test install
## Step 8: Commit + open PR
## Reference: soft-fork tracking procedure (spec §11.1)
```

- [ ] **Step 2: Write Audience and scope**

This doc is for **maintainers of the gsd-ic dev repo**, not for consumers. Consumers see [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md). The gsd-ic repo is a soft-fork of `gsd-build/get-shit-done` — most of the IC pack lives alongside vendored upstream content; upstream improvements flow in via merge, not via package dependency.

- [ ] **Step 3: Write Prerequisites**

- `upstream` git remote configured: `git remote add upstream https://github.com/gsd-build/get-shit-done.git` (the sync script will error if missing).
- Clean working tree (`git status --porcelain` returns empty).
- On `main` branch (or a sync-prep branch).
- Node 22+ installed locally.

- [ ] **Step 4: Write Step 1 (dry-run)**

```bash
npm run sync-upstream -- --no-merge
```

Shows what would be merged without merging. Output: count of commits behind upstream + the `git log --oneline` of those commits. If "already in sync", stop here.

- [ ] **Step 5: Write Step 2 (run sync)**

```bash
npm run sync-upstream
```

Runs `tools/sync/sync-from-upstream.sh` which:
1. Fetches `upstream`.
2. Reports how far behind.
3. Merges `upstream/main` into the current branch (no edit on the merge commit).
4. Reapplies workflow patches via `tools/patch-workflows.sh`.
5. Bumps `gsd_pinned` field in `VERSION` (matched against the upstream `package.json` version).
6. Runs the full validator suite.

If any step fails, the script halts and leaves the repo in the failed state (no auto-rollback).

- [ ] **Step 6: Write Step 3 (conflicts)**

If `git merge upstream/main` produces conflicts, the script exits with an error. Common conflict zones:
- `package.json` `files[]` and `scripts{}` — usually safe to take both sides
- `agents/` upstream agents — if upstream renamed or restructured, audit by hand; ic-pack agents under `agents/gsd-*.md` listed in `package.json` `files[]` are pack-owned and should not be touched by upstream merges
- `commands/`, `skills/` upstream content — upstream changes usually win
- `workflow-patches/` — pack-owned; upstream changes here are a smell

Resolve conflicts manually, run `git add` on resolved files, `git commit` to complete the merge, then **re-run the validator suite manually** (`npm run ci`) since the sync script aborted mid-flight.

- [ ] **Step 7: Write Step 4 (bump gsd_pinned)**

If the merge wasn't taken cleanly by the script, manually update `VERSION`:

```
pack: <current>
gsd_pinned: <new upstream version, from upstream package.json>
```

Also update `peerDependencies.get-shit-done-cc` range in `package.json` if the major bumped.

- [ ] **Step 8: Write Step 5 (validators)**

```bash
npm run ci
npm run test:validators
npm test
```

All three must pass before committing the sync. The validator suite includes:
- Manifest schema (`validate-manifest.sh`)
- Completion markers (`validate-completion-markers.sh`)
- Classification banners (`validate-classification.sh`)
- Workflow patches (`validate-workflow-patches.sh`)
- Trigger strings (`validate-triggers.sh`)
- Reference staleness (`validate-reference-staleness.sh`)
- Audit log (`validate-audit-log.sh`)
- Agents (`validate-agents.sh`)
- Skills (`validate-skills.sh`)
- Publish scope (`validate-publish-scope.sh`)
- No classified leak (`validate-no-classified-leak.sh`)
- Seamless fork (`validate-seamless-fork.sh`)

- [ ] **Step 9: Write Step 6 (seamless-fork)**

```bash
bash tools/ci/validate-seamless-fork.sh
```

The seamless-fork guarantee is the load-bearing invariant for upstream syncs: with every IC gate and hook disabled in `.planning/intel-gates.json`, an installed program must behave bit-for-bit identically to a stock GSD program. An upstream sync that breaks this validator means the pack is no longer a clean superset.

- [ ] **Step 10: Write Step 7 (smoke install)**

```bash
npm pack    # produces adelphi-gsd-ic-<version>.tgz
mkdir -p /tmp/test-pack-install && cd /tmp/test-pack-install
npx get-shit-done-cc@latest
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=nga
ls .claude/agents/gsd-*.md | wc -l
```

Confirms the tarball installs against the new pinned GSD version.

- [ ] **Step 11: Write Step 8 (commit + PR)**

```bash
git push origin <sync-branch>
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "sync: upstream gsd-build/get-shit-done <new-version>" \
  --body "Pulls upstream changes; bumps gsd_pinned to <version>. Validators green."
```

Squash-merge with `--delete-branch` after CI green.

- [ ] **Step 12: Write the spec reference section**

Link to spec §11.1 line 958 for the formal soft-fork tracking procedure.

- [ ] **Step 13: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/UPGRADE-PROCEDURE.md
git commit -m "docs(ic-pack): expand UPGRADE-PROCEDURE with full sync workflow"
```

---

## Task 9: CONSUMER-UPGRADE.md — consumer-side version bump

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/CONSUMER-UPGRADE.md`
**Length target:** 80–120 lines

- [ ] **Step 1: Outline**

```
# Consumer-Side Upgrade: Bumping the Installed Pack Version
## When to upgrade
## Step 1: Pre-upgrade snapshot
## Step 2: Re-run the install
## Step 3: Switching customer (only if needed)
## Step 4: Post-upgrade verification
## What's preserved across upgrades
## Rollback
```

- [ ] **Step 2: Write When to upgrade**

- A new IC pack release ships (watch the `@adelphi/gsd-ic` npm tags, or release notes in the dev repo).
- Upstream GSD ships a security update that ic-pack pins to (check `gsd_pinned` in the new pack's `VERSION`).
- The active customer overlay changes (rare — see Step 3).

The pack is *idempotent* on re-install: running install with the same `--customer=` updates pack-managed content without touching program-owned files.

- [ ] **Step 3: Write Step 1 (snapshot)**

```bash
cd /path/to/your/program
git status   # confirm clean tree
git tag pre-upgrade-$(date +%Y-%m-%d)   # optional rollback tag
```

Note the current pack version (from `.claude/.gsd-ic/install-manifest.json` if present, or from `.claude/agents/gsd-*.md` frontmatter — implementer: confirm where the install metadata lives by reading `bin/lib/gsd-ic/install-pack.cjs`).

- [ ] **Step 4: Write Step 2 (re-run install)**

```bash
npx @adelphi/gsd-ic@latest install --customer=<same-customer-as-before>
```

Pin to a specific version if needed:

```bash
npx @adelphi/gsd-ic@<version> install --customer=<customer>
```

Idempotency: re-running with the same `--customer=` is safe. Pack content under `.claude/` (agents, hooks, skills, intel-refs, commands) is replaced; program-owned files (`.planning/intel-context.md`, `.planning/intel-gates.json` if edited, `.claude/settings.json` non-IC entries) are preserved.

- [ ] **Step 5: Write Step 3 (customer switch)**

If switching customers (rare — should match the program's actual IC customer):

```bash
npx @adelphi/gsd-ic@latest install --customer=<new-customer> --confirm-customer-switch
```

The `--confirm-customer-switch` flag is required when the new `--customer=` differs from the recorded customer in the install manifest. Without it, the install refuses (exit 4) to prevent accidental overlay swaps.

- [ ] **Step 6: Write Step 4 (verify)**

```bash
ls .claude/agents/gsd-*.md | wc -l   # ~58 + stock GSD
grep -c "gsd-classification-banner" .claude/settings.json   # hooks wired
```

Run any IC agent against a smoke test. If errors, check [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

- [ ] **Step 7: Write "What's preserved"**

Preserved across upgrades:
- `.planning/intel-context.md` (your program context)
- `.planning/intel-gates.json` (your gate enablement edits)
- `.claude/settings.json` (non-IC sections; IC hook registrations are re-wired)
- Any files outside `.claude/.gsd-ic/`-managed paths

Replaced on every upgrade:
- `.claude/agents/gsd-*.md` (pack agents)
- `.claude/intel-refs/` (pack refs)
- `.claude/skills/` (pack skills)
- `.claude/hooks/` (pack hooks)
- `.claude/commands/` (pack-shipped commands)
- `.claude/.gsd-ic/install-manifest.json`

- [ ] **Step 8: Write Rollback**

```bash
# Easiest: revert to the pre-upgrade tag if one was captured
git checkout pre-upgrade-<date>

# Or: install a specific older version
npx @adelphi/gsd-ic@<older-version> install --customer=<customer>

# Or: uninstall entirely and re-do
npx @adelphi/gsd-ic@latest uninstall
```

- [ ] **Step 9: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/CONSUMER-UPGRADE.md
git commit -m "docs(ic-pack): expand CONSUMER-UPGRADE with idempotent re-run flow"
```

---

## Task 10: TROUBLESHOOTING.md — seeded failure modes

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/TROUBLESHOOTING.md`
**Length target:** 160–220 lines

- [ ] **Step 1: Outline (8 seeded entries)**

```
# Troubleshooting
## Install: "GSD not detected"
## Install: "incompatible GSD version"
## Install: "unknown customer"
## Install: "customer switch requires --confirm-customer-switch"
## CI: validate-completion-markers fails
## CI: validate-manifest fails
## CI: validate-seamless-fork fails after upstream sync
## Runtime: agent never fires from gate trigger
## Runtime: classification banner false positive
## Runtime: hook crashes (Node version mismatch)
```

(Pick 8 of the above 10 — implementer may prune to keep length in range. Recommended keep: GSD-not-detected, incompatible-GSD-version, unknown-customer, validate-completion-markers, validate-seamless-fork, agent-never-fires, classification-banner-false-positive, hook-crashes.)

- [ ] **Step 2: Per-entry template**

Each entry: ~20 lines. Use this structure:

```markdown
## <Headline of the failure>

**Symptom:**
<What the user sees — exact error string in monospace if available>

**Cause:**
<One paragraph explaining what triggers it>

**Fix:**
<Numbered steps>

**Validator / tool that catches it:**
<Path to validator or `<none — runtime only>`>
```

- [ ] **Step 3: Write the 8 entries**

For each, the implementer should:
1. Grep the codebase for the actual error string (e.g., `grep -rn "GSD not detected" bin/`).
2. Read the validator source to describe the exact check.
3. Reference the validator path and any spec section where the invariant is defined.

Sample entry (GSD not detected):

```markdown
## Install: "GSD not detected"

**Symptom:**
```
error: GSD not detected in <target>. Run `npx get-shit-done-cc@latest` to install GSD first.
```

**Cause:**
The IC pack installer requires upstream GSD to be present in the target directory before it will overlay pack content. The check looks for `.claude/get-shit-done/` (the upstream-installed marker directory).

**Fix:**
1. `cd /path/to/your/program`
2. `npx get-shit-done-cc@latest` — installs upstream GSD
3. Re-run the IC pack install command.

**Validator / tool that catches it:**
`bin/lib/gsd-ic/verify-gsd.cjs` (preflight, exit code 3).
```

- [ ] **Step 4: Forbidden-language scan + link check + commit**

```bash
git add docs/ic-pack/TROUBLESHOOTING.md
git commit -m "docs(ic-pack): seed TROUBLESHOOTING with 8 known failure modes"
```

---

## Task 11: PER-CUSTOMER-PLAYBOOK.md — section-skeleton + seeds

**File:** `/Users/romansky/gsd-ic/docs/ic-pack/PER-CUSTOMER-PLAYBOOK.md`
**Length target:** 120–180 lines

- [ ] **Step 1: Outline**

```
# Per-Customer Playbook
## Audience and handling
## Section template (per customer)
## CIA
## DIA
## NGA
## NRO
## NSA
## Adding entries
```

- [ ] **Step 2: Write Audience and handling**

Internal document. Redact before sharing externally. Captures gotchas, language conventions, common AO-specific compliance flavors, transition-target reality checks, and past-incident watch-outs per IC customer. Contents are best-effort and authored by program teams who have shipped to the customer; entries marked "TBC" mean "not yet captured" rather than "will be later". Treat as living knowledge, not authoritative tradecraft.

- [ ] **Step 3: Write the per-customer section template**

```markdown
## <CUSTOMER>

**Primary mission framings:** <2-3 sentences>

**Common capability gaps:** <bullet list>

**AO-specific compliance flavors:** <bullet list — e.g., NGA emphasizes GEOINT-tradecraft tradeoffs; NSA emphasizes SIGINT selector-handling rigor>

**Tradecraft / language conventions:** <how the customer phrases things in deliverables>

**Known PoR transition targets:** <list, with current status>

**Past-performance citation conventions:** <how to cite for this customer>

**Watch-outs:** <historical demo / delivery tripwires>
```

- [ ] **Step 4: Write the 5 customer sections**

For each customer slug (`cia, dia, nga, nro, nsa`), the implementer should:
1. Read `config-overlays/<slug>/overlay.json` to seed `agent_skills` map context.
2. Read `config-overlays/<slug>/refs/*.md` (if present) for customer-specific tradecraft.
3. Write the section using the template; for fields with no source data, write `TBC — capture in next pilot AAR`.

It is OK for v1-seeded sections to be sparse (3–5 lines per field). The point is structure, not exhaustive content.

- [ ] **Step 5: Write "Adding entries"**

How a program team contributes new entries: PR against this file, one section per customer. PR description must include AAR or incident reference. Redact specifics (program names, exact dates, individuals) before merging.

- [ ] **Step 6: Forbidden-language scan + link check + commit**

`TBC` is allowed here (and only here) — exempt from forbidden-language scan. Implementer should grep for everything else (`stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]`) and confirm zero hits.

```bash
git add docs/ic-pack/PER-CUSTOMER-PLAYBOOK.md
git commit -m "docs(ic-pack): seed PER-CUSTOMER-PLAYBOOK with 5 AO-section skeletons"
```

---

## Task 12: Cross-reference sweep + final PR

**Audience:** controller (you), not subagents. This task is the controller's own work — no implementer dispatch.

- [ ] **Step 1: Confirm all 11 docs are committed**

```bash
git log --oneline docs-v1-final-pass..main   # should be empty
git log --oneline main..docs-v1-final-pass | wc -l   # should be ~11
```

- [ ] **Step 2: Run forbidden-language scan across all 11 files**

```bash
grep -rniE "stub|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|^.*Plan [0-9]" docs/ic-pack/*.md
```

Allowed exceptions:
- `TBC` is permitted only in `PER-CUSTOMER-PLAYBOOK.md`.
- Spec citations like "spec §11.6" or "Phase 0" inside historical context are OK.
- Plan references inside the docs themselves are NOT OK (those are stale forward-refs).

- [ ] **Step 3: Verify all internal links resolve**

```bash
# Extract relative links from all ic-pack docs and test each:
for f in docs/ic-pack/*.md; do
  grep -oE "\]\([^)]+\.md[^)]*\)" "$f" | sed -E 's/\]\(([^)]+)\)/\1/' | while read -r link; do
    target="${link%%#*}"
    # Resolve relative to the doc's directory
    base="$(dirname "$f")"
    [ -f "$base/$target" ] || echo "BROKEN: $f -> $link"
  done
done
```

Expected: no `BROKEN:` lines.

- [ ] **Step 4: Confirm validator suite is clean**

```bash
npm run ci
```

Docs are not gated, but this confirms no accidental adjacent damage.

- [ ] **Step 5: Push branch and open PR**

```bash
git push -u origin docs-v1-final-pass
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "docs: v1 final pass for 58-agent reality (post-v1 track #1)" \
  --body "$(cat <<'EOF'
## Summary

Post-v1 docs polish — rewrites the 11 stub or near-stub files in `docs/ic-pack/` to reflect shipped v1 reality (58 agents, 5 overlays, 5 skills, 3 hooks, 12 validators, npm install entry, sync-upstream tooling).

Per spec §15.2 documentation set + adjacent stubs (TROUBLESHOOTING, PER-CUSTOMER-PLAYBOOK, ADDING-A-SKILL).

No code changes. No validator changes. Pack VERSION unchanged.

## Files rewritten (11)

- README.md
- ARCHITECTURE.md
- QUICKSTART.md
- ADDING-AN-AGENT.md
- ADDING-A-REFERENCE.md
- ADDING-A-SKILL.md
- ADDING-A-CUSTOMER-OVERLAY.md
- UPGRADE-PROCEDURE.md
- CONSUMER-UPGRADE.md
- TROUBLESHOOTING.md (8 seeded entries)
- PER-CUSTOMER-PLAYBOOK.md (5 AO skeletons)

## Test plan

- [x] `npm run ci` green
- [x] forbidden-language scan across all 11 docs: zero hits
- [x] all internal links resolve
- [x] all spec line refs verified against current spec state
EOF
)"
```

- [ ] **Step 6: Squash-merge after CI green**

```bash
gh pr merge --repo adelphidata/gsd-ic --squash --delete-branch <PR-number>
git checkout main
git pull origin main
```

- [ ] **Step 7: Update memory if any new conventions surfaced**

If during execution we discovered a non-obvious convention (e.g., a doc-style preference, a sibling-anchoring decision the user weighed in on), save a feedback memory. Otherwise: no memory update needed — these are derivable from the docs themselves.

---

## Self-review checklist (controller, before dispatch)

- [x] **Spec coverage:** §15.2 names 8 docs (README, ARCHITECTURE, QUICKSTART, ADDING-AN-AGENT, ADDING-A-REFERENCE, ADDING-A-CUSTOMER-OVERLAY, UPGRADE-PROCEDURE, CONSUMER-UPGRADE) — all 8 are tasks 1–9 here (skill = Task 6 adjacent). TROUBLESHOOTING + PER-CUSTOMER-PLAYBOOK + ADDING-A-SKILL added per user scoping decision (§15.2 + adjacent stubs).
- [x] **Placeholder scan:** No `TBD`/`TODO`/`fill in details` strings in this plan. Length targets are concrete numbers. Every step has executable content.
- [x] **Type consistency:** "completion-marker registry" / "agent-contracts.ic-pack.md" terminology consistent. "Customer overlay" / "config-overlays" consistent. `applies_when` (snake_case array) consistent.
- [x] **Inventory facts:** verified at plan-write time (58 agents, 5 overlays, 5 skills, 3 hooks, 12 validators, 10 INT refs, 13 tradecraft refs, 5 install-CLI customer values). If any change during execution, halt + escalate.
- [x] **Spec line refs:** all line numbers captured from `grep -n "^### " docs/specs/2026-05-05-ic-agent-pack-design.md` at plan time. Implementers re-verify per Task header note.
- [x] **Forbidden-language scan applied to plan itself:** grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)" → zero hits in this plan (other than quoted as the forbidden patterns themselves, which is expected).

---

## Out of scope (do NOT do as part of this plan)

- Spec changes. The spec is the source of truth.
- Validator changes. No new gates, no new checks.
- Pack VERSION bump. Bumped at next real release.
- Code changes. Docs-only PR.
- New customer overlays.
- ADR creation. (If a doc decision warrants an ADR, surface as a separate PR.)
- Filling out SME-curated content in `intel-refs/` (separate post-v1 track #2).
- Training materials (separate post-v1 track #3).
- Restructuring `docs/ic-pack/` directory layout. Stay flat.
