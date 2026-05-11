---
classification: UNCLASSIFIED
title: Technical SIGINT — ELINT / FISINT / Telemetry
topic_id: int-disciplines/techsigint
applies_when:
  - techsigint
  - technical sigint
  - elint
  - fisint
  - radar emissions
  - foreign instrumentation
  - telemetry
  - electronic order of battle
ic_pack: true
owners:
  - intel-pack@adelphi.ai
last_reviewed: 2026-05-11
---

# Technical SIGINT — ELINT / FISINT / Telemetry

> **Phase 7 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

Technical SIGINT covers the collection, processing, and analysis of non-communications electronic signals — radar emissions, weapon-system telemetry, launch beacons, fuze signals, and other instrumentation signals radiated by foreign military equipment. It is explicitly distinct from COMINT (Communications Intelligence), which concerns voice, data, and messaging traffic and is the primary focus of `int-disciplines/sigint.md` and `gsd-sigint-researcher`. The two disciplines together constitute full SIGINT coverage: Technical SIGINT characterizes what a system *is* and *does* through its non-communications emissions; COMINT characterizes the *people and networks* operating it through their communications. Per spec line 346, when a phase requires full SIGINT coverage, spawn `gsd-sigint-researcher` (COMINT) and `gsd-techsigint-researcher` (Technical SIGINT) in parallel — neither agent alone covers the complete SIGINT collection space.

## Discipline Scope

Technical SIGINT analysis addresses four core functional areas:

- **ELINT (Electronic Intelligence) — Radar Emissions and EOB Construction** — collection and parametric characterization of non-communications electromagnetic emissions, primarily from radar systems; analysis of pulse characteristics, waveform modulation, and antenna signatures to identify and classify emitters; construction and maintenance of the Electronic Order of Battle (EOB), which maps the type, location, operating mode, and association of threat emitters within a target area.
- **FISINT (Foreign Instrumentation Signals Intelligence)** — collection and analysis of signals intentionally emitted by foreign aerospace and weapon-system test and operational programs, including weapon-system telemetry downlinks, launch-vehicle tracking beacons, range-safety command uplinks, and fuze-arming signals; FISINT is the primary INT window into foreign weapons-program development timelines and system performance during testing.
- **Instrumentation Telemetry Analysis** — decoding and interpreting the structured data streams carried on foreign telemetry channels to extract measurable performance parameters (velocity, altitude, acceleration, guidance corrections, stage-separation events) from weapon-system and aerospace tests; the analytic output is a parametric profile of system performance across test events.
- **Signal Classification and Fingerprinting** — characterization of individual emitters through their measurable parametric signatures (pulse-repetition interval, pulse width, carrier frequency band, modulation type, antenna-scan pattern) to assign emitter identities and support EOB attribution; fingerprinting enables re-identification of specific emitter units across collection opportunities.

## Data Shapes

Typical artifacts produced by or consumed in Technical SIGINT analysis:

- **Emitter Parametric Records** — structured records capturing the measurable characteristics of a specific emitter: frequency band (e.g., X-band, L-band, S-band), pulse-repetition interval (PRI) family, pulse width, antenna scan rate and pattern, and polarization. These are the foundational data unit of EOB construction and signal-fingerprint libraries. Schema families include STANAG parametric-record formats (NATO) and US-IC emitter-database record structures; cite by name only — internal field shapes are not reproduced here.
- **EOB Tables** — structured databases associating emitter identities with geographic locations, platform or unit associations, operating modes, and observed activity periods; the EOB is both an analytic product and a living reference updated as new collection refines the emitter picture.
- **Telemetry-Channel Decodes** — structured outputs of FISINT telemetry analysis, mapping decoded channel values to physical parameters (e.g., airspeed, altitude AGL, guidance-system state) across the timeline of a test event; the primary analytic input for foreign-system performance characterization.
- **Signal-Fingerprint Libraries** — repositories of emitter-specific parametric profiles used for re-identification matching; each entry captures the characteristic parametric envelope of a known emitter type or individual unit with associated confidence bounds.

> **Classification note:** The vast majority of genuine Technical SIGINT product — including real parametric records, EOB entries, and telemetry decodes — is classified at elevated levels due to collection-method sensitivity and treaty-regime equities. This framework supports analytic-design work on synthetic data and abstract system analogs only. No real parametric records, EOB data, or telemetry decodes are stored or referenced here.

## Capability Patterns Relevant to Technical SIGINT

Technical SIGINT analytic work maps to several reusable capability patterns:

