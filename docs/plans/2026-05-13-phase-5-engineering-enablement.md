# Phase 5 Engineering Enablement + Mission Framings Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 7 agents (`gsd-synthetic-data-engineer`, `gsd-intel-devops`, `gsd-stig-auditor`, `gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler`), 2 ref scaffolds (`intel-refs/ai-ml/eval-patterns.md`, `intel-refs/classification/aws-partitions.md`), 2 manifest entries, 7 registry rows, and 7 package allowlist paths — all per spec §13 Phase 5 deliverables (line 1073). End state: engineering tooling (synthetic data generation, partition-aware IaC, STIG audit) and mission-framing analytic roles (CI, targeting, insider threat, adversary modeling) are available to all programs.

**Architecture:** Phase 5 is the **engineering enablement and mission-framing layer** — it adds specialist implementers (Family N: synthetic-data-engineer, intel-devops) and analytic-framing roles (Family L: four mission-framing analysts) alongside one Family A compliance agent (gsd-stig-auditor) that ships here instead of Phase 1 because it depends on gsd-intel-devops producing IaC and container configs to audit. Family N agents carry the `Edit` tool (full implementation scope — they write generator code and IaC files). Family L agents are on-demand analysts (always-on parallel wiring is a Phase 7 deliverable); they produce per-phase framing artifacts in `.planning/phases/{phase}/`. The two new ref scaffolds (`ai-ml/eval-patterns.md`, `classification/aws-partitions.md`) feed future Phase 7 agents and cross-consume into existing Phase 5 agents respectively.

**Tech Stack:** Same as Plans 0-5 — Node.js 20+ (CommonJS `.cjs`), `node:test` for install-side JS tests, bash + jq for validators, Markdown for refs/agents. No new runtime dependencies. The `faker`, `mimesis`, `gdal`, `terraform`, `cloudformation` tools are referenced by the engineering agents but are consumer tooling (not packed).

**Spec reference:** `docs/specs/2026-05-05-ic-agent-pack-design.md` — §13 Phase 5 row (line 1073); Family N #54-#55 (line 382-383); Family L #49-#52 (line 367-370); §6.2 classified-leak-detector (for the no-classified-leak validator convention driving T2 content constraints); Appendix B ref-doc template; Appendix A agent file template.

**Prerequisites:** Plans 0, 1, 1-fix, 2, 3, 4, and 5 merged on main (confirmed — 1 context mapper, 8 compliance agents, 3 hooks, 27 ref docs [including 3 house-style], 9 Phase 2 domain agents, 5 Phase 3 mission-design agents, 9 Phase 4 customer-engagement agents, 6 skills, full validator suite passing). `npm install` run. `tools/ci/_run-all.sh` exits 0. `intel-refs/ai-ml/` directory exists (Plan 2 scaffold — contains `hitl-patterns.md`, `xai-patterns.md`, `fm-adaptation.md`). `intel-refs/classification/` directory exists (Plan 0 scaffold — contains `compartments.md`, `releasability.md`, `cui-categories.md`, `derivative-classification.md`).

**Seamless-fork compliance:** Plan 6 only ADDS files at IC-pack-controlled paths. The upstream-owned files modified are `package.json` (already-permitted modification per Plans 0-5) and `references/agent-contracts.ic-pack.md` (an IC-pack-named file already owned by this pack). No upstream agents/hooks/skills/configs are touched.

---

## File Structure

Files this plan creates or modifies (paths absolute from repo root `/Users/romansky/gsd-ic/`):

**Reference docs (new):**
- `intel-refs/ai-ml/eval-patterns.md`
- `intel-refs/classification/aws-partitions.md`

**Manifest (modified):**
- `intel-refs/MANIFEST.json` — 2 new entries (topic count 27 → 29)

**Agents (new, all `agents/`):**
- `agents/gsd-synthetic-data-engineer.md`
- `agents/gsd-intel-devops.md`
- `agents/gsd-stig-auditor.md`
- `agents/gsd-ci-analyst.md`
- `agents/gsd-targeting-analyst.md`
- `agents/gsd-insider-threat-analyst.md`
- `agents/gsd-adversary-modeler.md`

**Completion marker registry (modified):**
- `references/agent-contracts.ic-pack.md` — append 7 agent rows

**Package metadata (modified):**
- `package.json` — `files` field gets 7 new explicit per-file entries (intel-refs/ glob already covers the new refs)

**Total new files:** 9. Modified files: 3.

---

## Decomposition Decision Log

1. **Family N agents have the Edit tool; Family A stig-auditor and Family L agents do not.** Per spec Appendix A agent-file template and the locked decision from Family K (gsd-domex-engineer pattern), `gsd-synthetic-data-engineer` and `gsd-intel-devops` are full implementation-scope agents that write generator code and IaC files respectively. The Edit tool is required. `gsd-stig-auditor` is audit-only (reads configs, writes findings) — no Edit needed. Family L agents are analytic-framing only (reads + writes one report file) — no Edit needed.

2. **gsd-stig-auditor ships in Phase 5, not Phase 1.** Per spec §13 line 1073: the agent belongs to Family A behavior (appends to POA&M) but depends on `gsd-intel-devops` producing IaC and container configs to audit. Shipping it in Phase 1 would have been a hollow stub. Phase 5 is the correct home.

3. **Family L always-on parallel wiring deferred to Phase 7.** Per spec §13 line 1075, the `intel-gates.json` wiring that makes Family L agents fire on every analytic phase is a Phase 7 deliverable. In Phase 5, all four Family L agents ship as on-demand — each agent file documents this explicitly ("always-on parallel wiring is a Phase 7 deliverable; this agent runs on-demand until then.").

4. **aws-partitions.md uses abstract partition language only.** The `validate-no-classified-leak.sh` CI validator rejects literal classification markings (`TS//`, `S//`, `SI//`, etc.). The `intel-refs/classification/aws-partitions.md` ref describes IC AWS partitions using abstract terms only ("the high-side IC partitions", "ICITE-aligned partitions", "the DoD IL4/IL5 tier"). No literal TS/SCI designations appear anywhere in the ref.

5. **4-catalog scaffold for gsd-intel-devops.** Per the locked decision (spec open question O-04 resolved in Round 4): gsd-intel-devops covers 4 AWS service catalogs in scaffold form — compute/container, data services, AI/ML services, networking/security. Deeper IaC content is deferred to future SME ref curation. The agent produces scaffold-level Terraform/CloudFormation with partition-translation notes per catalog item, not full production-ready IaC.

6. **No Phase 5 agent (other than gsd-stig-auditor) appends to POA&M.** POA&M append is exclusively Family A behavior. The stig-auditor uses the Family A POA&M conventions (`skills/poam-conventions`) and agent-prefix `stig`. Family N and Family L agents produce their own distinct output artifacts; no POA&M touch.

7. **Two ref scaffolds only; no new skills in Phase 5.** The four existing skills (`intel-coding-conventions`, `classification-conventions`, `prototyping-discipline`, `adelphi-house-style`) are sufficient. Phase 5 agents are behavioral specialists, not voice-overlay candidates.

8. **eval-patterns.md consumed as a forward reference.** The `ai-ml/eval-patterns.md` ref is consumed immediately by `gsd-adversary-modeler` (adversarial robustness eval patterns) and `gsd-synthetic-data-engineer` (synthetic data quality eval). Its primary consumer `gsd-ai-eval-auditor` (#56) ships in Phase 7 — the ref ships now to support the agents that land this phase and to avoid blocking Phase 7 on a ref.

9. **2 manifest entries, not 7.** Only the 2 new ref docs need manifest entries. Agent files are tracked by the registry + package.json, not the manifest. The existing `intel-refs/ai-ml/` and `intel-refs/classification/` directories are already in the manifest structure; only the new files within them need entries.

10. **Implementer subagent model: sonnet, not haiku.** Plan 5 agents are task-level specs (condensed plan format from Plan 5). Implementer subagents synthesize the actual file content from: the spec section pointer, the task's structural requirements, the listed pattern reference (a prior plan's agent file to crib from), and Plan 5's agent conventions. Sonnet is needed for that synthesis. The implementer writes the file and reports DONE; the controller reviews each file before commit.

