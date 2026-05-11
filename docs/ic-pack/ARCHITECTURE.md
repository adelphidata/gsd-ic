<!-- CLASSIFICATION: UNCLASSIFIED -->
# IC Pack Architecture

The IC pack is a layered extension to the GSD framework. It adds 58 intelligence-community-tuned
agents, 3 deterministic hooks, 5 behavioral skills, 36 reference documents, 5 customer overlays,
and 12 CI validators on top of a standard GSD installation — without altering any stock GSD behavior.
This document is a customer-friendly subset of the design spec (§4 Architecture, line 95).

---

## Layered model (six layers)

```
Layer 5: Program project context     (.planning/intel-context.md)
Layer 4: Customer skill overlay      (one selected at install)
Layer 3: Skills (5 behavioral)       (skills/)
Layer 2: Manifest-indexed refs       (intel-refs/MANIFEST.json + intel-refs/**/*.md)
Layer 1: Thin agent files (58)       (agents/gsd-*.md)
Layer 0: Hooks (3, deterministic)    (hooks/gsd-*.js)
```

CI/validation gates every state change to any layer.

### Layer 0: Hooks

Three files live in `hooks/`: `gsd-classification-banner.js` (injects a classification header on
every agent output), `gsd-classified-leak-detector.js` (scans outputs against
`hooks/patterns/classified-markings.json` and halts if a classified pattern is detected), and
`gsd-prompt-injection-scan-intel.js` (blocks prompt-injection patterns common in adversarial
intelligence contexts). Hooks are deterministic and exit-code-driven; they fire on every `Read`,
`Write`, and `Bash` tool call regardless of which agent is active. They are compiled by
`scripts/build-hooks.js` into `hooks/dist/` before installation.

### Layer 1: Agents

58 thin markdown agent files reside in `agents/gsd-*.md`. Each carries YAML frontmatter with
`name`, `description`, `tools`, `applies_when`, `classification`, and `ic_pack: true` fields,
followed by an execution flow and a structured-return section that specifies the agent's completion
marker. Every agent matches exactly one completion-marker pattern enforced by
`tools/ci/validate-completion-markers.sh`. Agents are scoped to a single responsibility; none
duplicate behaviors available in other agents or in the upstream GSD pack.

### Layer 2: Manifest-indexed reference docs

`intel-refs/MANIFEST.json` is the authoritative index of all reference documents. Content files
live under `intel-refs/{int-disciplines,tradecraft,capability-patterns,ai-ml,classification-partitions,
ic-customer-ecosystem,modernization-themes,house-style,cross-cutting}/`. Each document carries
frontmatter with `applies_when`, `owner`, `last_reviewed`, and `classification` fields. Agents load
the refs whose `applies_when` tags intersect the active phase scope at runtime. v1 ships 36 reference
docs across 9 subdirectories: 10 INT-discipline refs, 13 tradecraft/compliance/ATO refs, and 2
capability-pattern refs among the remainder. All v1 content is UNCLASSIFIED. See
[REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md) for the full frontmatter contract and
[ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md) for the per-directory conventions.

### Layer 3: Behavioral skills

Five skills in `skills/<name>/` provide cross-agent behavioral guidance: `classification-conventions`
(correct IC marking syntax and banner placement), `intel-coding-conventions` (language patterns and
artifact naming conventions for IC deliverables), `prototyping-discipline` (scope discipline for
prototypes and demo builds), `adelphi-house-style` (prose and structure conventions for Adelphi
deliverables), and `poam-conventions` (POA&M structure, field semantics, and review-cycle
expectations). Skills are applied to agents at the skill-layer level, not embedded per agent. A
skill promotes to a standalone agent when it meets the §7.0 promotion rule: two or more of
multi-step reasoning required, own context-window benefit, or produces a distinct artifact.

### Layer 4: Customer skill overlay

One of five customer overlays (`cia`, `dia`, `nga`, `nro`, `nsa`) is selected at install time via
`--customer=`. The overlay maps agents to customer-specific additional skills and may inject
customer-specific reference docs. Exactly one overlay is active per installed instance. The five
customers are enforced by the `KNOWN_CUSTOMERS` list in `bin/lib/gsd-ic/parse-args.cjs`. See
[ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md) to add a new customer to the catalog.

### Layer 5: Per-program project context

`.planning/intel-context.md` is per-program and is NOT shipped in the pack — the engineer creates
it after installation. It should document the AO, mission statement, key contacts, transition
target, and primary INT disciplines in scope. Every agent reads this file at startup to anchor its
outputs to the specific program. Without it, agents operate with no program-specific grounding and
will produce generic, lower-utility outputs.

---

## Workflow integration: gates and the dispatcher

`.planning/intel-gates.json` is the workflow control file that maps triggers to agent invocations.
The full schema is documented in [intel-gates-schema.md](intel-gates-schema.md).

Each gate entry carries a `trigger` string (e.g., `plan-phase.5-handle-research`), an `agent` (or
`agents` array for fan-out), and an `enabled` flag. The GSD dispatcher reads this file and fires
the configured agent(s) when the trigger fires during a workflow run. Fan-out gates spawn multiple
agents in parallel from a single trigger; the dispatcher merges their results back to the caller
after all agents complete.

Family L is the canonical fan-out pattern in v1. It defines 4 mission-framing agents
(`gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler`)
all sharing the same trigger `plan-phase.5-handle-research`. All four ship `enabled: false` by
default — opt-in is per-program. The template for this pattern lives in
`workflow-patches/intel-gates.template.json`.

