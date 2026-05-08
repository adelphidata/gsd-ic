---
classification: UNCLASSIFIED
title: Entity Resolution — capability pattern
topic_id: capability-patterns/entity-resolution
---

# Entity Resolution — capability pattern

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

Entity resolution (ER) is the capability pattern of identifying and merging records that refer to the same real-world entity (person, organization, vehicle, location, network identifier) across heterogeneous sources. It is foundational to GEOINT pattern-of-life, HUMINT case management, OSINT social-graph analysis, and SIGINT correlation.

## Stages of an ER pipeline

1. **Blocking** — partition records into candidate groups using cheap features (name n-grams, geo-bucket, time-window) to avoid n² comparisons.
2. **Scoring** — pairwise similarity scoring within blocks (string distance, geo distance, temporal overlap, attribute matching).
3. **Resolution** — threshold + transitive closure → merge clusters; or graph-based community detection on a similarity graph.
4. **Reconciliation** — pick a canonical record per cluster (most-recent, highest-confidence, golden record).
5. **Provenance** — every merge decision must be traceable to the underlying records.

## Identifier types and considerations

- **Strong** — UUIDs assigned within the same authoritative system; deterministic.
- **Quasi** — names, dates of birth, addresses; require fuzzy matching.
- **Weak** — geo-temporal coincidence, behavior pattern; only meaningful in aggregate.

## Authoritative sources / common toolkits

- *Magellan* (academic) — open-source ER framework with comprehensive feature library.
- *Splink* (UK ONS) — production-grade probabilistic ER, BSD-3 licensed.
- *Dedupe.io* — Python library + commercial offering.
- IEEE TKDE 2007 — Christen, "A Survey of Indexing Techniques for Scalable Record Linkage and Deduplication" — foundational survey.

## Cross-references

- `int-disciplines/geoint.md` — geo-temporal ER for FMV-derived tracks.
- `int-disciplines/humint.md` — source-database ER.
- `capability-patterns/pattern-of-life.md` — POL is ER-on-tracks-over-time.

## Pack engineering notes

- ER pipelines on classified data are subject to per-AO authorities; treat the linkage matrix itself as potentially classified-by-aggregation even when input records are individually unclassified.
- Ground-truth sets for evaluation MUST not leak across customer programs; partition test data per AO.
- Common pitfall: ER on names alone produces unacceptable false-positive rates above ~10K records. Always use multi-attribute features.
