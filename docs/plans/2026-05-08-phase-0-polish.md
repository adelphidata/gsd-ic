# Phase 0 Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close four loose ends after Phase 0 — (1) ship `docs/ic-pack/ADDING-A-HOOK.md` for hook authoring, (2) lock the `intel-gates.json` schema as a stable target for future workflow patches, (3) ship 5 per-AO ecosystem ref scaffolds (nga/nsa/nro/cia/dia) that the context-mapper agent's prompt references, and (4) add `npx @adelphi/gsd-ic uninstall` for clean reinstall + IC-pack removal.

**Architecture:** Spec-compliant additions only — no architectural changes. Per-AO refs follow the same scaffold pattern as `int-disciplines/*` (frontmatter + structural outline + authoritative citations + SME-curation-deferred marker). Uninstall mirrors install's module structure: a single `uninstall.cjs` module that's the inverse of install-pack + wire-overlay + wire-hooks combined, plus a `parseArgs` extension to dispatch on `uninstall` subcommand. Idempotent: uninstalling on a non-installed target is a no-op.

**Tech Stack:** Same as Plan 1 — Node 20+ (`.cjs`), `node:test` for install-side tests, bash + jq for validators, Markdown for refs/docs.

**Spec reference:** `docs/specs/2026-05-05-ic-agent-pack-design.md` — §6 (hooks; informs ADDING-A-HOOK), §9.5 (intel-gates.json shape; informs the schema doc), §11 (rollout flow; informs the uninstall need), Appendix B (ecosystem ref shape).

**Prerequisites:** Plan 1 merged (commit `c19c466b` on main). `npm install` has been run.

**Seamless-fork compliance:** Plan 1-fix only ADDS files at IC-pack-controlled paths and modifies (1) `package.json` `files` (already-permitted modification per Plan 0), (2) `bin/gsd-ic-install.js` (IC-pack-owned), (3) `bin/lib/gsd-ic/parse-args.cjs` (IC-pack-owned), (4) `intel-refs/MANIFEST.json` (IC-pack-owned), and (5) the plan file itself. No upstream files touched.

---

## File Structure

Files this plan creates or modifies (paths absolute from repo root `/Users/romansky/gsd-ic/`):

