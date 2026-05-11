# Phase 7 Round 4 Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 6 agents (`gsd-icd-203-enforcer`, `gsd-techint-researcher`, `gsd-medint-researcher`, `gsd-techsigint-researcher`, `gsd-ai-eval-auditor`, `gsd-fm-adaptation-engineer`), 5 ref scaffolds (`intel-refs/int-disciplines/techint.md`, `intel-refs/int-disciplines/medint.md`, `intel-refs/int-disciplines/techsigint.md`, `intel-refs/tradecraft/icd-206.md`, `intel-refs/tradecraft/words-of-estimative-probability.md`), 5 manifest entries, 6 registry rows, 11 package allowlist paths (6 agents + 5 refs; the new template path lands via the `workflow-patches/` glob), and the first shipping `workflow-patches/intel-gates.template.json` wired with 4 Family L gate entries — all per spec §13 Phase 7 deliverables (line 1075). End state: tradecraft enforcement (ICD 203) is automatable on any analytic artifact; three additional INT disciplines (TECHINT, MEDINT, technical SIGINT) have first-class researchers and refs; AI/ML eval design + audit and FM adaptation are full agents in the pack; and the first non-trivial gate-config template ships, wiring Family L (CI / targeting / insider-threat / adversary-modeler) for always-on parallel firing on the phase-research workflow step.

**Architecture:** Phase 7 is the **Round 4 expansion** layer — analytic-quality enforcement (Family J ICD 203 enforcer), three additional Family I per-INT researchers, two Family N AI specialty agents, and the runtime wiring that activates Family L "always-on parallel" mission-framing analysts that shipped agent-side in Plan 6. The three new Family I researchers follow the identical 7-agent pattern already shipped (Read/Write/Bash/Grep/Glob + WebSearch/WebFetch + mcp__context7__*; `## RESEARCH COMPLETE` marker); each ships with a matching `int-disciplines/*.md` ref so the 7-of-7 pattern becomes 10-of-10. The ICD 203 enforcer audits analytic artifacts against ICD 203 §C.6 standards and Words of Estimative Probability discipline; it requires two new tradecraft refs (`icd-206.md`, `words-of-estimative-probability.md`) that spec line 353 names as inputs — both are forward-referenced from the existing `icd-203.md` scaffold (Plan 0). `gsd-ai-eval-auditor` is a **dual-mode agent**: one agent file emits one of three validator-compliant markers based on operating mode (`## AI EVAL DESIGN COMPLETE` for the design path, `## AI EVAL AUDIT COMPLETE` for the audit path, `## AI EVAL ISSUES FOUND` for the audit-with-findings failure mode). `gsd-fm-adaptation-engineer` is the only Phase 7 agent with the `Edit` tool (foundation-model adaptation implementation: RAG / fine-tune / prompting pipelines for IC content); it joins the 7 existing Edit-tool agents (code-fixer, synthetic-data-engineer, debugger, intel-devops, executor, domex-engineer, poam-tracker) and needs an explicit isolation smoke step. **Zero marker conversions in Phase 7** — every spec-declared marker is validator-compliant out of the box. The Family L gate wiring is shipped as **4 separate gate entries with a shared trigger string** (`plan-phase.5-handle-research`), avoiding any schema change; the gate-dispatcher runtime fans out at the resolved trigger by activating all gates whose trigger matches. This is the **first materialization** of the shipping `workflow-patches/intel-gates.template.json` — the schema doc (`docs/ic-pack/intel-gates-schema.md`) exists since Plan 1-fix but the template file itself has only been a `.gitkeep` placeholder.

**Tech Stack:** Same as Plans 0-7 — Node.js 20+ (CommonJS `.cjs`), `node:test` for install-side JS tests, bash + jq for validators, Markdown for refs/agents, JSON for the intel-gates template. No new runtime dependencies.

**Spec reference:** `docs/specs/2026-05-05-ic-agent-pack-design.md` — §13 Phase 7 row (line 1075); Family I #43-#45 (lines 344-346); Family J #47 (line 353); Family N #56-#57 (lines 384-385); Family L always-on description (lines 361-370); §9.6 gate-dispatcher fan-out resolution (line 1148 O-06 entry); Appendix A agent file template; Appendix B ref-doc template.

**Schema reference:** `docs/ic-pack/intel-gates-schema.md` — Plan 1-fix schema lock. Plan 7 is the first plan to ship a gate entry conforming to the schema.

**Prerequisites:** Plans 0, 1, 1-fix, 2, 3, 4, 5, 6, and 7 merged on main (confirmed at HEAD `2eb1e14d` — 52 IC pack agents, 3 hooks, 5 skills, 31 ref topics, full validator suite passing). `npm install` run. `tools/ci/_run-all.sh` exits 0. `intel-refs/int-disciplines/` contains 7 refs (cybint, finint, geoint, humint, masint, osint, sigint). `intel-refs/tradecraft/` contains 11 refs (ato-document-suite, ato-process-overview, cmmc-2.0, dfars-252-204-7012, eo-14028, fips-140-3, icd-203, itar-ear, nist-800-171, nist-800-53-rev5, poam-format). `workflow-patches/` directory exists with only `.gitkeep`.

**Seamless-fork compliance:** Plan 8 only ADDS files at IC-pack-controlled paths. The upstream-owned files modified are `package.json` (already-permitted modification per Plans 0-7) and `references/agent-contracts.ic-pack.md` (an IC-pack-named file owned by this pack). One new IC-pack-controlled path is materialized: `workflow-patches/intel-gates.template.json` — workflow-patches is an IC-pack-owned directory (Plan 0 scaffold), so this is additive. No upstream agents/hooks/skills/configs are touched. The `intel-gates.template.json` ships disabled-by-default in two senses: (a) consumer copies have `enabled: false` on every gate until the program PM opts in; (b) until the gate-dispatcher runtime is exercised in a real program, the template is inert.

---

## File Structure

Files this plan creates or modifies (paths absolute from repo root `/Users/romansky/gsd-ic/`):

**Reference docs (new, 5 total):**
- `intel-refs/int-disciplines/techint.md`
- `intel-refs/int-disciplines/medint.md`
- `intel-refs/int-disciplines/techsigint.md`
- `intel-refs/tradecraft/icd-206.md`
- `intel-refs/tradecraft/words-of-estimative-probability.md`

**Manifest (modified):**
- `intel-refs/MANIFEST.json` — 5 new entries (topic count 31 → 36)

**Agents (new, 6 total, all `agents/`):**
- `agents/gsd-icd-203-enforcer.md`
- `agents/gsd-techint-researcher.md`
- `agents/gsd-medint-researcher.md`
- `agents/gsd-techsigint-researcher.md`
- `agents/gsd-ai-eval-auditor.md`
- `agents/gsd-fm-adaptation-engineer.md`

**Intel-gates template (new — first shipping materialization):**
- `workflow-patches/intel-gates.template.json`

**Completion marker registry (modified):**
- `references/agent-contracts.ic-pack.md` — append 6 agent rows (52 → 58)

**Package metadata (modified):**
- `package.json` — `files` field gets 6 new explicit per-file entries for the new agents; the 5 new refs and the new gate template are already covered by their respective directory globs (`intel-refs/` and `workflow-patches/`)

**Total new files:** 12. Modified files: 3.

After this plan merges, the IC pack has **58 agents** total — the entire v1 agent roster from spec Appendix D is complete.

---

## Decomposition Decision Log

1. **Zero marker conversions in Phase 7.** Every spec-declared marker for the 6 Phase 7 agents is validator-regex-compliant out of the box (`(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)` terminal, `[A-Z][A-Z0-9 _&-]*` body). Mapping (all validator-compliant):
   - `gsd-icd-203-enforcer`: `## ICD 203 AUDIT COMPLETE` (success) / `## ICD 203 VIOLATIONS FOUND` (failure)
   - `gsd-techint-researcher` / `gsd-medint-researcher` / `gsd-techsigint-researcher`: `## RESEARCH COMPLETE` / `## RESEARCH BLOCKED` (Family I convention)
   - `gsd-ai-eval-auditor`: `## AI EVAL DESIGN COMPLETE` / `## AI EVAL AUDIT COMPLETE` / `## AI EVAL ISSUES FOUND` (3-marker dual-mode — see §3 below)
   - `gsd-fm-adaptation-engineer`: `## FM ADAPTATION COMPLETE`

   Contrast with Plan 6 (1 marker conversion: SYNTHETIC DATA) and Plan 7 (5 marker conversions: ISSO, SAR, IVV, EVIDENCE PACKAGE, CDRL). The clean phase means the registry has no deviation notes added in this plan.

2. **Three new INT-discipline refs ship symmetric with the existing 7-of-7 pattern.** Per locked decision (user-confirmed). Each new Family I researcher (#43-#45) gets a matching `intel-refs/int-disciplines/*.md` ref so consumers of the manifest can resolve the `int-disciplines/*` knowledge tags the same way as for the existing 7 Family I agents. Content split per spec line 344-346:
   - `int-disciplines/techint.md` — foreign materiel exploitation, adversary weapon-system analysis, reverse-engineering report patterns, captured-equipment data shapes.
   - `int-disciplines/medint.md` — disease surveillance, biothreat indicators, biosurveillance prototypes, public-health data models. Cross-references `ai-ml/eval-patterns.md` for biosurveillance ML eval discussion.
   - `int-disciplines/techsigint.md` — radar emissions analysis (ELINT), Foreign Instrumentation Signals (FISINT), instrumentation telemetry. Distinct from `sigint.md` (COMINT/communications focus). Cross-references `sigint.md` so the two-researcher pairing per spec line 346 is documented.

3. **`gsd-ai-eval-auditor` is a dual-mode agent shipping 3 markers.** Per locked decision (user-confirmed). The agent has two operating modes — eval-design (produce a defensible eval strategy) and eval-audit (audit an existing eval artifact) — and one failure mode for the audit path (issues found). All three markers are validator-compliant; the registry row lists all three with their respective output artifacts. Precedent: `gsd-rmf-control-mapper` (single agent, multiple-path terminal output). No deviation note; matches spec line 384 verbatim. The agent decides which mode to enter from the input shape: if invoked with `--design <capability-description>` it produces `AI-EVAL-DESIGN.md` and emits `## AI EVAL DESIGN COMPLETE`; if invoked with `--audit <existing-eval-artifact>` it produces `AI-EVAL-AUDIT.md` and emits `## AI EVAL AUDIT COMPLETE` (no issues) or `## AI EVAL ISSUES FOUND` (issues present).

4. **No new `ai-ml/fm-adaptation-patterns.md` ref this plan.** Per locked decision (user-confirmed). `gsd-fm-adaptation-engineer` synthesizes FM-adaptation patterns from training + the existing `ai-ml/eval-patterns.md` (Plan 6) + `capability-patterns/*` refs. If SMEs later want a dedicated FM-adaptation ref, that's a post-Phase-7 SME-curation deliverable (per Plan 7's "Customer overlay updates ... deferred to SME ref curation" pattern). The agent's `applies_when` includes `fm-adaptation`, `rag`, `fine-tune` so it activates correctly without a topic-named ref.

