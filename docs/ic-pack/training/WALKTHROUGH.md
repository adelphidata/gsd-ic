<!-- CLASSIFICATION: UNCLASSIFIED -->
# Walkthrough: 60-Minute IC Pack Framework Overview

This document is a self-guided session. Read straight through at a comfortable pace.

---

## Audience and prerequisites

**Audience:** Engineers, program leads, and SMEs new to the Adelphi IC Pack who want a
comprehensive mental model before touching real program work.

**Prerequisites:**
- Repo cloned locally.
- [QUICKSTART.md](../QUICKSTART.md) read at least once (or used as a companion).
- Node 22+ and `jq` installed (needed for the hands-on sessions, not this read-along).

---

## What you will know by the end

1. What the IC pack is and when to use (or not use) it.
2. The six layers of the IC pack architecture.
3. Which of the 15 agent families handles a given task.
4. How the three hooks fire and what the classification model enforces in v1.
5. How gates and the dispatcher protocol coordinate agent fan-out.
6. How to read a real agent file: lifecycle, inputs, outputs, completion marker.
7. Where to go for hands-on practice and deeper reference material.

---

## Agenda

| Block | Duration | Topic |
|-------|----------|-------|
| Block 1 | ≈5 min | What is the IC pack? |
| Block 2 | ≈10 min | The six-layer architecture |
| Block 3 | ≈10 min | Agent families — when to use which agent |
| Block 4 | ≈10 min | Hooks + the classification model |
| Block 5 | ≈10 min | Gates + the dispatcher protocol |
| Block 6 | ≈10 min | Live walkthrough — invoking `gsd-customer-context-mapper` |
| Block 7 | ≈5 min | Where to go next |
| **Total** | **60 min** | |

---

## Block 1 (≈5 min): What is the IC pack?

The IC pack is a soft-fork extension of GSD (Get Shit Done) that adds intelligence-community-tuned
capabilities on top of a standard GSD installation without altering any stock GSD behavior.

**v1 inventory:** 58 agents across 15 families, 5 customer overlays (`cia`, `dia`, `nga`, `nro`,
`nsa`), 5 behavioral skills, 3 deterministic hooks, 36 reference docs, and 12 CI validators.

**When to use:**
- Building IC-focused software prototypes that need rapid demo cadence plus contracting paperwork
  (capability statements, white papers, ATO drafts) alongside.
- Your program has at least one SME per primary INT discipline in scope.
- Your code is UNCLASSIFIED in this repo. CI enforces this; the pack does not handle classified
  content.

**When NOT to use:**
- Code that already lives on a classified system. The IC pack is for low-side prototyping only.
- Programs without SME staffing — reference docs decay without curators.
- Non-IC programs. Stock GSD is the right tool.

**The seamless-fork guarantee:** With every gate and hook disabled, an installed program behaves
bit-for-bit identically to a stock GSD program. The IC pack adds capabilities; it never silently
changes stock GSD behavior. Validated on every release by `tools/ci/validate-seamless-fork.sh`.
Install the IC pack, flip all gates to `enabled: false`, and nothing changes — then opt in
family by family.

Further reading: [README.md](../README.md), [ARCHITECTURE.md](../ARCHITECTURE.md).

---

## Block 2 (≈10 min): The six-layer architecture

The IC pack is organized into six discrete layers stacked from the lowest (hooks that fire on
every tool call) to the highest (per-program context that grounds every agent output).

```
Layer 5: Program project context     (.planning/intel-context.md)
Layer 4: Customer skill overlay      (one selected at install)
Layer 3: Skills (5 behavioral)       (skills/)
Layer 2: Manifest-indexed refs       (intel-refs/MANIFEST.json + intel-refs/**/*.md)
Layer 1: Thin agent files (58)       (agents/gsd-*.md)
Layer 0: Hooks (3, deterministic)    (hooks/gsd-*.js)
```

CI/validation gates every state change to any layer.

**Layer 0 — Hooks:** Three deterministic scripts that fire on every `Read`, `Write`, and `Bash`
tool call regardless of which agent is active. Zero LLM tokens per invocation. See Block 4.

**Layer 1 — Agents:** 58 IC-pack agent files (`agents/gsd-*.md`). Each carries YAML frontmatter
with `name`, `description`, `tools`, `applies_when`, `classification`, and `ic_pack: true` fields,
followed by an execution flow and a completion marker. Every agent covers a single responsibility.

**Layer 2 — Manifest-indexed reference docs:** `intel-refs/MANIFEST.json` indexes all 36 reference
docs across nine subdirectories inside `intel-refs/`. Agents load refs whose `applies_when` tags
intersect the active phase scope at runtime.