`tools/ci/validate-triggers.sh` enforces that every trigger string conforms to the
`<workflow>.<step>` slug form specified in the design spec (§9.6 Trigger string vocabulary,
line 785). Gates with malformed trigger strings are rejected in CI before merge.

---

## Completion-marker contract

Every IC pack agent emits exactly one completion-marker line as the final structured output of
its execution flow. The marker format is enforced by `tools/ci/validate-completion-markers.sh`
using the following regex:

```
^## [A-Z][A-Z0-9 _&-]*( COMPLETE| BLOCKED| FOUND| FAILED| UPDATE COMPLETE)$
```

The marker must appear verbatim in `references/agent-contracts.ic-pack.md`, which is the
authoritative registry of all agent names, their markers, and the agents that emit them. If an
agent's output does not match this pattern, or if the marker is absent from the registry, CI fails.

Six historical deviations are documented in the registry (1 from Phase 6, 5 from Phase 7) where
early spec wording predated the regex. In each case the agent file output was converted to match
the regex and the registry entry contains a footnote recording the original spec wording.

---

## Classification model

v1 ships three classification levels: `UNCLASSIFIED`, `CUI`, and `CLASSIFIED`. All v1 content
ships as `UNCLASSIFIED`. Every shipped markdown file — agents, reference docs, skills, hook source,
and docs — carries a mandatory `classification:` frontmatter field; doc-level banners use the
`<!-- CLASSIFICATION: ... -->` comment form at line 1.

The `gsd-classification-banner.js` hook (Layer 0) injects the active classification banner on
every agent output at runtime. The `gsd-classified-leak-detector.js` hook scans every output
against `hooks/patterns/classified-markings.json` and halts execution on a match, preventing
accidental leakage of classified strings into outputs from UNCLASSIFIED sessions.

Agents never determine classification on their own — they honor the user-declared classification
value from the session context. This is the user-declared classification convention (design spec
§4.5, line 162): classification is an input, not an inference.

`tools/ci/validate-classification.sh` and `tools/ci/validate-no-classified-leak.sh` enforce
correct frontmatter classification fields and absence of classified-marker patterns in all
committed content.

---

## Seamless-fork guarantee

With every gate and hook disabled in `.planning/intel-gates.json`, an installed program behaves
bit-for-bit identically to a stock GSD program. The IC pack adds capabilities; it never silently
changes or removes stock GSD behavior. Validated on every release by
`tools/ci/validate-seamless-fork.sh`.

The guarantee is structural: workflow patches must be idempotent, hooks must respect
`enabled: false`, reference docs must not auto-load outside an active gate context, and agents
must not auto-spawn without an explicit trigger. `validate-seamless-fork.sh` runs in CI on every
change and verifies all four properties mechanically before merge.

---

## CI surface

Twelve validators under `tools/ci/` gate every committed change to the pack. Each has a sibling
test file in `tools/ci/tests/`. Run all validators with `npm run ci` or validators alone with
`npm run test:validators`.

| Validator | What it checks |
|---|---|
| `validate-agents.sh` | All agent files have valid frontmatter, required fields, and `ic_pack: true` |
| `validate-audit-log.sh` | Audit-log entries are present and well-formed |
| `validate-classification.sh` | Every shipped markdown carries a valid `classification:` field |
| `validate-completion-markers.sh` | Every agent's completion marker matches the regex and is registered |
| `validate-manifest.sh` | `intel-refs/MANIFEST.json` schema is valid and all listed files exist |
| `validate-no-classified-leak.sh` | No committed content contains classified-marking patterns |
| `validate-publish-scope.sh` | `package.json` `files[]` covers exactly the intended set of pack files |
| `validate-reference-staleness.sh` | Reference docs whose `last_reviewed` date has passed are flagged |
| `validate-seamless-fork.sh` | IC pack does not alter stock GSD behavior when all gates are disabled |
| `validate-skills.sh` | Skill files have valid frontmatter and required fields |
| `validate-triggers.sh` | All gate trigger strings conform to `<workflow>.<step>` slug format |
| `validate-workflow-patches.sh` | Workflow-patch files are schema-valid and idempotent |

---

## What's deliberately not in v1

- **CUI and classified content handling.** All v1 content is UNCLASSIFIED. The infrastructure to
  handle CUI-marked or CLASSIFIED documents (separate storage, need-to-know gating, marking
  propagation) is explicitly deferred per §16 open question O-05.

- **Family L gate live exercise.** The 4 Family L mission-framing agents exist and are wired in
  `workflow-patches/intel-gates.template.json`, but all four ship `enabled: false`. The fan-out
  dispatcher contract has not been stress-tested against a real program's phase-5 workflow; live
  exercise is a post-v1 readiness step.

- **Gate-dispatcher result-merge beyond concatenation.** The v1 dispatcher concatenates fan-out
  agent results in order. Structured merge strategies (conflict detection, priority ordering,
  de-duplication across overlapping intelligence assessments) are not defined and not implemented.

- **SME-curated reference depth.** Reference docs ship populated with structure and initial content,
  but per-INT-discipline depth requires per-INT SME review and deepening. This is tracked as a
  post-v1 program-onboarding step per §15.1.1 and is intentional — the scaffolds are actionable
  without being authoritative.

- **Per-customer-overlay intelligence expansion.** Customer overlays in v1 wire skills and activate
  agents; they do not carry customer-specific intelligence content (AO-specific TTPs, customer
  threat models, customer-specific regulatory mappings). That content is per-program, not per-pack.
