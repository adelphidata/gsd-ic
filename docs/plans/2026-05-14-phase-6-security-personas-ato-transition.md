# Phase 6 Security Personas + ATO Documentation + Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 13 agents (Family C orchestrators `gsd-isso`, `gsd-issm`; Family D ATO doc specialists `gsd-ssp-drafter`, `gsd-poam-tracker`, `gsd-sar-dryrun`, `gsd-iv-and-v-dryrun`, `gsd-conmon-planner`, `gsd-irp-author`, `gsd-contingency-planner`, `gsd-evidence-packager`; Family E completion `gsd-cdrl-mapper`, `gsd-milestone-brief-generator`; Family O `gsd-transition-advisor`), 2 ref scaffolds (`intel-refs/tradecraft/ato-process-overview.md`, `intel-refs/tradecraft/ato-document-suite.md`), 2 manifest entries, 13 registry rows, and 13 package allowlist paths — all per spec §13 Phase 6 deliverables (line 1074). End state: the security-persona orchestrators and the full ATO documentation suite are available; programs can run their compliance audits, get an ISSO Brief synthesis, get an ISSM determination, draft SSP/IRP/ConMon/Contingency plans, run SAR/IV&V dryruns, package per-milestone evidence, map CDRLs, generate milestone briefs, and produce a transition-readiness check — end-to-end inside the pack with no external tooling.

**Architecture:** Phase 6 is the **security-persona and ATO documentation layer**. Family C (`gsd-isso`, `gsd-issm`) are higher-level synthesizers that read existing Family A+B+D outputs and produce briefings and determinations — they ship with the `Task` tool affordance for future orchestration but operate as **pure synthesizers in v1** (decision §6 below). Family D (8 agents) are the formal ATO documentation specialists: SSP, POA&M, SAR/IV&V dryruns, ConMon, IRP, Contingency, Evidence Packager. Family E completes with two CDRL/customer-artifact agents (`gsd-cdrl-mapper`, `gsd-milestone-brief-generator`); the other two Family E agents (`gsd-after-action-recorder`, `gsd-tim-facilitator`) shipped in Phase 4. Family O is one agent: `gsd-transition-advisor`, the only Phase 6 agent with `AskUserQuestion` (hybrid intake when `transition_path` is absent from `.planning/intel-context.md`). Two consolidated ref scaffolds (`tradecraft/ato-process-overview.md` and `tradecraft/ato-document-suite.md`) replace what would otherwise have been five per-NIST-publication refs (NIST SP 800-18, 800-34, 800-37, 800-61, 800-137) — symmetric with Plan 6's two-ref pattern.

**Tech Stack:** Same as Plans 0-6 — Node.js 20+ (CommonJS `.cjs`), `node:test` for install-side JS tests, bash + jq for validators, Markdown for refs/agents. No new runtime dependencies.

**Spec reference:** `docs/specs/2026-05-05-ic-agent-pack-design.md` — §13 Phase 6 row (line 1074); Family C #10-11 (lines 279-280); Family D #12-19 (lines 286-293); Family E #20 cdrl-mapper (line 299), #21 milestone-brief-generator (line 300); Family O #58 (line 391); Appendix B ref-doc template; Appendix A agent file template.

**Prerequisites:** Plans 0, 1, 1-fix, 2, 3, 4, 5, and 6 merged on main (confirmed at HEAD `e315917e` — 39 IC pack agents, 3 hooks, 5 skills [`intel-coding-conventions`, `classification-conventions`, `prototyping-discipline`, `adelphi-house-style`, `poam-conventions`], 29 ref topics, full validator suite passing). `npm install` run. `tools/ci/_run-all.sh` exits 0. `intel-refs/tradecraft/` directory exists with 9 existing refs (cmmc-2.0, dfars-252-204-7012, eo-14028, fips-140-3, icd-203, itar-ear, nist-800-171, nist-800-53-rev5, poam-format).

**Seamless-fork compliance:** Plan 7 only ADDS files at IC-pack-controlled paths. The upstream-owned files modified are `package.json` (already-permitted modification per Plans 0-6) and `references/agent-contracts.ic-pack.md` (an IC-pack-named file already owned by this pack). No upstream agents/hooks/skills/configs are touched.

---

## File Structure

Files this plan creates or modifies (paths absolute from repo root `/Users/romansky/gsd-ic/`):

**Reference docs (new, both under `intel-refs/tradecraft/`):**
- `intel-refs/tradecraft/ato-process-overview.md`
- `intel-refs/tradecraft/ato-document-suite.md`

**Manifest (modified):**
- `intel-refs/MANIFEST.json` — 2 new entries (topic count 29 → 31)

**Agents (new, all `agents/`):**
- `agents/gsd-isso.md`
- `agents/gsd-issm.md`
- `agents/gsd-ssp-drafter.md`
- `agents/gsd-poam-tracker.md`
- `agents/gsd-sar-dryrun.md`
- `agents/gsd-iv-and-v-dryrun.md`
- `agents/gsd-conmon-planner.md`
- `agents/gsd-irp-author.md`
- `agents/gsd-contingency-planner.md`
- `agents/gsd-evidence-packager.md`
- `agents/gsd-cdrl-mapper.md`
- `agents/gsd-milestone-brief-generator.md`
- `agents/gsd-transition-advisor.md`

**Completion marker registry (modified):**
- `references/agent-contracts.ic-pack.md` — append 13 agent rows (39 → 52)

**Package metadata (modified):**
- `package.json` — `files` field gets 13 new explicit per-file entries (intel-refs/ glob already covers the new refs)

**Total new files:** 15. Modified files: 3.

---

## Decomposition Decision Log

1. **Five spec markers fail validator regex; convert at agent file (not extend validator).** Per locked decision (user-confirmed) and Plan 6 precedent (`SYNTHETIC DATA READY` → `COMPLETE`), the validator stays as `(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)`. Conversions:
   - `gsd-isso`: spec lists `## ISSO REVIEW COMPLETE` / `## ISSO BRIEF READY`. Ship single primary marker `## ISSO REVIEW COMPLETE` only; document in registry that the brief-ready synonym from spec is folded into REVIEW COMPLETE (the agent is finished when the brief is ready — there is no semantically-distinct "review without brief" path).
   - `gsd-sar-dryrun`: `## SAR FINDINGS` → `## SAR DRYRUN GAPS FOUND` (terminal `FOUND`).
   - `gsd-iv-and-v-dryrun`: `## IVV FINDINGS` → `## IVV DRYRUN GAPS FOUND` (terminal `FOUND`).
   - `gsd-evidence-packager`: `## EVIDENCE PACKAGE INCOMPLETE` → `## EVIDENCE PACKAGE BLOCKED` (terminal `BLOCKED`).
   - `gsd-cdrl-mapper`: `## UNMAPPED CDRLs FOUND` (lowercase `s` violates `[A-Z][A-Z0-9 _&-]*`) → `## UNMAPPED CDRLS FOUND` (uppercased plural).
   - `gsd-issm`: spec marker is `## ISSM DETERMINATION COMPLETE` with body variants `READY-FOR-AO` / `REMEDIATE-FIRST` / `RISK-ACCEPTED-WITH-MITIGATION`. The variant is body content (a labeled section in the determination doc), not a section marker — no marker conversion needed.

2. **`gsd-isso` and `gsd-issm` are pure synthesizers in v1.** Per locked decision (user-confirmed). The `Task` tool is present in their frontmatter (per spec line 279, 280), but agent files document v1 behavior as: read existing Family A+B+D artifacts (control matrix, audits, SSP, POA&M, dryruns, etc.), synthesize the brief / determination. The `Task` tool affordance is reserved for future use when an orchestrator needs to spawn a missing Family D agent. v1 smoke does not exercise spawn paths; just file-output + marker checks.

