---
classification: UNCLASSIFIED
title: MASINT — Measurement and Signature Intelligence
topic_id: int-disciplines/masint
---

# MASINT — Measurement and Signature Intelligence

> **Phase 2 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

MASINT is the collection and analysis of intelligence derived from technical sensors that detect and measure physical phenomena. It produces signature data characterizing targets that are not accessible through imagery or signals alone. Phase 2 focus spans all MASINT phenomenologies, sensor fusion patterns, and signature library engineering.

## Sub-disciplines

- **RADINT (Radar Intelligence)** — radar cross-section, SAR, ISAR characterization of targets.
- **ACINT (Acoustic Intelligence)** — underwater acoustic signatures; seismic sensing; sonar phenomenology.
- **IRINT (Infrared Intelligence)** — thermal signatures; IR seeker characterization; heat-source detection.
- **NUCINT (Nuclear Intelligence)** — radiation signatures; isotopic analysis; nuclear detonation detection.
- **Sensor fusion** — combining multi-phenomenology signatures to improve characterization confidence.
- **Signature libraries** — engineering and maintenance of target-specific signature databases.

## Authoritative sources

- DIA *MASINT Science and Technology Roadmap* (DIA, unclassified version). (Phenomenology taxonomy.)
- IEEE 1522 — *Standard for Radar Cross-Section Test Procedures* (IEEE). (RADINT measurement baseline.)
- CTBTO Monitoring System documentation (CTBTO). (Seismic/acoustic/hydroacoustic detection methods.)
- JP 2-0 — *Joint Intelligence* (Joint Chiefs of Staff). (MASINT role in joint intelligence cycle.)

## Cross-references

- `tradecraft/icd-203.md` — analytic standards for sensor-derived assessments.
- `capability-patterns/entity-resolution.md` — signature-based entity identification.

## Pack engineering notes

- Signature library data (target-specific phenomenological parameters) MUST be treated as CUI minimum. Apply `gsd-classified-leak-detector` patterns.
- Sensor fusion prototypes produced by `gsd-masint-researcher` may interface with `gsd-domex-engineer` tooling when captured-media includes sensor data.