**Layer 3 — Behavioral skills:** Five skills in `skills/<name>/` provide cross-agent behavioral
guidance, applied at the skill-layer level rather than embedded per agent. A skill promotes to an
agent when it meets the §7.0 promotion rule (two or more of: multi-step reasoning required, own
context-window benefit, or produces a distinct artifact).

**Layer 4 — Customer skill overlay:** One of five customer overlays selected at install via
`--customer=`. Maps agents to customer-specific additional skills and may inject customer-specific
reference docs. Exactly one overlay is active per installed instance.

**Layer 5 — Per-program project context:** `.planning/intel-context.md` is per-program and is
NOT shipped in the pack — the engineer creates it after installation. Documents the AO, mission
statement, key contacts, transition target, and primary INT disciplines in scope. Every agent
reads this file at startup. Without it, agents produce generic, lower-utility outputs.

Further reading: [ARCHITECTURE.md](../ARCHITECTURE.md) — §Layered model.

---

## Block 3 (≈10 min): Agent families — when to use which agent

The 58 IC-pack agents are grouped into 15 families (A through O).

| Family | Name | Agents | What it handles |
|--------|------|--------|-----------------|
| A | Compliance Specialists | 8 | RMF control mapping, STIG audit, CMMC, ITAR screening, FIPS validation, SBOM generation, NIST 800-171 audit, DFARS incident response |
| B | Privacy | 1 | USPER/PII review under EO 12333/FISA/AG Guidelines + GDPR; PIA and PTA |
| C | Security Personas | 2 | ISSO synthesis of A+B+D outputs; ISSM risk determination and submission prep |
| D | ATO Documentation Specialists | 8 | SSP, POA&M, SAR dryrun, IV&V dryrun, ConMon plan, IRP, Contingency plan, Evidence packager |
| E | CDRL & Customer Artifacts | 4 | CDRL mapping, milestone briefs, after-action recording, TIM facilitation |
| F | Customer Engagement & Deliverables | 4 | Capability briefs, white papers, demo scripting, shared mission narrative blocks |
| G | Capture / BD | 4 | RFI analysis, capability statements, proposal drafting, past-performance management |
| H | Mission & Prototype Design | 4 | Mission gap analysis, customer context mapping, SoW decomposition, capability gap analysis |
| I | Per-INT Discipline Researchers | 10 | One researcher per INT: HUMINT, GEOINT, SIGINT, OSINT, MASINT, CYBINT, FININT, TECHINT, MEDINT, TECHSIGINT |
| J | All-Source Research & Tradecraft Compliance | 2 | Multi-INT fusion framing (all-source researcher); ICD 203 / WEP analytic-quality enforcement |
| K | Specialty Domain | 1 | DOMEX engineering — designs and implements NLP/OCR/forensic pipelines |
| L | Mission-Framing Analysts | 4 | Counterintelligence framing, targeting analysis, insider threat patterns, adversary modeling — always-on parallel |
| M | Architecture / Fusion | 1 | Multi-INT fusion architecture: entity resolution, temporal correlation, OBP-aligned object models |
| N | Engineering Enablement | 4 | Synthetic data, partition-aware IaC/DevOps, AI/ML eval design, foundation model adaptation |
| O | Transition | 1 | Prototype-to-PoR pre-flight: control inheritance, supportability gaps, partition portability |

**Three worked examples:**