- **Emitter Clustering by Parametric Similarity** — grouping collected emitter observations by proximity in parametric space (frequency band, PRI family, pulse-width range) to identify emitter types, associate observations across collection opportunities, and surface novel emitters that do not match existing library entries; clustering and classification patterns from `capability-patterns/entity-resolution.md` apply to deduplication and disambiguation across multi-collection parametric traces.
- **EOB-Completeness Assessment** — evaluating the coverage and currency of an EOB against known threat-emitter inventories and collection gaps; completeness assessment is a structured gap-analysis problem — which emitter types, geographic sectors, and time windows are under-observed or unobserved in current collection.
- **Signal-Fingerprint Matching Against Known-Emitter Libraries** — similarity search against a parametric-record library to assign collected signals to known emitter identities; matching involves tolerance bands across multiple parametric dimensions and produces confidence-scored identity candidates rather than deterministic assignments.
- **Cross-INT Fusion with TECHINT** — TECHINT exploitation (`int-disciplines/techint.md`) of foreign radar and weapon systems produces physical parametric measurements (antenna aperture, transmitter power class, waveguide dimensions) that ground-truth and constrain the parametric envelopes in ELINT emitter libraries; the two disciplines are mutually calibrating for emitter-type characterization.
- **Cross-INT Fusion with GEOINT** — geolocation of emitters from angle-of-arrival, time-difference-of-arrival, or multilateration data links Technical SIGINT parametric records to geographic positions and facilities visible in GEOINT (`int-disciplines/geoint.md`); emitter geolocation supports site attribution, unit-of-force association, and deployment-pattern analysis.

## Tradecraft Considerations

- **ICD 203 Application — Identification Confidence** — emitter identification claims must be expressed with explicit confidence language per ICD 203 (*Analytic Standards*, DNI). "Almost certainly X-band fire-control radar" (high confidence, narrow parametric match to a specific type) is categorically different from "consistent with X-band radar" (low-to-moderate confidence, parametric overlap with a type family). Analysts must document the parametric basis for each confidence tier, enumerate alternative emitter types that fit the observed parameters, and flag collection gaps that would resolve remaining ambiguity. False precision in emitter identification has operational consequence; uncertainty is a product finding, not a reporting weakness.
- **Source-Attribution Discipline at the Collection-Platform Level** — Technical SIGINT reports frequently imply collection-platform characteristics through the specificity of their parameter sets and the geometry of their emitter-geolocation products. Even in unclassified analytic-design products, referencing specific collection platforms, sensor geometries, or collection windows by name risks revealing collection methods or treaty-sensitive equities. This pack's synthetic-product templates use generic descriptors (e.g., "collection asset," "airborne collection platform") and do not name real collection programs or systems.

## Authoritative Sources

- ICD 202 — *Transitioning Classified Intelligence Products to Unclassified Networks* (DNI). (Governs SIGINT dissemination paths; applies to Technical SIGINT products.)
- ICD 203 — *Analytic Standards* (DNI). (Applies to all finished Technical SIGINT assessments, including emitter identification and FISINT-derived performance characterizations.)
- JP 2-0 — *Joint Intelligence* (Joint Chiefs of Staff). (SIGINT discipline taxonomy; ELINT and FISINT role in the joint intelligence cycle.)
- JP 2-01 — *Joint and National Intelligence Support to Military Operations* (Joint Chiefs of Staff). (Technical SIGINT in joint collection management and targeting support.)
- NSA — *Signals Intelligence Directorate: Mission and Function* (NSA public affairs, unclassified). (Organizational charter for U.S. SIGINT collection including ELINT and FISINT.)

## See Also

- `int-disciplines/sigint.md` — COMINT companion discipline; pair `gsd-sigint-researcher` and `gsd-techsigint-researcher` for full SIGINT coverage when a phase requires both communications and non-communications signal analysis.
- `int-disciplines/geoint.md` — geolocation of emitter sites; GEOINT imagery and geospatial data supports emitter-site attribution and deployment-pattern analysis.
- `int-disciplines/techint.md` — parametric reports of fielded foreign equipment; TECHINT physical exploitation data calibrates and ground-truths ELINT parametric envelopes for the same emitter types.
- `capability-patterns/entity-resolution.md` — emitter-identity deduplication and disambiguation across multi-collection parametric traces; signal-fingerprint matching methodology.

## Pack Engineering Notes

- Emitter parametric data — even at abstract band/family level — MUST be treated as CUI minimum in any production context. Apply `gsd-classified-leak-detector` patterns to all parametric-record fields before storage or sharing.
- `gsd-techsigint-researcher` consumes this ref alongside `int-disciplines/sigint.md`, `int-disciplines/techint.md`, and `capability-patterns/entity-resolution.md`; load those refs in the same session context for full discipline coverage.
- Use abstract parametric ranges only in synthetic data and analytic-design products (e.g., "X-band," "L-band telemetry," "medium-PRF radar") — do not use specific frequency values that could imply real-system characterizations or constitute unclassified parametric intelligence.
- EOB products — even unclassified analytic-design templates — must use generic emitter-type labels and synthetic geographic coordinates; do not reference real unit designations, facility names, or operational deployment locations.