11. **Smoke test mirrors Plan 5 Task 19 structure.** T13 has 15 verification steps. The key additions vs. Plan 5 smoke: Edit-tool isolation check (only SDE + intel-devops), POA&M reference isolation (only stig-auditor), Family L always-on note presence, and the no-classified-leak scan (catches the TS// / S// patterns the classified-leak-detector validator enforces at runtime).

12. **gsd-adversary-modeler applies_when includes ai-ml.** Per the instruction: adversary models inform AI/ML eval design (as documented in the eval-patterns.md ref shipped this phase). This cross-tag is intentional and aligns with spec line 370 knowledge tag `capability-patterns, ai-ml`.

13. **Task ordering: refs before agents, agents before registry, registry before package.** T1 and T2 (refs) must complete before T4-T10 (agents) so the agents can cite the refs without forward-reference gaps. T4-T10 (agents) must complete before T11 (registry) so the implementer can verify each marker matches the agent file. T11 (registry) must complete before T13 (smoke) so the completion-marker validator passes in Step 3. T12 (package.json) can run in parallel with T11 but must precede T13 Step 11 (npm pack scope check). The controller may parallelize T1/T2 and parallelize T7/T8/T9/T10 (Family L — no inter-agent dependencies) but must keep T4 (SDE) before T5 (intel-devops) if the implementer uses SDE output as an input example for intel-devops (not required, but natural sequencing).

14. **gsd-stig-auditor has two distinct completion markers.** `## STIG AUDIT COMPLETE` signals a full audit ran with findings (there may be zero findings — audit ran cleanly). `## STIG AUDIT GAPS FOUND` signals the audit could not complete due to missing IaC inputs — it does NOT mean STIG violations were found. This distinction is important for the registry row: the second marker column lists `## STIG AUDIT GAPS FOUND` (not `## STIG AUDIT BLOCKED`) because the condition is "inputs insufficient" not "blocked by classification". The validator regex accepts `FOUND` as a terminal so both markers pass.

---

## Task 1: ai-ml/eval-patterns.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/ai-ml/eval-patterns.md`

Establishes IC AI/ML eval patterns. The `intel-refs/ai-ml/` directory already exists (Plan 2 scaffold). Consumed by: `gsd-adversary-modeler` (adversarial robustness eval patterns, this phase), `gsd-synthetic-data-engineer` (synthetic data quality eval patterns, this phase), and future Phase 7 `gsd-ai-eval-auditor` (forward reference).

**Spec source:** Spec §5 line 384 (gsd-ai-eval-auditor description references `intel-refs/ai-ml/eval-patterns.md` as the standard it reads); spec §14 risk register R-11 (standardize the mission-utility metric definition in this file).

**Content requirements:**
- Frontmatter: `classification: UNCLASSIFIED`, `owner: intel-pack@adelphi.ai`, `last_reviewed: 2026-05-13`, `applies_when: [ai-ml, eval, evaluation, mission utility, hitl, model evaluation, ic eval, eval design]`
- Title: `# IC AI/ML Eval Patterns`
- Purpose section (1 paragraph): explain the doc is consumed by Phase 5 engineering agents and the future `gsd-ai-eval-auditor`; grounds the mission-utility metric definition per spec R-11
- 5 content sections:
  1. **Mission-Utility Metrics** — define mission utility as analyst-hours-saved on a scenario (not MMLU); how to scope a valid scenario; measurement approach (control group vs. baseline capture); documentation requirements for defensible claims to a government customer
  2. **Eval Categories** — 4 categories: (a) offline benchmark (static test dataset, controlled conditions, quantified metrics); (b) online HITL evaluation (analyst-in-the-loop, decision quality measured, latency tracked); (c) adversarial robustness (adversarial inputs, distribution shift, edge cases — cross-references gsd-adversary-modeler); (d) classification-aware test data (partition-appropriate test data, no mixing of training/test data provenance tiers)
  3. **Defensible Measurement Claims** — evidence-chain requirements for customer-facing claim (claim → test design → test data provenance → result + confidence interval → mission interpretation); ICD 203 hedging applies
  4. **Synthetic Data Quality Eval** — when real data is unavailable (demo prep, pre-ATO phases); distribution-fidelity metrics; schema-completeness checks; cross-references gsd-synthetic-data-engineer
  5. **See Also** — `tradecraft/icd-203.md`, `ai-ml/hitl-patterns.md`, `ai-ml/xai-patterns.md`, `capability-patterns/attribution.md`
- Length target: ~120 lines
- Pattern reference: `intel-refs/ai-ml/hitl-patterns.md` (same directory, same ref-doc structure)

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, the content requirements above, Plan 5 `intel-refs/ai-ml/hitl-patterns.md` as pattern reference for header/structure. The implementer should write substantive content — section guidance is real instruction, not "TBD." Sample content should read as plausible IC-flavored analytic practice guidance (no marketing language, no "state-of-the-art AI").

- [ ] **Step 2: Validate against template**

```bash
head -8 /Users/romansky/gsd-ic/intel-refs/ai-ml/eval-patterns.md
```

Expected: frontmatter with all 4 required keys (classification, owner, last_reviewed, applies_when).

- [ ] **Step 2a: Verify no classified markings in ref**

```bash
grep -nE "(TS//|S//|SI//|TK//|HCS//|TOP SECRET|SECRET)" /Users/romansky/gsd-ic/intel-refs/ai-ml/eval-patterns.md | head -5
```

Expected: zero matches.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/ai-ml/eval-patterns.md
git commit -m "[N] docs(refs): IC AI/ML eval patterns — mission-utility metrics + eval categories (Phase 5)"
```

---

## Task 2: classification/aws-partitions.md ref scaffold

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/classification/aws-partitions.md`

Establishes IC AWS partition map. The `intel-refs/classification/` directory already exists (Plan 0 scaffold). Consumed by: `gsd-intel-devops` (partition-translation notes, this phase), `gsd-transition-advisor` (Phase 6 forward reference), `gsd-fm-adaptation-engineer` (Phase 7 forward reference).

**CRITICAL:** Do NOT use literal classification markings (`TS//`, `S//`, `TOP SECRET`, `SECRET`, `SI//`, `TK//`, etc.) anywhere in this file. The `validate-no-classified-leak.sh` CI validator will reject them on build. Use only abstract terms: "the high-side IC partitions", "ICITE-aligned partitions", "the upper-tier IC cloud environments", "the DoD IL4/IL5 tier".

**Content requirements:**
- Frontmatter: `classification: UNCLASSIFIED`, `owner: intel-pack@adelphi.ai`, `last_reviewed: 2026-05-13`, `applies_when: [classification, aws, govcloud, il4, il5, iso, isob, isof, partition, cloud architecture]`
- Title: `# IC AWS Partition Map`
- Purpose section (1 paragraph): consumed by `gsd-intel-devops` and `gsd-transition-advisor`; establishes the partition vocabulary and translation guide
- 6 content sections:
  1. **Commercial AWS** — standard `aws` partition; `us-east-1`, `us-west-2`, etc.; full service catalog; internet-accessible; the dev/prototype environment for all Phase 0-5 work
  2. **GovCloud (US-East-Gov, US-West-Gov)** — `aws-us-gov` partition; FedRAMP Moderate (default GovCloud baseline) and FedRAMP High; ITAR-eligible; used by DoD and civilian agencies below IL4; accessible from commercial internet but US-persons-only; most (not all) commercial services available
  3. **IL4 / IL5 (DoD Impact Level mapping)** — abstract DoD ImpactLevel tiers; IL4 covers Controlled Unclassified Information (CUI) up to DoD CUI; IL5 adds National Security Systems (NSS); hosted in `aws-us-gov` or dedicated IL5 regions depending on authorizing official; service catalog is a subset of GovCloud — document the major gaps (some AI/ML services not available at IL5)
  4. **ISO / ISOB / ISOF (the IC partition tiers — abstract)** — describe abstractly: the ICITE-aligned AWS partitions; air-gapped from commercial internet; restricted ARN namespace; service catalog is a strict subset of GovCloud; "the high-side IC partitions" language only; no details about specific compartment handling
  5. **Service Availability Matrix** — table with rows: Compute (ECS/EKS/Lambda/Fargate), Data (S3/RDS/DynamoDB/OpenSearch), AI/ML (Bedrock/SageMaker/Comprehend/Textract), Networking (VPC/Transit Gateway/IAM Identity Center/GuardDuty). Columns: Commercial, GovCloud, IL4/5, IC Partitions (abstract). Use: "Full", "Partial", "Limited", "Not available", "Verify with AO" — no high-side specifics
  6. **Migration Path Considerations** — common transition paths: direct (low-side → IC partition) vs. stepped (low-side → GovCloud → IL4/5 → IC partition); control inheritance at each hop; architectural decisions to make at day one that affect portability (VPC design, IAM patterns, KMS key strategies, container registries); cross-references `gsd-transition-advisor` for runtime guidance
  7. **See Also** — `classification/compartments.md`, `classification/releasability.md`, `ecosystem/ic-ite.md`, `ecosystem/c2e.md`
- Length target: ~140 lines
- Pattern reference: `intel-refs/classification/compartments.md` (same directory)

- [ ] **Step 1: Write the ref**

Dispatch sonnet implementer with: target path, the content requirements above (with the no-classified-leak constraint emphasized), Plan 2 `intel-refs/classification/compartments.md` as pattern reference for header/structure. Brief the implementer explicitly: every reference to an IC-partition tier must use abstract language — the pattern `"high-side IC partition"`, `"ICITE-aligned partition"`, `"upper-tier IC cloud environment"` — never literal compartment designators.

- [ ] **Step 2: Validate — no literal markings**

```bash
grep -nE "(TS//|S//|SI//|TK//|HCS//|KDK//|G//|TOP SECRET|SECRET)" /Users/romansky/gsd-ic/intel-refs/classification/aws-partitions.md | head -5
```

Expected: zero matches.

- [ ] **Step 3: Validate frontmatter**

```bash
head -8 /Users/romansky/gsd-ic/intel-refs/classification/aws-partitions.md
```

Expected: all 4 required frontmatter keys present.

- [ ] **Step 4: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/classification/aws-partitions.md
git commit -m "[N] docs(refs): IC AWS partition map — commercial/GovCloud/IL4-5/IC-partition guide (Phase 5)"
```

---

## Task 3: Update MANIFEST.json with 2 new entries

**Files:**
- Modify: `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json`

Adds 2 manifest entries — one per Phase 5 ref scaffold. Bundled as a single task to touch MANIFEST.json once. The existing 27 entries (from Plans 0-5) are unchanged. After this task: 29 topics.

- [ ] **Step 1: Add 2 entries**

Edit tool, `intel-refs/MANIFEST.json`. Locate the last existing entry (the last Phase 4 house-style entry `house-style/briefs.md`) and append after its closing `}`:

```json
    ,
    "ai-ml/eval-patterns.md": {
      "applies_when": ["ai-ml", "eval", "evaluation", "mission utility", "hitl", "model evaluation", "ic eval", "eval design"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-13",
      "classification": "UNCLASSIFIED"
    },
    "classification/aws-partitions.md": {
      "applies_when": ["classification", "aws", "govcloud", "il4", "il5", "iso", "isob", "isof", "partition", "cloud architecture"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-13",
      "classification": "UNCLASSIFIED"
    }
```

- [ ] **Step 2: Validate JSON**

```bash
jq empty /Users/romansky/gsd-ic/intel-refs/MANIFEST.json && echo "JSON valid"
```

Expected: `JSON valid`.

- [ ] **Step 3: Verify topic count**

```bash
jq '.topics | keys | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
```

Expected: `29` (27 existing + 2 new Phase 5 entries).

- [ ] **Step 4: Run manifest validator**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-manifest.sh
```

Expected: `[validate-manifest] OK`.

- [ ] **Step 5: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/MANIFEST.json
git commit -m "[U] docs(manifest): add 2 Phase 5 ref entries (ai-ml/eval-patterns, classification/aws-partitions)"
```

---

## Task 4: gsd-synthetic-data-engineer agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md`

Family N agent #54. Synthetic data generation across 4 data families. **Has Edit tool** — full implementation scope (writes generator code alongside dataset files).

**Spec source:** Line 382.

**Frontmatter:**
- `name: gsd-synthetic-data-engineer`
- `description`: synthetic data generation for demos across 4 data families (tabular/structured, geospatial, text/document, sensor/signal); picks generation strategy per family; produces dataset files + generator scripts in `.planning/synthetic-data/{name}/`
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Edit, Bash, Grep, Glob]`
- `applies_when: [demo, ai-ml, synthetic data, faker, mimesis, gdal, generator, data fabric, data family]`

**Required sections:**
1. `# gsd-synthetic-data-engineer` heading + role paragraph (4 data families, full implementation scope)
2. `## When you run` — demo prep when real data is unavailable; pre-ATO testing; model eval with classification-appropriate inputs; Phase 4 `gsd-demo-scripter` spawns this agent when SDE is available
3. `## Inputs you accept` — real-data schema description or sample (path or paste), target distribution constraints (count, date range, entity types, geographic bounds as applicable), demo scenario description, target data family (tabular / geospatial / text-document / sensor-signal)
4. `## What you produce` — output directory: `.planning/synthetic-data/{name}/` containing:
   - `README.md` — dataset description, generation parameters, schema, distribution choices, fidelity tradeoff notes
   - Data files (format per family — see How you do the work)
   - Generator script(s) — Edit tool to write runnable script that reproduced the dataset
   - `CLASSIFICATION.md` sidecar declaring classification of all outputs
5. `## How you do the work` — branch on data family:
   - **Tabular/structured** — Faker (Python) or Mimesis for entity records, transactions, timeseries; produce CSV/JSON/Parquet; generator script is a Python file using the library; schema-fidelity: match column names, types, null rates, value distributions to the real-data schema description
   - **Geospatial** — GDAL for synthetic GeoTIFF/GeoJSON/KML; for NITF-shaped imagery: describe the NITF structure + use placeholder pixel data (no real imagery); for synthetic FMV: generate metadata-only frames with placeholder media; generator script is bash + GDAL commands
   - **Text/document corpus** — synthetic IIRs (Intelligence Information Reports): template-filled with synthetic entities, dates, locations; synthetic OSINT articles: paragraph-level faker content seeded with domain vocabulary; synthetic chat/document collections: message-thread generator. Generator script is Python with Faker + domain-specific vocabulary list
   - **Sensor/signal** — IQ data (generate synthetic I/Q sample arrays in sigmf format), acoustic (generate WAV with synthetic noise + injected tones), phenomenology (synthetic sensor readings in JSON timeseries). Generator script uses numpy/scipy if available; otherwise describes the generation math and produces a CSV of computed values
6. `## Constraints` — UNCLASSIFIED default for all outputs; never ingest real classified data; never use real PII (names, SSNs, addresses — use synthetic equivalents); document the schema-distribution-fidelity tradeoff explicitly in the README (synthetic data never perfectly matches real distributions — customers must know this); flag if user provides a schema that appears to contain real data
7. `## Completion marker` — emit `## SYNTHETIC DATA READY` on success
8. Trailing self-emit `## SYNTHETIC DATA READY` heading

**Length target:** 180-220 lines. Pattern reference: `agents/gsd-domex-engineer.md` (Plan 3 — Edit-tool implementation pattern; multi-step write + generator script pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 382, `agents/gsd-domex-engineer.md` as pattern reference (Edit tool + generator code + multi-step produce pattern), the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## SYNTHETIC DATA READY$" /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md
grep "Edit" /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md | head -2
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md
```

Expected: marker present; tools line includes Edit; ic_pack: true present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-synthetic-data-engineer.md
git commit -m "[N] feat(agents): gsd-synthetic-data-engineer — Phase 5 4-family synthetic data generator"
```

---

## Task 5: gsd-intel-devops agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-intel-devops.md`

Family N agent #55. Partition-aware IaC, STIG-hardened images, air-gap-promotable build patterns. **Has Edit tool**. Covers 4 AWS service catalogs in scaffold form with commercial → IL4/5 → IC-partition translation notes per locked decision.

**Spec source:** Line 383.

**Frontmatter:**
- `name: gsd-intel-devops`
- `description`: partition-aware IaC, STIG-hardened images, air-gap-promotable build patterns; 4 AWS service catalogs (compute/container, data services, AI/ML services, networking/security) with commercial → IL4/5 → IC-partition translation notes
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Edit, Bash, Grep, Glob]`
- `applies_when: [classification, ecosystem, aws, iac, terraform, cloudformation, devops, partition, ci/cd, hardening, ato]`

**Required sections:**
1. `# gsd-intel-devops` heading + role paragraph (AWS-first; 4 service catalogs; partition-aware from day one; IaC output in `.planning/iac/`)
2. `## When you run` — during cloud architecture design; transition planning; IaC scaffolding; ATO documentation prep; when gsd-stig-auditor needs configs to audit
3. `## Inputs you accept` — target deployment environment (Commercial / GovCloud / IL4/5 / IC-partition — read from `.planning/intel-context.md` `target_partition` if set); system architecture description; list of services required; transition target from `gsd-transition-advisor` output (Phase 6 forward reference — reads `.planning/TRANSITION-READINESS.md` if present)
4. `## What you produce` — output directory: `.planning/iac/` containing per-catalog IaC scaffolds:
   - `compute/` — ECS/EKS/Lambda/Fargate Terraform modules with partition-translation notes
   - `data/` — S3/RDS/DynamoDB/OpenSearch configs with KMS variations per partition
   - `ai-ml/` — Bedrock/SageMaker/Comprehend/Textract scaffold (includes notes where services don't exist in IC partitions)
   - `networking/` — VPC/Transit Gateway/IAM Identity Center/GuardDuty/Security Hub with partition-aware IAM patterns
   - `ci-cd/` — pipeline configs (GitHub Actions for low-side; partition-appropriate equivalent for higher tiers)
   - `hardening/` — STIG baseline references, AMI hardening notes, container image scan hooks
   - `PARTITION-NOTES.md` — summary of commercial → IL4/5 → IC-partition translation decisions
5. `## How you do the work` — for each of the 4 service catalogs, produce a scaffold with:
   - **Compute/container** (ECS/EKS/Lambda/Fargate): Terraform module stubs; partition-translation note per service (EKS exists in GovCloud and most IC partitions; Lambda availability varies — document per target); STIG-hardened AMI reference (Red Hat or Amazon Linux 2 STIG); container image scan hook in CI
   - **Data services** (S3/RDS/DynamoDB/OpenSearch): KMS key strategy varies by partition (CMK required at IL4+; KMS not all key types available in IC partitions — document gaps); S3 bucket policy scaffold (block public access + require TLS + restrict principal to IAM Identity Center groups); RDS encryption + backup scaffold; OpenSearch access policy
   - **AI/ML services** (Bedrock/SageMaker/Comprehend/Textract): note explicitly for each service whether it exists in GovCloud / IL4/5 / IC partitions; where a commercial AI/ML service has no IC equivalent, document the recommended alternative (e.g., on-prem inference, open-weight model on SageMaker in GovCloud); scaffolds are commercial-only unless target_partition indicates GovCloud
   - **Networking/security** (VPC/Transit Gateway/IAM Identity Center/GuardDuty/Security Hub): VPC scaffold with private subnets only, flow logs enabled; Transit Gateway attachment pattern for multi-account; IAM Identity Center SSO scaffold (behavior changes in IC partitions — flag); GuardDuty + Security Hub enable-and-export Terraform; partition-translation note: at IC partitions, commercial SIEM integrations are unavailable — document alternatives
   - For each catalog: read `intel-refs/classification/aws-partitions.md` to ground partition translation notes
6. `## Constraints` — UNCLASSIFIED default for all IaC outputs; partition-aware design from day one (not as an afterthought); document where commercial services do not exist in IC partitions and what the recommended alternative is; never include actual credentials, account IDs, ARNs in IaC scaffolds — use Terraform variables with documented `variable {}` blocks; no high-side details written to IaC files (operating environment is low-side — see §2.3)
7. `## Completion marker` — emit `## DEVOPS PLAN COMPLETE` on success
8. Trailing self-emit `## DEVOPS PLAN COMPLETE` heading

**Length target:** 220-280 lines (longest Phase 5 agent — 4-catalog scaffold). Pattern reference: `agents/gsd-domex-engineer.md` (Plan 3 — Edit tool + multi-step implementation); `agents/gsd-fusion-architect.md` (Plan 3 — multi-section scaffold pattern with structured subsections per catalog analog).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 383, `agents/gsd-domex-engineer.md` and `agents/gsd-fusion-architect.md` as pattern references, the section requirements above. Emphasize: 4-catalog branching is the core structure; each catalog item must include the partition-translation note; no literal markings.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## DEVOPS PLAN COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-intel-devops.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-intel-devops.md
grep "Edit" /Users/romansky/gsd-ic/agents/gsd-intel-devops.md | head -2
grep "aws-partitions" /Users/romansky/gsd-ic/agents/gsd-intel-devops.md | head -2
```

Expected: marker present; tools includes Edit; aws-partitions ref cross-reference present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-intel-devops.md
git commit -m "[N] feat(agents): gsd-intel-devops — Phase 5 partition-aware IaC (4 AWS service catalogs)"
```

---

## Task 6: gsd-stig-auditor agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-stig-auditor.md`

Family A agent — ships in Phase 5 per spec §13 line 1073 (depends on `gsd-intel-devops` producing IaC/container configs). **Audit-only** — no Edit tool. POA&M append behavior per Family A conventions (`skills/poam-conventions`).

**Spec source:** §13 line 1073 (placement rationale); §5 Family A behavior pattern (POA&M append).

**Frontmatter:**
- `name: gsd-stig-auditor`
- `description`: audits IaC and container configs against applicable STIGs (DISA STIG / SCAP profiles); produces structured findings in `.planning/STIG-AUDIT.md`; appends non-compliances to POA&M per skills/poam-conventions
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]` (no Edit — audit reads configs, writes findings only)
- `applies_when: [classification, tradecraft, stig, hardening, security configuration, ato, iac audit]`

**Required sections:**
1. `# gsd-stig-auditor` heading + role paragraph (Family A audit behavior; runs after gsd-intel-devops; appends to POA&M)
2. `## When you run` — after `gsd-intel-devops` produces IaC and container configs in `.planning/iac/`; pre-ATO milestone; when an AO requests a STIG-compliance posture report
3. `## Inputs you accept` — IaC files and Dockerfiles from `.planning/iac/` (or user-supplied path); Kubernetes manifests / container configs if present; OS hardening configs (AMI build scripts, cloud-init); `intel-refs/classification/aws-partitions.md` for partition-appropriate STIG profile selection; `.planning/intel-context.md` for AO identity and classification ceiling
4. `## What you produce` — `.planning/STIG-AUDIT.md` with structure:
   - Frontmatter (classification, generated, target_partition, applicable_stigs)
   - Audit Summary table (STIG profile, total rules checked, findings by severity — High/Medium/Low, open items vs. resolved)
   - Findings by STIG profile (one subsection per profile applied)
   - POA&M entries (duplicated here for human review; authoritative copy appended to `.planning/POA&M.md`)
5. `## How you do the work`:
   - Identify applicable STIGs by deployment target: RHEL STIG for EC2/AMI, Docker Enterprise STIG for container images, AWS RDS STIG for database services, Kubernetes STIG for EKS workloads, AWS Foundations benchmark for account-level controls
   - For each applicable STIG: read the relevant IaC / config files; check each rule against the config; classify finding as: Compliant / Not Compliant / Not Applicable / Insufficient Evidence
   - Produce structured findings with: STIG ID, rule title, finding severity (CAT I = High, CAT II = Medium, CAT III = Low), current state, required state, remediation recommendation
   - Append non-compliant findings to `.planning/POA&M.md` per `skills/poam-conventions` (agent prefix: `stig`; control-id format: `stig-<profile>-<ruleid>`; severity rubric: CAT I → High, CAT II → Medium, CAT III → Low)
6. `## Constraints` — UNCLASSIFIED default; append to POA&M idempotently (re-running on the same IaC produces the same entries, not duplicates); flag dependency on `gsd-intel-devops` output — if `.planning/iac/` does not exist, emit `## STIG AUDIT GAPS FOUND` with a note that the audit cannot proceed without IaC inputs; scope this agent to the configs it can read (do not infer compliance of configs not provided)
7. `## Completion marker` — emit `## STIG AUDIT COMPLETE` (full audit completed with findings); `## STIG AUDIT GAPS FOUND` (IaC inputs missing or insufficient to complete audit)
8. Trailing self-emit `## STIG AUDIT COMPLETE` heading

**Length target:** 130-170 lines. Pattern reference: `agents/gsd-cmmc-auditor.md` or `agents/gsd-fips-140-3-validator.md` (Plan 2 — Family A pattern: audit reads + structured findings + POA&M append per poam-conventions skill).

**POA&M agent-prefix convention (for the implementer):** When appending to `.planning/POA&M.md`, use agent-prefix `stig`, control-id format `stig-<profile>-<ruleid>` (e.g., `stig-rhel8-V-230244`, `stig-docker-V-219999`, `stig-aws-rds-V-113059`), severity mapped from DISA CAT level: CAT I → High, CAT II → Medium, CAT III → Low. This mirrors how `gsd-cmmc-auditor` prefixes entries `cmmc-<domain>-<practice>` — same skill, same structural pattern, different prefix and control vocabulary.

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, §13 line 1073 placement rationale, `agents/gsd-cmmc-auditor.md` as pattern reference (Family A POA&M append pattern), the section requirements above including the POA&M prefix convention.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## STIG AUDIT (COMPLETE|GAPS FOUND)$" /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md
grep "POA" /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md | head -3
grep "poam-conventions" /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md | head -2
```

Expected: both markers present; tools does NOT include Edit; POA&M references present; poam-conventions reference present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-stig-auditor.md
git commit -m "[N] feat(agents): gsd-stig-auditor — Phase 5 IaC/container STIG audit (Family A, POA&M append)"
```

---

## Task 7: gsd-ci-analyst agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-ci-analyst.md`

Family L agent #49. On-demand (always-on parallel wiring deferred to Phase 7). Counterintelligence framing for the current phase.

**Spec source:** Line 367.

**Frontmatter:**
- `name: gsd-ci-analyst`
- `description`: counterintelligence framing — foreign-collection-target analysis, deception detection, foreign D&D considerations; on-demand until Phase 7 always-on wiring
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]` (no AskUserQuestion, no Edit — analytic framing only)
- `applies_when: [tradecraft, capability-patterns, ci, counterintelligence, foreign collection, deception, foreign d&d, threat actor]`

**Required sections:**
1. `# gsd-ci-analyst` heading + role paragraph (CI framing; note that always-on parallel wiring is a Phase 7 deliverable)
2. `## When you run` — on-demand: when an engineer requests CI framing for the current phase; in Phase 7+, this agent fires in parallel on every analytic phase automatically. Note: "always-on parallel wiring is a Phase 7 deliverable; this agent runs on-demand until then."
3. `## Inputs you accept` — phase scope (`.planning/phases/{phase}/` directory contents), customer context (`.planning/intel-context.md`), threat-actor references (user-supplied or from `intel-refs/tradecraft/`), prior CI analyses if any
4. `## What you produce` — `.planning/phases/{phase}/{phase}-CI-ANALYSIS.md` with:
   - Frontmatter (classification, phase, generated)
   - Foreign Collection Priority Assessment: what aspects of the program capability, architecture, or data are likely foreign collection targets; why
   - Deception Risks: where deception by a foreign actor could affect the program's analysis or data; detection indicators
   - Foreign D&D Considerations: denial and deception patterns relevant to the program's mission domain; how to design collection/analysis with D&D awareness
   - CI-Aware Design Recommendations: specific design adjustments the team should consider (e.g., data provenance tagging, source diversity requirements, anomaly detection on training data)
