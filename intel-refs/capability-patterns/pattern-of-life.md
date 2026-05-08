---
classification: UNCLASSIFIED
title: Pattern of Life (POL) — capability pattern
topic_id: capability-patterns/pattern-of-life
---

# Pattern of Life — capability pattern

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

Pattern-of-life (POL) analysis derives the recurring spatio-temporal behavior of an entity (or set of entities) from observation streams over time. It is the mainstream analytic mode of activity-based intelligence (ABI) and the foundation of many GEOINT-FMV deliverables.

## Core elements

- **Anchor points** — locations the entity returns to with high frequency (residence, work, hangouts).
- **Temporal regularity** — recurring time-of-day / day-of-week patterns.
- **Mode mixture** — typical movement modes (foot, vehicle, transit) and their daily distribution.
- **Co-presence graph** — other entities with statistically-significant temporal overlap at shared locations.
- **Anomalies** — deviations from established baseline; the deliverable is often "what changed and why."

## Methods

- **Spatio-temporal clustering** — DBSCAN/HDBSCAN on (lat, lon, time) tuples to identify anchor points.
- **Activity-graph mining** — frequent-subgraph patterns over (entity → location → time-bin) tuples.
- **Sequence modeling** — HMMs / RNNs to learn typical behavior sequences and flag low-likelihood deviations.
- **Hot-spot analysis** — Getis-Ord Gi*, kernel density estimation on incident streams.

## Authoritative / canonical references

- "Activity-Based Intelligence: Principles and Applications" — Patrick Biltgen & Stephen Ryan (2016), Artech House.
- *Foundations of GEOINT* — NGA's public reference textbook.
- *USGIF Universal GEOINT Body of Knowledge* — competency framework.

## Cross-references

- `int-disciplines/geoint.md` — POL primarily lives within GEOINT-FMV.
- `capability-patterns/entity-resolution.md` — POL is built on ER'd tracks.

## Pack engineering notes

- POL analyses on individuals are sensitive even at unclassified levels; treat outputs as CUI-PRIVACY by default.
- Baseline windows should be at least 4× the periodicity of interest (e.g., 4 weeks for weekly patterns) to avoid spurious anomaly flags.
- "Anomaly" is meaningful only relative to a defined baseline; any POL output MUST cite the baseline window.
