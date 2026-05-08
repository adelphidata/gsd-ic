---
classification: UNCLASSIFIED
title: OSINT — Open-Source Intelligence
topic_id: int-disciplines/osint
---

# OSINT — Open-Source Intelligence

> **Phase 2 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

OSINT is the collection and analysis of intelligence derived from publicly available information (PAI). It spans web, social media, academic, commercial, and government-published sources. Phase 2 focus: OSINT collection ethics, persona separation, SOCMINT patterns, and structured threat-intelligence sharing formats.

## Sub-disciplines

- **SOCMINT (Social Media Intelligence)** — collection and analysis of social media content; network graph analysis; influence-operation detection.
- **PAI (Publicly Available Information)** — web scraping, academic sources, commercial databases, government publications.
- **Persona separation** — operational security for OSINT collectors; cover persona management; attribution avoidance.
- **Threat intelligence sharing** — STIX 2.1 / MISP structured formats for OSINT-derived threat data.

## Authoritative sources

- ICD 206 — *Sourcing Requirements for Disseminated Analytic Products* (DNI). (PAI sourcing attribution rules.)
- STIX 2.1 — *Structured Threat Information Expression* (OASIS CTI TC, 2021).
- MISP Project — *Malware Information Sharing Platform* open-source standard (MISP community).
- ASD *OSINT Fundamentals* — open-source collection ethics baseline (Australian Signals Directorate, 2023).

## Cross-references

- `tradecraft/icd-203.md` — analytic standards applicable to OSINT-derived assessments.
- `capability-patterns/entity-resolution.md` — entity disambiguation across open-source records.
- `int-disciplines/cybint.md` — cyber threat OSINT overlaps with CTI collection.

## Pack engineering notes

- Persona separation artifacts (personas, collection accounts) MUST NOT be stored in plaintext in `.planning/`. Apply `gsd-classified-leak-detector` patterns.
- STIX/MISP output from OSINT tools is a natural interoperability surface with `gsd-cybint-researcher`.