**Documentation (new):**
- `docs/ic-pack/ADDING-A-HOOK.md` — author-facing guide for adding a new IC-pack hook (per Plan 1 Decomposition Decision #3).
- `docs/ic-pack/intel-gates-schema.md` — locks the `intel-gates.json` config-file schema; reference for future workflow-patch plans.

**Per-AO ecosystem refs (new):**
- `intel-refs/ecosystem/nga.md`
- `intel-refs/ecosystem/nsa.md`
- `intel-refs/ecosystem/nro.md`
- `intel-refs/ecosystem/cia.md`
- `intel-refs/ecosystem/dia.md`

**Manifest (modified):**
- `intel-refs/MANIFEST.json` — adds 5 ecosystem entries.

**Uninstall implementation (new):**
- `bin/lib/gsd-ic/uninstall.cjs` — module that strips IC-pack content + unwires hooks/overlay metadata.
- `tests/install/uninstall.test.cjs` — node:test cases.

**Install entry-point (modified):**
- `bin/lib/gsd-ic/parse-args.cjs` — recognize `uninstall` subcommand; update `USAGE` string.
- `tests/install/parse-args.test.cjs` — extend tests for uninstall subcommand.
- `bin/gsd-ic-install.js` — dispatch on `opts.subcommand === 'uninstall'`.
- `tests/install/end-to-end.test.cjs` — add install→uninstall→verify-clean round-trip case.

**Package metadata (modified):**
- `package.json` — `files` field gets per-file entries for the 5 new ecosystem refs (intel-refs/ is a recursive include, so this is just a sanity check; no actual changes needed unless we discover otherwise).

**Total new files:** 8. Modified files: 5.

---

## Decomposition Decision Log

Decisions made while writing this plan:

1. **Per-AO refs are scaffolds, not SME content.** Same convention as Plan 1's int-disciplines refs: frontmatter + structural outline + 3-5 authoritative external citations + "full SME curation deferred to pre-rollout per spec §15.1.1" marker. Each is ~150-250 words. Public information only (agency mission, primary INT focus, public references).

2. **`intel-gates.json` schema doc only — no actual gates wired.** The actual workflow-patching mechanism (gate dispatcher slash commands, patch-workflows.sh extension to apply real patches, validate-seamless-fork enforcement on real diffs) is deferred to a future phase plan. This task locks the schema so future plans have a stable target.

3. **One `uninstall.cjs` module, not three.** Install splits into install-pack + wire-overlay + wire-hooks because each addresses a different concern and is independently useful. Uninstall's inverse operations are tightly coupled (you almost always want to remove all of them together — a partial uninstall leaves the program in an undefined state). Single module is simpler and matches the actual usage shape.

4. **Uninstall is conservative.** It removes ONLY files/entries IC-pack created or marked as managed. Specifically:
    - `.claude/agents/` — only files with `ic_pack: true` frontmatter
    - `.claude/hooks/` — only files with `// ic_pack: true` marker; plus the entire `patterns/` subdir
    - `.claude/skills/` — only the IC_PACK_SKILL_NAMES list
    - `.claude/intel-refs/` — entire dir (it's IC-pack-only by definition)
    - `.claude/references/agent-contracts.ic-pack.md` — single file
    - `.claude/config-overlays/<customer>/` — only the customer named in `__gsd_ic.customer`
    - `.claude/settings.json` — strip entries matching IC_HOOKS, remove `__gsd_ic` metadata
    - `.planning/config.json` — strip `agent_skills` entries listed in `__gsd_ic.managed_agents`, remove `__gsd_ic` block
    - **Preserved**: `.planning/intel-context.md` (program-owned even though context-mapper writes it), all other `.planning/*` files, all stock GSD content, settings.json's other hooks and config keys.

5. **Idempotency of uninstall.** Re-running uninstall on a target with no IC-pack content is a no-op (succeeds with `[gsd-ic] no IC-pack content found at <target>; nothing to uninstall`). Same target idempotency principle as install.

6. **No new validators.** The existing 12 validators cover the new content (validate-classification on the ecosystem refs, validate-manifest on the new manifest entries, validate-publish-scope on package.json). No new validator needed.

---

## Task 1: `docs/ic-pack/ADDING-A-HOOK.md` — author guide

**Files:**
- Create: `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-HOOK.md`

Closes the documentation gap noted in Plan 1's Decomposition Decision #3 (per-file `files` listing means new hook authors must update package.json).

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-HOOK.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: Adding an IC-pack hook
---

# Adding an IC-pack hook

This guide is for IC-pack contributors adding a new Claude Code hook to the pack. Hooks fire on `PostToolUse` (or other Claude Code events) and emit advisories or blocks based on tool inputs/outputs.

## When to add a hook vs. a skill vs. an agent

- **Hook** — automatic, runs on every matching tool call, sub-second budget, no LLM. Use for pattern detection, audit trails, banner stamping.
- **Skill** — behavioral injection into an agent's prompt. Use for per-agent conventions or reasoning patterns.
- **Agent** — full LLM context with multi-step reasoning. Use when the work is structured, produces an artifact, or needs decision-making.

## File layout

```
hooks/
├── gsd-<name>.js              ← the hook script (Node CommonJS)
├── patterns/
│   └── <name>-patterns.json   ← (optional) data tables consumed by the hook
└── ...
tests/hooks/
└── <name>.test.cjs            ← node:test unit tests
```

## Required hook conventions

1. **First-line marker.** Every IC-pack hook script MUST have `// ic_pack: true` in the first 10 lines. This is what `bin/lib/gsd-ic/install-pack.cjs` uses to distinguish IC-pack hooks from upstream stock hooks (which share the `gsd-` prefix). Without the marker, the hook is treated as upstream and not copied to consumer installs.

2. **Module shape.** Export a `run(payload)` function plus a CLI wrapper:
   ```javascript
   #!/usr/bin/env node
   // ic_pack: true
   // <description>
   'use strict';

   function run(payload) {
     // returns { ok: boolean, action?: string, advisory?: string, ... }
   }

   module.exports = { run /*, ...other testable helpers */ };

   // CLI entry: read JSON payload from stdin (Claude Code hook protocol), invoke run.
   if (require.main === module) {
     let raw = '';
     process.stdin.setEncoding('utf8');
     process.stdin.on('data', (c) => { raw += c; });
     process.stdin.on('end', () => {
       let payload = {};
       try { payload = raw ? JSON.parse(raw) : {}; } catch {}
       const result = run(payload);
       if (result.advisory) process.stderr.write(`${result.advisory}\n`);
       process.exit(result.blocked ? 1 : 0); // or always 0 if hook is advisory-only
     });
   }
   ```

3. **Configuration.** Read `payload.config.hooks.<your_hook_name>` for enable/disable + per-hook config. Default `enabled: true`. Provide a graceful no-op when payload omits config.

4. **Tool filtering.** Check `payload.tool` early and exit `{ ok: true, action: 'skipped' }` for irrelevant tool events. Don't waste compute on `Read` events when you only care about `Write|Edit`.

5. **Pattern catalogs (when applicable).** For data-driven hooks (regex matchers, denylist scanners, etc.), put patterns in a sibling `hooks/patterns/<name>-patterns.json`. The hook `require`s the catalog at runtime relative to its own directory.

6. **Tests.** Use `node:test`, one test file at `tests/hooks/<name>.test.cjs`. Cover: happy path, every flag-trigger condition, disabled config, irrelevant tool events. Use `fs.mkdtempSync` for fixture isolation.

## Registration steps

A new hook needs entries in three places:

### A. `package.json` `files` field

Add the explicit per-file paths:

```json
"files": [
  "hooks/gsd-<name>.js",
  "hooks/patterns/<name>-patterns.json",
  ...
]
```

NOT a `hooks/gsd-*.js` glob — that would also pull in upstream stock hooks. We use per-file listings; the trade-off is that adding a new hook requires touching `package.json`.

### B. `bin/lib/gsd-ic/wire-hooks.cjs` `IC_HOOKS` array

Add:

```javascript
const IC_HOOKS = [
  // ...existing...
  { name: 'gsd-<name>.js', event: 'PostToolUse', matcher: 'Write|Edit' },
];
```

The `matcher` field uses Claude Code's tool-name-pattern syntax (e.g., `Write|Edit`, `Write`, `*`). The `event` field is the Claude Code event name (`PostToolUse`, `PreToolUse`, `SessionStart`, etc.).

### C. (Optional) Validator extension

If the hook depends on a new file path or new convention, the validator suite (`tools/ci/validate-*.sh`) may need an update. Most hooks need no validator changes — the existing `validate-no-classified-leak`, `validate-classification`, `validate-publish-scope` already cover the common cases.

## Authoring checklist (before submitting)

- [ ] Hook file has `// ic_pack: true` marker in first 10 lines.
- [ ] Module exports `run(payload)` and a CLI wrapper.
- [ ] Config schema documented in the hook's header comment.
- [ ] Tests at `tests/hooks/<name>.test.cjs` cover happy + flagging + disabled + irrelevant-tool paths.
- [ ] Pattern catalog (if any) at `hooks/patterns/<name>-patterns.json`, valid JSON.
- [ ] `package.json` `files` updated with explicit paths.
- [ ] `bin/lib/gsd-ic/wire-hooks.cjs` `IC_HOOKS` array updated.
- [ ] `bash tools/ci/_run-all.sh` and `node --test tests/hooks/*.test.cjs tests/install/*.test.cjs` both green.
- [ ] Commit subject prefixed `[U]` per `skills/classification-conventions`.

## Reference: existing hooks

See Plan 1's three hooks for working examples:

- `hooks/gsd-classification-banner.js` — frontmatter / first-line classification reader.
- `hooks/gsd-classified-leak-detector.js` — pattern-catalog-driven scanner with severity-based blocking.
- `hooks/gsd-prompt-injection-scan-intel.js` — pattern-catalog-driven advisory.

Each uses the conventions above and has a test file at `tests/hooks/<name>.test.cjs` covering the same shapes.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add docs/ic-pack/ADDING-A-HOOK.md
git commit -m "[U] docs: ADDING-A-HOOK.md (closes Plan 1 Decomposition Decision #3 docs gap)"
```

---

## Task 2: `docs/ic-pack/intel-gates-schema.md` — config schema reference

**Files:**
- Create: `/Users/romansky/gsd-ic/docs/ic-pack/intel-gates-schema.md`

Locks the `.planning/intel-gates.json` schema so future workflow-patch plans have a stable target. No actual gates wired in this plan.

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/docs/ic-pack/intel-gates-schema.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: intel-gates.json — schema reference
---

# `intel-gates.json` — schema reference

`intel-gates.json` is the per-program config file at `.planning/intel-gates.json` that controls IC-pack hook + workflow-gate behavior. It is consumer-owned (lives in the consumer's program repo) and is OPTIONAL — when absent, all hooks default to `enabled: true` and no workflow gates fire.

## File location

`<program-root>/.planning/intel-gates.json`

## Top-level shape

```json
{
  "version": "2026.05",
  "hooks": {
    "<hook_id>": {
      "enabled": true,
      "<per_hook_config_key>": <value>
    }
  },
  "gates": {
    "<gate_id>": {
      "enabled": false,
      "trigger": "<workflow-name>.<step-name>",
      "agent": "<gsd-agent-name>",
      "config": { "<gate_specific_keys>": <values> }
    }
  }
}
```

## `hooks` object

One key per IC-pack hook. Hook IDs are documented in each hook's source file. Currently shipping (Plan 1):

| Hook ID | File | Default | Per-hook keys |
|---|---|---|---|
| `classification_banner` | `hooks/gsd-classification-banner.js` | `enabled: true` | (none) |
| `classified_leak` | `hooks/gsd-classified-leak-detector.js` | `enabled: true`, `block_on_match: false` | `block_on_match: boolean` |
| `prompt_injection_intel` | `hooks/gsd-prompt-injection-scan-intel.js` | `enabled: true` | (none) |

When a hook key is absent, defaults apply. Setting `enabled: false` disables the hook entirely.

## `gates` object

One key per workflow gate. Gates are workflow-side hooks that invoke an agent at a specific step boundary. Plan 1-fix only locks the schema; no gates ship in this plan.

| Field | Required | Notes |
|---|---|---|
| `enabled` | yes | `false` by default. Setting `true` activates the gate. |
| `trigger` | yes | Format: `<workflow-name>.<step-name>` (e.g., `new-project.context-mapper`). Must resolve to a real heading slug or anchor in the named workflow file. Validated by `tools/ci/validate-triggers.sh`. |
| `agent` | yes | Name of the IC-pack agent to invoke at the trigger (e.g., `gsd-customer-context-mapper`). |
| `config` | no | Free-form per-gate config. Schema defined per gate in the agent's frontmatter. |

## Validation

- `tools/ci/validate-triggers.sh` validates that every `gates.*.trigger` resolves to a real workflow step.
- `tools/ci/validate-seamless-fork.sh` validates that the workflow patches applied for active gates are semantically inert when gates are disabled.
- Schema validation per se is currently advisory — there is no JSON-schema-backed validator. Future plans may add `validate-intel-gates.sh`.

## Default behavior (no `intel-gates.json`)

When the file is absent:

- All hooks: `enabled: true`, default per-hook config.
- All gates: `enabled: false` (no gates fire).

This matches the seamless-fork guarantee: a fresh install with no `.planning/intel-gates.json` behaves bit-for-bit as stock GSD plus advisory-only hooks.

## Example

```json
{
  "version": "2026.05",
  "hooks": {
    "classified_leak": { "enabled": true, "block_on_match": true }
  },
  "gates": {
    "context-mapper": {
      "enabled": true,
      "trigger": "new-project.intel-context",
      "agent": "gsd-customer-context-mapper"
    }
  }
}
```

This config: enables blocking-mode for the leak detector + enables the context-mapper gate at the new-project workflow's `intel-context` step.

## Versioning

The `version` field uses the same `YYYY.MM` shape as `intel-refs/MANIFEST.json` and gets bumped on framework releases. Consumers are forward-compatible within the same `YYYY.MM` series.

## Why this schema

- Hooks and gates are separate top-level objects because they are distinct mechanisms (Claude Code event hooks vs. workflow-side gate dispatchers per spec §9.6).
- Per-hook/per-gate config is opt-in: defaults work for most programs; per-program tuning is per spec §15.1's per-program PM model.
- The schema deliberately does NOT enumerate every IC-pack hook/gate at the schema level — agents and hooks self-document their config requirements in their source files. The schema only specifies the shape; the contents are open.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add docs/ic-pack/intel-gates-schema.md
git commit -m "[U] docs: lock intel-gates.json schema reference"
```

---

## Task 3: Per-AO ref — `intel-refs/ecosystem/nga.md`

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ecosystem/nga.md`

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/intel-refs/ecosystem/nga.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: NGA — National Geospatial-Intelligence Agency
topic_id: ecosystem/nga
---

# NGA — National Geospatial-Intelligence Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NGA is the IC's functional manager for GEOINT (geospatial intelligence), serving the DoD and the broader IC. Headquartered at NGA Campus East (Springfield, VA) and NGA Campus West (St. Louis, MO).

## Mission

- Provide GEOINT for national security, military operations, and disaster response.
- Functional manager (per ICD 113) for IMINT and GEOINT collection, exploitation, and dissemination.
- Steward of the GEOINT enterprise: standards, training, ATO/accreditation guidance for GEOINT systems.

## Primary INTs

- **GEOINT** (primary) — IMINT, FMV, geospatial-information.
- **IMINT** (subordinate to GEOINT in NGA's organization).

## Operational footprint

- Source Operations Group (large customer of commercial-imagery providers).
- Office of Sciences and Methodologies (R&D, including AI/ML).
- Foundation GEOINT (basemaps, AGI / activity-based intelligence).

## Authoritative sources

- nga.mil — public web presence.
- ICD 113 — *Functional Managers for IMINT/GEOINT* (DNI).
- DoDI 5105.60 — *National Geospatial-Intelligence Agency (NGA)*.

## Cross-references

- `int-disciplines/geoint.md` — the discipline NGA manages.
- `capability-patterns/pattern-of-life.md`, `capability-patterns/entity-resolution.md` — common analytic patterns NGA programs use.

## Pack engineering notes

- NGA programs typically run on AWS C2S/SC2S or NGA-managed enclaves. `intel-coding-conventions` partition-aware AWS calls apply.
- NGA's open-data program (NGA Open Data) is a useful dev-time fixture source for unclassified prototyping.
- Imagery pipelines targeting NGA are subject to NSDs (NGA Standardization Documents); engineers should reference the relevant NSD before building format-specific code.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ecosystem/nga.md
git commit -m "[U] docs(refs): nga ecosystem scaffold (Phase 0; SME expansion deferred)"
```

---

## Task 4: Per-AO ref — `intel-refs/ecosystem/nsa.md`

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ecosystem/nsa.md`

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/intel-refs/ecosystem/nsa.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: NSA — National Security Agency
topic_id: ecosystem/nsa
---

# NSA — National Security Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NSA is the IC's functional manager for SIGINT (signals intelligence) and the lead US authority for cybersecurity and information assurance. Co-located with US Cyber Command at Fort Meade, MD. NSA also manages the Central Security Service (CSS), the cryptologic combat support agency.

## Mission

- Collect, process, and disseminate SIGINT for national security and military operations.
- Functional manager (per ICD 113 / 200) for SIGINT.
- National authority for cryptologic systems, cybersecurity standards (NIAP / Common Criteria), and IA.

## Primary INTs

- **SIGINT** (primary) — comint, elint, fisint.
- **Cyber Defense / CNO support**.
- **MASINT** subordinate sub-disciplines that fall under SIGINT collection (e.g., RFINT).

## Operational footprint

- Cybersecurity Directorate (defensive mission).
- Signals Intelligence Directorate (offensive collection mission).
- Research Directorate.

## Authoritative sources

- nsa.gov — public web presence.
- ICD 113 — *Functional Managers for IMINT/GEOINT/SIGINT/MASINT*.
- USSID 18 — *Limitations and procedures in signals intelligence operations* (governs USP-related SIGINT).
- CNSSP 28 — *Policy on the use of public-key cryptography for the protection of US national security systems* (NSA-led).

## Cross-references

- `int-disciplines/sigint.md` — to be added in Phase 2 per spec §13.
- `tradecraft/icd-203.md` — analytic standards apply to SIGINT-derived assessments.

## Pack engineering notes

- NSA-mission code is held to the highest cryptographic and IA standards in the IC. `intel-coding-conventions`'s "no commercial-internet-only deps" rule applies absolutely.
- USP (US Person) data handling has specific procedures (USSID 18); any code touching collection metadata must respect minimization rules.
- NSA programs frequently target air-gapped and high-side environments; early pipeline design should assume disconnect-tolerance.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ecosystem/nsa.md
git commit -m "[U] docs(refs): nsa ecosystem scaffold (Phase 0; SME expansion deferred)"
```

---

## Task 5: Per-AO ref — `intel-refs/ecosystem/nro.md`

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ecosystem/nro.md`

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/intel-refs/ecosystem/nro.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: NRO — National Reconnaissance Office
topic_id: ecosystem/nro
---

# NRO — National Reconnaissance Office

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NRO designs, builds, launches, and operates the United States's overhead reconnaissance satellites. Headquartered in Chantilly, VA. Subordinate to both the DoD and the IC; the NRO Director is dual-hatted as the assistant secretary of the Air Force for space.

## Mission

- Design, acquire, and operate space-based reconnaissance systems.
- Deliver IMINT and SIGINT collection from overhead platforms to the rest of the IC.
- Exit point for collection; the resulting data is exploited by NGA (IMINT/GEOINT) and NSA (SIGINT).

## Primary INTs

- **IMINT** (primary; via overhead EO/IR/SAR/hyperspectral collection).
- **SIGINT** (overhead SIGINT collection).
- **MASINT** (specific collection systems).

## Operational footprint

- Imagery Systems Acquisition Directorate.
- SIGINT Systems Acquisition Directorate.
- Communications Systems Acquisition Directorate.
- Operations Directorate (mission operations of fielded systems).

## Authoritative sources

- nro.gov — public web presence.
- *NRO at 60* (DNI history retrospective; public).
- DoDI 5105.23 — *Director of the National Reconnaissance Office*.
- ICD 502 — *Integrated Defense of the Intelligence Community Information Environment* (NRO is an IC element).

## Cross-references

- `int-disciplines/geoint.md` — NGA exploits NRO-collected imagery.
- `int-disciplines/sigint.md` — NSA exploits NRO-collected SIGINT (Phase 2 placeholder).

## Pack engineering notes

- NRO programs touch space-vehicle ground systems, often with extensive launch / mission-operations integration concerns.
- Aerospace-grade software development standards (NASA / DoD STIG-equivalent) typically apply on NRO programs; coding for NRO is rigorous.
- Engineers building tools for NRO consumption should expect strong segregation between collection and exploitation domains; the data flow is producer→consumer with formal handoff points.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ecosystem/nro.md
git commit -m "[U] docs(refs): nro ecosystem scaffold (Phase 0; SME expansion deferred)"
```

---

## Task 6: Per-AO ref — `intel-refs/ecosystem/cia.md`

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ecosystem/cia.md`

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/intel-refs/ecosystem/cia.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: CIA — Central Intelligence Agency
topic_id: ecosystem/cia
---

# CIA — Central Intelligence Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

CIA is the principal foreign-intelligence service of the United States. Headquartered in Langley, VA. Reports to the Director of National Intelligence; the CIA Director also chairs the National Counterterrorism Center's intelligence component.

## Mission

- Collect, process, and analyze foreign intelligence to inform the President, NSC, and senior policymakers.
- Conduct covert action when authorized by the President under Title 50.
- Lead all-source analysis on geopolitical, economic, scientific, and technological topics of foreign-intelligence interest.

## Primary INTs

- **HUMINT** (primary; clandestine human-source operations are CIA's defining mission).
- **All-source analysis** (consuming GEOINT, SIGINT, OSINT, and HUMINT).
- **OSINT** (Open Source Enterprise was CIA-managed before transitioning to DNI).

## Operational footprint

- Directorate of Operations (clandestine HUMINT collection).
- Directorate of Analysis (all-source product).
- Directorate of Digital Innovation (digital, cyber).
- Directorate of Science & Technology (technical collection).
- Directorate of Support.

## Authoritative sources

- cia.gov — public web presence.
- *Studies in Intelligence* (CIA's unclassified scholarly journal).
- ICD 304 — *Human Intelligence* (DNI; CIA-influenced).
- 50 U.S. Code Ch. 15 — *National Security* (Title 50 authority basis).

## Cross-references

- `int-disciplines/humint.md` — CIA's primary collection discipline.
- `tradecraft/icd-203.md` — analytic standards govern CIA's analytic products.

## Pack engineering notes

- CIA-mission systems often process source-attribution metadata; `intel-coding-conventions`'s "never log source attribution" rule is foundational.
- CIA's classified IT environment (CITE) has its own stack constraints; production code targeting CITE must validate against CITE-approved component libraries.
- Open-Source Center products (now under DNI) are publicly available; useful as unclassified analytic-product corpora for ICD 203 conformance experiments.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ecosystem/cia.md
git commit -m "[U] docs(refs): cia ecosystem scaffold (Phase 0; SME expansion deferred)"
```

---

## Task 7: Per-AO ref — `intel-refs/ecosystem/dia.md`

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ecosystem/dia.md`

- [ ] **Step 1: Write the doc**

Use the Write tool, `/Users/romansky/gsd-ic/intel-refs/ecosystem/dia.md`, EXACTLY:

````markdown
---
classification: UNCLASSIFIED
title: DIA — Defense Intelligence Agency
topic_id: ecosystem/dia
---

# DIA — Defense Intelligence Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

DIA is the principal foreign-military-intelligence agency of the DoD. Headquartered at the Joint Base Anacostia-Bolling (DC) and the DIA Center at Bolling. The DIA Director is dual-hatted as the J2 director of the Joint Staff (military intelligence advisor to the Chairman, JCS).

## Mission

- Provide all-source military intelligence to military operators, planners, and policymakers.
- Functional manager for MASINT (per ICD 113).
- Operate the Defense Attaché System and the Defense Clandestine Service (HUMINT collection in support of military requirements).

## Primary INTs

- **MASINT** (primary functional management).
- **HUMINT** (military HUMINT via DCS).
- **All-source military analysis** (the mainline analytic mission).

## Operational footprint

- Directorate for Analysis.
- Directorate for Operations (DCS, attaché system).
- Directorate for MASINT and Technical Collection (DT).
- Joint Functional Component Command for ISR (subordinate; coordinates DoD-wide ISR).

## Authoritative sources

- dia.mil — public web presence.
- *Worldwide Threat Assessment* (DIA-led product, published annually; public).
- DoDI 5105.21 — *Defense Intelligence Agency*.
- ICD 113 — MASINT functional management.

## Cross-references

- `int-disciplines/humint.md` — DIA's HUMINT operational doctrine.
- `tradecraft/icd-203.md` — applies to DIA analytic products.

## Pack engineering notes

- Many DIA programs run on JWICS (Joint Worldwide Intelligence Communications System); engineers should be JWICS-aware in deployment topology assumptions.
- MASINT-related code paths often require partition-aware ARN handling (per `intel-coding-conventions`) when targeting DoD-managed cloud.
- Worldwide Threat Assessment is a public corpus useful for tradecraft / ICD 203 conformance experiments at the unclassified level.
````

- [ ] **Step 2: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ecosystem/dia.md
git commit -m "[U] docs(refs): dia ecosystem scaffold (Phase 0; SME expansion deferred)"
```

---

## Task 8: Add 5 ecosystem entries to manifest

**Files:**
- Modify: `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json`

- [ ] **Step 1: Update manifest**

Use the Write tool to overwrite `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json` with EXACTLY:

```json
{
  "version": "2026.05",
  "topics": {
    "int-disciplines/humint.md": {
      "applies_when": ["humint", "case management", "asset validation", "biometrics", "domex"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-07",
      "classification": "UNCLASSIFIED"
    },
    "int-disciplines/geoint.md": {
      "applies_when": ["geoint", "imint", "fmv", "imagery", "nitf", "stanag-4609", "kml", "geotiff", "mgrs", "geojson"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-07",
      "classification": "UNCLASSIFIED"
    },
    "tradecraft/icd-203.md": {
      "applies_when": ["icd-203", "analytic standards", "uncertainty", "tradecraft", "analytic product"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-07",
      "classification": "UNCLASSIFIED"
    },
    "capability-patterns/entity-resolution.md": {
      "applies_when": ["entity resolution", "er", "record linkage", "deduplication", "identity resolution"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-07",
      "classification": "UNCLASSIFIED"
    },
    "capability-patterns/pattern-of-life.md": {
      "applies_when": ["pol", "pattern of life", "abi", "activity-based intelligence", "behavior tracking"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-07",
      "classification": "UNCLASSIFIED"
    },
    "ecosystem/nga.md": {
      "applies_when": ["nga", "national geospatial-intelligence agency", "geoint customer", "ecosystem"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-08",
      "classification": "UNCLASSIFIED"
    },
    "ecosystem/nsa.md": {
      "applies_when": ["nsa", "national security agency", "sigint customer", "cybersecurity", "ecosystem"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-08",
      "classification": "UNCLASSIFIED"
    },
    "ecosystem/nro.md": {
      "applies_when": ["nro", "national reconnaissance office", "overhead", "satellite reconnaissance", "ecosystem"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-08",
      "classification": "UNCLASSIFIED"
    },
    "ecosystem/cia.md": {
      "applies_when": ["cia", "central intelligence agency", "humint customer", "covert action", "ecosystem"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-08",
      "classification": "UNCLASSIFIED"
    },
    "ecosystem/dia.md": {
      "applies_when": ["dia", "defense intelligence agency", "masint customer", "military intelligence", "ecosystem"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-08",
      "classification": "UNCLASSIFIED"
    }
  }
}
```

- [ ] **Step 2: Validate**

```bash
cd /Users/romansky/gsd-ic
bash tools/ci/validate-manifest.sh
bash tools/ci/validate-classification.sh
bash tools/ci/validate-reference-staleness.sh
```

Expected: all three OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/MANIFEST.json
git commit -m "[U] feat(refs): add 5 ecosystem (per-AO) entries to manifest"
```

---

## Task 9: Extend `parseArgs` to recognize `uninstall` subcommand

**Files:**
- Modify: `/Users/romansky/gsd-ic/bin/lib/gsd-ic/parse-args.cjs`
- Modify: `/Users/romansky/gsd-ic/tests/install/parse-args.test.cjs`

- [ ] **Step 1: Update parse-args tests**

Use the Edit tool on `/Users/romansky/gsd-ic/tests/install/parse-args.test.cjs`:

`old_string`:
```javascript
  it('treats --help as a request to print usage and exit cleanly', () => {
    const opts = parseArgs(['--help']);
    assert.equal(opts.subcommand, 'help');
  });
});
```

`new_string`:
```javascript
  it('treats --help as a request to print usage and exit cleanly', () => {
    const opts = parseArgs(['--help']);
    assert.equal(opts.subcommand, 'help');
  });

  it('parses uninstall subcommand without requiring --customer', () => {
    const opts = parseArgs(['uninstall', '--target=/tmp/foo']);
    assert.equal(opts.subcommand, 'uninstall');
    assert.equal(opts.target, '/tmp/foo');
    assert.equal(opts.customer, null);
  });

  it('uninstall accepts optional --customer (used to scope overlay removal explicitly)', () => {
    const opts = parseArgs(['uninstall', '--customer=nga', '--target=/tmp/foo']);
    assert.equal(opts.subcommand, 'uninstall');
    assert.equal(opts.customer, 'nga');
  });

  it('uninstall does not require --customer (will read from target metadata)', () => {
    // No throw expected.
    const opts = parseArgs(['uninstall']);
    assert.equal(opts.subcommand, 'uninstall');
    assert.equal(opts.customer, null);
  });
});
```

- [ ] **Step 2: Run test, confirm fails**

```bash
cd /Users/romansky/gsd-ic
node --test tests/install/parse-args.test.cjs 2>&1 | tail -10
```

Expected: 3 new tests fail (uninstall not yet a recognized subcommand).

- [ ] **Step 3: Update parse-args.cjs**

Use the Edit tool on `/Users/romansky/gsd-ic/bin/lib/gsd-ic/parse-args.cjs`:

`old_string`:
```javascript
const USAGE = `
Usage:
  npx @adelphi/gsd-ic install --customer=<name> [--target=<path>]

Subcommands:
  install     Install the IC pack into a program directory
  --help      Show this help

Required:
  --customer=<name>   One of: ${[...KNOWN_CUSTOMERS].join(', ')}

Optional:
  --target=<path>     Program directory (default: $PWD)

Examples:
  npx @adelphi/gsd-ic install --customer=nga
  npx @adelphi/gsd-ic@2026.05.0 install --customer=nsa --target=/path/to/program
`.trim();
```

`new_string`:
```javascript
const USAGE = `
Usage:
  npx @adelphi/gsd-ic install --customer=<name> [--target=<path>]
  npx @adelphi/gsd-ic uninstall [--target=<path>]

Subcommands:
  install     Install the IC pack into a program directory
  uninstall   Remove the IC pack from a program directory
  --help      Show this help

Required for install:
  --customer=<name>   One of: ${[...KNOWN_CUSTOMERS].join(', ')}

Optional:
  --target=<path>     Program directory (default: $PWD)

Examples:
  npx @adelphi/gsd-ic install --customer=nga
  npx @adelphi/gsd-ic uninstall --target=/path/to/program
`.trim();
```

`old_string`:
```javascript
  if (!['install', 'help'].includes(opts.subcommand)) {
    throw new Error(`unknown subcommand "${opts.subcommand}". ${USAGE}`);
  }
  if (opts.subcommand === 'install') {
    if (!opts.customer) {
      throw new Error(`install requires --customer=<name>. ${USAGE}`);
    }
    if (!KNOWN_CUSTOMERS.has(opts.customer)) {
      throw new Error(`unknown customer "${opts.customer}". Known: ${[...KNOWN_CUSTOMERS].join(', ')}`);
    }
  }
  return opts;
}
```

`new_string`:
```javascript
  if (!['install', 'uninstall', 'help'].includes(opts.subcommand)) {
    throw new Error(`unknown subcommand "${opts.subcommand}". ${USAGE}`);
  }
  if (opts.subcommand === 'install') {
    if (!opts.customer) {
      throw new Error(`install requires --customer=<name>. ${USAGE}`);
    }
    if (!KNOWN_CUSTOMERS.has(opts.customer)) {
      throw new Error(`unknown customer "${opts.customer}". Known: ${[...KNOWN_CUSTOMERS].join(', ')}`);
    }
  }
  // uninstall has no required args (target defaults to $PWD; customer is read from target metadata if absent)
  return opts;
}
```

- [ ] **Step 4: Run tests, confirm pass**

```bash
node --test tests/install/parse-args.test.cjs
```

Expected: 12 tests pass (9 existing + 3 new).

- [ ] **Step 5: Commit**

```bash
git add bin/lib/gsd-ic/parse-args.cjs tests/install/parse-args.test.cjs
git commit -m "[U] feat(install): parse-args recognizes uninstall subcommand"
```

---

## Task 10: Implement `uninstall.cjs` module + tests

**Files:**
- Create: `/Users/romansky/gsd-ic/bin/lib/gsd-ic/uninstall.cjs`
- Create: `/Users/romansky/gsd-ic/tests/install/uninstall.test.cjs`

- [ ] **Step 1: Write failing test**

Use the Write tool, `/Users/romansky/gsd-ic/tests/install/uninstall.test.cjs`, EXACTLY:

```javascript
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { installPack } = require('../../bin/lib/gsd-ic/install-pack.cjs');
const { wireOverlay } = require('../../bin/lib/gsd-ic/wire-overlay.cjs');
const { wireHooks } = require('../../bin/lib/gsd-ic/wire-hooks.cjs');
const { uninstall } = require('../../bin/lib/gsd-ic/uninstall.cjs');

function tmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `gsd-ic-uninstall-${label}-`));
}

function makePackSource() {
  const src = tmp('src');
  fs.writeFileSync(path.join(src, 'VERSION'), 'pack: 0.1.0\ngsd_pinned: 1.39.0\n');
  fs.mkdirSync(path.join(src, 'agents'), { recursive: true });
  fs.writeFileSync(path.join(src, 'agents/gsd-x.md'),
    '---\nic_pack: true\nclassification: UNCLASSIFIED\n---\n## X COMPLETE\n');
  fs.mkdirSync(path.join(src, 'hooks/patterns'), { recursive: true });
  fs.writeFileSync(path.join(src, 'hooks/gsd-test-hook.js'), '// ic_pack: true\nmodule.exports = {};\n');
  fs.writeFileSync(path.join(src, 'hooks/patterns/p.json'), '{"patterns":[]}');
  fs.mkdirSync(path.join(src, 'intel-refs'), { recursive: true });
  fs.writeFileSync(path.join(src, 'intel-refs/MANIFEST.json'), '{"version":"2026.05","topics":{}}');
  fs.mkdirSync(path.join(src, 'config-overlays/nga'), { recursive: true });
  fs.writeFileSync(path.join(src, 'config-overlays/nga/overlay.json'),
    JSON.stringify({ customer: 'nga', agent_skills: { 'gsd-x': ['.claude/skills/y'] } }));
  return src;
}