5. `## Constraints` — UNCLASSIFIED default; analysis is based on open-source tradecraft doctrine only — no classified CI sources; flag if user provides information that appears to be classified; CI framing is advisory — humans apply judgment on operational CI decisions
6. `## Completion marker` — emit `## CI ANALYSIS COMPLETE`
7. Trailing self-emit `## CI ANALYSIS COMPLETE` heading

**Length target:** 100-130 lines. Pattern reference: `agents/gsd-mission-gap-analyst.md` (Plan 3 — phase-scoped analytic agent that reads context and produces a structured `.planning/` artifact).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 367, `agents/gsd-mission-gap-analyst.md` as pattern reference (phase-scoped analytic agent pattern), the section requirements above. Emphasize: the "Phase 7 wiring" note must appear explicitly in the "When you run" section.

- [ ] **Step 2: Verify**

```bash
grep -E "^## CI ANALYSIS COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-ci-analyst.md
grep "Phase 7" /Users/romansky/gsd-ic/agents/gsd-ci-analyst.md | head -2
grep "^tools:" /Users/romansky/gsd-ic/agents/gsd-ci-analyst.md
```

Expected: marker present; Phase 7 reference present; tools does not include Edit or AskUserQuestion.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-ci-analyst.md
git commit -m "[N] feat(agents): gsd-ci-analyst — Phase 5 on-demand CI framing (Family L, Phase 7 wiring deferred)"
```

---

## Task 8: gsd-targeting-analyst agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md`

