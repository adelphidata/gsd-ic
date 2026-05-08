---
classification: UNCLASSIFIED
title: SIGINT — Signals Intelligence
topic_id: int-disciplines/sigint
---

# SIGINT — Signals Intelligence

> **Phase 2 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

SIGINT is the collection and analysis of intelligence derived from signals — including communications (COMINT), electronic emissions (ELINT), and foreign instrumentation signals (FISINT). Phase 2 focus is COMINT-side patterns: communications metadata analysis, signal classification, and electronic order of battle (EOB) analytic patterns.

## Sub-disciplines

- **COMINT (Communications Intelligence)** — collection of foreign communications; metadata correlation; target development from communications patterns.
- **ELINT (Electronic Intelligence)** — non-communications electronic emissions; radar characterization; emitter identification.
- **FISINT (Foreign Instrumentation Signals Intelligence)** — telemetry and tracking signals from foreign aerospace programs.
- **EOB (Electronic Order of Battle)** — mapping threat emitters; frequency/parameter databases; emitter geo-location.

## Authoritative sources

- ICD 202 — *Transitioning Classified Intelligence Products to Unclassified Networks* (DNI). (Governs SIGINT dissemination paths.)
- NIST SP 800-187 — *Guide to LTE Security* (NIST, 2017). (Communications security baseline.)
- ATIS-1000017 — *ATIS Telecom Glossary* (ATIS). (Reference for communications terminology.)
- JP 2-0 — *Joint Intelligence* (Joint Chiefs of Staff). (SIGINT role in joint intelligence cycle.)

## Cross-references

- `tradecraft/icd-203.md` — analytic standards applicable to SIGINT-derived assessments.
- `capability-patterns/entity-resolution.md` — entity reasoning across target communications.

## Pack engineering notes

- SIGINT metadata (selectors, identifiers, intercept timestamps) MUST be treated as CUI minimum. Apply `gsd-classified-leak-detector` patterns.
- `gsd-sigint-researcher` handles COMINT-focused analysis; technical-collection SIGINT (sensor physics, TEMPEST) is deferred to `gsd-techsigint-researcher` (Phase 7).