function fullInstall(target, customer) {
  const packSource = makePackSource();
  installPack({ packSource, target, customer });
  wireOverlay({ packSource, target, customer });
  wireHooks({ target });
}

describe('uninstall', () => {
  it('removes IC-pack agents but preserves stock agents', () => {
    const target = tmp('agents');
    fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/agents/gsd-stock.md'), 'stock content (no ic_pack frontmatter)');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-x.md')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-x.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-stock.md')), true);
  });

  it('removes IC-pack hooks + patterns but preserves stock hooks', () => {
    const target = tmp('hooks');
    fs.mkdirSync(path.join(target, '.claude/hooks'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/hooks/gsd-stock.js'), '// stock content (no ic_pack marker)');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-test-hook.js')), true);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/patterns/p.json')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-test-hook.js')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/patterns')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-stock.js')), true);
  });

  it('removes intel-refs entirely', () => {
    const target = tmp('refs');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs/MANIFEST.json')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs')), false);
  });

  it('removes config-overlays/<customer>/ but not other customers', () => {
    const target = tmp('overlay');
    fullInstall(target, 'nga');
    fs.mkdirSync(path.join(target, '.claude/config-overlays/nsa'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/config-overlays/nsa/overlay.json'), '{"customer":"nsa"}');
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/config-overlays/nga')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/config-overlays/nsa')), true);
  });

  it('removes IC-pack hooks from settings.json but preserves other hooks', () => {
    const target = tmp('settings');
    fs.mkdirSync(path.join(target, '.claude'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/settings.json'), JSON.stringify({
      hooks: {
        PostToolUse: [
          { matcher: 'Write|Edit', hooks: [{ type: 'command', command: 'node ~/.claude/hooks/some-other.js' }] },
        ],
      },
      otherKey: { kept: true },
    }));
    fullInstall(target, 'nga');
    uninstall({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    const cmds = (s.hooks?.PostToolUse || []).flatMap((e) => (e.hooks || []).map((h) => h.command || ''));
    assert.ok(cmds.some((c) => c.includes('some-other.js')), 'pre-existing hook preserved');
    assert.ok(!cmds.some((c) => c.includes('gsd-classification-banner')), 'IC-pack hook entry removed');
    assert.equal(s.__gsd_ic, undefined);
    assert.equal(s.otherKey.kept, true);
  });

  it('removes IC-pack metadata from .planning/config.json but preserves other keys', () => {
    const target = tmp('config');
    fs.mkdirSync(path.join(target, '.planning'), { recursive: true });
    fs.writeFileSync(path.join(target, '.planning/config.json'), JSON.stringify({
      workflow: { auto_advance: true },
      agent_skills: { 'gsd-planner': ['.claude/skills/some-stock-skill'] },
    }));
    fullInstall(target, 'nga');
    uninstall({ target });
    const cfg = JSON.parse(fs.readFileSync(path.join(target, '.planning/config.json'), 'utf8'));
    assert.equal(cfg.workflow.auto_advance, true);
    assert.deepEqual(cfg.agent_skills['gsd-planner'], ['.claude/skills/some-stock-skill']);
    assert.equal(cfg.agent_skills['gsd-x'], undefined, 'IC-pack agent_skills entry removed');
    assert.equal(cfg.__gsd_ic, undefined);
  });

  it('preserves program-owned files (.planning/intel-context.md)', () => {
    const target = tmp('preserve');
    fs.mkdirSync(path.join(target, '.planning'), { recursive: true });
    fs.writeFileSync(path.join(target, '.planning/intel-context.md'), 'PROGRAM CONTEXT');
    fullInstall(target, 'nga');
    uninstall({ target });
    assert.equal(fs.readFileSync(path.join(target, '.planning/intel-context.md'), 'utf8'), 'PROGRAM CONTEXT');
  });

  it('is idempotent — uninstall on a non-installed target is no-op', () => {
    const target = tmp('clean');
    // Should not throw.
    uninstall({ target });
    // Re-running should also not throw.
    uninstall({ target });
  });
});
```

- [ ] **Step 2: Run, confirm fails**

```bash
cd /Users/romansky/gsd-ic
node --test tests/install/uninstall.test.cjs 2>&1 | tail -10
```

Expected: `Cannot find module`.

- [ ] **Step 3: Implement `uninstall.cjs`**

Use the Write tool, `/Users/romansky/gsd-ic/bin/lib/gsd-ic/uninstall.cjs`, EXACTLY:

```javascript
'use strict';