3. **POA&M-tracker is Family D, not Family A.** Per spec line 287 (Family D #13). It uses the same `skills/poam-conventions` skill that Family A's `gsd-stig-auditor` uses (Plan 6) — POA&M append-or-update behavior is shared. The agent prefix is `poam` (not a Family A prefix); the source-of-finding is whatever upstream produced the audit/dryrun output (audits, dryruns, IV&V findings).

4. **Family E completion this phase.** Phase 4 shipped `gsd-after-action-recorder` (#22) and `gsd-tim-facilitator` (#23). Phase 6 ships `gsd-cdrl-mapper` (#20) and `gsd-milestone-brief-generator` (#21). After Plan 7 merges, Family E is complete (4/4).

5. **Two consolidated refs, not five per-publication.** Per locked decision (user-confirmed). Symmetric with Plan 6's two-ref pattern. Content split:
   - `tradecraft/ato-process-overview.md` covers the **lifecycle**: NIST SP 800-37 RMF six-step process, ISSO/ISSM/AO RACI matrix, authorization decision types (ATO / ATO-with-conditions / denial), continuous authorization concepts, "likely AO questions" patterns. Consumed by `gsd-isso`, `gsd-issm`.
   - `tradecraft/ato-document-suite.md` covers the **documents**: SSP per NIST SP 800-18, IRP per NIST SP 800-61, ConMon Plan per NIST SP 800-137, Contingency Plan per NIST SP 800-34, evidence-packaging conventions (PDR/CDR/TRR/ATO submission). Consumed by `gsd-ssp-drafter`, `gsd-irp-author`, `gsd-conmon-planner`, `gsd-contingency-planner`, `gsd-evidence-packager`, `gsd-sar-dryrun`, `gsd-iv-and-v-dryrun`.

6. **No new skill in Phase 6.** The five existing skills are sufficient. `gsd-poam-tracker` consumes `skills/poam-conventions` exactly the way `gsd-stig-auditor` does (Plan 6). `gsd-milestone-brief-generator` reuses `intel-refs/house-style/briefs.md` (already in manifest) and Marp-compatible front-matter conventions from Phase 4's `gsd-capability-brief-generator`.

7. **`gsd-transition-advisor` is the only Phase 6 agent with `AskUserQuestion`.** Per spec line 391 (hybrid path handling — reads `transition_path` from `intel-context.md` if present, else interviews to fill it). Pattern reference: `agents/gsd-mission-gap-analyst.md` (Phase 3 — also hybrid intake via AskUserQuestion + structured input file).

8. **Implementer subagent model: sonnet for agents and refs, haiku for mechanical edits.** Same split as Plan 6: agent and ref synthesis is engineering/integration work (sonnet). Manifest, registry, and package.json edits are mechanical (haiku). Smoke is run by the controller inline.

9. **Task ordering: refs → agents → registry → package → smoke.** T1, T2 (refs) must complete before T4-T16 (agents) so agents cite refs without forward-reference gaps. T4-T16 must complete before T17 (registry) so the implementer can verify each marker matches the agent file and the validator passes. T17 (registry) must complete before T19 (smoke) so the completion-marker validator passes in smoke step 3. T18 (package.json) can run in parallel with T17 but must precede T19 step 11 (npm pack scope check). The controller may parallelize T1/T2 (independent refs) and may parallelize sibling Family D agents (T6-T11 have no inter-agent dependencies once T1/T2 are done).

10. **`gsd-evidence-packager` outputs directory + index.md, no zip in v1.** Spec line 293 says `.planning/evidence-packages/{date}/` (zip + index). For v1, the agent produces a directory with `index.md` (catalog of contained artifacts) and copies (or symlinks/quotes paths to) the relevant artifacts. Actual zipping is documented as an optional follow-step the engineer runs (`zip -r` of the directory) — keeps the agent free of zip-tooling assumptions. The `.zip` file path is a v2 deliverable.

11. **`gsd-issm` documents determination variants in the body, not in markers.** The agent emits one marker `## ISSM DETERMINATION COMPLETE`; the body contains a `## Determination` section labeled with one of `READY-FOR-AO` / `REMEDIATE-FIRST` / `RISK-ACCEPTED-WITH-MITIGATION`. This keeps marker compliance simple (no validator change) and concentrates the variant content in a structured section that consumers (humans preparing for AO) can scan.

12. **`gsd-cdrl-mapper` and `gsd-milestone-brief-generator` use `ecosystem` and `tradecraft` knowledge tags only.** No new ref topic for CDRL conventions in Plan 7; the agents synthesize CDRL knowledge from the spec section + their own training. If SMEs later want a dedicated `ecosystem/cdrl-conventions.md` ref, that's a post-Phase-6 SME-curation deliverable (per Plan 6's "Customer overlay updates ... deferred to SME ref curation" pattern).

13. **`gsd-milestone-brief-generator` mirrors `gsd-capability-brief-generator` Marp pattern.** Both produce dual-format Markdown convertible to slide deck via `marp-cli`. Pattern reference: `agents/gsd-capability-brief-generator.md` (Phase 4). The same Marp-compatible front-matter and slide-break (`---`) conventions apply.

14. **Smoke test mirrors Plan 6 Task 13 structure.** T19 has 16 verification steps. Key Phase-6-specific additions: `Task` tool isolation check (only ISSO + ISSM); `AskUserQuestion` tool isolation check (only Transition-advisor among Phase 6 agents — `gsd-mission-gap-analyst`, `gsd-after-action-recorder` already shipped with it earlier); marker-conversion deviation note presence in registry rows (5 deviations); 13-row registry append count.

15. **No `intel-gates.json` changes in Plan 7.** Family L always-on parallel wiring is Phase 7 per spec §13 line 1075. ISSO/ISSM gate-trigger entries (e.g., the spec's §9 references to `isso-review` and `issm-review` gate names at line 756 and 759) are already mapped at the spec level; runtime wiring lands when the gate-dispatcher is exercised by a real program. Plan 7 ships agent files only; no gate-dispatcher changes.

---

## Task 1: tradecraft/ato-process-overview.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/tradecraft/ato-process-overview.md`

Establishes the RMF / ATO lifecycle vocabulary the Family C orchestrators consume. The `intel-refs/tradecraft/` directory exists (Plan 1 / Plan 2 scaffolds — 9 existing refs).

**Spec source:** Spec §5 lines 279-280 (ISSO/ISSM roles); §13 line 1074 (Phase 6 scope). NIST SP 800-37 Rev 2 (RMF) is the authoritative external reference for the lifecycle.

**Content requirements:**
1. Frontmatter: `topic: tradecraft/ato-process-overview`, `applies_when: [ato, rmf, authorization, isso, issm, ao, authorizing official, iatt, denial, continuous authorization]`, `classification: UNCLASSIFIED`, `ic_pack: true`, owners stub.
2. `# ATO Process Overview` — one-paragraph framing.
3. `## RMF Six-Step Lifecycle` — categorize, select, implement, assess, authorize, monitor (per NIST SP 800-37 Rev 2). One paragraph per step describing what the framework expects to happen, who owns it, and which Phase 6 agent contributes (e.g., assess → SAR/IV&V dryruns; authorize → ISSM determination + AO conversation; monitor → ConMon planner output drives the cadence).
4. `## ISSO / ISSM / AO RACI` — Markdown table mapping the six RMF steps × the three personas, plus the one-row "framework boundary" note (the framework stops at ISSM; humans handle the AO interaction — per spec line 280).
5. `## Authorization Decision Types` — ATO, ATO-with-conditions, IATT (Interim Authority To Test), denial. One paragraph each describing when used, what conditions look like, and how the agent body emits the variant (cross-reference to `gsd-issm` body-variant convention).
6. `## Continuous Authorization` — modern RMF posture; how the ConMon plan feeds continuous reauthorization; relationship to the `gsd-conmon-planner` output.
7. `## Likely AO Questions` — pattern catalog (10-15 patterns) of the categories of question an AO typically asks: residual risk, control inheritance, supply-chain (SBOM), boundary diagrams, incident-response readiness. The `gsd-issm` agent uses these patterns to populate its "Likely AO Questions" appendix.
8. **Constraints:** UNCLASSIFIED only; abstract partition language only (no literal `TS//`, `S//`, `SI//` markings — `validate-no-classified-leak.sh` will reject literal markings); cite NIST publication numbers but no quoted text from non-public NIST publications.

**Length target:** 300-400 lines. Pattern reference: `intel-refs/tradecraft/nist-800-53-rev5.md` (Plan 1 — tradecraft ref structure; Markdown frontmatter; section conventions).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec lines 279-280 + line 1074, `intel-refs/tradecraft/nist-800-53-rev5.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/tradecraft/ato-process-overview.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/tradecraft/ato-process-overview.md
git commit -m "[N] feat(intel-refs): tradecraft/ato-process-overview — RMF lifecycle + ISSO/ISSM/AO RACI"
```

---

## Task 2: tradecraft/ato-document-suite.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/tradecraft/ato-document-suite.md`

Covers the five formal ATO documents the Family D specialists author. Consolidates NIST SP 800-18 (SSP), 800-34 (Contingency), 800-61 (IRP), 800-137 (ConMon), and ATO submission packaging.

**Spec source:** Spec §5 lines 286-293 (Family D agents 12-19); §13 line 1074.

**Content requirements:**
1. Frontmatter: `topic: tradecraft/ato-document-suite`, `applies_when: [ssp, system security plan, irp, incident response, conmon, continuous monitoring, contingency, dr, disaster recovery, evidence package, pdr, cdr, trr, ato submission]`, `classification: UNCLASSIFIED`, `ic_pack: true`, owners stub.
2. `# ATO Document Suite` — one-paragraph framing.
3. `## System Security Plan (SSP)` — per NIST SP 800-18 Rev 1: required sections (system identification, system operational status, control implementation summary, ATO milestones, system interconnections, supplemental detail). Cross-reference: control matrix output of `gsd-rmf-control-mapper` is the input to SSP control-implementation-summary.
4. `## Incident Response Plan (IRP)` — per NIST SP 800-61 Rev 2: lifecycle phases (preparation, detection & analysis, containment & eradication & recovery, post-incident activity); team roles; communication plan; evidence preservation; regulatory reporting touchpoints (cross-reference to `gsd-dfars-incident-responder` Plan 2 output for DFARS-specific 72-hour reporting playbook).
5. `## Continuous Monitoring Plan (ConMon)` — per NIST SP 800-137: organization-defined monitoring frequency per control; automation strategy; escalation thresholds; reporting cadence to ISSM and AO. Reference the `gsd-isso` synthesis output as a typical consumer.
6. `## Contingency Plan / Disaster Recovery` — per NIST SP 800-34 Rev 1: BIA inputs (RTO/RPO per system); contingency strategies (alternate site, alternate processing, backup); recovery procedures; testing & exercises; plan maintenance.
7. `## Evidence Packaging Conventions` — per-milestone packaging (PDR, CDR, TRR, ATO submission): directory layout convention `.planning/evidence-packages/{date}/`; index.md catalog format; artifacts to include per milestone (control matrix, audits, SSP-current, POA&M-current, test results, customer-deliverable copies); v1 ships directory + index, optional zip is engineer-driven.
8. `## Cross-References` — a small table mapping each Family D agent to the section above that it primarily implements.
9. **Constraints:** UNCLASSIFIED only; abstract partition language only; cite NIST publication numbers.

**Length target:** 350-450 lines (largest ref of the plan — 4 NIST publications consolidated plus evidence-packaging conventions; NIST SP 800-37 RMF lifecycle is covered separately in the sibling `tradecraft/ato-process-overview.md` ref shipped in T1, and 800-53 is referenced as a supporting authority via the existing `tradecraft/nist-800-53-rev5.md`). Pattern reference: `intel-refs/tradecraft/nist-800-171.md` (Plan 2 — multi-section consolidation pattern in tradecraft refs).

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, spec lines 286-293 + line 1074, `intel-refs/tradecraft/nist-800-171.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify frontmatter and classification**

```bash
head -10 /Users/romansky/gsd-ic/intel-refs/tradecraft/ato-document-suite.md
bash /Users/romansky/gsd-ic/tools/ci/validate-classification.sh
bash /Users/romansky/gsd-ic/tools/ci/validate-no-classified-leak.sh
```

Expected: frontmatter contains `classification: UNCLASSIFIED` and `ic_pack: true`; both validators OK.

- [ ] **Step 3: Commit**

```bash
git add intel-refs/tradecraft/ato-document-suite.md
git commit -m "[N] feat(intel-refs): tradecraft/ato-document-suite — SSP/IRP/ConMon/Contingency/Evidence per NIST 800-18/34/61/137"
```

---

## Task 3: Update MANIFEST.json with 2 new entries

**Files:**
- Modify: `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json`

Adds 2 ref entries. Topic count goes from 29 → 31. Mechanical haiku-friendly edit.

- [ ] **Step 1: Insert 2 entries (alphabetically, under `topics`)**

Edit tool, `intel-refs/MANIFEST.json`. Locate the existing `tradecraft/` block (alphabetical) and insert two entries:

```json
"tradecraft/ato-document-suite.md": {
  "applies_when": ["ssp", "system security plan", "irp", "incident response", "conmon", "continuous monitoring", "contingency", "dr", "disaster recovery", "evidence package", "pdr", "cdr", "trr", "ato submission"],
  "owner": "intel-pack@adelphi.ai",
  "last_reviewed": "2026-05-09",
  "classification": "UNCLASSIFIED"
},
"tradecraft/ato-process-overview.md": {
  "applies_when": ["ato", "rmf", "authorization", "isso", "issm", "ao", "authorizing official", "iatt", "denial", "continuous authorization"],
  "owner": "intel-pack@adelphi.ai",
  "last_reviewed": "2026-05-09",
  "classification": "UNCLASSIFIED"
},
```

Place these alphabetically before the existing `tradecraft/cmmc-2.0.md` entry. The `ato-document-suite` entry comes before `ato-process-overview` alphabetically. Schema mirrors the existing tradecraft entries (`owner`, `last_reviewed`, `classification`, `applies_when`); the file-level frontmatter `ic_pack`, `owners`, and `topic` are only inside the `.md` file, NOT in the manifest entry.

- [ ] **Step 2: Validate JSON + topic count**

```bash
node -e "require('/Users/romansky/gsd-ic/intel-refs/MANIFEST.json'); console.log('JSON valid')"
jq '.topics | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
```

Expected: `JSON valid` and `31`.

- [ ] **Step 3: Run manifest validator**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-manifest.sh
```

Expected: `[validate-manifest] OK`.

- [ ] **Step 4: Commit**

```bash
git add intel-refs/MANIFEST.json
git commit -m "[U] feat(manifest): index 2 Phase 6 ATO ref topics (29 → 31)"
```

---

## Task 4: gsd-isso agent (Family C)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-isso.md`

Family C agent #10. Pure synthesizer in v1 (decision §2). `Task` tool present in frontmatter per spec; not exercised in v1. Reads existing Family A+B+D outputs and produces a single ISSO Brief that `gsd-issm` consumes.

**Spec source:** Line 279.

**Frontmatter:**
- `name: gsd-isso`
- `description`: operational security ownership; synthesizes Family A+B+D outputs into a single ISSO Brief that ISSM consumes; reports to ISSM
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, Task]`
- `applies_when: [isso, ato, security review, brief, audit, family a, family b, family d, control matrix, ssp, poam, conmon, irp, contingency]`

**Required sections:**
1. `# gsd-isso` heading + role paragraph (synthesizes upstream Family A+B+D outputs; emits ISSO Brief; reports to ISSM; pure-synthesizer in v1 — `Task` tool reserved for future spawn paths).
2. `## When you run` — at the `isso-review` gate (post Family A/B/D outputs are complete in the phase); on-demand when an engineer wants a mid-phase synthesis.
3. `## Inputs you accept` — list the artifacts read: `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md` (RMF), `.planning/CMMC-AUDIT.md`, `.planning/NIST-800-171-AUDIT.md`, `.planning/phases/{phase}/{phase}-FIPS-VALIDATION.md`, `.planning/phases/{phase}/{phase}-ITAR-SCREEN.md`, `.planning/SBOM/SUMMARY.md`, `.planning/DFARS-INCIDENT-PLAYBOOK.md`, `.planning/phases/{phase}/{phase}-PRIVACY-REVIEW.md`, `.planning/SSP.md` (if drafted), `.planning/POAM.md`, `.planning/CONMON-PLAN.md` (if drafted), `.planning/IRP.md` (if drafted), `.planning/CONTINGENCY-PLAN.md` (if drafted), `.planning/STIG-AUDIT.md`, `.planning/intel-context.md`. Skip-on-missing semantics (the brief notes "(not yet produced this phase)" for any missing input rather than failing).
4. `## What you produce` — `.planning/phases/{phase}/{phase}-ISSO-BRIEF.md` containing: phase summary, control coverage status, residual risks, audit-finding rollup, POA&M overview (count of Open / In-Progress / Closed), recommended next steps for ISSM.
5. `## How you do the work` — synthesis pattern (read all inputs in parallel via Bash, group findings by NIST 800-53 family, summarize with citations to source artifact paths, produce the brief; do not duplicate source content — link/quote sparingly).
6. `## Constraints` — does not modify upstream artifacts; v1 does not spawn Family D agents (Task tool reserved for future); abstract partition language only; brief is UNCLASSIFIED.
7. `## Completion marker` — emit `## ISSO REVIEW COMPLETE` on success (the spec listed `## ISSO BRIEF READY` as a synonym; v1 ships the single primary marker — see decision §1).
8. Trailing self-emit `## ISSO REVIEW COMPLETE` heading.

**Length target:** 200-240 lines. Pattern references: `agents/gsd-fusion-architect.md` (synthesizer producing one structured artifact); `agents/gsd-all-source-researcher.md` (always-fires-after-specialists synthesis pattern). For the `Task` tool affordance documentation (without exercising it in v1), study how stock GSD agents that have `Task` describe its non-use in their bodies.

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 279, `agents/gsd-fusion-architect.md` and `agents/gsd-all-source-researcher.md` as pattern references, the section requirements above. Implementer must explicitly note in the agent body that the `Task` tool is reserved for v2 orchestration and not exercised in v1.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## ISSO REVIEW COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-isso.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-isso.md | grep -q "Task" && echo "Task tool: OK"
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-isso.md
grep -c "ISSO BRIEF READY" /Users/romansky/gsd-ic/agents/gsd-isso.md
```

Expected: marker present; `Task tool: OK`; `ic_pack: true` present; the count for `ISSO BRIEF READY` should be `0` (the synonym is documented in the registry deviation note, not in the agent file).

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-isso.md
git commit -m "[N] feat(agents): gsd-isso — Family C ISSO synthesizer (pure-synthesizer v1)"
```

---

## Task 5: gsd-issm agent (Family C)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-issm.md`

Family C agent #11. Pure synthesizer in v1 (same as ISSO). Consumes the ISSO Brief, produces a determination + "Likely AO Questions" appendix. Determination variant is body content under a `## Determination` section labeled `READY-FOR-AO` / `REMEDIATE-FIRST` / `RISK-ACCEPTED-WITH-MITIGATION` (decision §11).

**Spec source:** Line 280.

**Frontmatter:**
- `name: gsd-issm`
- `description`: managerial oversight; consumes ISSO brief; makes risk-acceptance recommendations; owns Risk Determination; produces submission package + likely-AO-questions appendix; framework stops at ISSM (humans handle the actual AO interaction)
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, Task]`
- `applies_when: [issm, ato, risk determination, ao, authorizing official, isso brief, submission, likely ao questions]`

**Required sections:**
1. `# gsd-issm` heading + role paragraph (consumes ISSO brief; produces determination + AO-prep appendix; explicitly note framework boundary — humans handle the AO interaction).
2. `## When you run` — at the `issm-review` gate (after `gsd-isso` brief is complete); on-demand when ISSM-level synthesis is needed.
3. `## Inputs you accept` — `.planning/phases/{phase}/{phase}-ISSO-BRIEF.md`, `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`, `.planning/POAM.md`, `.planning/SSP.md` (if available), optional dryrun outputs (`.planning/SAR-DRYRUN.md`, `.planning/IVV-DRYRUN.md`).
4. `## What you produce` — `.planning/phases/{phase}/{phase}-ISSM-DETERMINATION.md` containing: Risk Assessment, `## Determination` section labeled with one of `READY-FOR-AO` / `REMEDIATE-FIRST` / `RISK-ACCEPTED-WITH-MITIGATION`, recommended next steps, and a `## Likely AO Questions` appendix (10-20 patterns drawn from `intel-refs/tradecraft/ato-process-overview.md`).
5. `## How you do the work` — read ISSO brief; review POA&M (Open count, severity); review residual risks against control matrix gaps; choose determination variant per criteria (described in body — e.g., zero High-severity Open POA&Ms + complete control coverage → `READY-FOR-AO`; otherwise `REMEDIATE-FIRST` or `RISK-ACCEPTED-WITH-MITIGATION` per documented thresholds); populate `Likely AO Questions` from ref patterns.
6. `## Escalation` — when ISSM wants extra confidence before signing off, the spec allows spawning `gsd-sar-dryrun` / `gsd-iv-and-v-dryrun` via Task. Document this escalation path; in v1, the `Task` tool is present but not exercised — the agent instead notes "ISSM recommends a SAR dryrun before AO submission" if confidence is low; an engineer manually invokes the dryrun.
7. `## Constraints` — framework stops at ISSM (do not draft AO correspondence; do not assume AO contact); UNCLASSIFIED only.
8. `## Completion marker` — emit `## ISSM DETERMINATION COMPLETE` on success (the determination variant is body content, not part of the marker).
9. Trailing self-emit `## ISSM DETERMINATION COMPLETE` heading.