Family L agent #50. On-demand. Targeting-analysis framing — find/fix/finish support tools, evidence standards.

**Spec source:** Line 368.

**Frontmatter:**
- `name: gsd-targeting-analyst`
- `description`: targeting-analysis framing — find/fix/finish support tools, evidence standards for IC prototype capabilities; on-demand until Phase 7 always-on wiring
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [tradecraft, capability-patterns, targeting, find fix finish, targeting analyst, evidence standards]`

**Required sections:**
1. Role paragraph (targeting-analysis framing; always-on wiring Phase 7; on-demand until then)
2. `## When you run` — on-demand; note Phase 7 wiring deferred
3. `## Inputs you accept` — phase scope (`.planning/phases/{phase}/` directory contents); mission-domain context from `.planning/intel-context.md`; capability design docs; any existing targeting requirements (user-supplied)
4. `## What you produce` — `.planning/phases/{phase}/{phase}-TARGETING-ANALYSIS.md` with:
   - Frontmatter (classification, phase, generated)
   - Find/Fix/Finish Applicability: which F3 components the program capability supports or enables; what sensor/source data is needed per stage
   - Evidence Standards: evidentiary requirements the prototype must meet to support a targeting decision; documentation requirements for chain-of-custody
   - Tooling Gaps: what existing F3 tools the prototype should interface with (or replace); integration notes
   - Design Recommendations: specific design choices that make the prototype more targeting-usable (e.g., audit-log format, confidence annotation, geolocation precision)