const fs = require('fs');
const path = require('path');
const { IC_HOOKS } = require('./wire-hooks.cjs');
const { isIcPackAgent, isIcPackHook, IC_PACK_SKILL_NAMES } = require('./install-pack.cjs');

function rmIfExists(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function rmAgents(target) {
  const dir = path.join(target, '.claude/agents');
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const p = path.join(dir, entry.name);
    if (isIcPackAgent(p)) fs.rmSync(p);
  }
}

function rmHooks(target) {
  const dir = path.join(target, '.claude/hooks');
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const p = path.join(dir, entry.name);
      if (isIcPackHook(p)) fs.rmSync(p);
    }
  }
  // Pattern catalogs are IC-pack-only.
  rmIfExists(path.join(dir, 'patterns'));
}

function rmSkills(target) {
  const dir = path.join(target, '.claude/skills');
  if (!fs.existsSync(dir)) return;
  for (const skillName of IC_PACK_SKILL_NAMES) {
    rmIfExists(path.join(dir, skillName));
  }
}

function rmIntelRefs(target) {
  rmIfExists(path.join(target, '.claude/intel-refs'));
}

function rmContractRegistry(target) {
  rmIfExists(path.join(target, '.claude/references/agent-contracts.ic-pack.md'));
}

function rmOverlay(target, customer) {
  if (!customer) return;
  rmIfExists(path.join(target, '.claude/config-overlays', customer));
}