**Length target:** 220-260 lines. Pattern references: `agents/gsd-isso.md` (sibling synthesizer — once written this phase); `agents/gsd-cmmc-auditor.md` (multi-input audit pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 280, `agents/gsd-isso.md` (already produced this phase) + `agents/gsd-cmmc-auditor.md` as pattern references, the section requirements above. Reinforce: marker is `## ISSM DETERMINATION COMPLETE` only; variant goes in a labeled body section.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## ISSM DETERMINATION COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-issm.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-issm.md | grep -q "Task" && echo "Task tool: OK"
grep -E "READY-FOR-AO|REMEDIATE-FIRST|RISK-ACCEPTED-WITH-MITIGATION" /Users/romansky/gsd-ic/agents/gsd-issm.md | head -3
```

Expected: marker present once; `Task tool: OK`; all three variant labels present in the body content (not as section markers).

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-issm.md
git commit -m "[N] feat(agents): gsd-issm — Family C ISSM determination + likely-AO appendix"
```

---

## Task 6: gsd-ssp-drafter agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-ssp-drafter.md`

Family D agent #12. Authors SSP per NIST SP 800-18 Rev 1.

**Spec source:** Line 286.

**Frontmatter:**
- `name: gsd-ssp-drafter`
- `description`: authors System Security Plan per NIST SP 800-18; consumes control matrix and system architecture; produces `.planning/SSP.md`
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ssp, system security plan, nist 800-18, control implementation, system identification, ato]`

**Required sections:**
1. `# gsd-ssp-drafter` heading + role paragraph.
2. `## When you run` — during ATO documentation prep; on-demand when SSP is needed for a milestone.
3. `## Inputs you accept` — `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`, `.planning/intel-context.md`, system architecture artifacts (engineer-provided), prior `.planning/SSP.md` if updating.
4. `## What you produce` — `.planning/SSP.md` per NIST SP 800-18 Rev 1 structure (system identification, system operational status, control implementation summary, ATO milestones, system interconnections, supplemental detail).
5. `## How you do the work` — read control matrix; group controls by NIST 800-53 family; for each control, write the implementation paragraph using project-specific language; cross-reference architecture artifacts; mark inherited / hybrid / system per matrix.
6. `## Constraints` — UNCLASSIFIED only; do not invent control implementations (mark "TBD by engineer" if matrix says system-level but no implementation evidence exists); cite the matrix as the source of authority.
7. `## Completion marker` — `## SSP DRAFT COMPLETE` on success; `## SSP DRAFT BLOCKED` when control matrix is missing or inputs are insufficient.
8. Trailing self-emit headings for both markers (only one fires per run).

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-cmmc-auditor.md` (audit-doc author pattern, multi-input synthesis).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 286, `agents/gsd-cmmc-auditor.md` as pattern reference, the section requirements above. Implementer reads `intel-refs/tradecraft/ato-document-suite.md` (produced in T2) for SSP section conventions.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## SSP DRAFT COMPLETE$|^## SSP DRAFT BLOCKED$" /Users/romansky/gsd-ic/agents/gsd-ssp-drafter.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-ssp-drafter.md
```

Expected: both markers present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-ssp-drafter.md
git commit -m "[N] feat(agents): gsd-ssp-drafter — Family D SSP author per NIST 800-18"
```

---

## Task 7: gsd-poam-tracker agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-poam-tracker.md`

Family D agent #13. Manages POA&M; idempotent append-or-update via `skills/poam-conventions`. Agent prefix: `poam` (or per source-of-finding when called from a specific audit).

**Spec source:** Line 287.