5. **Two tradecraft refs ship as ICD 203 enforcer prerequisites.** Per locked decision (user-confirmed). Spec line 353 names `intel-refs/tradecraft/icd-206.md` and `intel-refs/tradecraft/words-of-estimative-probability.md` as required inputs. The existing `icd-203.md` (Plan 0) has forward-references to both. Content split:
   - `tradecraft/icd-206.md` — Intelligence Community Directive 206: sourcing standards, source description discipline, classification of sources, citation conventions. Companion to ICD 203 (analytic standards) — ICD 203 §C.6.5(1) and §C.6.5(9) explicitly cite source-description and citation-accuracy obligations that ICD 206 elaborates.
   - `tradecraft/words-of-estimative-probability.md` — the Sherman-Kent WEP tables and the 7-band confidence vocabulary (`almost certainly` / `highly likely` / `likely` / `roughly even chance` / `unlikely` / `highly unlikely` / `almost no chance`) with their percentage bands per the modern ODNI / IC variants. Currently inlined as a paragraph in `ai-ml/eval-patterns.md` — promotion to dedicated ref so both `gsd-icd-203-enforcer` and `gsd-ai-eval-auditor` consume the same canonical source.

6. **Family L gate wiring uses 4 entries with shared trigger — no schema change.** Per locked decision (user-confirmed). The current `intel-gates.json` schema (Plan 1-fix) defines `gates.<id>.agent` as a singular string. Rather than extend the schema to support `agents: [array]` (which would force schema doc + validator + CI test fixture changes), Plan 7 ships 4 separate gate entries (`family-l-ci`, `family-l-targeting`, `family-l-insider`, `family-l-adversary`) all pointing at the same trigger string `plan-phase.5-handle-research`. The gate-dispatcher runtime (not in scope this plan — runtime exercise is Plan 9+) will fan out by enumerating all gates whose trigger matches. `validate-triggers.sh` accepts this because each gate entry resolves to the same real workflow step.

7. **Trigger `plan-phase.5-handle-research` chosen for Family L.** The trigger format is `<workflow>.<step>`. The `plan-phase` workflow at `get-shit-done/workflows/plan-phase.md` has step `## 5. Handle Research` which slugifies to `5-handle-research` via the validator's regex (`tolower` → `gsub(/[^a-z0-9 -]/, "")` → `gsub(/[[:space:]]+/, "-")`). This is the moment when phase-research artifacts are produced — the natural fan-out point for the mission-framing analysts that should "always fire on every phase with analytic content" per spec line 363. Family L gates ship with `enabled: false` (the schema's `enabled` field default applies); consumers opt in via their per-program `.planning/intel-gates.json`.

8. **`workflow-patches/intel-gates.template.json` is the first shipping template materialization.** The schema doc (`docs/ic-pack/intel-gates-schema.md`) has existed since Plan 1-fix, and CI test fixtures contain template fragments, but the consumer-facing shipping template at `workflow-patches/intel-gates.template.json` has only been a `.gitkeep` placeholder. Plan 8 creates the template with: the schema-versioned header (`"version": "2026.05"`), the hooks block with current defaults (per schema §`hooks`), and a gates block with 4 Family L entries (all `enabled: false`). The installer copies this to consumer programs at `.planning/intel-gates.json` (or the equivalent install path per the consumer-install design from Plan 1-fix).

9. **`gsd-fm-adaptation-engineer` is the only Phase 7 agent with `Edit` tool — explicit isolation smoke step.** Same pattern as Plan 7's Step 10 (which verified POA&M-tracker was the only Phase 6 Edit-tool agent). The smoke step iterates over the 6 Phase 7 agents and asserts `Edit=1` for `gsd-fm-adaptation-engineer` only; `Edit=0` for all others. The 7 already-shipped Edit-tool agents (code-fixer, synthetic-data-engineer, debugger, intel-devops, executor, domex-engineer, poam-tracker) are not re-checked — the assertion is scoped to Phase 7 deliverables.

10. **No `AskUserQuestion` tool in any Phase 7 agent — explicit isolation smoke step.** None of the 6 Phase 7 agents has hybrid intake. The smoke step asserts `AskUserQuestion=0` for all 6. The 3 already-shipped AskUserQuestion agents (`gsd-mission-gap-analyst`, `gsd-after-action-recorder`, `gsd-transition-advisor`) are not re-checked.

11. **Implementer subagent model: sonnet for agents and refs, haiku for mechanical edits.** Same split as Plans 6 and 7. Agent and ref synthesis is engineering/integration work (sonnet). Manifest, registry, package.json, and intel-gates.template.json edits are mechanical (haiku). Smoke is run by the controller inline. Pattern reference (refs): existing `intel-refs/int-disciplines/cybint.md` (Plan 2 — INT-discipline ref structure). Pattern reference (Family I agents): existing `agents/gsd-cybint-researcher.md` (Plan 2 — Family I researcher template). Pattern reference (auditor agents): existing `agents/gsd-cmmc-auditor.md` (Plan 1 — tradecraft auditor template; structurally close to icd-203-enforcer). Pattern reference (dual-mode auditor with multiple markers): existing `agents/gsd-rmf-control-mapper.md` (multi-terminal output paths). Pattern reference (Edit-tool implementation agent): existing `agents/gsd-domex-engineer.md` (Plan 2 — designs AND implements in target source tree).

12. **Task ordering: refs → manifest → agents → template → registry → package → smoke.** T1-T5 (refs) must complete before T7-T12 (agents) so agents cite refs without forward-reference gaps. T6 (manifest) must update after refs land. T7-T12 (agents) must complete before T13 (template) only if the template's `agent` field naming is verified against actual shipped agent names — it is, since Plan 6 shipped Family L agents and Plan 8's template references them by their shipped names. T14 (registry) must complete after T7-T12 so the implementer can verify each marker matches the agent file and the validator passes. T15 (package.json) can run in parallel with T14 but must precede T16 step 11 (npm pack scope check). The controller may parallelize T1/T2/T3 (independent INT refs), T4/T5 (independent tradecraft refs), and sibling Family I agents T7/T8/T9 (no inter-agent dependencies once T1/T2/T3 are done). T10 (icd-203-enforcer) depends on T4/T5. T11 (ai-eval-auditor) and T12 (fm-adaptation-engineer) are independent of T7-T10. T13 (template) can run anywhere after T6 — agent files referenced by name only.