function unwireSettingsHooks(target) {
  const p = path.join(target, '.claude/settings.json');
  if (!fs.existsSync(p)) return;
  let settings;
  try { settings = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return; }
  if (settings.hooks) {
    for (const event of Object.keys(settings.hooks)) {
      const arr = settings.hooks[event] || [];
      settings.hooks[event] = arr
        .map((entry) => {
          if (!entry || !Array.isArray(entry.hooks)) return entry;
          const filtered = entry.hooks.filter((h) =>
            !IC_HOOKS.some((ich) => h.command && h.command.includes(ich.name))
          );
          if (filtered.length === entry.hooks.length) return entry;
          if (filtered.length === 0) return null;
          return { ...entry, hooks: filtered };
        })
        .filter(Boolean);
      if (settings.hooks[event].length === 0) delete settings.hooks[event];
    }
    if (Object.keys(settings.hooks).length === 0) delete settings.hooks;
  }
  delete settings.__gsd_ic;
  fs.writeFileSync(p, JSON.stringify(settings, null, 2) + '\n');
}

function unwireConfigOverlay(target) {
  const p = path.join(target, '.planning/config.json');
  if (!fs.existsSync(p)) return null;
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
  const customer = cfg.__gsd_ic && cfg.__gsd_ic.customer;
  const managedAgents = (cfg.__gsd_ic && cfg.__gsd_ic.managed_agents) || [];
  if (cfg.agent_skills) {
    for (const a of managedAgents) delete cfg.agent_skills[a];
    if (Object.keys(cfg.agent_skills).length === 0) delete cfg.agent_skills;
  }
  delete cfg.__gsd_ic;
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
  return customer;
}