**Frontmatter:**
- `name: gsd-poam-tracker`
- `description`: POA&M lifecycle manager; idempotent append-or-update of audit/dryrun findings into `.planning/POAM.md` via the poam-conventions skill; tracks milestones; closes Open entries when remediation evidence is present
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Edit, Bash, Grep, Glob]`
- `applies_when: [poam, poa&m, plan of action, milestone, remediation, audit findings, dryrun findings, gap closure]`

**Required sections:**
1. `# gsd-poam-tracker` heading + role paragraph (idempotent upsert into POA&M; consumes upstream audit/dryrun outputs).
2. `## When you run` — when an audit produces findings (Family A) — wired via the `poam_auto_create: true` gate setting per spec §9 line 776; when a dryrun (`gsd-sar-dryrun`, `gsd-iv-and-v-dryrun`) reports findings; on-demand for milestone closure.
3. `## Inputs you accept` — audit/dryrun output paths (e.g., `.planning/STIG-AUDIT.md`, `.planning/CMMC-AUDIT.md`, `.planning/SAR-DRYRUN.md`, `.planning/IVV-DRYRUN.md`, `.planning/NIST-800-171-AUDIT.md`); existing `.planning/POAM.md` (if present); remediation evidence artifacts.
4. `## What you produce` — updated `.planning/POAM.md` with new Open entries for new findings, updated In-Progress entries when milestone progress is reported, Closed entries when remediation evidence is present. Closed table is append-only (never re-opens).
5. `## How you do the work` — invoke the `skills/poam-conventions` skill (its `SKILL.md` describes the upsert algorithm: key by `(agent-prefix, control-shortid, finding-hash)`; search Open/Closed; update Open or insert; leave Closed alone). For each finding from each upstream audit, call the skill once.
6. `## Constraints` — never re-open a Closed finding (manual override only); never duplicate-insert (the skill's hash-key prevents this); preserve existing entry timestamps.
7. `## Completion marker` — `## POAM UPDATE COMPLETE` on success.
8. Trailing self-emit `## POAM UPDATE COMPLETE` heading.

**Length target:** 160-200 lines. Pattern reference: `agents/gsd-stig-auditor.md` (Plan 6 — also consumes the `poam-conventions` skill and follows the same agent-prefix convention).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 287, `agents/gsd-stig-auditor.md` as pattern reference, the section requirements above. Skill consumption pattern is documented in `skills/poam-conventions/SKILL.md` — implementer reads it.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## POAM UPDATE COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-poam-tracker.md
grep "skills/poam-conventions\|poam-conventions skill" /Users/romansky/gsd-ic/agents/gsd-poam-tracker.md | head -2
```

Expected: marker present; skill reference present in body.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-poam-tracker.md
git commit -m "[N] feat(agents): gsd-poam-tracker — Family D idempotent POA&M lifecycle manager"
```

---

## Task 8: gsd-sar-dryrun agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-sar-dryrun.md`

Family D agent #14. Simulates Security Control Assessor pre-submission audit. Marker conversion: spec `## SAR FINDINGS` → ship as `## SAR DRYRUN GAPS FOUND` (decision §1).

**Spec source:** Line 288.

**Frontmatter:**
- `name: gsd-sar-dryrun`
- `description`: simulates Security Control Assessor pre-submission audit; reads SSP, control matrix, evidence package; produces SAR-DRYRUN with explicit findings or clean-pass
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [sar, security control assessor, dryrun, pre-submission audit, ato readiness]`

**Required sections:**
1. `# gsd-sar-dryrun` heading + role paragraph (simulated SCA review pattern; identifies issues a real SCA would likely flag before formal submission).
2. `## When you run` — when ISSM wants confidence before signing off (per spec line 280); pre-milestone (PDR/CDR/TRR boundaries); on-demand pre-AO submission.
3. `## Inputs you accept` — `.planning/SSP.md`, `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`, `.planning/evidence-packages/{date}/` (latest), `.planning/POAM.md`, `intel-refs/tradecraft/ato-document-suite.md` (for SCA-typical-findings patterns).
4. `## What you produce` — `.planning/SAR-DRYRUN.md` containing: control-by-control review with PASS / FINDING / N/A, evidence-gap rollup, recommended remediation actions per finding, predicted SAR severity for each finding.
5. `## How you do the work` — read SSP and control matrix; for each implemented control, verify evidence is present in the evidence package; for each evidence-missing or evidence-weak control, classify the gap (admin / technical / documentation); compose the dryrun report.
6. `## Constraints` — UNCLASSIFIED only; gap classification is opinionated but documented (cite SCA-typical patterns from the ref); does not modify upstream artifacts.
7. `## Completion marker` — `## SAR DRYRUN COMPLETE` on clean-pass; `## SAR DRYRUN GAPS FOUND` when one or more gaps require remediation. (Spec marker `## SAR FINDINGS` is converted per decision §1; document this conversion in a "Marker note" comment block at the bottom of the agent file.)
8. Trailing self-emit headings for both markers.

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-cmmc-auditor.md` (Family A audit-with-findings-or-clean-pass pattern; same dual-marker convention).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 288, `agents/gsd-cmmc-auditor.md` as pattern reference, the section requirements above. Reinforce: marker is `## SAR DRYRUN GAPS FOUND` (not `## SAR FINDINGS`); add a "Marker note" comment at the bottom of the agent file documenting the spec-to-validator conversion.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## SAR DRYRUN COMPLETE$|^## SAR DRYRUN GAPS FOUND$" /Users/romansky/gsd-ic/agents/gsd-sar-dryrun.md
grep -c "## SAR FINDINGS" /Users/romansky/gsd-ic/agents/gsd-sar-dryrun.md
grep "Marker note" /Users/romansky/gsd-ic/agents/gsd-sar-dryrun.md
```

Expected: both markers present; `## SAR FINDINGS` count is `0` (the original spec marker is mentioned in plain text inside the Marker note but not as a `## ` heading); Marker note present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-sar-dryrun.md
git commit -m "[N] feat(agents): gsd-sar-dryrun — Family D pre-submission SCA simulation"
```

---

## Task 9: gsd-iv-and-v-dryrun agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-iv-and-v-dryrun.md`

Family D agent #15. Simulates Independent V&V audit pre-submission. Marker conversion: spec `## IVV FINDINGS` → `## IVV DRYRUN GAPS FOUND` (decision §1).

**Spec source:** Line 289.

**Frontmatter:**
- `name: gsd-iv-and-v-dryrun`
- `description`: simulates Independent V&V audit pre-submission; reads full evidence package, system architecture, test artifacts; produces IVV-DRYRUN with explicit findings or clean-pass
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ivv, iv&v, independent verification and validation, dryrun, pre-submission audit, ato readiness]`

**Required sections:**
1. `# gsd-iv-and-v-dryrun` heading + role paragraph (independent-V&V perspective: tests not just controls but architectural integrity, test coverage, and system-level correctness).
2. `## When you run` — pre-milestone; pre-AO; when ISSM escalates for extra confidence (per spec line 280).
3. `## Inputs you accept` — full evidence package (`.planning/evidence-packages/{date}/` — latest), `.planning/SSP.md`, system architecture artifacts (engineer-provided), test artifacts and CI test results.
4. `## What you produce` — `.planning/IVV-DRYRUN.md` containing: architectural-integrity review, test-coverage assessment (gaps and recommended additions), control-test traceability matrix, system-level findings.
5. `## How you do the work` — verify control-to-test traceability; verify each "implemented" control has a corresponding test artifact; check test coverage against the control matrix; identify architectural concerns (boundary clarity, data-flow correctness); compose the dryrun.
6. `## Constraints` — opinionated independent perspective (the agent acts as if it were a different team); UNCLASSIFIED only; does not modify upstream artifacts.
7. `## Completion marker` — `## IVV DRYRUN COMPLETE` on clean-pass; `## IVV DRYRUN GAPS FOUND` when gaps exist. (Spec marker `## IVV FINDINGS` is converted per decision §1; document in a "Marker note" comment block at the bottom of the agent file.)
8. Trailing self-emit headings for both markers.

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-sar-dryrun.md` (sibling pattern produced earlier this phase) and `agents/gsd-cmmc-auditor.md` (pattern fall-back).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 289, `agents/gsd-sar-dryrun.md` (this phase) + `agents/gsd-cmmc-auditor.md` as pattern references, the section requirements above. Reinforce: marker is `## IVV DRYRUN GAPS FOUND`; Marker note required.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## IVV DRYRUN COMPLETE$|^## IVV DRYRUN GAPS FOUND$" /Users/romansky/gsd-ic/agents/gsd-iv-and-v-dryrun.md
grep -c "## IVV FINDINGS" /Users/romansky/gsd-ic/agents/gsd-iv-and-v-dryrun.md
grep "Marker note" /Users/romansky/gsd-ic/agents/gsd-iv-and-v-dryrun.md
```

Expected: both markers present; `## IVV FINDINGS` count is `0`; Marker note present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-iv-and-v-dryrun.md
git commit -m "[N] feat(agents): gsd-iv-and-v-dryrun — Family D pre-submission IV&V simulation"
```

---

## Task 10: gsd-conmon-planner agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-conmon-planner.md`

Family D agent #16. Authors Continuous Monitoring Plan per NIST SP 800-137.

**Spec source:** Line 290.

**Frontmatter:**
- `name: gsd-conmon-planner`
- `description`: authors Continuous Monitoring Plan per NIST SP 800-137; defines monitoring frequency per control, automation strategy, escalation thresholds, reporting cadence
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [conmon, continuous monitoring, nist 800-137, monitoring cadence, control monitoring, ato]`

**Required sections:**
1. `# gsd-conmon-planner` heading + role paragraph.
2. `## When you run` — during ATO documentation prep; before AO submission; when monitoring strategy needs revision after a SAR/IVV finding.
3. `## Inputs you accept` — `.planning/SSP.md`, `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`, system architecture artifacts, `intel-refs/tradecraft/ato-document-suite.md` (for ConMon section conventions).
4. `## What you produce` — `.planning/CONMON-PLAN.md` per NIST SP 800-137 structure (organization-defined monitoring frequency per control family, automation strategy, escalation thresholds, reporting cadence to ISSM and AO, plan-update triggers).
5. `## How you do the work` — read control matrix; group controls by family; assign monitoring frequency tier per control sensitivity (continuous / weekly / monthly / quarterly / annual); document automation hooks where automated monitoring is feasible; document the manual-review path for the rest; describe the ISSM-reporting cadence.
6. `## Constraints` — UNCLASSIFIED only; do not invent monitoring tools (describe the function, leave specific tool selection to engineer/SME); cite the ref for section conventions.
7. `## Completion marker` — `## CONMON PLAN COMPLETE` on success.
8. Trailing self-emit `## CONMON PLAN COMPLETE` heading.

**Length target:** 160-200 lines. Pattern reference: `agents/gsd-fusion-architect.md` (planning-doc author pattern producing one structured artifact).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 290, `agents/gsd-fusion-architect.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## CONMON PLAN COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-conmon-planner.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-conmon-planner.md
```

Expected: marker present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-conmon-planner.md
git commit -m "[N] feat(agents): gsd-conmon-planner — Family D ConMon plan author per NIST 800-137"
```

---

## Task 11: gsd-irp-author agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-irp-author.md`

Family D agent #17. Authors Incident Response Plan per NIST SP 800-61. Distinct from `gsd-dfars-incident-responder` (Phase 1) which produces the post-incident DFARS playbook — this one is the proactive IRP.

**Spec source:** Line 291.

