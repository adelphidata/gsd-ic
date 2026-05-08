---
classification: UNCLASSIFIED
title: POA&M File Format Reference
topic_id: tradecraft/poam-format
---

# POA&M File Format Reference

> **Phase 1 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable and is the canonical format that all Phase 1 compliance agents write to.

A Plan of Action and Milestones (POA&M) is a formal document required under FISMA (44 U.S.C. § 3554(b)(1)(A)) that identifies security weaknesses, describes remediation actions, and tracks status toward closure. Within an IC pack–enabled program, `.planning/POAM.md` is the program-local POA&M populated by compliance agents.

## File shape

```markdown
---
classification: UNCLASSIFIED
title: Plan of Action and Milestones (POA&M)
created: <ISO-8601 timestamp>
last_updated: <ISO-8601 timestamp>
---

# Plan of Action and Milestones

This file is auto-populated by IC-pack compliance agents (Family A specialists + privacy reviewer)
per spec §9.5. Each finding becomes one POA&M row. Idempotent: rows are keyed by
`(source_agent, control_id)`; re-running a compliance agent with overlapping findings updates
existing rows rather than duplicating.

## Open findings

| ID | Source agent | Control reference | Severity | Finding | Recommended action | Due date | Status |
|---|---|---|---|---|---|---|---|
| <key> | gsd-rmf-control-mapper | NIST 800-53 AC-2 | High | Description of finding | Mitigation steps | YYYY-MM-DD | Open |

## Closed findings

| ID | Source agent | Control reference | Severity | Finding | Action taken | Closed date | Status |
|---|---|---|---|---|---|---|---|
| <key> | gsd-cmmc-auditor | CMMC.L2.AC.L2-3.1.1 | Medium | ... | ... | YYYY-MM-DD | Closed |
```

## Idempotency key format

`<agent-prefix>-<control-shortid>-<finding-hash[:8]>`

| Segment | Meaning | Example |
|---|---|---|
| `agent-prefix` | Short token identifying the source agent | `rmf`, `cmmc`, `itar`, `fips`, `sbom`, `800171`, `dfars`, `privacy` |
| `control-shortid` | Framework-specific control identifier, lowercased, hyphens | `ac-2`, `l2-3-1-1`, `usml-xi`, `npm-crypto` |
| `finding-hash[:8]` | 8-char truncated hash of the finding text (handles one-control-multiple-findings) | `a1b2c3d4` |

Full example: `rmf-ac-2-a1b2c3d4`

## Severity scale

| Severity | Meaning |
|---|---|
| High | Critical control failure; likely affects contract award or ATO suitability |
| Medium | Control gap that requires remediation before delivery |
| Low | Advisory finding; best-practice deviation with low immediate risk |

## Status lifecycle

`Open` → `InProgress` → `Closed`

Agents only write `Open` (new findings) or update `Open` rows. Setting status to `InProgress` or `Closed` is a human action. Agents do not reopen `Closed` rows.

## Authoritative sources

- FISMA (44 U.S.C. § 3554) — statutory POA&M requirement.
- NIST SP 800-37 Rev 2 — *Risk Management Framework for Information Systems and Organizations* (NIST, 2018).
- OMB Circular A-130 — *Managing Information as a Strategic Resource* (OMB, 2016).
- DoD Instruction 8500.01 — *Cybersecurity* (DoD, 2014, incorporating change 2).

## Pack engineering notes

- Agents use `skills/poam-conventions` for the upsert algorithm; this doc documents the format only.
- `.planning/POAM.md` is program-owned; the IC pack does not ship a template — agents create it on first write.
- Human reviewers close findings; agents never flip `Closed` rows back to `Open`.