function uninstall({ target }) {
  if (!target) throw new Error('uninstall requires { target }');
  // Read customer from target metadata BEFORE we strip the metadata.
  const customer = unwireConfigOverlay(target);
  unwireSettingsHooks(target);
  rmAgents(target);
  rmHooks(target);
  rmSkills(target);
  rmIntelRefs(target);
  rmContractRegistry(target);
  rmOverlay(target, customer);
}

module.exports = { uninstall };
```

- [ ] **Step 4: Run test, confirm pass**

```bash
node --test tests/install/uninstall.test.cjs
```

Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add bin/lib/gsd-ic/uninstall.cjs tests/install/uninstall.test.cjs
git commit -m "[U] feat(install): uninstall.cjs module + tests"
```

---

## Task 11: Wire `uninstall` subcommand into `bin/gsd-ic-install.js`

**Files:**
- Modify: `/Users/romansky/gsd-ic/bin/gsd-ic-install.js`

- [ ] **Step 1: Add uninstall import + dispatch**

Use the Edit tool on `/Users/romansky/gsd-ic/bin/gsd-ic-install.js`:

`old_string`:
```javascript
const { wireHooks } = require(path.join(__dirname, 'lib', 'gsd-ic', 'wire-hooks.cjs'));
```

`new_string`:
```javascript
const { wireHooks } = require(path.join(__dirname, 'lib', 'gsd-ic', 'wire-hooks.cjs'));
const { uninstall } = require(path.join(__dirname, 'lib', 'gsd-ic', 'uninstall.cjs'));
```

`old_string`:
```javascript
  if (opts.subcommand === 'help') {
    process.stdout.write(`${USAGE}\n`);
    process.exit(0);
  }

  const packSource = path.join(__dirname, '..');
  const gsdPinned = readGsdPinned();
```

`new_string`:
```javascript
  if (opts.subcommand === 'help') {
    process.stdout.write(`${USAGE}\n`);
    process.exit(0);
  }

  if (opts.subcommand === 'uninstall') {
    try {
      uninstall({ target: opts.target });
    } catch (e) {
      process.stderr.write(`error: ${e.message}\n`);
      process.exit(6);
    }
    process.stdout.write(`uninstall complete: @adelphi/gsd-ic removed from ${opts.target}\n`);
    process.exit(0);
  }

  const packSource = path.join(__dirname, '..');
  const gsdPinned = readGsdPinned();
```

- [ ] **Step 2: Quick smoke**

```bash
cd /Users/romansky/gsd-ic
# --help still works
node bin/gsd-ic-install.js --help 2>&1 | head -3
```

Expected: usage output that mentions both `install` and `uninstall` subcommands.

- [ ] **Step 3: Commit**

```bash
git add bin/gsd-ic-install.js
git commit -m "[U] feat(install): bin/gsd-ic-install.js dispatches on uninstall subcommand"
```

---

## Task 12: Add install→uninstall round-trip e2e test

**Files:**
- Modify: `/Users/romansky/gsd-ic/tests/install/end-to-end.test.cjs`

- [ ] **Step 1: Append round-trip test**

Use the Edit tool on `/Users/romansky/gsd-ic/tests/install/end-to-end.test.cjs`:

`old_string`:
```javascript
  it('errors on customer switch without --confirm-customer-switch', () => {
    const target = tmp('switch');
    setupFakeGsdInstall(target);
    runInstall(['install', '--customer=nga', `--target=${target}`]);
    assert.throws(() => runInstall(['install', '--customer=nsa', `--target=${target}`]), /customer switch/i);
  });
});
```