**Frontmatter:**
- `name: gsd-irp-author`
- `description`: authors proactive Incident Response Plan per NIST SP 800-61; lifecycle phases (preparation, detection & analysis, containment & eradication & recovery, post-incident); team roles, communication plan, evidence preservation
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [irp, incident response plan, nist 800-61, preparation, detection, containment, recovery, post-incident, ato]`

**Required sections:**
1. `# gsd-irp-author` heading + role paragraph; distinguish from `gsd-dfars-incident-responder` (cross-reference: this is the proactive plan; the other is the post-incident DFARS-specific playbook).
2. `## When you run` — during ATO documentation prep; before AO submission; when threat model changes warrant IRP update.
3. `## Inputs you accept` — `.planning/SSP.md`, system architecture artifacts (engineer-provided), threat model artifacts (if available), `intel-refs/tradecraft/ato-document-suite.md` (for IRP section conventions); cross-references `.planning/DFARS-INCIDENT-PLAYBOOK.md` if present (the DFARS playbook is the post-incident reporting capability — IRP coverage cites it).
4. `## What you produce` — `.planning/IRP.md` per NIST SP 800-61 Rev 2 structure: lifecycle phases (preparation / detection & analysis / containment & eradication & recovery / post-incident activity), team roles and responsibilities, communication plan (internal + customer + regulatory touchpoints), evidence preservation procedures, regulatory reporting touchpoints (cross-reference the DFARS playbook for 72-hour reporting).
5. `## How you do the work` — synthesize per the ref; pull team-role names from `.planning/intel-context.md` if present (ISSO, ISSM, AO, engineering lead); cite the DFARS playbook for the post-incident reporting flow without duplicating its content.
6. `## Constraints` — UNCLASSIFIED only; cite, do not duplicate, the DFARS playbook.
7. `## Completion marker` — `## IRP COMPLETE` on success.
8. Trailing self-emit `## IRP COMPLETE` heading.

**Length target:** 160-200 lines. Pattern reference: `agents/gsd-dfars-incident-responder.md` (Plan 2 — incident-domain artifact-author pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 291, `agents/gsd-dfars-incident-responder.md` as pattern reference, the section requirements above. Implementer reads `intel-refs/tradecraft/ato-document-suite.md` (T2 output) for IRP section conventions.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## IRP COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-irp-author.md
grep "gsd-dfars-incident-responder" /Users/romansky/gsd-ic/agents/gsd-irp-author.md | head -2
```

Expected: marker present; cross-reference to DFARS playbook present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-irp-author.md
git commit -m "[N] feat(agents): gsd-irp-author — Family D proactive IRP per NIST 800-61"
```

---

## Task 12: gsd-contingency-planner agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-contingency-planner.md`

Family D agent #18. Authors Contingency / DR Plan per NIST SP 800-34.

**Spec source:** Line 292.

**Frontmatter:**
- `name: gsd-contingency-planner`
- `description`: authors Contingency / DR Plan per NIST SP 800-34; BIA inputs, contingency strategies (alternate site, processing, backup), recovery procedures, testing & exercises
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [contingency plan, dr, disaster recovery, nist 800-34, bia, business impact analysis, rto, rpo, ato]`

**Required sections:**
1. `# gsd-contingency-planner` heading + role paragraph.
2. `## When you run` — during ATO documentation prep; before AO submission; after a system architecture change with availability implications.
3. `## Inputs you accept` — `.planning/SSP.md`, system architecture artifacts (engineer-provided), BIA artifacts (engineer-provided RTO/RPO targets), `intel-refs/tradecraft/ato-document-suite.md` (for Contingency section conventions).
4. `## What you produce` — `.planning/CONTINGENCY-PLAN.md` per NIST SP 800-34 Rev 1 structure: BIA inputs (RTO/RPO per system component), contingency strategies (alternate site, alternate processing, backup), recovery procedures (per failure scenario), testing & exercises plan, plan maintenance.
5. `## How you do the work` — read SSP and architecture; for each major system component, document the RTO/RPO target (or flag as "TBD by engineer" if not provided); describe the recovery strategy at a level the AO can review; describe testing cadence.
6. `## Constraints` — UNCLASSIFIED only; do not invent specific failover infrastructure (describe the strategy, not the wiring).
7. `## Completion marker` — `## CONTINGENCY PLAN COMPLETE` on success.
8. Trailing self-emit `## CONTINGENCY PLAN COMPLETE` heading.

**Length target:** 160-200 lines. Pattern reference: `agents/gsd-irp-author.md` (sibling planning-doc author this phase) and `agents/gsd-fusion-architect.md` (fall-back).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 292, `agents/gsd-irp-author.md` (this phase) + `agents/gsd-fusion-architect.md` as pattern references, the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## CONTINGENCY PLAN COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-contingency-planner.md
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-contingency-planner.md
```

Expected: marker present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-contingency-planner.md
git commit -m "[N] feat(agents): gsd-contingency-planner — Family D contingency plan per NIST 800-34"
```

---

## Task 13: gsd-evidence-packager agent (Family D)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-evidence-packager.md`

Family D agent #19. Assembles per-milestone evidence packages. Marker conversion: spec `## EVIDENCE PACKAGE INCOMPLETE` → `## EVIDENCE PACKAGE BLOCKED` (decision §1). Output is a directory + `index.md` (no zip in v1 per decision §10).

**Spec source:** Line 293.

**Frontmatter:**
- `name: gsd-evidence-packager`
- `description`: assembles ATO/IV&V submission packages per-milestone (PDR / CDR / TRR / ATO submission); auto at milestone boundaries, on-demand otherwise; produces `.planning/evidence-packages/{date}/` directory with index.md catalog
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [evidence package, pdr, cdr, trr, ato submission, milestone, package, audit deliverable, customer ask]`

**Required sections:**
1. `# gsd-evidence-packager` heading + role paragraph.
2. `## When you run` — at milestone boundaries (PDR / CDR / TRR / ATO submission) automatically; on-demand when customer asks mid-phase.
3. `## Inputs you accept` — milestone type (PDR / CDR / TRR / ATO_SUBMISSION); all phase artifacts (`.planning/phases/*/`); `.planning/SSP.md`; `.planning/POAM.md`; `.planning/CMMC-AUDIT.md`, `.planning/STIG-AUDIT.md`, `.planning/NIST-800-171-AUDIT.md`, `.planning/SAR-DRYRUN.md`, `.planning/IVV-DRYRUN.md`; test artifacts (engineer-provided paths); `intel-refs/tradecraft/ato-document-suite.md` (for milestone-package conventions).
4. `## What you produce` — `.planning/evidence-packages/{date}/` directory containing: `index.md` (catalog of contained artifacts with descriptions, classification, source path, and milestone-relevance), copies of the relevant artifacts (or symlinks where appropriate), a `MILESTONE.md` describing which milestone this package supports and what it certifies. Document that engineer-driven `zip -r` is the optional final step (out of scope for v1).
5. `## How you do the work` — read the ref to determine which artifacts are required for each milestone type; check each required artifact is present (block with `BLOCKED` marker if any required artifact is missing); copy artifacts into the date-stamped directory; write the index.md catalog; write the MILESTONE.md description.
6. `## Constraints` — UNCLASSIFIED only at the package level (the package itself is a UNCLASSIFIED catalog; each artifact has its own classification preserved); never modify the source artifacts; never invent artifacts.
7. `## Completion marker` — `## EVIDENCE PACKAGE COMPLETE` when all required artifacts are gathered and indexed; `## EVIDENCE PACKAGE BLOCKED` when one or more required artifacts is missing. (Spec marker `## EVIDENCE PACKAGE INCOMPLETE` is converted per decision §1; document in a "Marker note" comment at the bottom of the agent file.)
8. Trailing self-emit headings for both markers.

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-mission-narrative-writer.md` (Phase 4 — multi-input aggregator pattern) and `agents/gsd-cmmc-auditor.md` (multi-marker pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 293, `agents/gsd-mission-narrative-writer.md` + `agents/gsd-cmmc-auditor.md` as pattern references, the section requirements above. Reinforce: directory + index.md only (no zip in v1); markers are `## EVIDENCE PACKAGE COMPLETE` / `## EVIDENCE PACKAGE BLOCKED`; Marker note required.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## EVIDENCE PACKAGE COMPLETE$|^## EVIDENCE PACKAGE BLOCKED$" /Users/romansky/gsd-ic/agents/gsd-evidence-packager.md
grep -c "## EVIDENCE PACKAGE INCOMPLETE" /Users/romansky/gsd-ic/agents/gsd-evidence-packager.md
grep "Marker note" /Users/romansky/gsd-ic/agents/gsd-evidence-packager.md
```

Expected: both markers present; `## EVIDENCE PACKAGE INCOMPLETE` count is `0`; Marker note present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-evidence-packager.md
git commit -m "[N] feat(agents): gsd-evidence-packager — Family D per-milestone evidence assembly"
```

---

## Task 14: gsd-cdrl-mapper agent (Family E)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-cdrl-mapper.md`

Family E agent #20. Parses CDRL list; maps each data item to phase/milestone and required format; detects unmapped CDRLs. Marker conversion: spec `## UNMAPPED CDRLs FOUND` (lowercase `s`) → `## UNMAPPED CDRLS FOUND` (decision §1).

**Spec source:** Line 299.

**Frontmatter:**
- `name: gsd-cdrl-mapper`
- `description`: parses CDRL list; maps each data item to phase/milestone and required format; detects unmapped CDRLs; output `.planning/CDRL-MAP.md`
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [cdrl, contract data requirements list, dd 1423, deliverable mapping, milestone mapping, unmapped]`

**Required sections:**
1. `# gsd-cdrl-mapper` heading + role paragraph (parses CDRL list — typically a DD 1423-style table from the contract; produces a mapping table from CDRL to phase/milestone and required format).
2. `## When you run` — at contract kickoff (after `gsd-sow-decomposer` has produced phase scaffolding); when CDRL list changes (mod-driven); on-demand for milestone planning.
3. `## Inputs you accept` — contract document or CDRL list (engineer-provided path or pasted CDRL table); `.planning/ROADMAP.md` (the phase/milestone roadmap); `.planning/SOW-DECOMPOSITION.md` if available.
4. `## What you produce` — `.planning/CDRL-MAP.md` containing: a table with columns `CDRL ID | Title | Frequency | Required Format | Mapped Phase | Mapped Milestone | Producing Agent (if known)`; a `## Unmapped CDRLs` section listing any CDRL that could not be mapped (typically because no phase/milestone covers it).
5. `## How you do the work` — parse the CDRL list (DD 1423 conventions: ID format like `A001`, `B002`); for each CDRL, match against the roadmap by topic and milestone; assign producing agent (`gsd-milestone-brief-generator` for PDR/CDR/TRR briefs, `gsd-evidence-packager` for evidence submissions, etc.) where the mapping is clear; flag unmapped CDRLs.
6. `## Constraints` — UNCLASSIFIED only; do not invent CDRL semantics (mark "TBD by PM" if frequency or required format is ambiguous in the source); do not modify the contract document.
7. `## Completion marker` — `## CDRL MAPPING COMPLETE` on full mapping; `## UNMAPPED CDRLS FOUND` when one or more CDRLs cannot be mapped. (Spec marker has lowercase `s` — converted to uppercase per decision §1; document in a "Marker note" comment at the bottom of the agent file.)
8. Trailing self-emit headings for both markers.

**Length target:** 160-200 lines. Pattern reference: `agents/gsd-sow-decomposer.md` (Phase 3 — contract-document parser producing structured artifacts).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 299, `agents/gsd-sow-decomposer.md` as pattern reference, the section requirements above. Reinforce: marker is `## UNMAPPED CDRLS FOUND` (uppercase S); Marker note required.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## CDRL MAPPING COMPLETE$|^## UNMAPPED CDRLS FOUND$" /Users/romansky/gsd-ic/agents/gsd-cdrl-mapper.md
grep -c "## UNMAPPED CDRLs FOUND" /Users/romansky/gsd-ic/agents/gsd-cdrl-mapper.md
grep "Marker note" /Users/romansky/gsd-ic/agents/gsd-cdrl-mapper.md
```

Expected: both markers present; `## UNMAPPED CDRLs FOUND` (lowercase s) count is `0`; Marker note present.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-cdrl-mapper.md
git commit -m "[N] feat(agents): gsd-cdrl-mapper — Family E CDRL → phase/milestone mapper"
```

---

## Task 15: gsd-milestone-brief-generator agent (Family E)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-milestone-brief-generator.md`

Family E agent #21. Builds formal program-review content (PDR/CDR/TRR/SRR). Dual-format Markdown — readable plus convertible to slides via `marp-cli`.

**Spec source:** Line 300.

**Frontmatter:**
- `name: gsd-milestone-brief-generator`
- `description`: builds formal program-review briefs (PDR/CDR/TRR/SRR); dual-format Markdown — readable as plain Markdown + Marp-cli compatible slide deck
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [milestone brief, pdr, cdr, trr, srr, program review, marp, dual-format brief, formal review]`

**Required sections:**
1. `# gsd-milestone-brief-generator` heading + role paragraph (formal program-review content; distinct from `gsd-capability-brief-generator` which is the pitch-style customer briefing).
2. `## When you run` — at milestone boundaries (PDR / CDR / TRR / SRR); on-demand for milestone preparation.
3. `## Inputs you accept` — milestone type, phase summaries (`.planning/phases/*/SUMMARY.md`), `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`, test results (engineer-provided), `intel-refs/house-style/briefs.md`.
4. `## What you produce` — `.planning/briefs/{milestone}-{date}-BRIEF.md` (dual-format) with: Marp-compatible front-matter, slide-break (`---`) sections, milestone-appropriate content (PDR: design review focus; CDR: critical-design completeness; TRR: test-readiness assessment; SRR: system-requirements review).
5. `## How you do the work` — load the house-style ref; read phase summaries and control matrix; assemble the milestone-specific narrative; emit Marp-compatible Markdown (front-matter + slide breaks); ensure plain-Markdown readability (each "slide" is a coherent paragraph or table).
6. `## Constraints` — UNCLASSIFIED only; consistent with `gsd-capability-brief-generator` Marp conventions; cite phase artifacts rather than duplicating large sections.
7. `## Completion marker` — `## MILESTONE BRIEF COMPLETE` on success.
8. Trailing self-emit `## MILESTONE BRIEF COMPLETE` heading.

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-capability-brief-generator.md` (Phase 4 — same dual-format Marp pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 300, `agents/gsd-capability-brief-generator.md` as pattern reference, the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## MILESTONE BRIEF COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-milestone-brief-generator.md
grep -c "marp\|Marp" /Users/romansky/gsd-ic/agents/gsd-milestone-brief-generator.md
```

Expected: marker present; Marp references present (count >= 2).

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-milestone-brief-generator.md
git commit -m "[N] feat(agents): gsd-milestone-brief-generator — Family E dual-format milestone briefs"
```

---

## Task 16: gsd-transition-advisor agent (Family O)

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-transition-advisor.md`

Family O agent #58. Pre-flight check for prototype → PoR transition. Hybrid intake via `AskUserQuestion` when `transition_path` is absent from `.planning/intel-context.md`. Only Phase 6 agent with `AskUserQuestion`.

**Spec source:** Line 391.

**Frontmatter:**
- `name: gsd-transition-advisor`
- `description`: pre-flight check for prototype → PoR transition; control inheritance, supportability gaps, data-ownership clarity, partition portability, valley-of-death risk patterns; hybrid path handling — reads `transition_path` from intel-context.md or interviews to fill it
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, AskUserQuestion]`
- `applies_when: [transition, por, program of record, prototype to por, valley of death, partition portability, control inheritance, supportability]`

**Required sections:**
1. `# gsd-transition-advisor` heading + role paragraph (pre-flight transition readiness; per-stage readiness check covering controls / portability / supportability concerns at each stage of the declared transition path).
2. `## When you run` — pre-UAT (per spec §9 line 757); on-demand when transition planning becomes a priority; at every plan-phase boundary if a transition target is set.
3. `## Inputs you accept` — `.planning/intel-context.md` (especially `transition_path`); project state (artifacts under `.planning/`); intended PoR (engineer-provided or via AskUserQuestion); `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md`; `intel-refs/classification/aws-partitions.md` (for partition-portability patterns).
4. `## What you produce` — `.planning/TRANSITION-READINESS.md` containing: declared transition path (e.g., `["low-side", "fedramp-mod", "il5", "aws-iso"]` for stepped or `["low-side", "aws-iso"]` for direct); per-stage readiness check (controls / portability / supportability per stage); identified gaps; valley-of-death risk patterns observed.
5. `## How you do the work` — read `.planning/intel-context.md`; if `transition_path` is missing, use AskUserQuestion to prompt for it (offering common patterns: direct low-side → AWS ISO, stepped via FedRAMP Mod / IL4 / IL5, custom); for each stage in the path, run the readiness checks; identify gaps; document the path and gaps; auto-suggest path if customer is in `intel-context.md` but path isn't (engineer confirms or overrides via AskUserQuestion).
6. `## Constraints` — UNCLASSIFIED only; abstract partition language only (per `aws-partitions.md` ref); do not modify intel-context.md without engineer confirmation; the readiness check is opinionated but cited.
7. `## Completion marker` — `## TRANSITION READINESS COMPLETE` on clean readiness; `## TRANSITION GAPS FOUND` when gaps require remediation.
8. Trailing self-emit headings for both markers.