13. **Smoke test mirrors Plan 7 Task 19 structure with Phase-7-specific assertions.** Sixteen verification steps including: 6-row registry append count; total-agent-count = 58 (52 from Plans 0-7 + 6 new Phase 7); zero new deviation notes (`grep -c "deviation:"` unchanged from Plan 7's count); Edit-tool isolation across Phase 7 (only fm-adaptation-engineer); AskUserQuestion isolation across Phase 7 (zero); 5 ref scaffolds present + manifest topic count = 36; `intel-gates.template.json` exists at `workflow-patches/` and validates against the schema via `validate-triggers.sh`; npm pack scope includes new agents + refs + template; install dry-run lands all deliverables.

14. **No new skill, no new hook in Phase 7.** All 6 agents work with existing skills (`intel-coding-conventions`, `classification-conventions`, `prototyping-discipline`, `adelphi-house-style`, `poam-conventions`); none require new ones. No hook changes — the 3 existing hooks (classification banner, classified-leak detector, prompt-injection scan) are unaffected.

15. **Customer overlay updates for 6 new agents deferred to SME ref curation post-merge.** Same posture as Plan 7. Customer overlays at `intel-refs/overlays/*/` (NGA, NSA, NRO, etc.) may want per-customer additions for the new INTs (e.g., NGA's TECHINT relationship to GEOINT collection); those updates are not in this plan's scope.

16. **Frontmatter `topic_id` vs `topic` field — directory-specific convention.** The `intel-refs/MANIFEST.json` validator (`tools/ci/validate-manifest.sh`) does NOT inspect either field — it iterates manifest topic keys and resolves to file paths. The in-file field is informational. However, two directory-local conventions exist:
    - `intel-refs/int-disciplines/` — all 7 existing siblings (cybint, finint, geoint, humint, masint, osint, sigint) use `topic_id`. T1-T3 (techint, medint, techsigint) ship `topic_id` to keep the INT family consistent (10-of-10).
    - `intel-refs/tradecraft/` — split: older Plan 0/2 refs (icd-203, poam-format, nist-*, cmmc-2.0, etc.) use `topic_id`; the newest two refs from Plan 7 (ato-process-overview, ato-document-suite) use `topic`. T4-T5 (icd-206, WEP) ship `topic` to match the most recent convention in the directory.
    - Symmetric rule for future ref additions: match the most recent ref pattern in the target directory. Older inconsistencies remain until SME curation phase.

---

## Task 1: int-disciplines/techint.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/int-disciplines/techint.md`

Establishes the TECHINT (technical intelligence — foreign materiel exploitation) discipline vocabulary the `gsd-techint-researcher` consumes. The `intel-refs/int-disciplines/` directory contains 7 existing refs (Plans 0, 2 scaffolds).

**Spec source:** Spec §5 line 344 (Family I #43 knowledge tags); §13 line 1075 (Phase 7 scope).

**Content requirements:**
1. Frontmatter: `topic_id: int-disciplines/techint` (matches the 7 existing INT-discipline siblings — `topic_id`, not `topic` — see §Convention note below), `title: TECHINT — Foreign Materiel Exploitation`, `classification: UNCLASSIFIED`, `applies_when: [techint, foreign materiel exploitation, fmx, captured equipment, reverse engineering, weapon system analysis, hardware exploitation, foreign weapon systems]`, `ic_pack: true`, `owners: [intel-pack@adelphi.ai]`, `last_reviewed: 2026-05-11`.
2. `# TECHINT — Foreign Materiel Exploitation` — one-paragraph framing distinguishing TECHINT from SIGINT/HUMINT/GEOINT (TECHINT is the analysis of foreign hardware/materiel itself, not the signals it emits or the people who operate it).
3. `## Discipline Scope` — what TECHINT analysts do: captured-equipment exploitation, reverse engineering of foreign systems, weapon-system performance characterization, supply-chain provenance analysis. Reference DIA's National Center for Medical Intelligence pattern (sister discipline) for the captured-materiel → finished-product workflow.
4. `## Data Shapes` — typical artifacts: exploitation reports (TECHREP-style narratives), captured-equipment manifests, photogrammetry / mechanical-drawing outputs, materials-analysis lab reports, performance-envelope estimates. Note: most genuine TECHINT product is classified; the framework supports analytic-design work on synthetic/abstract analogs only.
5. `## Capability Patterns Relevant to TECHINT` — entity resolution across captured-equipment serial-number traces; supply-chain provenance graphs; cross-INT fusion with FININT (procurement-network tracing) and OSINT (open-source manufacturer / parts-catalog data); pattern-of-life on equipment-fielding cadence.
6. `## Tradecraft Considerations` — ICD 203 application (especially uncertainty about adversary-system performance); source-attribution discipline when reports cite specific exploitation venues.
7. `## See Also` — `int-disciplines/sigint.md` (paired collection patterns), `int-disciplines/geoint.md` (imagery of fielded equipment), `capability-patterns/entity-resolution.md`, `capability-patterns/pattern-of-life.md`.
8. **Constraints:** UNCLASSIFIED only; abstract partition language only; no specific foreign-system names that would imply classified holdings; cite public DIA/IC publications by title only (no quoted content).

**Length target:** 80-120 lines (scaffold-plus posture). The 7 existing INT-discipline siblings are 35-39 line scaffolds awaiting SME curation per spec §15.1.1; the new INT refs land at "scaffold-plus" — cover all 8 spec content requirements thoroughly but stay proportionate to existing siblings rather than jumping to the 400-line Plan 7 ato-ref length. Pattern reference: `intel-refs/int-disciplines/cybint.md` (Plan 2 — INT-discipline ref structure; same frontmatter conventions including `topic_id` field name; same section split).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec line 344, `intel-refs/int-disciplines/cybint.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/int-disciplines/techint.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/int-disciplines/techint.md
git commit -m "[N] feat(intel-refs): int-disciplines/techint — TECHINT/FMX discipline scaffold"
```

---

## Task 2: int-disciplines/medint.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/int-disciplines/medint.md`

**Spec source:** Spec §5 line 345 (Family I #44); §13 line 1075.

**Content requirements:**
1. Frontmatter: `topic_id: int-disciplines/medint` (matches existing INT-discipline siblings), `title: MEDINT — Medical Intelligence`, `classification: UNCLASSIFIED`, `applies_when: [medint, medical intelligence, biosurveillance, disease surveillance, biothreat, public health, pandemic, epidemiology, ncmi]`, `ic_pack: true`, `owners: [intel-pack@adelphi.ai]`, `last_reviewed: 2026-05-11`.
2. `# MEDINT — Medical Intelligence` — one-paragraph framing referencing DIA NCMI (National Center for Medical Intelligence) as the canonical IC mission owner; clarify MEDINT is intelligence on medical capabilities/conditions/biological threats abroad, distinct from operational military medicine.
3. `## Discipline Scope` — disease surveillance, biothreat indicators (state and non-state programs), biosurveillance prototypes, public-health data models, foreign-medical-system capability assessment, environmental health intelligence.
4. `## Data Shapes` — typical artifacts: surveillance feeds (WHO / national CDCs / open-source), epidemiological reports, lab capability inventories, biothreat indicator tables, syndromic surveillance time-series. Note synthetic-data needs for prototyping — real biosurveillance data is frequently HIPAA-protected even when unclassified.
5. `## Capability Patterns Relevant to MEDINT` — time-series anomaly detection on syndromic surveillance, entity resolution across naming variants for foreign medical facilities, AI/ML eval for biothreat-indicator classifiers (cross-reference `ai-ml/eval-patterns.md` — false-negative cost is acute for biosurveillance), pattern-of-life on disease-outbreak cadence.
6. `## Tradecraft Considerations` — ICD 203 application: outbreak-attribution claims require explicit uncertainty (state-program vs. natural origin). PII / HIPAA handling discipline (cross-reference `gsd-privacy-reviewer` outputs when working with health data).
7. `## See Also` — `int-disciplines/osint.md` (public-health PAI is a primary MEDINT input), `int-disciplines/finint.md` (illicit-procurement tracing for biothreat programs), `ai-ml/eval-patterns.md`, `capability-patterns/pattern-of-life.md`.
8. **Constraints:** UNCLASSIFIED only; abstract language only; cite NCMI / WHO / CDC publications by title.

**Length target:** 80-120 lines (scaffold-plus posture; same rationale as T1). Pattern reference: `intel-refs/int-disciplines/cybint.md` (frontmatter convention including `topic_id` field name).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec line 345, `intel-refs/int-disciplines/cybint.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/int-disciplines/medint.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/int-disciplines/medint.md
git commit -m "[N] feat(intel-refs): int-disciplines/medint — MEDINT/biosurveillance discipline scaffold"
```

---

## Task 3: int-disciplines/techsigint.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/int-disciplines/techsigint.md`

**Spec source:** Spec §5 line 346 (Family I #45); §13 line 1075.

**Content requirements:**
1. Frontmatter: `topic_id: int-disciplines/techsigint` (matches existing INT-discipline siblings), `title: Technical SIGINT — ELINT / FISINT / Telemetry`, `classification: UNCLASSIFIED`, `applies_when: [techsigint, technical sigint, elint, fisint, radar emissions, foreign instrumentation, telemetry, electronic order of battle]`, `ic_pack: true`, `owners: [intel-pack@adelphi.ai]`, `last_reviewed: 2026-05-11`.
2. `# Technical SIGINT — ELINT / FISINT / Telemetry` — one-paragraph framing distinguishing technical SIGINT (non-communications signal collection) from COMINT (which is covered in `int-disciplines/sigint.md`). Explicitly note the pair-with-COMINT convention from spec line 346 — when a phase requires both, spawn `gsd-sigint-researcher` and `gsd-techsigint-researcher` in parallel.
3. `## Discipline Scope` — ELINT (radar emissions and EOB construction), FISINT (foreign instrumentation signals — weapon-system telemetry, launch beacons, fuze signals), instrumentation telemetry analysis, signal classification / fingerprinting.
4. `## Data Shapes` — typical artifacts: emitter parametric records (frequency / PRI / pulse width / antenna characteristics), EOB tables, telemetry-channel decodes, signal-fingerprint libraries. Note STANAG and US-IC parametric-record schema families (cite by name; do not transcribe).
5. `## Capability Patterns Relevant to Technical SIGINT` — emitter clustering by parametric similarity, EOB-completeness assessment, signal-fingerprint matching against known-emitter libraries, cross-INT fusion with TECHINT (parametric records of fielded foreign weapons) and GEOINT (geolocation of emitters).
6. `## Tradecraft Considerations` — ICD 203 application for identification confidence ("almost certainly X-band radar" vs. "consistent with X-band radar"); source-attribution discipline at the collection-platform level when reports cite specific systems.
7. `## See Also` — `int-disciplines/sigint.md` (COMINT companion; pair these two for full SIGINT coverage), `int-disciplines/geoint.md` (geolocation of emitter sites), `int-disciplines/techint.md` (parametric reports of fielded foreign equipment), `capability-patterns/entity-resolution.md`.
8. **Constraints:** UNCLASSIFIED only; abstract parametric ranges only (no specific frequencies that imply real-system characterizations); cite NSA / IC publications by title only.

**Length target:** 80-120 lines (scaffold-plus posture; same rationale as T1). Pattern reference: `intel-refs/int-disciplines/sigint.md` (closest sibling — the COMINT-focused INT-discipline ref; uses `topic_id` frontmatter field).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec line 346, `intel-refs/int-disciplines/sigint.md` as pattern reference, the section requirements above. Reinforce: distinguish from sigint.md's COMINT scope; cross-reference back to sigint.md.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/int-disciplines/techsigint.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/int-disciplines/techsigint.md
git commit -m "[N] feat(intel-refs): int-disciplines/techsigint — Technical SIGINT (ELINT/FISINT) discipline scaffold"
```

---

## Task 4: tradecraft/icd-206.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/tradecraft/icd-206.md`

**Spec source:** Spec line 353 names this as a required input to `gsd-icd-203-enforcer`. Forward-ref already exists in `intel-refs/tradecraft/icd-203.md` line 40 (`tradecraft/icd-206.md — sourcing standards (companion directive; Phase 4+)`).

**Content requirements:**
1. Frontmatter: `topic: tradecraft/icd-206`, `applies_when: [icd 206, icd-206, source description, sourcing standards, source reliability, source credibility, citation, attribution]`, `classification: UNCLASSIFIED`, `ic_pack: true`, owners stub, `last_reviewed: 2026-05-11`.
2. `# ICD 206 — Sourcing Standards` — one-paragraph framing: Intelligence Community Directive 206 governs how sources are described in analytic products. Companion to ICD 203 (analytic standards); ICD 203 §C.6.5(1) (sourcing) and §C.6.5(9) (citation accuracy) describe the obligations that ICD 206 elaborates in detail.
3. `## The Sourcing Discipline` — source description requirements: every source cited in an analytic product needs reliability and credibility characterization. Reliability addresses the source itself (A–F scale or equivalent). Credibility addresses the specific information (1–6 scale or equivalent). Together they form a parametric judgment about how much weight the analytic claim can carry.
4. `## Source Description Elements` — list: source type (HUMINT report, SIGINT collection, OSINT publication, etc.), reliability rating, credibility rating, access (firsthand/indirect/unknown), collection date, dissemination chain (originator → analyst → product). For classified sources, the description abstracts above the source's classification.
5. `## Citation Conventions` — how to cite in analytic products: footnote / endnote conventions when supported; inline parenthetical for short products. Cite once per fact, not once per paragraph. Distinguish citation (the source-of-record reference) from attribution (the named originator if dissemination rules permit).
6. `## Common Violations` — patterns that ICD 206 considers non-compliant: uncited assertions in finished products; aggregated source characterization ("multiple reports indicate") without per-source reliability; missing collection-date context; unattributed analytic judgments that should be footnoted to the source.
7. `## How `gsd-icd-203-enforcer` Uses This Ref` — the enforcer agent reads ICD 206 standards when auditing an artifact for source-attribution discipline. Failures map to a `## ICD 203 VIOLATIONS FOUND` finding with category `sourcing` or `citation`.
8. `## Authoritative Source` — ICD 206 — *Sourcing Requirements for Disseminated Analytic Products* (DNI). Public; the canonical reference.
9. `## See Also` — `tradecraft/icd-203.md`, `tradecraft/words-of-estimative-probability.md` (paired companion ref this phase), `int-disciplines/humint.md`, `int-disciplines/osint.md`.
10. **Constraints:** UNCLASSIFIED only; do not transcribe ICD 206 directive text (public reference cited by title and section); no real-source identifiers.

**Length target:** 180-240 lines. Pattern reference: `intel-refs/tradecraft/icd-203.md` (sister directive — same structural pattern; this is its companion).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec line 353, `intel-refs/tradecraft/icd-203.md` as pattern reference, the section requirements above. Reinforce: this is a companion ref to icd-203; cross-reference symmetric.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/tradecraft/icd-206.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Update icd-203.md forward-reference**

Update `intel-refs/tradecraft/icd-203.md` line 40 to remove the "Phase 4+" deferral note since icd-206.md now exists.

```bash
sed -i '' 's|tradecraft/icd-206.md — sourcing standards (companion directive; Phase 4+)|tradecraft/icd-206.md — sourcing standards (companion directive)|' /Users/romansky/gsd-ic/intel-refs/tradecraft/icd-203.md
grep -n "icd-206" /Users/romansky/gsd-ic/intel-refs/tradecraft/icd-203.md
```

Expected: line 40 no longer contains `Phase 4+`.

- [ ] **Step 4: Commit**

```bash
git add intel-refs/tradecraft/icd-206.md intel-refs/tradecraft/icd-203.md
git commit -m "[N] feat(intel-refs): tradecraft/icd-206 — sourcing standards companion to ICD 203"
```

---

## Task 5: tradecraft/words-of-estimative-probability.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/tradecraft/words-of-estimative-probability.md`

**Spec source:** Spec line 353 names this as required input to `gsd-icd-203-enforcer`. Currently inlined as paragraphs inside `intel-refs/ai-ml/eval-patterns.md` lines 78-80 ("ICD 203 hedging norms" subsection); promotion to dedicated ref makes the WEP vocabulary the canonical source for both the enforcer and the ai-eval-auditor.

**Content requirements:**
1. Frontmatter: `topic: tradecraft/words-of-estimative-probability`, `applies_when: [wep, words of estimative probability, sherman kent, confidence language, hedging, estimative language, icd 203, analytic confidence]`, `classification: UNCLASSIFIED`, `ic_pack: true`, owners stub, `last_reviewed: 2026-05-11`.
2. `# Words of Estimative Probability (WEP)` — one-paragraph framing: WEP is the standardized vocabulary the IC uses to communicate analytic confidence in finished products. Originates with Sherman Kent's "Words of Estimative Probability" essay (1964, Studies in Intelligence). The modern IC WEP table is published as part of ICD 203 implementation guidance and is the canonical reference for hedging language in any analytic claim.
3. `## The 7-Band Vocabulary` — Markdown table with rows for each band:
   - `almost certainly` — 95–100% confidence
   - `highly likely` — 80–95% confidence
   - `likely` — 55–80% confidence
   - `roughly even chance` — 45–55% confidence
   - `unlikely` — 20–45% confidence
   - `highly unlikely` — 5–20% confidence
   - `almost no chance` — 0–5% confidence
   
   Note: the exact band thresholds vary slightly across IC publications; the canonical thresholds for an Adelphi product are the ones above (ODNI 2015 publication). Document this choice explicitly.
4. `## When to Use Which Band` — guidance: use `almost certainly` only for facts with corroboration that excludes alternative explanations; `highly likely` for claims with strong evidence and minor uncertainty; `likely` for claims with reasonable but not strong evidence; `roughly even chance` when the evidence supports neither outcome more than the other; the lower bands mirror the upper bands. Avoid "possibly" — it lacks band semantics.
5. `## Forbidden Patterns` — patterns ICD 203 considers WEP violations: uncalibrated qualifiers ("very likely", "almost positively"); confidence terms applied to facts (the band applies to a judgment, not a known event); WEP terms mixed with numeric probabilities in the same sentence; bands that contradict the body of evidence cited.
6. `## How `gsd-icd-203-enforcer` Uses This Ref` — the enforcer agent reads the 7-band table and the forbidden patterns when auditing an artifact. Findings map to ICD 203 §C.6.5(2) (uncertainty expression) in the `## ICD 203 VIOLATIONS FOUND` output.
7. `## How `gsd-ai-eval-auditor` Uses This Ref` — the auditor agent applies WEP discipline to measurement claims when reviewing eval artifacts. Specifically, claims about extrapolating model performance beyond tested conditions must use WEP bands (per `ai-ml/eval-patterns.md` "Defensible Measurement Claims" section).
8. `## Authoritative Source` — Sherman Kent, "Words of Estimative Probability" (Studies in Intelligence, 1964; public-domain reprints). ODNI ICD 203 implementation guidance (public). Cite by title; do not transcribe.
9. `## See Also` — `tradecraft/icd-203.md`, `tradecraft/icd-206.md` (paired this phase), `ai-ml/eval-patterns.md`.
10. **Constraints:** UNCLASSIFIED only; cite public references by title and section.

**Length target:** 160-220 lines (shorter than other refs — the vocabulary is compact; depth comes from worked examples in the consuming agents). Pattern reference: `intel-refs/tradecraft/icd-203.md` (sister vocabulary ref — same structural pattern).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec line 353, `intel-refs/tradecraft/icd-203.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/tradecraft/words-of-estimative-probability.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/tradecraft/words-of-estimative-probability.md
git commit -m "[N] feat(intel-refs): tradecraft/words-of-estimative-probability — Sherman Kent WEP tables"
```

---

## Task 6: Update MANIFEST.json with 5 new entries

**Files:**
- Modify: `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json`

Add 5 new entries to the `topics` object. Current topic count: 31; target: 36.

**Actual manifest schema (verified from existing entries — `validate-manifest.sh` treats the topic key as the path, no explicit `path` field needed):**

Each topic entry has these 4 fields: `applies_when: [array]`, `owner: "string"` (singular, not `owners`), `last_reviewed: "YYYY-MM-DD"`, `classification: "UNCLASSIFIED"`.

**Entries to add:**

```json
{
  "int-disciplines/techint.md": {
    "applies_when": ["techint", "foreign materiel exploitation", "fmx", "captured equipment", "reverse engineering", "weapon system analysis", "hardware exploitation", "foreign weapon systems"],
    "owner": "intel-pack@adelphi.ai",
    "last_reviewed": "2026-05-11",
    "classification": "UNCLASSIFIED"
  },
  "int-disciplines/medint.md": {
    "applies_when": ["medint", "medical intelligence", "biosurveillance", "disease surveillance", "biothreat", "public health", "pandemic", "epidemiology", "ncmi"],
    "owner": "intel-pack@adelphi.ai",
    "last_reviewed": "2026-05-11",
    "classification": "UNCLASSIFIED"
  },
  "int-disciplines/techsigint.md": {
    "applies_when": ["techsigint", "technical sigint", "elint", "fisint", "radar emissions", "foreign instrumentation", "telemetry", "electronic order of battle"],
    "owner": "intel-pack@adelphi.ai",
    "last_reviewed": "2026-05-11",
    "classification": "UNCLASSIFIED"
  },
  "tradecraft/icd-206.md": {
    "applies_when": ["icd 206", "icd-206", "source description", "sourcing standards", "source reliability", "source credibility", "citation", "attribution"],
    "owner": "intel-pack@adelphi.ai",
    "last_reviewed": "2026-05-11",
    "classification": "UNCLASSIFIED"
  },
  "tradecraft/words-of-estimative-probability.md": {
    "applies_when": ["wep", "words of estimative probability", "sherman kent", "confidence language", "hedging", "estimative language", "icd 203", "analytic confidence"],
    "owner": "intel-pack@adelphi.ai",
    "last_reviewed": "2026-05-11",
    "classification": "UNCLASSIFIED"
  }
}
```

- [ ] **Step 1: Add entries via jq merge**

Dispatch haiku implementer (or controller inline) to add the 5 entries. Preferred form: in-place jq update preserving existing key order; alternatively, manual edit of the file with the 5 new entries appended to the `topics` object in alphabetical-key order.

- [ ] **Step 2: Verify topic count and manifest validator**

```bash
jq '.topics | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
bash /Users/romansky/gsd-ic/tools/ci/validate-manifest.sh
```

Expected: count = `36`; validator OK.

- [ ] **Step 3: Verify each new topic key resolves to its file (key = path under intel-refs/)**

```bash
for t in int-disciplines/techint.md int-disciplines/medint.md int-disciplines/techsigint.md tradecraft/icd-206.md tradecraft/words-of-estimative-probability.md; do
  if [ -f "/Users/romansky/gsd-ic/intel-refs/$t" ]; then echo "$t → file present"; else echo "$t → MISSING"; fi
done
```

Expected: 5 lines all echoing `→ file present`. The validator (`validate-manifest.sh`) confirms this by iterating `.topics | keys[]` and resolving each to `$ROOT/intel-refs/$key`.

- [ ] **Step 4: Commit**

```bash
git add intel-refs/MANIFEST.json
git commit -m "[N] feat(intel-refs): manifest — add 5 Phase 7 topics (3 INT + ICD 206 + WEP)"
```

---

## Task 7: gsd-techint-researcher agent (Family I)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-techint-researcher.md`

Family I agent #43. Standard Family I researcher; mirrors the 7 existing Family I researcher patterns.

**Spec source:** Line 344.

**Frontmatter:**
- `name: gsd-techint-researcher`
- `description`: TECHINT (foreign materiel exploitation, captured-equipment exploitation, weapon-system reverse engineering) discipline researcher; produces phase research deliverables for prototypes targeting TECHINT mission space
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]`
- `applies_when: [techint, foreign materiel exploitation, captured equipment, reverse engineering, weapon system, fmx, materiel]`
- `knowledge_tags: [int-disciplines/techint, capability-patterns, tradecraft]`

**Required sections (standard Family I shape):**
1. `# gsd-techint-researcher` heading + role paragraph.
2. `## When you run` — invoked by `plan-phase` when phase scope flags TECHINT terms; on-demand for TECHINT capability research.
3. `## Inputs you accept` — phase scope (path to phase plan); `.planning/intel-context.md`; manifest topics under `int-disciplines/techint` and `capability-patterns/*`.
4. `## What you produce` — `.planning/phases/{phase}/{phase}-TECHINT-RESEARCH.md` with sections: discipline-scope summary, capability-pattern recommendations, data-shape outline, cross-INT pairing recommendations (with TECHSIGINT for parametric records, with GEOINT for fielded-equipment imagery, with FININT for procurement-network tracing), open questions for SMEs.
5. `## How you do the work` — read manifest; load `int-disciplines/techint.md` and relevant `capability-patterns/*`; use WebSearch / WebFetch for public TECHINT framework references (NCMI / DIA publications by title); cite sources per ICD 206 conventions; abstract any source descriptions above classification.
6. `## Constraints` — UNCLASSIFIED only; no specific foreign-system names; cite public publications by title.
7. `## Completion marker` — emit `## RESEARCH COMPLETE` on success, `## RESEARCH BLOCKED` if scope is unclear or required refs are missing.
8. Trailing self-emit `## RESEARCH COMPLETE` heading example.

**Length target:** 90-110 lines (existing Family I sibling researchers are 93-98 lines; new researchers stay proportionate). Pattern reference: `agents/gsd-cybint-researcher.md` (Plan 2 — closest Family I sibling; identical structure).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 344, `agents/gsd-cybint-researcher.md` as pattern reference, `intel-refs/int-disciplines/techint.md` as the consumed ref (already produced T1), the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## RESEARCH COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-techint-researcher.md
grep -E "^## RESEARCH BLOCKED$" /Users/romansky/gsd-ic/agents/gsd-techint-researcher.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-techint-researcher.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-techint-researcher.md | grep -E "WebSearch.*WebFetch.*mcp__context7" && echo "tools: OK"
```

Expected: both markers present; `ic_pack: true` present; `tools: OK`.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-techint-researcher.md
git commit -m "[N] feat(agents): gsd-techint-researcher — Family I TECHINT discipline researcher"
```

---

## Task 8: gsd-medint-researcher agent (Family I)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-medint-researcher.md`

Family I agent #44. Standard Family I researcher. Knowledge tags include `ai-ml` (biosurveillance ML is a primary MEDINT capability pattern).

**Spec source:** Line 345.

**Frontmatter:**
- `name: gsd-medint-researcher`
- `description`: MEDINT (medical intelligence — disease surveillance, biothreat indicators, biosurveillance prototypes, public-health data models) discipline researcher
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]`
- `applies_when: [medint, medical intelligence, biosurveillance, disease surveillance, biothreat, public health, pandemic, epidemiology]`
- `knowledge_tags: [int-disciplines/medint, capability-patterns, ai-ml]`

**Required sections:** same shape as T7 (Family I standard), substituting MEDINT scope and biosurveillance patterns. Cross-INT pairing: OSINT (public-health PAI), FININT (illicit-procurement tracing for state biothreat programs).

**Length target:** 90-110 lines (matches Family I siblings 93-98). Pattern reference: `agents/gsd-cybint-researcher.md`.

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 345, `agents/gsd-cybint-researcher.md` as pattern reference, `intel-refs/int-disciplines/medint.md` and `intel-refs/ai-ml/eval-patterns.md` as consumed refs.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## RESEARCH COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-medint-researcher.md
grep -E "^## RESEARCH BLOCKED$" /Users/romansky/gsd-ic/agents/gsd-medint-researcher.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-medint-researcher.md
```

Expected: both markers present; `ic_pack: true` present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-medint-researcher.md
git commit -m "[N] feat(agents): gsd-medint-researcher — Family I MEDINT discipline researcher"
```

---

## Task 9: gsd-techsigint-researcher agent (Family I)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-techsigint-researcher.md`

Family I agent #45. Standard Family I researcher. Knowledge tags include both `int-disciplines/techsigint` (primary) and `int-disciplines/sigint` (paired sibling) — the pair-with-COMINT convention from spec line 346.

**Spec source:** Line 346.

**Frontmatter:**
- `name: gsd-techsigint-researcher`
- `description`: Technical SIGINT (ELINT, FISINT, radar emissions, foreign instrumentation telemetry) discipline researcher; pairs with `gsd-sigint-researcher` when phase scope demands both COMINT and technical-collection coverage
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]`
- `applies_when: [techsigint, technical sigint, elint, fisint, radar, foreign instrumentation, telemetry, emitter, electronic order of battle, eob]`
- `knowledge_tags: [int-disciplines/techsigint, int-disciplines/sigint, capability-patterns]`

**Required sections:** same shape as T7, substituting technical-SIGINT scope (ELINT / FISINT / telemetry). Cross-INT pairing: SIGINT (COMINT sibling — explicitly document the pair convention from spec line 346), GEOINT (emitter geolocation), TECHINT (parametric records of fielded foreign weapons).

**Length target:** 90-110 lines (matches Family I siblings 93-98). Pattern reference: `agents/gsd-sigint-researcher.md` (closest sibling — the COMINT-focused researcher in the same Family I; explicit pair to this agent).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 346, `agents/gsd-sigint-researcher.md` as pattern reference, `intel-refs/int-disciplines/techsigint.md` and `intel-refs/int-disciplines/sigint.md` as consumed refs. Reinforce: document the pair-with-sigint-researcher convention in the agent body.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## RESEARCH COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-techsigint-researcher.md
grep -E "^## RESEARCH BLOCKED$" /Users/romansky/gsd-ic/agents/gsd-techsigint-researcher.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-techsigint-researcher.md
grep -c "gsd-sigint-researcher" /Users/romansky/gsd-ic/agents/gsd-techsigint-researcher.md
```

Expected: both markers present; `ic_pack: true` present; pair reference count `>= 1` (the agent body documents the pair convention).

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-techsigint-researcher.md
git commit -m "[N] feat(agents): gsd-techsigint-researcher — Family I Technical SIGINT (ELINT/FISINT) researcher"
```

---

## Task 10: gsd-icd-203-enforcer agent (Family J)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-icd-203-enforcer.md`

Family J agent #47. Audits analytic artifacts against ICD 203 standards and the Words of Estimative Probability vocabulary. Distinct from Family A tradecraft auditors (which audit compliance configurations) — this one audits analytic content.

**Spec source:** Line 353.

**Frontmatter:**
- `name: gsd-icd-203-enforcer`
- `description`: Audits analytic artifacts (research outputs, briefs, narratives, white papers, proposals) for ICD 203 / ICD 206 / Words of Estimative Probability compliance; produces structured findings the authoring agent or engineer addresses before customer delivery
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [icd 203, icd-203, icd 206, icd-206, wep, words of estimative probability, analytic standards, sourcing, tradecraft enforcement, analytic review]`
- `knowledge_tags: [tradecraft, capability-patterns]`

**Required sections:**
1. `# gsd-icd-203-enforcer` heading + role paragraph.
2. `## When you run` — invoked manually by an engineer or by an authoring agent before customer delivery; on-demand against any analytic artifact path.
3. `## Inputs you accept` — path to the artifact under audit (`.md` file); the three tradecraft refs (`tradecraft/icd-203.md`, `tradecraft/icd-206.md`, `tradecraft/words-of-estimative-probability.md`); optional phase context.
4. `## What you produce` — `.planning/phases/{phase}/{phase}-ICD-203-AUDIT.md` (or alternate path if not in a phase context) containing: per-finding entries with category (`sourcing` / `citation` / `uncertainty` / `assertion` / `argumentation` / `judgment-vs-fact` / `alternative-analysis` / `customer-relevance` / `change-explanation`), line/section reference in the audited artifact, the violation pattern, and a suggested remediation. Findings grouped by category; severity tagged per finding (`blocker` / `major` / `minor`).
5. `## How you do the work` — read the artifact; scan for: (a) bare confidence terms outside the WEP 7-band ("likely", "highly likely", etc. — flag uncalibrated qualifiers like "very likely"); (b) uncited assertions (claims without source-of-record references); (c) missing source-reliability/credibility descriptors per ICD 206; (d) judgments stated as facts (no hedging on what is actually an analytic call); (e) mixed-methodology findings without explicit rationale; (f) missing alternative-analysis sections in products of relevant length / topic; (g) missing customer-relevance / "so what" framing per ICD 203 §C.6.5(6); (h) citation accuracy issues per ICD 203 §C.6.5(9). The agent is rule-based, not generative — it identifies patterns and reports them; remediation is left to the authoring agent or human.
6. `## Constraints` — does not modify the audited artifact; UNCLASSIFIED only (the audit report itself is unclassified — it discusses tradecraft, not classified content); cite ICD 203 / ICD 206 sections by number in findings.
7. `## Completion marker` — emit `## ICD 203 AUDIT COMPLETE` on success (no findings or audit successfully produced with findings listed); emit `## ICD 203 VIOLATIONS FOUND` if `blocker`-severity findings exist.
8. Trailing self-emit markers as appropriate.

**Length target:** 110-140 lines (existing auditors gsd-cmmc-auditor 98, gsd-nist-800-171-auditor 105; icd-203-enforcer has more complex audit logic — slight bump above 100). Pattern references: `agents/gsd-cmmc-auditor.md` (Plan 1 — tradecraft auditor template; same dual-marker pattern with success / findings-found split), `agents/gsd-nist-800-171-auditor.md` (Plan 2 — similar structural pattern with the validator-compliant marker convention).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 353, `agents/gsd-cmmc-auditor.md` and `agents/gsd-nist-800-171-auditor.md` as pattern references, `intel-refs/tradecraft/icd-203.md`, `intel-refs/tradecraft/icd-206.md`, `intel-refs/tradecraft/words-of-estimative-probability.md` as consumed refs (already produced T4-T5; icd-203.md from Plan 0).

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## ICD 203 AUDIT COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-icd-203-enforcer.md
grep -E "^## ICD 203 VIOLATIONS FOUND$" /Users/romansky/gsd-ic/agents/gsd-icd-203-enforcer.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-icd-203-enforcer.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-icd-203-enforcer.md | grep -v -E "Edit|Task|WebSearch|WebFetch|mcp__|AskUserQuestion" && echo "tools: minimal (no Edit/Task/Web/AUQ)"
```

Expected: both markers present once each; `ic_pack: true` present; `tools: minimal` echoes.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-icd-203-enforcer.md
git commit -m "[N] feat(agents): gsd-icd-203-enforcer — Family J tradecraft compliance auditor"
```

---

## Task 11: gsd-ai-eval-auditor agent (Family N)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md`

Family N agent #56. **Dual-mode agent — design and audit paths.** Three markers (decision §3): `## AI EVAL DESIGN COMPLETE` (design path); `## AI EVAL AUDIT COMPLETE` (audit path, no issues); `## AI EVAL ISSUES FOUND` (audit path, issues present). All validator-compliant.

**Spec source:** Line 384.

**Frontmatter:**
- `name: gsd-ai-eval-auditor`
- `description`: IC-flavored AI/ML eval design and audit — designs mission-utility-first eval strategies and audits existing eval artifacts for defensibility against IC customer scrutiny; replaces the former `eval-mission-utility` skill (Round 4 promotion to full agent per spec line 384)
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ai eval, ml eval, mission utility, eval audit, eval design, hitl eval, adversarial robustness, classification-aware eval, defensible measurement, ic eval]`
- `knowledge_tags: [ai-ml, capability-patterns, tradecraft]`

**Required sections:**
1. `# gsd-ai-eval-auditor` heading + role paragraph explaining the two operating modes (design and audit) and pairing with stock `gsd-eval-planner` (general eval mechanics) and Plan 6's existing `ai-ml/eval-patterns.md` ref.
2. `## When you run` — design mode: invoked when a capability is being scoped for an IC-customer-facing pitch and a defensible eval strategy is needed before HITL or mission-utility claims are made; audit mode: invoked when an existing eval artifact needs review before delivery (similar to ICD-203-enforcer's review role, but specific to eval claims).
3. `## Inputs you accept` —
   - Design mode: capability description; target customer; target audience for the eval (CO, oversight, AO).
   - Audit mode: path to existing eval artifact (a `.md` file with eval design + results); the canonical eval-patterns ref (`intel-refs/ai-ml/eval-patterns.md`); WEP ref for hedging-language checks (`intel-refs/tradecraft/words-of-estimative-probability.md`).
4. `## What you produce` —
   - Design mode: `.planning/phases/{phase}/{phase}-AI-EVAL-DESIGN.md` — scenario definition (with the three validity criteria per the eval-patterns ref), eval-category selection (offline benchmark / online HITL / adversarial robustness / classification-aware), mission-utility metric definitions, measurement approach, reproducibility-package outline.
   - Audit mode: `.planning/phases/{phase}/{phase}-AI-EVAL-AUDIT.md` — per-finding entries (similar shape to ICD-203 audit): category (`scenario-validity` / `metric-selection` / `measurement-approach` / `reproducibility` / `claim-defensibility` / `hedging-language`), severity (`blocker` / `major` / `minor`), reference to the audited artifact, suggested remediation.
5. `## How you do the work` —
   - Design mode: read capability description; pick eval category based on the customer ask (offline if pre-HITL, HITL if mission-utility claim is the headline); apply the three scenario-validity criteria; specify mission-utility metric explicitly (analyst-hours saved, not MMLU); document the reproducibility package.
   - Audit mode: read the artifact; check scenario validity, metric selection, measurement approach, reproducibility package, claim cadence (per eval-patterns "Defensible Measurement Claims"), and WEP discipline in claims that extrapolate beyond test conditions.
6. `## Mode Selection` — the agent decides mode from invocation arguments. Documented convention: if invoked with `--design` (or design-shaped input), it enters design mode; with `--audit <path>` (or path-shaped input pointing to an existing eval artifact), it enters audit mode. The body documents the convention so engineers know how to invoke.
7. `## Constraints` — UNCLASSIFIED only; eval-design content abstracts above classification; cite `ai-ml/eval-patterns.md` as the canonical standard for mission-utility metric definitions.
8. `## Completion marker(s)` — design mode: emit `## AI EVAL DESIGN COMPLETE` on success; audit mode: emit `## AI EVAL AUDIT COMPLETE` if no `blocker` findings, else `## AI EVAL ISSUES FOUND`.
9. Trailing example markers (one per mode).

**Length target:** 150-200 lines (dual-mode adds ~50% over single-mode auditors; gsd-rmf-control-mapper at 95 is the closest multi-terminal-output precedent). Pattern references: `agents/gsd-rmf-control-mapper.md` (multi-terminal-output agent), `agents/gsd-cmmc-auditor.md` (audit-with-findings pattern), `intel-refs/ai-ml/eval-patterns.md` (the canonical standard this agent enforces).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 384, `agents/gsd-rmf-control-mapper.md` and `agents/gsd-cmmc-auditor.md` as pattern references, `intel-refs/ai-ml/eval-patterns.md` (Plan 6) + `intel-refs/tradecraft/words-of-estimative-probability.md` (T5) as consumed refs. Reinforce: three markers, mode-aware; ship all three; do not collapse.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## AI EVAL DESIGN COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md
grep -E "^## AI EVAL AUDIT COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md
grep -E "^## AI EVAL ISSUES FOUND$" /Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-ai-eval-auditor.md | grep -v -E "Edit|Task|WebSearch|WebFetch|mcp__|AskUserQuestion" && echo "tools: minimal"
```

Expected: all three markers present; `ic_pack: true` present; `tools: minimal` echoes.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-ai-eval-auditor.md
git commit -m "[N] feat(agents): gsd-ai-eval-auditor — Family N dual-mode IC AI/ML eval design + audit"
```

---

## Task 12: gsd-fm-adaptation-engineer agent (Family N) — Edit-tool isolation

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-fm-adaptation-engineer.md`

Family N agent #57. **Only Phase 7 agent with `Edit` tool.** Implements (not just designs) FM-adaptation pipelines: RAG / fine-tune / prompting patterns for IC content with classification-aware retrieval, source attribution, hallucination tolerance, on-prem inference for transition.

**Spec source:** Line 385.

**Frontmatter:**
- `name: gsd-fm-adaptation-engineer`
- `description`: Foundation-model adaptation engineering for IC content — designs AND implements RAG / fine-tune / prompting pipelines that respect IC constraints (classification-aware retrieval, source attribution, hallucination tolerance, on-prem inference for transition target)
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]`
- `applies_when: [fm adaptation, foundation model, rag, fine-tune, prompting, llm adaptation, retrieval augmented generation, on-prem inference, classification-aware retrieval, ic ai]`
- `knowledge_tags: [ai-ml, capability-patterns, ecosystem]`

**Required sections:**
1. `# gsd-fm-adaptation-engineer` heading + role paragraph emphasizing implementation scope (Edit tool is present because this agent modifies code in the consumer's source tree, not just designs artifacts).
2. `## When you run` — invoked when a capability requires FM adaptation work (RAG pipeline, fine-tune, prompting strategy) targeted at IC content; pairs with `gsd-ai-eval-auditor` for measurement of the resulting capability.
3. `## Inputs you accept` — AI capability requirements; target foundation model(s) (e.g., Claude on Bedrock, Llama-on-prem, GPT via Azure GovCloud — note this informs the inference-environment design); data fabric / retrieval-source description; classification ceiling; transition target (cross-reference `gsd-transition-advisor` Plan 7 output if produced).
4. `## What you produce` — `.planning/phases/{phase}/{phase}-FM-ADAPTATION-DESIGN.md` (the design artifact) **and** implementation code in the project source tree (RAG pipeline files, fine-tune scripts, prompting templates, eval harness integration). The agent writes design + code in the same pass; Edit tool is for iterating on the code.
5. `## How you do the work` — IC-specific patterns: (a) classification-aware retrieval (the retriever respects classification labels on source documents and never returns content above the prompting context's clearance); (b) source attribution (every generated claim cites a retrieved source — supports ICD 206 sourcing in downstream products); (c) hallucination tolerance (the design declares acceptable failure modes — refusal vs. confabulation — per use case); (d) on-prem inference for transition (the design notes which transition stages support which inference environments — cross-reference `classification/aws-partitions.md` for IC-partition AI service availability).
6. `## Constraints` — UNCLASSIFIED design content; implementation code respects the project's existing structure; uses `intel-refs/ai-ml/eval-patterns.md` as the eval design source; pairs with `gsd-ai-eval-auditor` for measurement.
7. `## Completion marker` — emit `## FM ADAPTATION COMPLETE` on success.
8. Trailing self-emit marker.

**Length target:** 180-240 lines (existing Edit-tool implementers: gsd-domex-engineer 103, gsd-synthetic-data-engineer 219; fm-adaptation lands closer to synthetic-data scale because it covers RAG + fine-tune + prompting + classification-aware retrieval). Pattern references: `agents/gsd-domex-engineer.md` (Plan 2 — Edit-tool implementation agent; "designs AND implements" pattern), `agents/gsd-synthetic-data-engineer.md` (Plan 6 — Edit-tool implementation agent in `ai-ml` knowledge tag space; closest sibling on multiple axes).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 385, `agents/gsd-domex-engineer.md` and `agents/gsd-synthetic-data-engineer.md` as pattern references, `intel-refs/ai-ml/eval-patterns.md` and `intel-refs/classification/aws-partitions.md` as consumed refs. Reinforce: Edit tool is present; the agent produces design + code; do not lift it out.

- [ ] **Step 2: Verify markers + frontmatter (with Edit-tool presence assertion)**

```bash
grep -E "^## FM ADAPTATION COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-fm-adaptation-engineer.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-fm-adaptation-engineer.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-fm-adaptation-engineer.md | grep -E "\bEdit\b" && echo "Edit tool: present"
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-fm-adaptation-engineer.md | grep -E "WebSearch.*WebFetch.*mcp__context7" && echo "Web tools: present"
```

Expected: marker present; `ic_pack: true` present; `Edit tool: present` and `Web tools: present` both echo.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-fm-adaptation-engineer.md
git commit -m "[N] feat(agents): gsd-fm-adaptation-engineer — Family N FM adaptation (RAG/fine-tune/prompting; Edit tool)"
```

---

## Task 13: workflow-patches/intel-gates.template.json + Family L wiring

**Files:**
- Create: `/Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json`

**First materialization** of the shipping intel-gates template. Schema reference: `docs/ic-pack/intel-gates-schema.md` (Plan 1-fix). Ships with: schema-version header, hooks defaults, and 4 Family L gate entries (decision §6) all pointing at the same trigger string `plan-phase.5-handle-research` (decision §7). All gates `enabled: false` — consumer programs opt in per-program.

**File content:**

```json
{
  "version": "2026.05",
  "_comment": "Shipping intel-gates template. Consumer copies this to .planning/intel-gates.json and tunes per program. All gates ship enabled:false; opt-in is per-program. See docs/ic-pack/intel-gates-schema.md for the full schema.",
  "hooks": {
    "classification_banner": { "enabled": true },
    "classified_leak": { "enabled": true, "block_on_match": false },
    "prompt_injection_intel": { "enabled": true }
  },
  "gates": {
    "family-l-ci": {
      "enabled": false,
      "trigger": "plan-phase.5-handle-research",
      "agent": "gsd-ci-analyst",
      "_comment": "Family L always-on parallel: counterintelligence framing on every phase with analytic content. Opt in by setting enabled:true."
    },
    "family-l-targeting": {
      "enabled": false,
      "trigger": "plan-phase.5-handle-research",
      "agent": "gsd-targeting-analyst",
      "_comment": "Family L always-on parallel: targeting analysis."
    },
    "family-l-insider": {
      "enabled": false,
      "trigger": "plan-phase.5-handle-research",
      "agent": "gsd-insider-threat-analyst",
      "_comment": "Family L always-on parallel: insider-threat analytic patterns."
    },
    "family-l-adversary": {
      "enabled": false,
      "trigger": "plan-phase.5-handle-research",
      "agent": "gsd-adversary-modeler",
      "_comment": "Family L always-on parallel: structured adversary modeling."
    }
  }
}
```

- [ ] **Step 1: Write the template file**

Dispatch haiku implementer (or controller inline — mechanical JSON write) to create the file with the exact content above.

- [ ] **Step 2: Verify JSON is valid + matches schema shape**

```bash
jq '.' /Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json > /dev/null && echo "JSON: OK"
jq '.version' /Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json
jq '.hooks | keys' /Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json
jq '.gates | keys' /Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json
jq '.gates | to_entries | map(select(.value.enabled == true)) | length' /Users/romansky/gsd-ic/workflow-patches/intel-gates.template.json
```

Expected: `JSON: OK`; `"2026.05"`; 3 hook keys; 4 gate keys; `0` enabled gates.

- [ ] **Step 3: Verify trigger resolves via validate-triggers.sh**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-triggers.sh
```

Expected: validator OK (the trigger `plan-phase.5-handle-research` resolves to `get-shit-done/workflows/plan-phase.md` heading `## 5. Handle Research`).

- [ ] **Step 4: Verify each gate's `agent` field references an actually-shipped agent**

```bash
for agent in gsd-ci-analyst gsd-targeting-analyst gsd-insider-threat-analyst gsd-adversary-modeler; do
  test -f /Users/romansky/gsd-ic/agents/${agent}.md && echo "${agent}: present"
done
```

Expected: all 4 echo `present` (these shipped in Plan 6).

- [ ] **Step 5: Commit**

```bash
git add workflow-patches/intel-gates.template.json
git commit -m "[N] feat(workflow-patches): intel-gates.template.json — first shipping template + Family L always-on wiring"
```

---

## Task 14: Update agent-contracts.ic-pack.md with 6 rows

**Files:**
- Modify: `/Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md`

Append 6 new rows to the registry table (current count 52 → 58). No deviation notes this plan (decision §1 — zero marker conversions).

**Rows to append (in declaration order — after the existing `gsd-transition-advisor` row at line 67):**

```
| gsd-techint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-TECHINT-RESEARCH.md` |
| gsd-medint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-MEDINT-RESEARCH.md` |
| gsd-techsigint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-TECHSIGINT-RESEARCH.md` |
| gsd-icd-203-enforcer | ## ICD 203 AUDIT COMPLETE | ## ICD 203 VIOLATIONS FOUND | `.planning/phases/{phase}/{phase}-ICD-203-AUDIT.md` |
| gsd-ai-eval-auditor | ## AI EVAL DESIGN COMPLETE / ## AI EVAL AUDIT COMPLETE | ## AI EVAL ISSUES FOUND | `.planning/phases/{phase}/{phase}-AI-EVAL-DESIGN.md` (design mode); `.planning/phases/{phase}/{phase}-AI-EVAL-AUDIT.md` (audit mode) |
| gsd-fm-adaptation-engineer | ## FM ADAPTATION COMPLETE | (none) | `.planning/phases/{phase}/{phase}-FM-ADAPTATION-DESIGN.md` + implementation code in project source tree |
```

Trailing note update: the existing parenthetical at line 69 reads "(populated as agents land across Plans 1–8 — see Appendix D of the design spec for the full target list)". Plan 8 completes the v1 roster at 58 agents. Update the note: "(populated across Plans 1–8 — v1 roster complete at 58 agents per Appendix D)".

- [ ] **Step 1: Append rows + update trailing note**

Dispatch haiku implementer (or controller inline) to append the 6 rows after line 67 and update the trailing parenthetical.

- [ ] **Step 2: Verify completion-marker validator passes**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh
```

Expected: `[validate-completion-markers] OK`. This is the gate that verifies every shipped agent's declared marker resolves; with 6 new agents and zero conversions, this should pass cleanly.

- [ ] **Step 3: Verify 6 new rows present**

```bash
grep -cE "^\| gsd-(techint-researcher|medint-researcher|techsigint-researcher|icd-203-enforcer|ai-eval-auditor|fm-adaptation-engineer) " /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `6`.

- [ ] **Step 4: Verify deviation-note count unchanged**

```bash
grep -c "deviation:" /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: count unchanged from pre-Plan-8 state (6 — 1 from Plan 6 + 5 from Plan 7). Zero new deviation notes confirms decision §1.

- [ ] **Step 5: Commit**

```bash
git add references/agent-contracts.ic-pack.md
git commit -m "[N] feat(registry): agent-contracts.ic-pack.md — append 6 Phase 7 rows (v1 roster complete at 58)"
```

---

## Task 15: Update package.json files field with 6 agent paths

**Files:**
- Modify: `/Users/romansky/gsd-ic/package.json`

The `files` field uses directory globs for `intel-refs/` and `workflow-patches/` (covering refs + new template automatically), but each agent path is explicit. Append 6 new entries.

**Entries to add** (under the `files` array, in alphabetical order alongside existing agent entries):

```
"agents/gsd-ai-eval-auditor.md",
"agents/gsd-fm-adaptation-engineer.md",
"agents/gsd-icd-203-enforcer.md",
"agents/gsd-medint-researcher.md",
"agents/gsd-techint-researcher.md",
"agents/gsd-techsigint-researcher.md",
```

- [ ] **Step 1: Add entries via jq**

Dispatch haiku implementer (or controller inline) to add the 6 strings to the `files` array. Preserve existing order otherwise.

- [ ] **Step 2: Verify all 6 new paths present + JSON valid**

```bash
for a in gsd-ai-eval-auditor gsd-fm-adaptation-engineer gsd-icd-203-enforcer gsd-medint-researcher gsd-techint-researcher gsd-techsigint-researcher; do
  jq -r --arg p "agents/${a}.md" '.files[] | select(. == $p)' /Users/romansky/gsd-ic/package.json
done
jq '.' /Users/romansky/gsd-ic/package.json > /dev/null && echo "JSON: OK"
```

Expected: 6 path lines printed; `JSON: OK`.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "[N] chore(package): files — add 6 Phase 7 agent paths"
```

---

## Task 16: Bottom-to-top smoke

**Files:** None (read-only validation).

Run all CI validators + npm pack scope check + install dry-run + spot-check Plan 8 outputs.

- [ ] **Step 1: All validators OK**

```bash
cd /Users/romansky/gsd-ic
bash tools/ci/_run-all.sh
```

Expected: every validator reports OK; exit 0.

- [ ] **Step 2: Completion-marker validator specifically OK**

```bash
bash tools/ci/validate-completion-markers.sh
```

Expected: `[validate-completion-markers] OK`. (Zero marker conversions this phase — should pass cleanly.)

- [ ] **Step 3: Manifest validator OK + topic count 36**

```bash
bash tools/ci/validate-manifest.sh
jq '.topics | length' intel-refs/MANIFEST.json
```

Expected: validator OK; topic count = `36`.

- [ ] **Step 4: Classification validator OK + no-classified-leak OK**

```bash
bash tools/ci/validate-classification.sh
bash tools/ci/validate-no-classified-leak.sh
```

Expected: both OK. (Critical for the 5 new refs and 6 new agent files.)

- [ ] **Step 5: Trigger validator OK**

```bash
bash tools/ci/validate-triggers.sh
```

Expected: validator OK. (This is the first plan to exercise the trigger validator against a real intel-gates.template.json — the 4 Family L gates' shared trigger must resolve.)

- [ ] **Step 6: Registry has exactly 6 new Phase 7 rows**

```bash
grep -cE "^\| gsd-(techint-researcher|medint-researcher|techsigint-researcher|icd-203-enforcer|ai-eval-auditor|fm-adaptation-engineer) " references/agent-contracts.ic-pack.md
```

Expected: `6`.

- [ ] **Step 7: Total IC pack agent count = 58 (v1 roster complete)**

```bash
ls agents/ | xargs -I{} sh -c 'awk "/^---$/{n++; if (n==2) exit} n==1 && /^ic_pack: true/{print FILENAME}" agents/{}' 2>/dev/null | wc -l
```

Expected: `58` (52 from Plans 0-7 + 6 new Phase 7 agents).

- [ ] **Step 8: Zero new deviation notes in registry**

```bash
grep -c "deviation:" references/agent-contracts.ic-pack.md
```

Expected: `6` (unchanged from pre-Plan-8 — confirms decision §1 zero-conversion claim).

- [ ] **Step 9: Edit-tool isolation — only `gsd-fm-adaptation-engineer` among Phase 7 agents**

```bash
for a in techint-researcher medint-researcher techsigint-researcher icd-203-enforcer ai-eval-auditor fm-adaptation-engineer; do
  has_edit=$(grep -E "^tools:" agents/gsd-$a.md | grep -cE "\bEdit\b" || true)
  echo "gsd-$a: Edit=$has_edit"
done
```

Expected: `gsd-fm-adaptation-engineer: Edit=1`; all others `Edit=0`.

- [ ] **Step 10: AskUserQuestion isolation — zero among Phase 7 agents**

```bash
for a in techint-researcher medint-researcher techsigint-researcher icd-203-enforcer ai-eval-auditor fm-adaptation-engineer; do
  has_auq=$(grep -E "^tools:" agents/gsd-$a.md | grep -cE "\bAskUserQuestion\b" || true)
  echo "gsd-$a: AskUserQuestion=$has_auq"
done
```

Expected: all 6 echo `=0`.

- [ ] **Step 11: Task-tool isolation — zero among Phase 7 agents**

```bash
for a in techint-researcher medint-researcher techsigint-researcher icd-203-enforcer ai-eval-auditor fm-adaptation-engineer; do
  has_task=$(grep -E "^tools:" agents/gsd-$a.md | grep -cE "\bTask\b" || true)
  echo "gsd-$a: Task=$has_task"
done
```

Expected: all 6 echo `=0`. (None of the Phase 7 agents orchestrates.)

- [ ] **Step 12: gsd-ai-eval-auditor ships all 3 markers**

```bash
grep -E "^## AI EVAL DESIGN COMPLETE$" agents/gsd-ai-eval-auditor.md
grep -E "^## AI EVAL AUDIT COMPLETE$" agents/gsd-ai-eval-auditor.md
grep -E "^## AI EVAL ISSUES FOUND$" agents/gsd-ai-eval-auditor.md
```

Expected: all three lines echo (one match each).

- [ ] **Step 13: intel-gates.template.json materialized + 4 Family L gates present**

```bash
test -f workflow-patches/intel-gates.template.json && echo "template: present"
jq '.gates | keys' workflow-patches/intel-gates.template.json
jq '.gates | to_entries | map(.value.trigger) | unique | length' workflow-patches/intel-gates.template.json
```

Expected: `template: present`; 4 gate keys listed (`family-l-ci`, `family-l-targeting`, `family-l-insider`, `family-l-adversary`); unique-trigger count `1` (all share `plan-phase.5-handle-research`).

- [ ] **Step 14: npm pack dry-run includes all Phase 7 deliverables, no upstream leak**

```bash
npm pack --dry-run 2>&1 | grep -E "agents/gsd-(techint-researcher|medint-researcher|techsigint-researcher|icd-203-enforcer|ai-eval-auditor|fm-adaptation-engineer)\.md|intel-refs/int-disciplines/(techint|medint|techsigint)\.md|intel-refs/tradecraft/(icd-206|words-of-estimative-probability)\.md|workflow-patches/intel-gates\.template\.json" | wc -l
```

Expected: `12` (6 agents + 5 refs + 1 template).

```bash
npm pack --dry-run 2>&1 | grep -E "claude-code|stock|\.git/" | wc -l
```

Expected: `0` (no upstream-only paths leak into the npm pack).

- [ ] **Step 15: Install dry-run lands all deliverables**

```bash
TARGET=$(mktemp -d)
node bin/gsd-ic-install.js install --customer=nga --target=$TARGET 2>&1 | tail -20
ls $TARGET/agents/ | grep -cE "(techint-researcher|medint-researcher|techsigint-researcher|icd-203-enforcer|ai-eval-auditor|fm-adaptation-engineer)"
ls $TARGET/intel-refs/int-disciplines/ | grep -cE "(techint|medint|techsigint)\.md"
ls $TARGET/intel-refs/tradecraft/ | grep -cE "(icd-206|words-of-estimative-probability)\.md"
test -f $TARGET/workflow-patches/intel-gates.template.json && echo "template installed"
```

Expected: install completes without error; 6 agents land; 3 INT refs land; 2 tradecraft refs land; `template installed` echoes.

- [ ] **Step 16: All commits clean and pushable**

```bash
git status -uno
git log --oneline -20
```

Expected: clean working tree; 15 new commits visible (T1-T3 refs INT, T4-T5 refs tradecraft, T6 manifest, T7-T9 Family I agents, T10 enforcer, T11 ai-eval-auditor, T12 fm-adaptation-engineer, T13 template, T14 registry, T15 package.json — T16 produces no commit).

---

## Self-Review (run before announcing completion)

### 1. Spec coverage

| Item from spec §13 Phase 7 (line 1075) | Plan 8 task | Notes |
|---|---|---|
| `gsd-icd-203-enforcer` | T10 | Family J #47, two markers (compliant) |
| `gsd-techint-researcher` | T7 | Family I #43, RESEARCH marker |
| `gsd-medint-researcher` | T8 | Family I #44, RESEARCH marker |
| `gsd-techsigint-researcher` | T9 | Family I #45, pair-with-sigint documented |
| `gsd-ai-eval-auditor` | T11 | Family N #56, dual-mode, 3 markers (compliant) |
| `gsd-fm-adaptation-engineer` | T12 | Family N #57, Edit-tool isolation |
| Family L always-on integration (intel-gates.json wiring) | T13 | 4 gates, shared trigger, no schema change |
| `gsd-tim-facilitator` (spec residue) | — | Shipped Plan 5; intentionally skipped this plan |

Additional plan deliverables (per locked decisions):
| Deliverable | Plan 8 task | Rationale |
|---|---|---|
| `int-disciplines/techint.md` | T1 | 7→10 INT-disciplines symmetric pattern |
| `int-disciplines/medint.md` | T2 | Same pattern |
| `int-disciplines/techsigint.md` | T3 | Same pattern + sigint pairing |
| `tradecraft/icd-206.md` | T4 | Spec line 353 names as enforcer input |
| `tradecraft/words-of-estimative-probability.md` | T5 | Spec line 353 names as enforcer input; promotes from inline ai-ml/eval-patterns paragraph |
| 5 manifest entries | T6 | Each ref needs manifest indexing |
| 6 registry rows | T14 | Required for completion-marker validator (zero deviation notes) |
| 6 package allowlist entries | T15 | Mechanical files-field update |
| Template scaffold + Family L wiring | T13 | First materialization of shipping intel-gates.template.json |

### 2. Completion marker validator compliance

All 6 Phase 7 agents' markers are validator-regex-compliant out of the box (decision §1). Verification: each marker matches `^## [A-Z][A-Z0-9 _&-]*( COMPLETE| BLOCKED| FOUND| FAILED| UPDATE COMPLETE)$`. Zero conversions, zero deviation notes.

| Agent | Marker(s) | Validator-compliant? |
|---|---|---|
| `gsd-techint-researcher` | `RESEARCH COMPLETE` / `RESEARCH BLOCKED` | Yes |
| `gsd-medint-researcher` | `RESEARCH COMPLETE` / `RESEARCH BLOCKED` | Yes |
| `gsd-techsigint-researcher` | `RESEARCH COMPLETE` / `RESEARCH BLOCKED` | Yes |
| `gsd-icd-203-enforcer` | `ICD 203 AUDIT COMPLETE` / `ICD 203 VIOLATIONS FOUND` | Yes |
| `gsd-ai-eval-auditor` | `AI EVAL DESIGN COMPLETE` / `AI EVAL AUDIT COMPLETE` / `AI EVAL ISSUES FOUND` | Yes (all three) |
| `gsd-fm-adaptation-engineer` | `FM ADAPTATION COMPLETE` | Yes |

### 3. Type / API consistency

- `intel-gates.template.json` schema fields match `docs/ic-pack/intel-gates-schema.md` exactly: `version` (string), `hooks` (object with `enabled` + per-hook keys), `gates` (object with `enabled` + `trigger` + `agent` + optional `config`).
- The trigger string `plan-phase.5-handle-research` resolves to a real heading slug per `validate-triggers.sh` regex: `## 5. Handle Research` → lowercase → strip non-`[a-z0-9 -]` (removes `.`) → spaces-to-hyphen → `5-handle-research`. Verified at T16 step 5.
- All 4 Family L gate `agent` fields reference shipped agent names (Plan 6). Verified at T13 step 4.
- Manifest topic key shape (e.g., `int-disciplines/techint.md`) matches existing entries' key shape. Verified at T6 step 2.

### 4. Scope check

Plan 8 ships v1's final 6 agents — the v1 roster is complete at 58 agents after merge. Plan 9 and beyond are post-v1 maintenance and SME-curation work, not new spec deliverables. Out-of-scope items moved to the dedicated section below.

### 5. Placeholder scan (plan-level)

```bash
grep -nE "TBD|TODO|implement later|fill in details|appropriate error|handle edge" \
  /Users/romansky/gsd-ic/docs/plans/2026-05-11-phase-7-round-4-expansion.md \
  | grep -v -E "\.template\.json|\.planning/|\{phase\}|\{date\}|\{name\}|TBD by engineer|TBD by PM|self-review|out-of-scope"
```

Expected: zero matches in plan structural content. Curly-brace template tokens (`{phase}`, `{date}`, `{name}`) are intentional path templates. The string "TBD by engineer" pattern documented in Plan 7's self-review §5 does not appear in any Plan 8 task — the 6 agents here do not have engineer-fill-in-blank emit patterns. Self-review and out-of-scope sections may contain the literal words `TBD` / `TODO` in reference to other-phase deliverables; those are not plan-level placeholders.

---

## Plan complete

Plan saved to `/Users/romansky/gsd-ic/docs/plans/2026-05-11-phase-7-round-4-expansion.md`.

**Execution model:**
- T1, T2, T3 (INT refs) — sonnet implementer per task; commits per-task; parallelizable
- T4, T5 (tradecraft refs) — sonnet implementer per task; commits per-task; parallelizable
- T6 (manifest) — controller inline (mechanical JSON edit) or haiku
- T7, T8, T9 (Family I agents) — sonnet implementer per task; writes file only (no commit); controller commits each sequentially. Sibling Family I agents may parallelize.
- T10 (icd-203-enforcer) — sonnet; depends on T4/T5
- T11 (ai-eval-auditor) — sonnet; dual-mode shape; depends on T5 (WEP ref) + Plan 6's eval-patterns ref
- T12 (fm-adaptation-engineer) — sonnet; Edit-tool agent; depends on Plan 6's eval-patterns ref + Plan 5's aws-partitions ref
- T13 (intel-gates.template.json) — controller inline (mechanical JSON write) or haiku; first materialization
- T14 (registry) — controller inline (mechanical edit) or haiku
- T15 (package.json) — controller inline (mechanical edit) or haiku
- T16 (smoke) — controller inline

**Push + PR + merge:** Handled by the controller after all 15 task commits land — branch push to `origin/plan-8-phase-7-round-4-expansion`, `gh pr create --repo adelphidata/gsd-ic --base main --title "Plan 8: Phase 7 Round 4 Expansion — 6 agents (v1 complete at 58) + 5 refs + first intel-gates template + Family L wiring (#10)"`, monitor CI, squash-merge on green. PR description should call out: (a) zero marker conversions this phase (clean validator pass); (b) first materialization of the shipping `intel-gates.template.json` template — the `validate-triggers.sh` validator goes from "no gates to validate" (per `validate-triggers.sh` log line "no intel-gates.json files — nothing to validate") to actively validating 4 gate triggers; (c) v1 roster complete at 58 agents.

---

## Out-of-scope reminders for Plan 9+

These items are **not** in Plan 8 and belong to subsequent plans or post-v1 SME-curation work:

- `gsd-tim-facilitator` — already shipped in Plan 5 (Phase 4); spec §13 line 1075 listing is spec residue.
- Gate-dispatcher runtime exercise — the 4 Family L gate entries ship in Plan 8 but are `enabled: false`; runtime fan-out behavior is exercised when a real program opts in. Test fixture work (validating fan-out semantics in CI) is a Plan 9+ deliverable if needed.
- `intel-gates.json` trigger entries for ISSO/ISSM/transition-readiness gates (spec §9 lines 757, 759) — Plan 9+ when the runtime exercises them.
- `ai-ml/fm-adaptation-patterns.md` dedicated ref — deferred to SME ref curation; agent synthesizes from training + existing refs in v1.
- Customer overlay updates for the 6 new Phase 7 agents (e.g., NGA-specific TECHINT overlay) — deferred to SME ref curation post-merge.
- v1 polish: docs/ic-pack/ARCHITECTURE.md final pass, QUICKSTART.md examples updated to reflect 58-agent v1, training materials per spec §15.3.
- npm-publish / consumer-rollout — separate plan once the v1 roster is verified end-to-end on a pilot program.
- ICD 203 enforcer rule expansion — the v1 enforcer covers the 9 ICD 203 §C.6.5 elements + WEP discipline + ICD 206 source-attribution; richer pattern catalogs (e.g., automated alternative-analysis detection beyond presence/absence) are post-v1.
- AI eval auditor scenario library — the v1 auditor reads `ai-ml/eval-patterns.md` as its standard; a structured scenario-template library (per-domain eval design templates) is post-v1 SME curation.
- Gate-dispatcher schema extension to `agents: [array]` — explicitly rejected for Plan 8 (decision §6); revisit when 3+ gate-trigger families need fan-out and the 4-per-trigger pattern becomes unwieldy.