`new_string`:
```javascript
  it('errors on customer switch without --confirm-customer-switch', () => {
    const target = tmp('switch');
    setupFakeGsdInstall(target);
    runInstall(['install', '--customer=nga', `--target=${target}`]);
    assert.throws(() => runInstall(['install', '--customer=nsa', `--target=${target}`]), /customer switch/i);
  });

  it('install → uninstall round-trip leaves only stock content', () => {
    const target = tmp('roundtrip');
    setupFakeGsdInstall(target);
    runInstall(['install', '--customer=nga', `--target=${target}`]);
    // Sanity: IC-pack content is present.
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs/MANIFEST.json')), true);
    const out = runInstall(['uninstall', `--target=${target}`]);
    assert.match(out, /uninstall complete/i);
    // IC-pack content gone.
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-customer-context-mapper.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-classification-banner.js')), false);
    // Stock GSD signal still present.
    assert.equal(fs.existsSync(path.join(target, '.claude/skills/gsd-help/SKILL.md')), true);
  });

  it('uninstall is idempotent on a non-installed target', () => {
    const target = tmp('clean-uninstall');
    setupFakeGsdInstall(target);
    // Just-set-up-stock-GSD target; never installed IC pack.
    const out = runInstall(['uninstall', `--target=${target}`]);
    assert.match(out, /uninstall complete/i);
    // Stock content still present.
    assert.equal(fs.existsSync(path.join(target, '.claude/skills/gsd-help/SKILL.md')), true);
  });
});
```

- [ ] **Step 2: Run install test suite**

```bash
cd /Users/romansky/gsd-ic
node --test tests/install/*.test.cjs 2>&1 | tail -8
```

Expected: 43 tests pass across 8 files (parse-args 12 + verify-gsd 4 + install-pack 5 + wire-overlay 5 + wire-hooks 4 + idempotency 2 + uninstall 8 + end-to-end 6 = 46... actually adjust to match — count via the test runner output).

- [ ] **Step 3: Commit**

```bash
git add tests/install/end-to-end.test.cjs
git commit -m "[U] test(install): install→uninstall round-trip + idempotent-on-clean tests"
```

---

## Task 13: Bottom-to-top integration smoke

**Files:** none new — exercises full Plan 1-fix deliverable.

- [ ] **Step 1: Re-run all CI**

```bash
cd /Users/romansky/gsd-ic
bash tools/ci/_run-all.sh
```

Expected: all 12 validators OK.

- [ ] **Step 2: Re-run all tests**

```bash
bash tools/ci/tests/_run-all.sh
node --test tests/install/*.test.cjs
node --test tests/hooks/*.test.cjs
```

Expected: all green.

- [ ] **Step 3: Manual install + uninstall against `/tmp/fake-program`**

```bash
rm -rf /tmp/fake-program
mkdir -p /tmp/fake-program/.claude/skills/gsd-help
echo "fake stock GSD" > /tmp/fake-program/.claude/skills/gsd-help/SKILL.md

# Install
node /Users/romansky/gsd-ic/bin/gsd-ic-install.js install --customer=nga --target=/tmp/fake-program

# Verify pack present
test -f /tmp/fake-program/.claude/agents/gsd-customer-context-mapper.md && echo "agent installed"
test -f /tmp/fake-program/.claude/intel-refs/ecosystem/nga.md && echo "ecosystem ref installed"

# Uninstall
node /Users/romansky/gsd-ic/bin/gsd-ic-install.js uninstall --target=/tmp/fake-program

# Verify pack gone but stock remains
test ! -e /tmp/fake-program/.claude/agents/gsd-customer-context-mapper.md && echo "agent removed"
test ! -e /tmp/fake-program/.claude/intel-refs && echo "intel-refs removed"
test -f /tmp/fake-program/.claude/skills/gsd-help/SKILL.md && echo "stock GSD preserved"
```

Expected: 5 "✓" lines confirming round-trip clean.

- [ ] **Step 4: Verify package.json scope still clean**

```bash
cd /Users/romansky/gsd-ic
bash tools/ci/validate-publish-scope.sh
npm pack --dry-run 2>&1 | grep "npm notice " | grep -E "^npm notice [0-9]" | grep -E "ecosystem/" | head
```

Expected: validate-publish-scope OK; the 5 ecosystem ref files appear in pack contents.

- [ ] **Step 5: Cleanup**

```bash
rm -rf /tmp/fake-program
```

- [ ] **Step 6: Commit (only if smoke required fixes; otherwise no commit)**

If Steps 1-4 produced any deviations, commit fixes against the appropriate prior task with a `fix:` prefix. Otherwise no commit needed.

---

## Self-Review

### 1. Spec coverage

This plan addresses 4 user-selected scope items:

| Item | Plan task | Notes |
|---|---|---|
| ADDING-A-HOOK.md docs | Task 1 | ✓ |
| intel-gates.json schema doc | Task 2 | ✓ schema only; no actual gates |
| Per-AO ecosystem ref scaffolds (5) | Tasks 3-7 | ✓ |
| Manifest entries for ecosystem refs | Task 8 | ✓ |
| --uninstall subcommand | Tasks 9-12 | parseArgs + module + entry-point + e2e |
| Bottom-to-top smoke | Task 13 | ✓ |

No gaps.

### 2. Placeholder scan

```bash
grep -n -E "(TBD|TODO|implement later|fill in|appropriate (error|validation|edge))" /Users/romansky/gsd-ic/docs/plans/2026-05-08-phase-0-polish.md | head
```

Expected: zero hits, or only inside intentional template content.

### 3. Type / API consistency

- `uninstall({ target })` signature consistent with how `bin/gsd-ic-install.js` calls it (Task 10 + Task 11). ✓
- `IC_HOOKS` imported from `wire-hooks.cjs` matches the Plan 1 export. ✓
- `IC_PACK_SKILL_NAMES`, `isIcPackAgent`, `isIcPackHook` imported from `install-pack.cjs` — all already exported by Plan 1's install-pack module. ✓
- New `parseArgs` `uninstall` subcommand correctly does NOT require `--customer` (which install does). ✓

### 4. Scope check

- ✓ `npm run ci` continues to pass after every task
- ✓ New install tests cover both happy path (round-trip) and idempotency on clean target
- ✓ npm pack scope unchanged in shape; just adds 5 more ecosystem refs (covered by recursive `intel-refs/` glob already in `files`)
- ✓ Seamless-fork preserved (no upstream files touched)

---

## Plan complete

Plan saved to `/Users/romansky/gsd-ic/docs/plans/2026-05-08-phase-0-polish.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — Dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `superpowers:executing-plans`.

Which approach?

---

## Out-of-scope reminders

These items are **NOT** in this plan and belong to subsequent plans:

- Actual workflow patches (the gate-dispatcher slash commands per spec §9.6 + the first concrete `intel-gates.json` patches). Substantial mechanism design; deferred to a Phase 1 plan.
- The third skill `prototyping-discipline` (lands in Phase 4 per spec §13).
- Skills 4 (`adelphi-house-style`) lands in Phase 4.
- The remaining 56 IC-pack agents.
- SME-curated expansion of all the scaffolded refs (per spec §15.1.1).

---

## Deviations from plan during execution

(populated as deviations occur during implementation)