5. `## Constraints` — UNCLASSIFIED default; targeting framing is advisory — operational targeting decisions require cleared human judgment; do not recommend specific engagement actions
6. `## Completion marker` — `## TARGETING ANALYSIS COMPLETE`
7. Trailing self-emit `## TARGETING ANALYSIS COMPLETE` heading

**Length target:** 100-130 lines. Pattern reference: `agents/gsd-mission-gap-analyst.md` (Plan 3 — same phase-scoped analytic agent pattern as T7).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 368, `agents/gsd-mission-gap-analyst.md` as pattern reference (phase-scoped analytic agent pattern), the section requirements above. Emphasize: "Phase 7 wiring" note must appear in the "When you run" section; content is real analytic guidance (not stubs — write substantive F3 and evidence-standards content).

- [ ] **Step 2: Verify**

```bash
grep -E "^## TARGETING ANALYSIS COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md
grep "Phase 7" /Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md | head -2
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md
```

Expected: marker present; Phase 7 reference present; ic_pack: true present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-targeting-analyst.md
git commit -m "[N] feat(agents): gsd-targeting-analyst — Phase 5 on-demand targeting framing (Family L)"
```

---

## Task 9: gsd-insider-threat-analyst agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md`

Family L agent #51. On-demand. Insider-threat analytic patterns — anomaly behavior detection, indicator correlation, ITP requirements.

**Spec source:** Line 369.

**Frontmatter:**
- `name: gsd-insider-threat-analyst`
- `description`: insider-threat analytic patterns — anomaly behavior detection, indicator correlation, ITP requirements for IC program; on-demand until Phase 7 always-on wiring
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [tradecraft, capability-patterns, insider threat, itp, anomaly behavior, indicator correlation]`

**Required sections:**
1. Role paragraph (ITP analytic framing; always-on wiring Phase 7; on-demand until then)
2. `## When you run` — on-demand; note Phase 7 wiring deferred
3. `## Inputs you accept` — phase scope; ITP requirements (user-supplied or inferred from `intel-refs/tradecraft/`); program architecture docs; user-activity monitoring scope
4. `## What you produce` — `.planning/phases/{phase}/{phase}-INSIDER-THREAT.md` with:
   - Frontmatter (classification, phase, generated)
   - ITP Applicability: which ITP requirements apply to the program capability based on mission domain and data access patterns
   - Anomaly Behavior Indicators: behavioral indicators relevant to this program's data and user patterns; how the prototype could support detection
   - Indicator Correlation Patterns: multi-indicator patterns that elevate confidence in a finding; how to avoid false positives in a mission-critical environment
   - Audit-Log Design Recommendations: what user-activity data the prototype should capture to support ITP; log format and retention requirements
   - Design Recommendations: specific capability-design choices that support ITP requirements without compromising analyst productivity
