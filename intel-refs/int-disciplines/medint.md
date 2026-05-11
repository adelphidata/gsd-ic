---
classification: UNCLASSIFIED
title: MEDINT — Medical Intelligence
topic_id: int-disciplines/medint
applies_when:
  - medint
  - medical intelligence
  - biosurveillance
  - disease surveillance
  - biothreat
  - public health
  - pandemic
  - epidemiology
  - ncmi
ic_pack: true
owners:
  - intel-pack@adelphi.ai
last_reviewed: 2026-05-11
---

# MEDINT — Medical Intelligence

> **Phase 7 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

MEDINT (Medical Intelligence) is the collection, processing, and analysis of intelligence concerning foreign medical capabilities, health conditions, and biological threats that may affect national security or military operations abroad. The canonical IC mission owner is the Defense Intelligence Agency's National Center for Medical Intelligence (NCMI), which produces finished MEDINT on foreign infectious-disease outbreaks, biothreat programs, and the health of foreign populations and armed forces. MEDINT is explicitly distinct from operational military medicine, which addresses the health of U.S. forces and is a logistics and readiness function rather than an intelligence one. MEDINT is also distinct from domestic public-health surveillance: it concerns conditions, capabilities, and threats originating or operating outside U.S. borders — their intelligence significance, not their domestic treatment implications.

## Discipline Scope

MEDINT analysis addresses six core functional areas:

- **Disease surveillance** — systematic monitoring of foreign infectious-disease incidence, geographic spread, and outbreak cadence using open-source reporting (WHO, national CDCs, academic epidemiology) and all-source collection; NCMI is the DIA lead for finished disease-surveillance assessments affecting deployed-force health.
- **Biothreat indicator analysis** — identification and characterization of indicators suggesting state or non-state biological-weapons research, development, production, or acquisition; covers dual-use laboratory capabilities, precursor procurement, and anomalous outbreak patterns inconsistent with natural-origin hypotheses.
- **Biosurveillance prototyping** — development of analytic models and data-integration architectures that fuse multi-source surveillance feeds into anomaly-detection systems; prototype environments typically rely on synthetic or publicly available data due to the restricted nature of real epidemiological data.
- **Public-health data modeling** — construction of baseline models for foreign disease burden, healthcare-system capacity, and population-level health vulnerability to support forecast and consequence analysis.
- **Foreign medical-system capability assessment** — evaluation of adversary and partner-nation healthcare infrastructure, pharmaceutical production, laboratory networks, and medical-countermeasure stockpiles as elements of national power and operational environment.
- **Environmental health intelligence** — analysis of foreign environmental conditions (contamination, water quality, occupational exposures) affecting deployed-force health or threatening civilian-population stability.

## Data Shapes

Typical artifacts produced by or consumed in MEDINT analysis:

- **Surveillance feeds** — structured disease-incidence reports from WHO Disease Outbreak News, national CDC situation reports, ProMED-mail, and HealthMap; the primary open-source input stream for disease-surveillance analysis.
- **Epidemiological reports** — peer-reviewed and grey-literature outbreak investigations, case-series reports, and seroprevalence studies; provide epidemiological parameters (reproductive number, case-fatality rate, incubation distribution) needed for analytic modeling.
- **Lab capability inventories** — assessments of foreign biosafety-level-3/4 facilities, genomic-sequencing capacity, and diagnostic capability; inputs to both biothreat assessment and foreign-medical-system capability analysis.
- **Biothreat indicator tables** — structured records of observable indicators (facility construction, equipment procurement, personnel movements, anomalous outbreak patterns) associated with biological-weapons-relevant activities.
- **Syndromic surveillance time-series** — temporal sequences of symptom-cluster counts or emergency-department visit rates that serve as leading indicators of outbreak events before laboratory confirmation.

> **Data handling note:** Real biosurveillance data — even when unclassified — is frequently subject to HIPAA or equivalent national-law protections because it contains individually identifiable health information. Prototype and analytic-design work in this pack uses synthetic data or publicly released aggregate data. Analysts working with identifiable health data must apply `gsd-privacy-reviewer` outputs; see Tradecraft Considerations below.

## Capability Patterns Relevant to MEDINT

MEDINT analytic work maps to several reusable capability patterns:

- **Time-series anomaly detection on syndromic surveillance** — detecting outbreak onset in syndromic time-series is a canonical anomaly-detection problem; statistical control-chart methods, changepoint detection, and sequence-model approaches all apply. Anomaly detection on sparse, noisy, multi-variate surveillance feeds is a primary MEDINT prototype use case.
- **Entity resolution across foreign medical-facility naming variants** — foreign hospital, laboratory, and public-health agency names appear in inconsistent transliterations, abbreviations, and aliases across source streams. Entity-resolution patterns (`capability-patterns/entity-resolution.md`) are required for deduplication and cross-source fusion of facility-level reporting.
- **AI/ML evaluation discipline for biothreat-indicator classifiers** — machine-learning classifiers applied to biothreat-indicator data carry acute false-negative risk: missing a genuine biothreat indicator has severe consequence. Cross-reference `ai-ml/eval-patterns.md` for the eval-pattern discussion of asymmetric cost functions; that ref's treatment of false-negative cost is the direct methodological basis for MEDINT classifier design and evaluation criteria.
- **Pattern-of-life on disease-outbreak cadence** — seasonal and geographic outbreak patterns for known endemic diseases constitute a baseline pattern-of-life against which anomalous outbreaks are measured. Pattern-of-life methodology (`capability-patterns/pattern-of-life.md`) applies to outbreak recurrence analysis and to monitoring biosurveillance-relevant actor movements and communications.

## Tradecraft Considerations

- **ICD 203 application — outbreak-attribution uncertainty** — attributing an outbreak to a state biological-weapons program versus a natural-origin event is one of the highest-stakes and most uncertain assessments in the IC. ICD 203 (*Analytic Standards*, DNI) requires analysts to state confidence levels explicitly, enumerate alternative hypotheses (including natural-origin and accident-origin alternatives), and resist pressure to resolve ambiguity beyond what evidence supports. Outbreak-attribution claims must clearly distinguish between indicators consistent with a state program and indicators that constitute positive evidence for one.
- **PII and HIPAA handling discipline** — medical and epidemiological data often contains individually identifiable health information subject to HIPAA or analogous national protections even when the data is not classified. Analysts and engineers working with health data in any context — prototype, production, or exercise — must route outputs through `gsd-privacy-reviewer` review before storage or sharing. This applies to synthetic data built from real patient-level records, to foreign-surveillance data with individual-level identifiers, and to any analytic product that could enable re-identification.
- **Dual-use distinction** — laboratory capabilities, techniques, and knowledge applicable to legitimate public-health research are frequently the same as those relevant to biological-weapons development. MEDINT assessments must document the analytic basis for distinguishing dual-use from weapons-specific activity; absence of discriminating evidence is a gap, not a finding.

## Authoritative Sources

- DIA NCMI — *National Center for Medical Intelligence* unclassified fact sheets and annual open-source products (Defense Intelligence Agency). (MEDINT mission charter and finished-product examples.)
- WHO — *Disease Outbreak News* (World Health Organization, current). (Primary open-source disease surveillance feed.)
- CDC — *Morbidity and Mortality Weekly Report (MMWR)* (Centers for Disease Control and Prevention, current). (Epidemiological baseline and outbreak characterization standards.)
- ICD 203 — *Analytic Standards* (DNI). (Applies to all finished MEDINT assessments, including outbreak-attribution.)
- JP 2-01 — *Joint and National Intelligence Support to Military Operations* (Joint Chiefs of Staff). (MEDINT role in the joint intelligence cycle.)
- DoD Directive 6420.01 — *National Center for Medical Intelligence* (DoD). (NCMI organizational charter, unclassified.)

## See Also

- `int-disciplines/osint.md` — public-health open-source data (WHO, national CDCs, ProMED, HealthMap) is the primary collection source for MEDINT disease surveillance; OSINT collection and triage patterns apply directly.
- `int-disciplines/finint.md` — illicit-procurement tracing for biothreat-relevant equipment, precursors, and materials; financial-flow analysis links procurement indicators to biothreat-program attribution.
- `ai-ml/eval-patterns.md` — eval methodology for ML classifiers; the false-negative cost discussion is the primary reference for biosurveillance and biothreat-indicator classifier design.
- `capability-patterns/pattern-of-life.md` — outbreak-cadence baseline and anomaly framing; recurrence analysis for endemic disease and monitoring of biosurveillance-relevant actor activity.
- `capability-patterns/entity-resolution.md` — foreign medical-facility and public-health agency deduplication across multi-source surveillance feeds.

## Pack Engineering Notes

- Medical and epidemiological data — even unclassified aggregate data — MUST be reviewed by `gsd-privacy-reviewer` before storage, processing, or sharing in any analytic or prototype context. Individual-level health data is CUI minimum regardless of classification.
- `gsd-medint-researcher` consumes this ref alongside `ai-ml/eval-patterns.md` and `capability-patterns/pattern-of-life.md`; those refs should be loaded in the same session context for full discipline coverage.
- Biosurveillance prototype pipelines MUST use synthetic data or publicly released aggregate data. Do not use real patient-level or facility-level records in prototype environments without explicit data-handling agreements reviewed through `gsd-privacy-reviewer`.
- Outbreak-attribution analytic products require an explicit uncertainty section per ICD 203; workflow templates include required uncertainty and alternative-hypothesis fields as mandatory inputs, not optional annotations.