**Length target:** 220-260 lines. Pattern reference: `agents/gsd-mission-gap-analyst.md` (Phase 3 — only other agent with `AskUserQuestion` + hybrid intake pattern; reads optional structured input file, falls back to interview for missing fields).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 391, `agents/gsd-mission-gap-analyst.md` as pattern reference, the section requirements above. Reinforce: `AskUserQuestion` invocation pattern follows `gsd-mission-gap-analyst`; `aws-partitions.md` is the source of partition patterns.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## TRANSITION READINESS COMPLETE$|^## TRANSITION GAPS FOUND$" /Users/romansky/gsd-ic/agents/gsd-transition-advisor.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-transition-advisor.md | grep -q "AskUserQuestion" && echo "AskUserQuestion: OK"
grep "transition_path" /Users/romansky/gsd-ic/agents/gsd-transition-advisor.md | head -2
```

Expected: both markers present; `AskUserQuestion: OK`; `transition_path` referenced.

- [ ] **Step 3: Commit**

```bash
git add agents/gsd-transition-advisor.md
git commit -m "[N] feat(agents): gsd-transition-advisor — Family O hybrid-intake transition readiness"
```

---

## Task 17: Update agent-contracts.ic-pack.md with 13 rows

**Files:**
- Modify: `/Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md`

Append 13 new rows after the last Phase 5 row (`gsd-adversary-modeler`). Five rows include marker-conversion deviation notes per decision §1. Mechanical haiku-friendly edit.

- [ ] **Step 1: Append 13 rows**

Edit tool, `references/agent-contracts.ic-pack.md`. Locate the line:

```
| gsd-adversary-modeler | ## ADVERSARY MODEL COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ADVERSARY-MODEL.md` |
```

Append the following 13 rows immediately after it:

```
| gsd-isso | ## ISSO REVIEW COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ISSO-BRIEF.md` — **deviation: spec §5 line 279 lists `## ISSO REVIEW COMPLETE` / `## ISSO BRIEF READY` as alternative success markers; we ship the single primary `## ISSO REVIEW COMPLETE` to keep one terminal state per agent. The brief-ready synonym is folded into REVIEW COMPLETE. Same deviation pattern as Plan 6 SYNTHETIC DATA marker.** |
| gsd-issm | ## ISSM DETERMINATION COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ISSM-DETERMINATION.md` (Risk Assessment + `## Determination` body section labeled READY-FOR-AO / REMEDIATE-FIRST / RISK-ACCEPTED-WITH-MITIGATION + Likely AO Questions appendix) |
| gsd-ssp-drafter | ## SSP DRAFT COMPLETE | ## SSP DRAFT BLOCKED | `.planning/SSP.md` |
| gsd-poam-tracker | ## POAM UPDATE COMPLETE | (none) | `.planning/POAM.md` (idempotent upsert via `skills/poam-conventions`) |
| gsd-sar-dryrun | ## SAR DRYRUN COMPLETE | ## SAR DRYRUN GAPS FOUND | `.planning/SAR-DRYRUN.md` — **deviation: spec §5 line 288 says `## SAR FINDINGS`; validator regex requires terminal `(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)`, so we ship `## SAR DRYRUN GAPS FOUND`. Same pattern as Plan 6 SYNTHETIC DATA marker.** |
| gsd-iv-and-v-dryrun | ## IVV DRYRUN COMPLETE | ## IVV DRYRUN GAPS FOUND | `.planning/IVV-DRYRUN.md` — **deviation: spec §5 line 289 says `## IVV FINDINGS`; same validator-regex constraint, so we ship `## IVV DRYRUN GAPS FOUND`.** |
| gsd-conmon-planner | ## CONMON PLAN COMPLETE | (none) | `.planning/CONMON-PLAN.md` |
| gsd-irp-author | ## IRP COMPLETE | (none) | `.planning/IRP.md` |
| gsd-contingency-planner | ## CONTINGENCY PLAN COMPLETE | (none) | `.planning/CONTINGENCY-PLAN.md` |
| gsd-evidence-packager | ## EVIDENCE PACKAGE COMPLETE | ## EVIDENCE PACKAGE BLOCKED | `.planning/evidence-packages/{date}/` (directory + `index.md` + `MILESTONE.md`; engineer-driven `zip -r` is optional follow-step) — **deviation: spec §5 line 293 says `## EVIDENCE PACKAGE INCOMPLETE`; validator regex requires terminal `BLOCKED`, so we ship `## EVIDENCE PACKAGE BLOCKED`.** |
| gsd-cdrl-mapper | ## CDRL MAPPING COMPLETE | ## UNMAPPED CDRLS FOUND | `.planning/CDRL-MAP.md` — **deviation: spec §5 line 299 says `## UNMAPPED CDRLs FOUND` (lowercase `s`); validator regex character class `[A-Z][A-Z0-9 _&-]*` rejects lowercase, so we ship `## UNMAPPED CDRLS FOUND` (uppercase `S`).** |
| gsd-milestone-brief-generator | ## MILESTONE BRIEF COMPLETE | (none) | `.planning/briefs/{milestone}-{date}-BRIEF.md` (dual-format Marp) |
| gsd-transition-advisor | ## TRANSITION READINESS COMPLETE | ## TRANSITION GAPS FOUND | `.planning/TRANSITION-READINESS.md` (per-stage checks) |
```

- [ ] **Step 2: Verify row count**

```bash
grep -c "^| gsd-isso \|^| gsd-issm \|^| gsd-ssp-drafter \|^| gsd-poam-tracker \|^| gsd-sar-dryrun \|^| gsd-iv-and-v-dryrun \|^| gsd-conmon-planner \|^| gsd-irp-author \|^| gsd-contingency-planner \|^| gsd-evidence-packager \|^| gsd-cdrl-mapper \|^| gsd-milestone-brief-generator \|^| gsd-transition-advisor " /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `13`.

