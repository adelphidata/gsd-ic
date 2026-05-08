---
classification: UNCLASSIFIED
title: DIA — Defense Intelligence Agency
topic_id: ecosystem/dia
---

# DIA — Defense Intelligence Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

DIA is the principal foreign-military-intelligence agency of the DoD. Headquartered at the Joint Base Anacostia-Bolling (DC) and the DIA Center at Bolling. The DIA Director is dual-hatted as the J2 director of the Joint Staff (military intelligence advisor to the Chairman, JCS).

## Mission

- Provide all-source military intelligence to military operators, planners, and policymakers.
- Functional manager for MASINT (per ICD 113).
- Operate the Defense Attaché System and the Defense Clandestine Service (HUMINT collection in support of military requirements).

## Primary INTs

- **MASINT** (primary functional management).
- **HUMINT** (military HUMINT via DCS).
- **All-source military analysis** (the mainline analytic mission).

## Operational footprint

- Directorate for Analysis.
- Directorate for Operations (DCS, attaché system).
- Directorate for MASINT and Technical Collection (DT).
- Joint Functional Component Command for ISR (subordinate; coordinates DoD-wide ISR).

## Authoritative sources

- dia.mil — public web presence.
- *Worldwide Threat Assessment* (DIA-led product, published annually; public).
- DoDI 5105.21 — *Defense Intelligence Agency*.
- ICD 113 — MASINT functional management.

## Cross-references

- `int-disciplines/humint.md` — DIA's HUMINT operational doctrine.
- `tradecraft/icd-203.md` — applies to DIA analytic products.

## Pack engineering notes

- Many DIA programs run on JWICS (Joint Worldwide Intelligence Communications System); engineers should be JWICS-aware in deployment topology assumptions.
- MASINT-related code paths often require partition-aware ARN handling (per `intel-coding-conventions`) when targeting DoD-managed cloud.
- Worldwide Threat Assessment is a public corpus useful for tradecraft / ICD 203 conformance experiments at the unclassified level.
