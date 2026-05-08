---
classification: UNCLASSIFIED
title: NRO — National Reconnaissance Office
topic_id: ecosystem/nro
---

# NRO — National Reconnaissance Office

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NRO designs, builds, launches, and operates the United States's overhead reconnaissance satellites. Headquartered in Chantilly, VA. Subordinate to both the DoD and the IC; the NRO Director is dual-hatted as the assistant secretary of the Air Force for space.

## Mission

- Design, acquire, and operate space-based reconnaissance systems.
- Deliver IMINT and SIGINT collection from overhead platforms to the rest of the IC.
- Exit point for collection; the resulting data is exploited by NGA (IMINT/GEOINT) and NSA (SIGINT).

## Primary INTs

- **IMINT** (primary; via overhead EO/IR/SAR/hyperspectral collection).
- **SIGINT** (overhead SIGINT collection).
- **MASINT** (specific collection systems).

## Operational footprint

- Imagery Systems Acquisition Directorate.
- SIGINT Systems Acquisition Directorate.
- Communications Systems Acquisition Directorate.
- Operations Directorate (mission operations of fielded systems).

## Authoritative sources

- nro.gov — public web presence.
- *NRO at 60* (DNI history retrospective; public).
- DoDI 5105.23 — *Director of the National Reconnaissance Office*.
- ICD 502 — *Integrated Defense of the Intelligence Community Information Environment* (NRO is an IC element).

## Cross-references

- `int-disciplines/geoint.md` — NGA exploits NRO-collected imagery.
- `int-disciplines/sigint.md` — NSA exploits NRO-collected SIGINT (Phase 2 placeholder).

## Pack engineering notes

- NRO programs touch space-vehicle ground systems, often with extensive launch / mission-operations integration concerns.
- Aerospace-grade software development standards (NASA / DoD STIG-equivalent) typically apply on NRO programs; coding for NRO is rigorous.
- Engineers building tools for NRO consumption should expect strong segregation between collection and exploitation domains; the data flow is producer→consumer with formal handoff points.