- [ ] **Step 3: Run completion-marker validator**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh
```

Expected: `[validate-completion-markers] OK`.

- [ ] **Step 4: Commit**

```bash
git add references/agent-contracts.ic-pack.md
git commit -m "[U] docs(contracts): register 13 Phase 6 agent completion markers (5 with deviation notes)"
```

---

## Task 18: Update package.json files field with 13 agent paths

**Files:**
- Modify: `/Users/romansky/gsd-ic/package.json`

Adds 13 explicit per-file entries to the `files` array. The 2 new ref docs are covered by the existing `intel-refs/` glob. Mechanical haiku-friendly edit.

- [ ] **Step 1: Add 13 entries**

Edit tool, `package.json`. Locate the line:

```
    "agents/gsd-adversary-modeler.md",
```

Append the following 13 lines immediately after it:

```json
    "agents/gsd-isso.md",
    "agents/gsd-issm.md",
    "agents/gsd-ssp-drafter.md",
    "agents/gsd-poam-tracker.md",
    "agents/gsd-sar-dryrun.md",
    "agents/gsd-iv-and-v-dryrun.md",
    "agents/gsd-conmon-planner.md",
    "agents/gsd-irp-author.md",
    "agents/gsd-contingency-planner.md",
    "agents/gsd-evidence-packager.md",
    "agents/gsd-cdrl-mapper.md",
    "agents/gsd-milestone-brief-generator.md",
    "agents/gsd-transition-advisor.md",
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "require('/Users/romansky/gsd-ic/package.json'); console.log('JSON valid')"
```

Expected: `JSON valid`.

- [ ] **Step 3: Verify 13 new entries are present**

```bash
node -e "const pkg = require('/Users/romansky/gsd-ic/package.json'); const phase6 = pkg.files.filter(f => f.match(/gsd-(isso|issm|ssp-drafter|poam-tracker|sar-dryrun|iv-and-v-dryrun|conmon-planner|irp-author|contingency-planner|evidence-packager|cdrl-mapper|milestone-brief-generator|transition-advisor)/)); console.log(phase6.length, 'paths'); phase6.forEach(p => console.log(' -', p));"
```

Expected: `13 paths` and 13 path lines.

- [ ] **Step 4: Commit**

```bash
git add package.json
git commit -m "[U] chore(package): add 13 Phase 6 agent paths to files allowlist"
```

---

## Task 19: Bottom-to-top smoke

**Files:** None (read-only validation).

Run all CI validators + npm pack scope check + install dry-run + spot-check Plan 7 outputs.

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

Expected: `[validate-completion-markers] OK`. (This is the gate that the 5 marker conversions hinge on.)

- [ ] **Step 3: Manifest validator OK + topic count 31**

```bash
bash tools/ci/validate-manifest.sh
jq '.topics | length' intel-refs/MANIFEST.json
```

Expected: validator OK; topic count = `31`.

- [ ] **Step 4: Classification validator OK + no-classified-leak OK**

```bash
bash tools/ci/validate-classification.sh
bash tools/ci/validate-no-classified-leak.sh
```

Expected: both OK. (Critical for the 2 new tradecraft refs and 13 new agent files.)

- [ ] **Step 5: Registry has exactly 13 new Phase 6 rows**

```bash
grep -cE "^\| gsd-(isso|issm|ssp-drafter|poam-tracker|sar-dryrun|iv-and-v-dryrun|conmon-planner|irp-author|contingency-planner|evidence-packager|cdrl-mapper|milestone-brief-generator|transition-advisor) " references/agent-contracts.ic-pack.md
```

Expected: `13`.

- [ ] **Step 6: Total IC pack agent count = 52**

```bash
ls agents/ | xargs -I{} sh -c 'awk "/^---$/{n++; if (n==2) exit} n==1 && /^ic_pack: true/{print FILENAME}" agents/{}' 2>/dev/null | wc -l
```

Expected: `52` (39 from Plans 0-6 + 13 new Phase 6 agents).

- [ ] **Step 7: Marker-conversion deviation notes present in registry**

```bash
grep -c "deviation:" references/agent-contracts.ic-pack.md
```

Expected: `>= 6` (1 from Plan 6 SYNTHETIC DATA + 5 new from Plan 7: ISSO, SAR, IVV, EVIDENCE PACKAGE, CDRL).

- [ ] **Step 8: Task tool isolation — only ISSO + ISSM among Phase 6 agents**

```bash
for a in isso issm ssp-drafter poam-tracker sar-dryrun iv-and-v-dryrun conmon-planner irp-author contingency-planner evidence-packager cdrl-mapper milestone-brief-generator transition-advisor; do
  has_task=$(grep -E "^tools:" agents/gsd-$a.md | grep -c "Task" || true)
  echo "gsd-$a: Task=$has_task"
done
```

Expected: `gsd-isso: Task=1`, `gsd-issm: Task=1`, all others `Task=0`.

- [ ] **Step 9: AskUserQuestion tool isolation — only `gsd-transition-advisor` among Phase 6 agents**

```bash
for a in isso issm ssp-drafter poam-tracker sar-dryrun iv-and-v-dryrun conmon-planner irp-author contingency-planner evidence-packager cdrl-mapper milestone-brief-generator transition-advisor; do
  has_auq=$(grep -E "^tools:" agents/gsd-$a.md | grep -c "AskUserQuestion" || true)
  echo "gsd-$a: AskUserQuestion=$has_auq"
done
```

Expected: only `gsd-transition-advisor: AskUserQuestion=1`; all others `=0`.

- [ ] **Step 10: No agent has `Edit` tool in Phase 6**

```bash
for a in isso issm ssp-drafter poam-tracker sar-dryrun iv-and-v-dryrun conmon-planner irp-author contingency-planner evidence-packager cdrl-mapper milestone-brief-generator transition-advisor; do
  has_edit=$(grep -E "^tools:" agents/gsd-$a.md | grep -cE "\bEdit\b" || true)
  echo "gsd-$a: Edit=$has_edit"
done
```

Expected: `gsd-poam-tracker: Edit=1` (POA&M idempotent upsert needs Edit); all others `=0`. (POA&M tracker is the only Phase 6 agent with `Edit` because it modifies an existing artifact rather than producing a new one.)

- [ ] **Step 11: npm pack dry-run includes all Phase 6 deliverables, no upstream leak**

```bash
npm pack --dry-run 2>&1 | grep -E "agents/gsd-(isso|issm|ssp-drafter|poam-tracker|sar-dryrun|iv-and-v-dryrun|conmon-planner|irp-author|contingency-planner|evidence-packager|cdrl-mapper|milestone-brief-generator|transition-advisor)\.md|intel-refs/tradecraft/ato-(process-overview|document-suite)\.md" | wc -l
```

Expected: `15` (13 agents + 2 refs).

```bash
npm pack --dry-run 2>&1 | grep -E "claude-code|stock|\.git/" | wc -l
```

Expected: `0` (no upstream-only paths leak into the npm pack).

- [ ] **Step 12: Install dry-run lands all deliverables**

```bash
mktemp -d > /tmp/plan7-install-target
TARGET=$(cat /tmp/plan7-install-target)
node bin/gsd-ic-install.js install --customer=nga --target=$TARGET 2>&1 | tail -20
ls $TARGET/agents/ | grep -cE "(isso|issm|ssp-drafter|poam-tracker|sar-dryrun|iv-and-v-dryrun|conmon-planner|irp-author|contingency-planner|evidence-packager|cdrl-mapper|milestone-brief-generator|transition-advisor)"
ls $TARGET/intel-refs/tradecraft/ato-*.md | wc -l
```

Expected: install completes without error; 13 agents land; 2 ato refs land.

- [ ] **Step 13: All 5 marker-conversion deviations behaved as designed**

```bash
# Each converted marker IS in the agent (the new validator-compliant marker).
grep -l "## ISSO REVIEW COMPLETE" agents/gsd-isso.md
grep -l "## SAR DRYRUN GAPS FOUND" agents/gsd-sar-dryrun.md
grep -l "## IVV DRYRUN GAPS FOUND" agents/gsd-iv-and-v-dryrun.md
grep -l "## EVIDENCE PACKAGE BLOCKED" agents/gsd-evidence-packager.md
grep -l "## UNMAPPED CDRLS FOUND" agents/gsd-cdrl-mapper.md