*"I need to write a capability statement."* → **Family F** (`gsd-mission-narrative-writer` #27)
for narrative blocks, then **Family G** (`gsd-capability-statement-generator` #29) to build from
those blocks.

*"I need to do GEOINT research for this phase."* → **Family I** (`gsd-geoint-researcher` #37).
After it completes, `gsd-all-source-researcher` (**Family J**, #46) automatically wraps the output
with multi-INT framing even on single-INT phases.

*"I need an ATO POA&M."* → **Family D** (`gsd-poam-tracker` #13) — idempotent append-or-update
via `poam-conventions`, auto-fed by Family A compliance audits (when `poam_auto_create: true`) and
SAR/IV&V dryruns.

Further reading: [ARCHITECTURE.md](../ARCHITECTURE.md) — §What v1 ships.

---

## Block 4 (≈10 min): Hooks + the classification model

### The three IC-pack hooks

All three hooks live in `hooks/` and are deterministic — no LLM tokens, exit-code-driven, fire
on every `Read`, `Write`, and `Bash` tool call regardless of the active agent.

**`gsd-classification-banner.js`**
Injects the active classification banner on every agent output at runtime. In v1 the banner is
always `UNCLASSIFIED`. The banner format matches the `<!-- CLASSIFICATION: ... -->` comment
convention used at line 1 of every shipped markdown file.

**`gsd-classified-leak-detector.js`**
Scans every output against the pattern catalog at `hooks/patterns/classified-markings.json`
and halts execution if a classified pattern is detected — for example, if a user pastes
classified material into a prompt, the hook catches it before any agent output writes it to disk.

**`gsd-prompt-injection-scan-intel.js`**
Blocks prompt-injection patterns common in adversarial intelligence contexts: injection strings
embedded in documents the agent reads (e.g., a captured document containing manipulation
directives).

Hooks are compiled by `scripts/build-hooks.js` into `hooks/dist/` before installation.

### The classification model

v1 ships three levels in the schema: `UNCLASSIFIED`, `CUI`, and `CLASSIFIED`. **All v1 content
is `UNCLASSIFIED`.** CUI/classified handling is explicitly deferred (spec §16 open question O-05);
the infrastructure for separate storage, need-to-know gating, and marking propagation is not
present in v1.

Key properties:
- Every shipped markdown file carries a mandatory `classification:` frontmatter field.
- **Agents never determine classification on their own.** They honor the user-declared value from
  session context (spec §4.5). Classification is an input, not an inference.
- `tools/ci/validate-classification.sh` and `tools/ci/validate-no-classified-leak.sh` enforce
  correct frontmatter and absence of classified-marker patterns in all committed content.
- `hooks/patterns/classified-markings.json` is a security control; editing it requires CI approval.

Further reading: [ARCHITECTURE.md](../ARCHITECTURE.md) — §Classification model.

---

## Block 5 (≈10 min): Gates + the dispatcher protocol

### The intel-gates.json schema

`.planning/intel-gates.json` maps triggers to agent invocations. Full schema in
[intel-gates-schema.md](../intel-gates-schema.md).

Each gate entry carries:
- **`trigger`**: when the gate fires (e.g., `plan-phase.5-handle-research`).
- **`agent`** or **`agents`** array: the agent(s) to invoke. An `agents` array enables fan-out.
- **`enabled`**: boolean. Newly shipped gates default to `enabled: false` — opt-in is per-program.
  A new gate cannot silently change behavior until an engineer explicitly sets `enabled: true`.

### Trigger format

The conventional format is `<workflow>.<step>`. The vocabulary is open-ended; any string is
valid. `tools/ci/validate-triggers.sh` validates that each trigger resolves to a real step in a
known stock workflow (semantic resolution, not string-format enforcement), so renaming a workflow
step causes the validator to catch stale gate entries.

### Family L: the canonical fan-out pattern

Family L is the canonical fan-out example. The four agents — `gsd-ci-analyst`,
`gsd-targeting-analyst`, `gsd-insider-threat-analyst`, and `gsd-adversary-modeler` — all share
the trigger `plan-phase.5-handle-research`. All four ship `enabled: false` by default.

When a program opts in, the dispatcher fires that agent in parallel alongside the INT researchers.
The dispatcher concatenates results in order back to the caller (v1 merge strategy). The template
lives in `workflow-patches/intel-gates.template.json`.

Further reading: [intel-gates-schema.md](../intel-gates-schema.md).

---

## Block 6 (≈10 min): Live walkthrough — invoking `gsd-customer-context-mapper`

**This block is read-along only.** Do not execute commands here. For hands-on practice, see
[HANDS-ON-SCAFFOLD-A-PROTOTYPE.md](HANDS-ON-SCAFFOLD-A-PROTOTYPE.md).

### The agent at a glance

File: `agents/gsd-customer-context-mapper.md`

```yaml
name: gsd-customer-context-mapper
ic_pack: true
classification: UNCLASSIFIED
tools: [Read, Write, Bash, Grep, Glob]
applies_when: [ecosystem]
```

`applies_when: [ecosystem]` causes the agent to load ecosystem reference docs at startup —
specifically the IC-customer briefs for the five AOs (CIA, DIA, NGA, NRO, NSA).

### When it runs

1. **Kickoff (mandatory).** First invocation on a new program — no prior
   `.planning/intel-context.md` exists; the agent creates one.
2. **Plan-phase boundary (automatic).** At the start of each `plan-phase` workflow, the agent
   refreshes context and ingests pending AAR deltas from `gsd-after-action-recorder`.
3. **On-demand.** Engineers invoke it to update specific fields (e.g., the classification ceiling
   changed, or the transition target was named).

### Execution flow at kickoff

1. Read `PROJECT.md` (if it exists). Extract mission, scope, customer information.
2. Read the user-provided program description as the most authoritative input.
3. Read public AO information from the `applies_when: [ecosystem]` reference docs.
4. Compose `.planning/intel-context.md`. Where information is missing, write an explicit
   marker rather than inventing values.
5. Write the file with `last_updated` set to the current ISO-8601 timestamp.
6. Emit the completion marker as the final line of output.

### The output artifact

`.planning/intel-context.md` contains: Authorities & Operations (AO), Mission domain,
Classification posture, Technical scope summary, Transition target, Risks (mission-context only),
and Outstanding context gaps. A Change Log section is appended at plan-phase boundaries and grows
as AAR deltas are ingested.

### Completion markers

```
## CONTEXT MAPPING COMPLETE
```
Success path: file was written and mandatory fields are present.

```
## CONTEXT MAPPING BLOCKED
```
Failure path: followed by an explanation of what information was insufficient to produce the file.

### Key constraints

- The agent does NOT browse the web. It relies on user input, `PROJECT.md`, and the reference docs.
- The agent does NOT create or modify other `.planning/*` files. `intel-context.md` is its sole
  output.
- The agent does NOT invent metadata. Empty fields are recorded in the gaps section.
- If the user asks it to mark the file at a higher classification, it stops and requests written
  authorization, citing `skills/classification-conventions` Rule 3.

---

## Block 7 (≈5 min): Where to go next

**Hands-on practice:**

- [HANDS-ON-ADD-A-REFERENCE.md](HANDS-ON-ADD-A-REFERENCE.md) — 30 min: create a real (throwaway)
  reference doc, register it in the manifest, run validators, clean up. Start here if you will
  curate reference docs or onboard SME content.
- [HANDS-ON-SCAFFOLD-A-PROTOTYPE.md](HANDS-ON-SCAFFOLD-A-PROTOTYPE.md) — 30 min: set up a scratch
  program, install stock GSD then the IC pack, create `.planning/intel-context.md`, and invoke
  `gsd-customer-context-mapper`. Start here if you are beginning a new program.

**SMEs curating reference content:**
- [SME-CURATION-FRAMEWORK.md](../SME-CURATION-FRAMEWORK.md) — SME workflow, curation states,
  quality bars, and the per-INT review cycle.

**Agent authors:**
- [ADDING-AN-AGENT.md](../ADDING-AN-AGENT.md) — frontmatter requirements, completion-marker
  registration, CI expectations.

**Continued reference reading:**
- [README.md](../README.md) — pack overview, when-to-use, full documentation map.
- [ARCHITECTURE.md](../ARCHITECTURE.md) — full layered architecture, CI surface table, and
  what is deliberately not in v1.
- [QUICKSTART.md](../QUICKSTART.md) — install to first agent invocation in 30 minutes.

---

## Checkpoint quiz (self-graded)

Answer each question from memory before checking the answer key.

**Question 1:** Name the six layers of the IC pack architecture in order from Layer 0 to
Layer 5. Include the path or location hint for each.

**Question 2:** Which family covers ATO documentation specialists (SSP, POA&M, SAR/IV&V dryruns,
ConMon plan, IRP, Contingency plan, Evidence packager)? Give the family letter and name.

**Question 3:** Where does the classified-leak detector's pattern catalog live? Give the path
relative to the repo root.

**Question 4:** What is the default value of the `enabled` flag on a newly shipped gate entry
in `intel-gates.json`? Why is this the default?

**Question 5:** Family L's `plan-phase.5-handle-research` trigger fans out to four agents.
Name all four agent IDs.

---

## Answer key

**Answer 1:**

```
Layer 0: Hooks (3, deterministic)         hooks/gsd-*.js
Layer 1: Thin agent files (58)            agents/gsd-*.md
Layer 2: Manifest-indexed refs            intel-refs/MANIFEST.json + intel-refs/**/*.md
Layer 3: Skills (5 behavioral)            skills/
Layer 4: Customer skill overlay           one selected at install
Layer 5: Program project context          .planning/intel-context.md
```

**Answer 2:** **Family D — ATO Documentation Specialists** (8 agents): `gsd-ssp-drafter`,
`gsd-poam-tracker`, `gsd-sar-dryrun`, `gsd-iv-and-v-dryrun`, `gsd-conmon-planner`,
`gsd-irp-author`, `gsd-contingency-planner`, `gsd-evidence-packager`.

**Answer 3:** `hooks/patterns/classified-markings.json`

**Answer 4:** `false`. Upholds the seamless-fork guarantee: a newly shipped gate cannot change
behavior for existing programs until an engineer explicitly sets `enabled: true`. Pack upgrades
never silently activate new gates.

**Answer 5:** `gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`,
`gsd-adversary-modeler`.
