---
classification: UNCLASSIFIED
title: TECHINT — Foreign Materiel Exploitation
topic_id: int-disciplines/techint
topic: int-disciplines/techint
applies_when:
  - techint
  - foreign materiel exploitation
  - fmx
  - captured equipment
  - reverse engineering
  - weapon system analysis
  - hardware exploitation
  - foreign weapon systems
ic_pack: true
owners:
  - intel-pack@adelphi.ai
last_reviewed: 2026-05-11
---

# TECHINT — Foreign Materiel Exploitation

> **Phase 7 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

TECHINT (Technical Intelligence) is the collection, processing, and analysis of foreign materiel — the physical hardware, components, and systems produced or fielded by adversaries. It is distinct from SIGINT, which concerns the electronic emissions a system radiates; from HUMINT, which concerns the people who design, build, or operate it; and from GEOINT, which concerns imagery of where that system is deployed. TECHINT analysts work directly with the object itself: its materials, mechanical tolerances, manufacturing provenance, electronic architecture, and measurable performance parameters. The primary mode of TECHINT production is foreign materiel exploitation (FMX) — a structured, all-source analytic workflow that begins with acquisition of a foreign item and ends with a finished technical-intelligence product characterizing that item's capabilities, limitations, and design origins.

## Discipline Scope

TECHINT analysts and engineers perform five core functions:

- **Captured-equipment exploitation** — systematic physical examination of foreign items recovered through combat, purchase, cooperative transfer, or liaison to characterize construction, materials, and embedded electronics.
- **Reverse engineering of foreign systems** — disassembly, functional mapping, and performance inference from hardware to reconstruct design intent without access to original specifications.
- **Weapon-system performance characterization** — derivation of operational envelopes (range, accuracy, lethality, countermeasure susceptibility) from physical evidence and open-source technical literature.
- **Supply-chain provenance analysis** — tracing component origins through part markings, materials composition, and manufacturing signatures to identify the industrial base, national origin, and third-party supply networks behind a foreign system.
- **Technical-documentation exploitation** — analysis of recovered manuals, maintenance logs, schematics, and software to extract design parameters and operational procedures.