5. `## Constraints` — UNCLASSIFIED default; ITP analysis is advisory — operational ITP decisions require cleared human judgment and legal authorization; do not identify specific individuals
6. `## Completion marker` — `## INSIDER THREAT ANALYSIS COMPLETE`
7. Trailing self-emit `## INSIDER THREAT ANALYSIS COMPLETE` heading

**Length target:** 100-130 lines. Pattern reference: `agents/gsd-mission-gap-analyst.md` (Plan 3 — same phase-scoped analytic agent pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 369, `agents/gsd-mission-gap-analyst.md` as pattern reference (same phase-scoped analytic agent pattern as T7 and T8), the section requirements above. Emphasize: "Phase 7 wiring" note must appear; ITP content is real analytic guidance with substantive anomaly-behavior and indicator-correlation sections.

- [ ] **Step 2: Verify**

```bash
grep -E "^## INSIDER THREAT ANALYSIS COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md
grep "Phase 7" /Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md | head -2
grep "ic_pack: true" /Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md
```

Expected: marker present; Phase 7 reference present; ic_pack: true present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-insider-threat-analyst.md
git commit -m "[N] feat(agents): gsd-insider-threat-analyst — Phase 5 on-demand ITP framing (Family L)"
```

---

## Task 10: gsd-adversary-modeler agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md`

Family L agent #52. On-demand. Structured adversary modeling — ATT&CK/D3FEND/kill chains, OB decomposition. `applies_when` includes `ai-ml` because adversary models inform AI/ML eval design (cross-reference to `intel-refs/ai-ml/eval-patterns.md`).

**Spec source:** Line 370.

**Frontmatter:**
- `name: gsd-adversary-modeler`
- `description`: structured adversary modeling — ATT&CK/D3FEND/kill chains, OB decomposition; informs AI/ML eval design (adversarial robustness); on-demand until Phase 7 always-on wiring
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [capability-patterns, ai-ml, adversary, att&ck, d3fend, kill chain, ob decomposition, adversary modeling]`

**Required sections:**
1. Role paragraph (adversary modeling; ATT&CK/D3FEND/kill chain frameworks; OB decomposition; informs AI/ML eval adversarial robustness; always-on wiring Phase 7; on-demand until then)
2. `## When you run` — on-demand; note Phase 7 wiring deferred; explicitly note that adversary models produced here feed the adversarial-robustness eval category in `intel-refs/ai-ml/eval-patterns.md`
3. `## Inputs you accept` — phase scope; target adversary description (user-supplied or inferred from mission domain); system architecture (what the adversary is targeting); threat intelligence references from `intel-refs/tradecraft/`
4. `## What you produce` — `.planning/phases/{phase}/{phase}-ADVERSARY-MODEL.md` with:
   - Frontmatter (classification, phase, generated, adversary_profile)
   - Adversary Profile: who/what the modeled adversary is (state actor / non-state / insider / automated system); motivation; capability level
   - Kill Chain / ATT&CK Mapping: relevant MITRE ATT&CK techniques mapped to the mission domain; which techniques the prototype capability addresses or surfaces
   - D3FEND Countermeasure Mapping: defensive techniques from MITRE D3FEND that the prototype should implement or support
   - OB Decomposition: Order-of-Battle decomposition of the adversary's relevant capabilities, infrastructure, or organizational structure as applicable to the mission domain
   - AI/ML Adversarial Robustness Implications: based on this adversary model, what adversarial inputs or distribution shifts should the AI/ML eval test? Cross-reference `intel-refs/ai-ml/eval-patterns.md` adversarial robustness category
   - Design Recommendations: specific capability-design choices to harden against the modeled adversary
5. `## Constraints` — UNCLASSIFIED default; adversary modeling is based on open-source MITRE ATT&CK/D3FEND frameworks and publicly available threat-intel doctrine; no classified adversary details; do not include specific TTPs that could constitute OPSEC violations; adversary models are planning tools — operational adversary attribution requires cleared human judgment
6. `## Completion marker` — `## ADVERSARY MODEL COMPLETE`
7. Trailing self-emit `## ADVERSARY MODEL COMPLETE` heading

**Length target:** 110-140 lines. Pattern reference: `agents/gsd-mission-gap-analyst.md` (Plan 3 — phase-scoped analytic agent pattern); `agents/gsd-capability-gap-analyst.md` (Plan 3 — cross-reference pattern to other planning artifacts).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 370, `agents/gsd-mission-gap-analyst.md` and `agents/gsd-capability-gap-analyst.md` as pattern references, the section requirements above. Emphasize: the ai-ml/eval-patterns.md cross-reference in the AI/ML Adversarial Robustness Implications section must be present; "Phase 7 wiring" note must appear.

- [ ] **Step 2: Verify**

```bash
grep -E "^## ADVERSARY MODEL COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md
grep "Phase 7" /Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md | head -2
grep "eval-patterns" /Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md | head -2
```

Expected: marker present; Phase 7 reference present; eval-patterns cross-reference present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-adversary-modeler.md
git commit -m "[N] feat(agents): gsd-adversary-modeler — Phase 5 structured adversary modeling + AI eval cross-ref (Family L)"
```

---

## Task 11: Update agent-contracts.ic-pack.md with 7 rows

**Files:**
- Modify: `/Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md`

Append 7 new rows after the last Phase 4 row (`gsd-past-performance-manager`).

- [ ] **Step 1: Append 7 rows**

Edit tool, `references/agent-contracts.ic-pack.md`. Locate the line:

```
| gsd-past-performance-manager | ## PP UPDATE COMPLETE | ## PP UPDATE BLOCKED | `.planning/past-performance/PP-LOG.md` + `.planning/past-performance/CITATIONS.md` |
```

Append the following 7 rows immediately after it:

```
| gsd-synthetic-data-engineer | ## SYNTHETIC DATA READY | (none) | `.planning/synthetic-data/{name}/` (datasets + generator scripts) |
| gsd-intel-devops | ## DEVOPS PLAN COMPLETE | (none) | `.planning/iac/` (IaC files + CI/CD configs + hardening guidance + partition-translation notes) |
| gsd-stig-auditor | ## STIG AUDIT COMPLETE | ## STIG AUDIT GAPS FOUND | `.planning/STIG-AUDIT.md` |
| gsd-ci-analyst | ## CI ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-CI-ANALYSIS.md` |
| gsd-targeting-analyst | ## TARGETING ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-TARGETING-ANALYSIS.md` |
| gsd-insider-threat-analyst | ## INSIDER THREAT ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-INSIDER-THREAT.md` |
| gsd-adversary-modeler | ## ADVERSARY MODEL COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ADVERSARY-MODEL.md` |
```

- [ ] **Step 2: Verify row count**

```bash
grep -c "## SYNTHETIC DATA READY\|## DEVOPS PLAN COMPLETE\|## STIG AUDIT COMPLETE\|## CI ANALYSIS COMPLETE\|## TARGETING ANALYSIS COMPLETE\|## INSIDER THREAT ANALYSIS COMPLETE\|## ADVERSARY MODEL COMPLETE" /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `7`.

- [ ] **Step 3: Run completion-marker validator**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh
```

Expected: `[validate-completion-markers] OK`.

- [ ] **Step 4: Commit**

```bash
cd /Users/romansky/gsd-ic
git add references/agent-contracts.ic-pack.md
git commit -m "[U] docs(contracts): register 7 Phase 5 agent completion markers"
```

---

## Task 12: Update package.json files field with 7 agent paths

**Files:**
- Modify: `/Users/romansky/gsd-ic/package.json`

Adds 7 explicit per-file entries to the `files` array. The 2 new ref docs are covered by the existing `intel-refs/` glob in package.json. Only the 7 new agents need explicit entries.

- [ ] **Step 1: Add 7 entries**

Edit tool, `package.json`. Locate the line:

```
    "agents/gsd-past-performance-manager.md",
```

Append the following 7 lines immediately after it:

```json
    "agents/gsd-synthetic-data-engineer.md",
    "agents/gsd-intel-devops.md",
    "agents/gsd-stig-auditor.md",
    "agents/gsd-ci-analyst.md",
    "agents/gsd-targeting-analyst.md",
    "agents/gsd-insider-threat-analyst.md",
    "agents/gsd-adversary-modeler.md",
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "require('/Users/romansky/gsd-ic/package.json'); console.log('JSON valid')"
```

Expected: `JSON valid`.

- [ ] **Step 3: Verify 7 new entries are present**

```bash
node -e "const pkg = require('/Users/romansky/gsd-ic/package.json'); const phase5 = pkg.files.filter(f => f.match(/gsd-(synthetic-data-engineer|intel-devops|stig-auditor|ci-analyst|targeting-analyst|insider-threat-analyst|adversary-modeler)/)); console.log(phase5)"
```

Expected: array of 7 paths, one per Phase 5 agent.

- [ ] **Step 4: Commit**

```bash
cd /Users/romansky/gsd-ic
git add package.json
git commit -m "[U] chore(package): add 7 Phase 5 agent paths to files allowlist"
```

---

## Task 13: Bottom-to-top smoke

**Files:** None (read-only validation).

Bottom-to-top smoke verifying all Phase 5 deliverables before push/PR/merge (handled by the human controller, not by an implementer subagent).

- [ ] **Step 1: All IC pack validators**

```bash
cd /Users/romansky/gsd-ic && bash tools/ci/_run-all.sh
```

Expected: `[ci] all validators passed`.

- [ ] **Step 2: 7 new agent files exist**

```bash
for f in \
  agents/gsd-synthetic-data-engineer.md \
  agents/gsd-intel-devops.md \
  agents/gsd-stig-auditor.md \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  [ -f "/Users/romansky/gsd-ic/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

Expected: 7 `OK:` lines.

- [ ] **Step 3: 2 new ref docs exist**

```bash
for f in \
  intel-refs/ai-ml/eval-patterns.md \
  intel-refs/classification/aws-partitions.md; do
  [ -f "/Users/romansky/gsd-ic/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

Expected: 2 `OK:` lines.

- [ ] **Step 4: MANIFEST topic count = 29**

```bash
jq '.topics | keys | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
```

Expected: `29`.

- [ ] **Step 5: 7 Phase 5 markers in registry**

```bash
grep -c "## SYNTHETIC DATA READY\|## DEVOPS PLAN COMPLETE\|## STIG AUDIT COMPLETE\|## CI ANALYSIS COMPLETE\|## TARGETING ANALYSIS COMPLETE\|## INSIDER THREAT ANALYSIS COMPLETE\|## ADVERSARY MODEL COMPLETE" /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `7`.

- [ ] **Step 6: 7 Phase 5 paths in package.json**

```bash
node -e "const pkg = require('/Users/romansky/gsd-ic/package.json'); const phase5 = pkg.files.filter(f => f.match(/gsd-(synthetic-data-engineer|intel-devops|stig-auditor|ci-analyst|targeting-analyst|insider-threat-analyst|adversary-modeler)/)); console.log(phase5.length)"
```

Expected: `7`.

- [ ] **Step 7: AskUserQuestion — zero in any Phase 5 agent**

```bash
for f in \
  agents/gsd-synthetic-data-engineer.md \
  agents/gsd-intel-devops.md \
  agents/gsd-stig-auditor.md \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  count=$(grep -c "AskUserQuestion" "/Users/romansky/gsd-ic/$f" 2>/dev/null || echo 0)
  echo "$f: $count"
done
```

Expected: all counts = 0. No Phase 5 agent uses AskUserQuestion.

- [ ] **Step 8: Edit tool only in SDE + intel-devops (2 agents); zero in the other 5**

```bash
for f in \
  agents/gsd-synthetic-data-engineer.md \
  agents/gsd-intel-devops.md \
  agents/gsd-stig-auditor.md \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  has_edit=$(grep "^tools:" "/Users/romansky/gsd-ic/$f" | grep -c "Edit" || echo 0)
  echo "$f: Edit=$has_edit"
done
```

Expected: `gsd-synthetic-data-engineer.md: Edit=1`; `gsd-intel-devops.md: Edit=1`; all others `Edit=0`.

- [ ] **Step 9: POA&M append references — only stig-auditor**

```bash
for f in \
  agents/gsd-synthetic-data-engineer.md \
  agents/gsd-intel-devops.md \
  agents/gsd-stig-auditor.md \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  has_poam=$(grep -c "POA" "/Users/romansky/gsd-ic/$f" 2>/dev/null || echo 0)
  echo "$f: POA&M_refs=$has_poam"
done
```

Expected: `gsd-stig-auditor.md` has count > 0; all others = 0.

Also verify poam-conventions reference in stig-auditor:

```bash
grep "poam-conventions" /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md
```

Expected: at least one match.

- [ ] **Step 10: install-side tests**

```bash
cd /Users/romansky/gsd-ic && npm run test:install
```

Expected: all tests pass; 0 fail.

- [ ] **Step 11: npm pack scope — 9 artifacts in pack (7 agents + 2 refs via intel-refs/ glob)**

```bash
cd /Users/romansky/gsd-ic && npm pack --dry-run 2>&1 | grep "npm notice " | grep -E "agents/gsd-(synthetic-data-engineer|intel-devops|stig-auditor|ci-analyst|targeting-analyst|insider-threat-analyst|adversary-modeler)" | wc -l
```

Expected: `7`.

```bash
cd /Users/romansky/gsd-ic && npm pack --dry-run 2>&1 | grep "npm notice " | grep -E "intel-refs/(ai-ml/eval-patterns|classification/aws-partitions)\.md" | wc -l
```

Expected: `2`.

- [ ] **Step 12: Placeholder scan**

```bash
grep -nE "(TBD|TODO|implement later|fill in)" \
  /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md \
  /Users/romansky/gsd-ic/agents/gsd-intel-devops.md \
  /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md \
  /Users/romansky/gsd-ic/agents/gsd-ci-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md \
  /Users/romansky/gsd-ic/intel-refs/ai-ml/eval-patterns.md \
  /Users/romansky/gsd-ic/intel-refs/classification/aws-partitions.md 2>/dev/null | head -10
```

Expected: zero matches. Curly-brace `{name}`, `{phase}`, `{profile}`, `{ruleid}`, `{date}` patterns inside output-shape examples are intentional content.

- [ ] **Step 13: ic_pack frontmatter on all 7 agents**

```bash
for f in \
  agents/gsd-synthetic-data-engineer.md \
  agents/gsd-intel-devops.md \
  agents/gsd-stig-auditor.md \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  grep -q "ic_pack: true" "/Users/romansky/gsd-ic/$f" && echo "OK: $f" || echo "MISSING ic_pack: $f"
done
```

Expected: 7 `OK:` lines.

- [ ] **Step 14: Family L always-on note — each of the 4 Family L agents mentions "Phase 7 wiring"**

```bash
for f in \
  agents/gsd-ci-analyst.md \
  agents/gsd-targeting-analyst.md \
  agents/gsd-insider-threat-analyst.md \
  agents/gsd-adversary-modeler.md; do
  count=$(grep -c "Phase 7" "/Users/romansky/gsd-ic/$f" 2>/dev/null || echo 0)
  echo "$f: Phase-7-refs=$count"
done
```

Expected: all 4 files have count > 0.

- [ ] **Step 15: No literal classification markings in any Phase 5 file (smoke against validated-no-classified-leak)**

```bash
grep -nE "(TS//|S//|SI//|TK//|HCS//|KDK//|G//|TOP SECRET|SECRET)" \
  /Users/romansky/gsd-ic/agents/gsd-synthetic-data-engineer.md \
  /Users/romansky/gsd-ic/agents/gsd-intel-devops.md \
  /Users/romansky/gsd-ic/agents/gsd-stig-auditor.md \
  /Users/romansky/gsd-ic/agents/gsd-ci-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-targeting-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-insider-threat-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-adversary-modeler.md \
  /Users/romansky/gsd-ic/intel-refs/ai-ml/eval-patterns.md \
  /Users/romansky/gsd-ic/intel-refs/classification/aws-partitions.md 2>/dev/null | head -10
```

Expected: zero matches. This catches the class of error that would fail `validate-no-classified-leak.sh` on CI.

---

## Self-Review (run before announcing completion)

### 1. Spec coverage

| Item from spec §13 Phase 5 (line 1073) | Plan 6 task | Notes |
|---|---|---|
| `gsd-synthetic-data-engineer` | T4 | Family N #54, 4 data families, Edit tool |
| `gsd-intel-devops` | T5 | Family N #55, 4 AWS service catalogs, Edit tool |
| `gsd-stig-auditor` | T6 | Family A, ships Phase 5 per spec §13:1073 dependency note, POA&M append |
| `gsd-ci-analyst` | T7 | Family L #49, on-demand (Phase 7 always-on deferred) |
| `gsd-targeting-analyst` | T8 | Family L #50, on-demand |
| `gsd-insider-threat-analyst` | T9 | Family L #51, on-demand |
| `gsd-adversary-modeler` | T10 | Family L #52, on-demand, ai-ml cross-tag |

Additional plan deliverables (per locked decisions):
| Deliverable | Plan 6 task | Rationale |
|---|---|---|
| `ai-ml/eval-patterns.md` ref | T1 | Consumed by adversary-modeler + SDE this phase; forward-ref for Phase 7 ai-eval-auditor |
| `classification/aws-partitions.md` ref | T2 | Consumed by intel-devops partition-translation notes |
| 2 manifest entries | T3 | Each ref needs manifest indexing |
| 7 registry rows | T11 | Required for completion-marker validator |
| 7 package paths | T12 | Required for npm pack scope |
| Bottom-to-top smoke | T13 | Pre-push verification |

Agents deferred per spec: `gsd-ai-eval-auditor` (#56) and `gsd-fm-adaptation-engineer` (#57) — Phase 7 per spec §13 line 1075. `gsd-transition-advisor` (#58) — Phase 6 per spec §13 line 1074.

### 2. Completion marker validator compliance

Validator regex: `^##[[:space:]]+[A-Z][A-Z0-9 _&-]*[[:space:]]+(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)$`

| Agent | Marker | First char after `## ` | Terminal | Valid? |
|---|---|---|---|---|
| gsd-synthetic-data-engineer | `## SYNTHETIC DATA READY` | `S` | `READY`... wait — | **See note** |
| gsd-intel-devops | `## DEVOPS PLAN COMPLETE` | `D` | `COMPLETE` | Yes |
| gsd-stig-auditor | `## STIG AUDIT COMPLETE` | `S` | `COMPLETE` | Yes |
| gsd-stig-auditor | `## STIG AUDIT GAPS FOUND` | `S` | `FOUND` | Yes |
| gsd-ci-analyst | `## CI ANALYSIS COMPLETE` | `C` | `COMPLETE` | Yes |
| gsd-targeting-analyst | `## TARGETING ANALYSIS COMPLETE` | `T` | `COMPLETE` | Yes |
| gsd-insider-threat-analyst | `## INSIDER THREAT ANALYSIS COMPLETE` | `I` | `COMPLETE` | Yes |
| gsd-adversary-modeler | `## ADVERSARY MODEL COMPLETE` | `A` | `COMPLETE` | Yes |

**Note on `## SYNTHETIC DATA READY`:** The terminal `READY` does not appear in the standard alternation `(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)`. This marker is inherited from the spec (line 382 — `## SYNTHETIC DATA READY` is the spec-declared marker). The implementer must verify this marker passes the project's `validate-completion-markers.sh` before committing. If the validator rejects `READY`, coordinate with the controller to either: (a) update the validator's allowed terminals to include `READY`, or (b) update the spec-adjacent marker to `## SYNTHETIC DATA COMPLETE`. Do not change the marker without first checking the validator.

**Resolution:** Check the validator's allowed terminal list:

```bash
grep -E "(READY|COMPLETE|BLOCKED|FOUND|FAILED)" /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh | head -5
```

If `READY` is already in the alternation, proceed. If not, extend the validator in the same commit as the agent. Do not ship the agent with a marker that fails CI.

### 3. Type / API consistency

- All 7 agent files have `ic_pack: true` frontmatter — consistent with `isIcPackAgent()` helper.
- All 7 agents have `classification: UNCLASSIFIED` in frontmatter.
- No Phase 5 agent has `AskUserQuestion` in tools — consistent with the scope (no hybrid intake needed; engineering agents read schemas from disk; analytic agents read context from disk).
- Only `gsd-synthetic-data-engineer` and `gsd-intel-devops` have the `Edit` tool — consistent with Family N "full implementation scope" spec definition.
- `gsd-stig-auditor` does NOT have `Edit` — audit-read-only pattern consistent with other Family A agents (gsd-cmmc-auditor, gsd-fips-140-3-validator).
- Family L agents (T7-T10) have no `Edit` or `AskUserQuestion` — analytic-framing only.
- Only `gsd-stig-auditor` references POA&M append + `skills/poam-conventions` — consistent with "Family A only" rule.
- 2 ref docs have matching `applies_when` between their file frontmatter and their MANIFEST.json entry.
- Registry rows: 33 → 40 total (33 from Plans 0-5 + 7 new Phase 5 rows).
- Package files allowlist: 7 new agent paths (intel-refs/ glob already covers the 2 new refs).

### 4. Scope check

Plan 6 produces working software:
- `npm run ci` exits 0
- `npm pack --dry-run` includes all 7 agents + 2 refs (no upstream leak)
- `node bin/gsd-ic-install.js install --customer=nga --target=<dir>` lands all 7 agents + refs
- All install + hook tests pass
- Registry has 40 rows total (33 Phase 0-4 + 7 new Phase 5)
- MANIFEST has 29 topics (27 Phase 0-4 + 2 new Phase 5)
- No upstream agent/hook/skill/config file is modified
- Family L agents are on-demand only — no `intel-gates.json` changes in this plan
- gsd-stig-auditor is wired to consume `gsd-intel-devops` output path (`.planning/iac/`) — no circular dependency
- The `## SYNTHETIC DATA READY` marker must be confirmed valid by the completion-marker validator before T11 commit (see Self-Review §2 note)

### 5. Placeholder scan (plan-level)

```bash
grep -nE "(TBD|TODO|implement later|fill in)" /Users/romansky/gsd-ic/docs/plans/2026-05-13-phase-5-engineering-enablement.md | head
```

Expected: zero matches. Curly-brace template tokens and `{phase}` / `{name}` / `{ruleid}` / `{profile}` patterns are intentional content.

---

## Plan complete

Plan saved to `/Users/romansky/gsd-ic/docs/plans/2026-05-13-phase-5-engineering-enablement.md`.

**Execution model:**
- T1, T2 (ref scaffolds) — sonnet implementer per task (synthesizes ref content from spec + existing sibling ref as pattern); commits per-task
- T3 (manifest) — controller inline (mechanical JSON edit)
- T4-T10 (7 agents) — sonnet implementer per task (synthesizes from spec + named pattern reference agent); writes file only (no commit); controller commits each sequentially
- T11, T12 (registry, package.json) — controller inline (mechanical edits)
- T13 (smoke) — controller inline

**Push + PR + merge:** Handled by the controller (Claude Code) after all 12 task commits land — branch push, `gh pr create --repo adelphidata/gsd-ic --base main --title "Phase 5: Engineering Enablement + Mission Framings (7 agents, 2 refs)"`, monitor CI, squash-merge on green. PR description should call out the `## SYNTHETIC DATA READY` marker validator verification (Self-Review §2 note) as the one non-trivial CI gate to watch.

---

## Out-of-scope reminders for Plan 7+

These items are **not** in Plan 6 and belong to subsequent plans:

- `gsd-isso`, `gsd-issm`, all Family D ATO doc specialists (SSP-drafter, POA&M-tracker, SAR-dryrun, IV&V-dryrun, ConMon-planner, IRP-author, contingency-planner, evidence-packager), `gsd-cdrl-mapper`, `gsd-milestone-brief-generator`, `gsd-transition-advisor` (#58) — Phase 6 per spec §13 line 1074
- `gsd-icd-203-enforcer`, `gsd-techint-researcher`, `gsd-medint-researcher`, `gsd-techsigint-researcher`, `gsd-ai-eval-auditor` (#56), `gsd-fm-adaptation-engineer` (#57), Family L always-on `intel-gates.json` wiring — Phase 7 per spec §13 line 1075
- Always-on parallel activation for Family L (gsd-ci-analyst, gsd-targeting-analyst, gsd-insider-threat-analyst, gsd-adversary-modeler) — Phase 7 per spec §13 line 1075; agents shipped this phase run on-demand only
- `intel-gates.json` trigger entries for Family L automatic dispatch — Phase 7
- Customer overlay updates for gsd-synthetic-data-engineer and gsd-intel-devops — deferred to SME ref curation post Phase 5 merge
