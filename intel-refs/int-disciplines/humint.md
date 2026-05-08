---
classification: UNCLASSIFIED
title: HUMINT — Human Intelligence
topic_id: int-disciplines/humint
---

# HUMINT — Human Intelligence

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

HUMINT is the collection of intelligence from human sources. It is one of seven primary INT disciplines and is uniquely concerned with case management, source-handler tradecraft, asset validation, and (where authorized) document and media exploitation.

## Sub-disciplines

- **Case management** — recruitment, handling, termination cycles; cover/legend management; reporting cadence.
- **Asset validation** — vetting, polygraph, motivation analysis, reliability/source-credibility classification per ICD-206.
- **Biometrics** — fingerprint, facial, iris collection and matching at edge devices; ABIS integration.
- **DOMEX (Document & Media Exploitation)** — captured-media triage, language exploitation, technical exploitation of seized devices.

## Authoritative sources

- ICD 204 — *Roles and Responsibilities for the Conduct of National Intelligence Source Operations* (DNI).
- ICD 206 — *Sourcing Requirements for Disseminated Analytic Products* (DNI).
- JP 2-0 — *Joint Intelligence* (Joint Chiefs of Staff).
- DoDI 3115.09 — *DoD Intelligence Interrogations, Detainee Debriefings, and Tactical Questioning* (DoD).

## Cross-references

- `tradecraft/icd-203.md` — analytic standards that apply to HUMINT-derived assessments.
- `tradecraft/icd-206.md` — sourcing standards (Phase 4+, not Phase 0).
- `capability-patterns/entity-resolution.md` — entity reasoning patterns relevant to source databases.

## Pack engineering notes

- Tools that handle HUMINT-related metadata (source identifiers, locations, cover identities) MUST treat that metadata as CUI minimum and apply `gsd-classified-leak-detector` patterns. See `skills/classification-conventions`.
- Source-protection-evasion patterns (e.g., "reveal the source identity") are caught by `gsd-prompt-injection-scan-intel`.