The DIA National Center for Medical Intelligence (NCMI) provides a useful parallel workflow: a physical sample (in NCMI's case, a biological specimen; in FMX, a hardware artifact) enters a custody chain, is subjected to laboratory analysis, and produces a finished intelligence product that informs policy and operational planning. The captured-materiel → laboratory analysis → finished-product workflow is common to both disciplines and is the structural template for FMX product pipelines in this pack.

## Data Shapes

Typical artifacts produced by or consumed in TECHINT analysis:

- **Exploitation reports (TECHREP-style narratives)** — structured technical-intelligence reports describing examination findings, analytic conclusions, and gaps. Public analogues include unclassified DIA technical reports and DTRA assessments released under FOIA.
- **Captured-equipment manifests** — custody and inventory records enumerating items, serial/lot numbers, condition, and chain of custody from acquisition through laboratory disposition.
- **Photogrammetry and mechanical-drawing outputs** — dimensioned drawings, 3-D point clouds, and photographic documentation produced during physical examination; the geometric "ground truth" of a captured item.
- **Materials-analysis lab reports** — spectrographic, metallurgical, and chemical-composition analyses characterizing alloys, coatings, adhesives, and other materials — inputs to both performance characterization and supply-chain attribution.
- **Performance-envelope estimates** — probabilistic bounds on system capabilities (e.g., maximum effective range, guidance accuracy, seeker discrimination threshold) derived from physical evidence and modeling rather than from direct testing.

> **Classification note:** The vast majority of genuine TECHINT product is classified at elevated levels due to source sensitivity and equities of partner nations. This framework supports analytic-design work on synthetic data, abstract system analogs, and publicly available technical literature only. No real FMX product is stored or referenced here.

## Capability Patterns Relevant to TECHINT

TECHINT analytic work maps to several reusable capability patterns:

- **Entity resolution across captured-equipment serial-number traces** — serial numbers, lot codes, and manufacturer marks on captured items are entities that link individual hardware pieces to production runs, fielding cohorts, and supply chains. Entity-resolution patterns (`capability-patterns/entity-resolution.md`) apply directly to deduplication and disambiguation across component-level traces.
- **Supply-chain provenance graphs** — component origins can be represented as directed graphs: raw-material supplier → subcomponent fabricator → integrator → end user. Graph traversal and link-analysis patterns support attribution of foreign systems to their industrial base.
- **Cross-INT fusion with FININT** — procurement-network tracing links the financial flows behind foreign-system acquisition to the supply-chain provenance graph. FININT (`int-disciplines/finint.md`) provides the transaction-monitoring and sanctions-screening vocabulary; TECHINT provides the hardware artifact that grounds the financial trace.
- **Cross-INT fusion with OSINT** — open-source manufacturer catalogs, patent filings, academic publications, and commercial parts databases are primary sources for TECHINT component identification. OSINT (`int-disciplines/osint.md`) collection and triage patterns apply to this corpus.
- **Pattern-of-life on equipment-fielding cadence** — tracking when, where, and at what rate adversary systems appear in operational use is a pattern-of-life problem (`capability-patterns/pattern-of-life.md`). GEOINT-derived sighting data combined with TECHINT exploitation records supports cadence analysis and production-rate estimation.

## Tradecraft Considerations

- **ICD 203 application** — the analytic standards in ICD 203 (*Analytic Standards*, DNI) apply with particular force to TECHINT assessments because performance-envelope estimates are inherently model-dependent and uncertain. Analysts must explicitly state confidence levels, bound uncertainty ranges, acknowledge alternative hypotheses about system design, and flag gaps that could materially change the assessment. Uncertainty about adversary-system performance is expected and must not be papered over with false precision.
- **Source-attribution discipline** — TECHINT reports frequently cite specific exploitation venues (laboratories, depots, test ranges). Even in unclassified products, over-specific venue attribution can reveal collection methods or compromise partner relationships. This pack's synthetic-product templates use generic venue descriptors (e.g., "exploitation facility," "government laboratory") and do not name real-world exploitation programs.
- **Custody-chain integrity** — the forensic value of a physical exploitation depends entirely on unbroken custody documentation from point of acquisition to laboratory analysis. Analytic-workflow templates in this pack include custody-chain metadata fields as required inputs, not optional annotations.
- **Distinction from MASINT** — MASINT characterizes targets through remote sensing signatures (radar cross-section, acoustic emission, thermal profile). TECHINT characterizes the same targets through direct physical examination. The two disciplines are complementary: MASINT signatures can be calibrated against TECHINT exploitation data from the same system type. See `int-disciplines/masint.md` for MASINT phenomenology vocabulary.

## Authoritative Sources

- DIA *Physical Characteristics of Foreign Materiel* series (DIA, unclassified volumes). (Taxonomy and reporting standards for FMX.)
- JP 2-01 — *Joint and National Intelligence Support to Military Operations* (Joint Chiefs of Staff). (TECHINT role in the joint intelligence cycle.)
- JP 2-0 — *Joint Intelligence* (Joint Chiefs of Staff). (Discipline taxonomy and collection management context.)
- AR 381-26 / SECNAVINST 3820.3 series — *Army Foreign Materiel Exploitation Program* (DA) / *Naval Foreign Materiel Program* (DON). (Service-level program charters, unclassified versions.)
- ICD 203 — *Analytic Standards* (DNI). (Applies to all finished TECHINT assessments.)
- DTRA public technical reports (Defense Threat Reduction Agency). (Unclassified WMD-related FMX-adjacent analyses.)

## See Also

- `int-disciplines/sigint.md` — paired collection patterns; ELINT and FISINT complement TECHINT performance characterization of the same system types.
- `int-disciplines/geoint.md` — imagery of fielded equipment; GEOINT sighting data feeds equipment-fielding pattern-of-life analysis.
- `int-disciplines/masint.md` — signature-based characterization as TECHINT calibration complement.
- `int-disciplines/finint.md` — procurement-network tracing; financial-flow analysis linked to supply-chain provenance graphs.
- `int-disciplines/osint.md` — open-source manufacturer and parts-catalog data as primary TECHINT component-identification source.
- `capability-patterns/entity-resolution.md` — serial-number and component-mark entity resolution across exploitation traces.
- `capability-patterns/pattern-of-life.md` — equipment-fielding cadence analysis.

## Pack Engineering Notes

- Captured-equipment data (serial numbers, lot codes, component identifiers) MUST be treated as CUI minimum in any production context. Apply `gsd-classified-leak-detector` patterns.
- `gsd-techint-researcher` consumes this ref alongside `capability-patterns/entity-resolution.md` and `capability-patterns/pattern-of-life.md`; those refs must be loaded in the same session context for full discipline coverage.
- TECHINT exploitation timelines (acquisition date, exploitation date, report date) are operationally sensitive even in unclassified products; workflow templates use relative offsets (T+N days) rather than calendar dates.
- Supply-chain provenance graph construction may interface with `gsd-finint-researcher` (procurement-network tracing) and `gsd-domex-engineer` (device/media exploitation from co-located materiel).