# Original spec markers do NOT appear as headings in the agents (they may appear in plain text inside Marker note comments).
test "$(grep -c '^## ISSO BRIEF READY$' agents/gsd-isso.md)" = "0"
test "$(grep -c '^## SAR FINDINGS$' agents/gsd-sar-dryrun.md)" = "0"
test "$(grep -c '^## IVV FINDINGS$' agents/gsd-iv-and-v-dryrun.md)" = "0"
test "$(grep -c '^## EVIDENCE PACKAGE INCOMPLETE$' agents/gsd-evidence-packager.md)" = "0"
test "$(grep -c '^## UNMAPPED CDRLs FOUND$' agents/gsd-cdrl-mapper.md)" = "0"
echo "All 5 marker conversions verified."
```

Expected: each `grep -l` echoes the agent path; `echo "All 5 marker conversions verified."` prints.

- [ ] **Step 14: Family E completion check**

```bash
ls agents/gsd-after-action-recorder.md agents/gsd-tim-facilitator.md agents/gsd-cdrl-mapper.md agents/gsd-milestone-brief-generator.md
```

Expected: all 4 Family E agents present (after-action and tim-facilitator from Phase 4; cdrl-mapper and milestone-brief-generator from Phase 6).

- [ ] **Step 15: ISSO/ISSM body documents pure-synthesizer v1 behavior**

```bash
grep -c "synthesizer\|reserved for\|not exercised in v1\|v2\|future" agents/gsd-isso.md
grep -c "synthesizer\|reserved for\|not exercised in v1\|v2\|future" agents/gsd-issm.md
```

Expected: each `>= 1` — both agent bodies explicitly document the v1 pure-synthesizer posture.

- [ ] **Step 16: All commits clean and pushable**

```bash
git status -uno
git log --oneline -20
```

Expected: clean working tree; 18 new commits visible (T1-T2 refs, T3 manifest, T4-T16 13 agents, T17 registry, T18 package.json — T19 produces no commit).

---

## Self-Review (run before announcing completion)

### 1. Spec coverage

| Item from spec §13 Phase 6 (line 1074) | Plan 7 task | Notes |
|---|---|---|
| `gsd-isso` | T4 | Family C #10, pure-synthesizer v1, marker conversion (folded BRIEF READY synonym) |
| `gsd-issm` | T5 | Family C #11, pure-synthesizer v1, body variant for determination |
| `gsd-ssp-drafter` | T6 | Family D #12, NIST 800-18 |
| `gsd-poam-tracker` | T7 | Family D #13, consumes `skills/poam-conventions` |
| `gsd-sar-dryrun` | T8 | Family D #14, marker conversion (FINDINGS → DRYRUN GAPS FOUND) |
| `gsd-iv-and-v-dryrun` | T9 | Family D #15, marker conversion (FINDINGS → DRYRUN GAPS FOUND) |
| `gsd-conmon-planner` | T10 | Family D #16, NIST 800-137 |
| `gsd-irp-author` | T11 | Family D #17, NIST 800-61, distinguishes from DFARS playbook |
| `gsd-contingency-planner` | T12 | Family D #18, NIST 800-34 |
| `gsd-evidence-packager` | T13 | Family D #19, marker conversion (INCOMPLETE → BLOCKED), no zip in v1 |
| `gsd-cdrl-mapper` | T14 | Family E #20, marker conversion (CDRLs → CDRLS) |
| `gsd-milestone-brief-generator` | T15 | Family E #21, dual-format Marp |
| `gsd-transition-advisor` | T16 | Family O #58, AskUserQuestion hybrid intake |

Additional plan deliverables (per locked decisions):
| Deliverable | Plan 7 task | Rationale |
|---|---|---|
| `tradecraft/ato-process-overview.md` | T1 | RMF lifecycle + ISSO/ISSM/AO RACI; consumed by Family C |
| `tradecraft/ato-document-suite.md` | T2 | SSP/IRP/ConMon/Contingency/Evidence; consumed by 7 Family D + Family C |
| 2 manifest entries | T3 | Each ref needs manifest indexing |
| 13 registry rows | T17 | Required for completion-marker validator + 5 deviation notes |
| 13 package paths | T18 | Required for npm pack scope |
| Bottom-to-top smoke | T19 | Pre-push verification |

Agents deferred per spec: Phase 7 deliverables remain `gsd-icd-203-enforcer`, `gsd-techint-researcher`, `gsd-medint-researcher`, `gsd-techsigint-researcher`, `gsd-ai-eval-auditor` (#56), `gsd-fm-adaptation-engineer` (#57), Family L always-on `intel-gates.json` wiring (per spec §13 line 1075).

### 2. Completion marker validator compliance

Validator regex (authoritative — `tools/ci/validate-completion-markers.sh`): `^##[[:space:]]+[A-Z][A-Z0-9 _&-]*[[:space:]]+(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)$`

| Agent | Marker | Terminal | Valid? |
|---|---|---|---|
| gsd-isso | `## ISSO REVIEW COMPLETE` | `COMPLETE` | Yes |
| gsd-issm | `## ISSM DETERMINATION COMPLETE` | `COMPLETE` | Yes |
| gsd-ssp-drafter | `## SSP DRAFT COMPLETE` | `COMPLETE` | Yes |
| gsd-ssp-drafter | `## SSP DRAFT BLOCKED` | `BLOCKED` | Yes |
| gsd-poam-tracker | `## POAM UPDATE COMPLETE` | `UPDATE COMPLETE` | Yes |
| gsd-sar-dryrun | `## SAR DRYRUN COMPLETE` | `COMPLETE` | Yes |
| gsd-sar-dryrun | `## SAR DRYRUN GAPS FOUND` | `FOUND` | Yes (converted from spec `## SAR FINDINGS`) |
| gsd-iv-and-v-dryrun | `## IVV DRYRUN COMPLETE` | `COMPLETE` | Yes |
| gsd-iv-and-v-dryrun | `## IVV DRYRUN GAPS FOUND` | `FOUND` | Yes (converted from spec `## IVV FINDINGS`) |
| gsd-conmon-planner | `## CONMON PLAN COMPLETE` | `COMPLETE` | Yes |
| gsd-irp-author | `## IRP COMPLETE` | `COMPLETE` | Yes |
| gsd-contingency-planner | `## CONTINGENCY PLAN COMPLETE` | `COMPLETE` | Yes |
| gsd-evidence-packager | `## EVIDENCE PACKAGE COMPLETE` | `COMPLETE` | Yes |
| gsd-evidence-packager | `## EVIDENCE PACKAGE BLOCKED` | `BLOCKED` | Yes (converted from spec `## EVIDENCE PACKAGE INCOMPLETE`) |
| gsd-cdrl-mapper | `## CDRL MAPPING COMPLETE` | `COMPLETE` | Yes |
| gsd-cdrl-mapper | `## UNMAPPED CDRLS FOUND` | `FOUND` | Yes (converted from spec `## UNMAPPED CDRLs FOUND` — uppercase `S`) |
| gsd-milestone-brief-generator | `## MILESTONE BRIEF COMPLETE` | `COMPLETE` | Yes |
| gsd-transition-advisor | `## TRANSITION READINESS COMPLETE` | `COMPLETE` | Yes |
| gsd-transition-advisor | `## TRANSITION GAPS FOUND` | `FOUND` | Yes |

**5 marker conversions documented** in T17 registry rows with `**deviation:**` prose. The PR body must call these out explicitly so reviewers and SMEs see the spec → agent-file mapping.

### 3. Type / API consistency

- All 13 agent files have `ic_pack: true` frontmatter — consistent with `isIcPackAgent()` helper used by the validator and packager.
- All 13 agents have `classification: UNCLASSIFIED` in frontmatter.
- Only `gsd-isso` and `gsd-issm` have the `Task` tool — Family C orchestrator pattern.
- Only `gsd-transition-advisor` has `AskUserQuestion` among Phase 6 agents (matches the Phase 4 `gsd-after-action-recorder` and Phase 3 `gsd-mission-gap-analyst` precedent — only agents that interview).
- Only `gsd-poam-tracker` has the `Edit` tool — POA&M is an upsert against an existing file; all other Phase 6 agents are write-only authors of new artifacts.
- 5 agent files contain "Marker note" comment blocks documenting the spec-to-validator marker conversion (sar-dryrun, iv-and-v-dryrun, evidence-packager, cdrl-mapper, isso-the-folded-synonym).
- Registry rows 40-52 (13 new rows) match agent files; 5 rows include `**deviation:**` prose.
- Package files allowlist: 13 new agent paths (intel-refs/ glob already covers the 2 new refs).
- MANIFEST topic count: 31 (29 from Plan 6 + 2 new Phase 6 refs).
- Total IC pack agents post-Plan 7: 52.

### 4. Scope check

Plan 7 produces working software:
- `npm run ci` exits 0
- `npm pack --dry-run` includes all 13 agents + 2 refs (no upstream leak; verified by Step 11)
- `node bin/gsd-ic-install.js install --customer=nga --target=<dir>` lands all 13 agents + 2 refs
- All install + hook tests pass
- Registry has 52 rows total (39 Phase 0-5 + 13 new Phase 6)
- MANIFEST has 31 topics (29 Phase 0-5 + 2 new Phase 6)
- No upstream agent/hook/skill/config file is modified
- `gsd-isso` and `gsd-issm` carry the `Task` tool but document v1 pure-synthesizer posture
- `gsd-transition-advisor` is the only Phase 6 agent with `AskUserQuestion`
- 5 marker conversions are validator-compliant and registered with deviation notes

### 5. Placeholder scan (plan-level)

```bash
grep -nE "(TBD|TODO|implement later|fill in)" /Users/romansky/gsd-ic/docs/plans/2026-05-14-phase-6-security-personas-ato-transition.md | head
```

Expected: zero matches in plan structural content. Curly-brace template tokens (`{phase}`, `{date}`, `{milestone}`, `{name}`) are intentional path templates. The literal string "TBD by engineer" / "TBD by PM" appears in agent task content (T6 SSP, T12 Contingency, T14 CDRL) as a documented agent-behavior pattern (the agent emits "TBD by engineer" when input data is insufficient) — these are not plan-level placeholders, they are spec'd agent outputs.

---

## Plan complete

Plan saved to `/Users/romansky/gsd-ic/docs/plans/2026-05-14-phase-6-security-personas-ato-transition.md`.

**Execution model:**
- T1, T2 (ref scaffolds) — sonnet implementer per task; commits per-task
- T3 (manifest) — controller inline (mechanical JSON edit) or haiku
- T4-T16 (13 agents) — sonnet implementer per task; writes file only (no commit); controller commits each sequentially. Sibling agents may parallelize: T6/T7/T8/T10/T11/T12 (Family D doc authors with no inter-agent dependency on each other once T1/T2 are done) and T14/T15 (Family E sibling parsers/generators) can run concurrently. T4 (ISSO) → T5 (ISSM) is sequential because T5's pattern reference is T4's output.
- T17, T18 (registry, package.json) — controller inline (mechanical edits) or haiku
- T19 (smoke) — controller inline

**Push + PR + merge:** Handled by the controller after all 18 task commits land — branch push to `origin/plan-7-phase-6-security-ato`, `gh pr create --repo adelphidata/gsd-ic --base main --title "Plan 7: Phase 6 Security Personas + ATO Documentation + Transition (13 agents, 2 refs, 5 marker conversions)"`, monitor CI, squash-merge on green. PR description must call out the **5 marker-conversion deviations** (ISSO, SAR, IVV, EVIDENCE PACKAGE, CDRL) with the spec-source → validator-compliant mapping table from Self-Review §2 — this is the single non-trivial CI gate to watch.

---

## Out-of-scope reminders for Plan 8+

These items are **not** in Plan 7 and belong to subsequent plans:

- `gsd-icd-203-enforcer`, `gsd-techint-researcher`, `gsd-medint-researcher`, `gsd-techsigint-researcher`, `gsd-ai-eval-auditor` (#56), `gsd-fm-adaptation-engineer` (#57) — Phase 7 per spec §13 line 1075
- Family L always-on parallel activation (`intel-gates.json` wiring for `gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler`) — Phase 7 per spec §13 line 1075
- ISSO Task-tool orchestration semantics (real spawn paths for Family D agents from `gsd-isso`) — Phase 7+ when the gate dispatcher is exercised by a real program
- ISSM dryrun-escalation Task-tool exercise (`gsd-issm` spawning `gsd-sar-dryrun` / `gsd-iv-and-v-dryrun`) — Phase 7+
- `intel-gates.json` trigger entries for `isso-review`, `issm-review`, `transition-readiness` (referenced in spec §9 lines 757, 759 but the runtime wiring is the gate-dispatcher's responsibility, not the agent files') — Phase 7+
- `ecosystem/cdrl-conventions.md` ref (deeper CDRL semantics for `gsd-cdrl-mapper`) — deferred to SME ref curation post Phase 6 merge
- Per-NIST-publication separate refs (NIST SP 800-18, 800-34, 800-37, 800-61, 800-137 standalone) if SMEs want finer granularity than the 2 consolidated refs — deferred to SME ref curation
- Customer overlay updates for the 13 new agents — deferred to SME ref curation post Plan 7 merge
- ATO evidence-package zip-tooling (`zip -r` automation in `gsd-evidence-packager`) — v2 enhancement
