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
