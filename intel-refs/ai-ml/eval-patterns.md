---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-13
applies_when: [ai-ml, eval, evaluation, mission utility, hitl, model evaluation, ic eval, eval design]
---

# IC AI/ML Eval Patterns

This reference establishes AI/ML evaluation design patterns for IC mission environments. It is consumed by `gsd-adversary-modeler` (adversarial robustness eval patterns), `gsd-synthetic-data-engineer` (synthetic data quality eval), and the future Phase 7 `gsd-ai-eval-auditor`, which reads this file as its primary standard for auditing model evaluation artifacts. What makes IC AI/ML evals distinct from academic benchmarks is the primacy of mission utility — the relevant question is not "what is the model's score on a public leaderboard" but "how many analyst hours does this save on a representative scenario, and at what false-negative cost?" IC evals must also respect classification ceilings on test data, operate in air-gapped or enclave-constrained environments, and produce measurement claims defensible to a government contracting officer or congressional oversight audience.

---

## Mission-Utility Metrics

Mission utility is measured as analyst-hours saved on a defined scenario, not as accuracy on an academic benchmark such as MMLU or HELM. An NGA imagery analyst evaluating a building-change-detection model does not care about ImageNet top-1 accuracy; the relevant metric is how many hours of manual tile review the model displaces per analyst per shift, and how many valid change events the model fails to flag (false-negative cost).

IC-relevant metrics, with worked examples:

- **Time-to-first-flag** — elapsed time from data ingest to first analyst notification of a candidate event. Relevant for NSA cyber-anomaly detection: a model that cuts time-to-first-flag from 4.2 hours to 38 minutes represents a meaningful decision-cycle improvement even if precision is only 71%.
- **False-negative cost** — the mission consequence of a missed detection, expressed in analyst re-work hours or in decision-window closure. For an all-source fusion model, a false negative on a time-sensitive indicator may cost the target package entirely; this cost must be explicitly modeled, not aggregated into a single F1 score.
- **Analyst-effort multiplier** — ratio of targets reviewed per analyst-hour with the model versus without. A multiplier of 3.1x means the analyst covers three times the target load at equivalent review depth; this is the headline claim for a capability pitch.
- **Coverage breadth** — fraction of the target set touched by the model within a defined time window. Relevant when the baseline workflow simply cannot cover the full set due to analyst capacity.

**Scenario scoping:** A valid mission-utility scenario is one that (a) reflects a real task that analysts perform at measurable frequency, (b) has a defined start state and end state that can be independently judged, and (c) is executable in both the baseline (no model) and treatment (with model) conditions without changing the analyst's mission responsibilities. "Summarize this collection report in one sentence" is not a valid scenario — it is a prompt benchmark. "Identify all high-confidence entity aliases in this target package and flag for deconfliction review" is a valid scenario if that task is part of the actual workflow.

**Measurement approach:** Preferred measurement is instrumented workflow timing (start/stop timestamps recorded by the tool) combined with analyst-adjudicated output quality rating. Analyst self-report of time-on-task is an acceptable supplement but not a primary measure — self-report underestimates task time by 15%–40% on complex analytic work in controlled studies.

Contrast with academic metrics: accuracy, F1, and AUC are useful for internal calibration during development but are not sufficient for IC customer-facing claims. A model with 94% accuracy that is wrong on the 6% of cases involving the highest-priority targets has failed the mission regardless of its leaderboard position.

---

## Eval Categories

### Offline Benchmark

An offline benchmark uses synthetic or held-out historical data with established ground truth. It measures algorithmic performance under controlled conditions — no analyst in the loop, no live system latency, no ambiguous labeling. This is the correct category for comparing candidate model architectures, tuning hyperparameters, or establishing a performance baseline before committing to an HITL study.

Design requirements: ground truth must be independently adjudicated (not derived from the same model family being tested); the test split must be held out before any training run that touches the training split; dataset provenance must be documented with a hash so results are reproducible. For an NGA model evaluating overhead imagery, the offline benchmark dataset might be 2,400 labeled tiles across three geographic regions, with labels adjudicated by two independent imagery analysts and an arbitration process for disagreements. For an NSA cyber-analytic model, the offline benchmark might be a six-month window of labeled network-anomaly events with ground truth drawn from confirmed analyst-adjudicated incidents.

Report format: accuracy, precision, recall, F1, and AUC with 95% confidence intervals. State the dataset size, the class distribution, and the date range of the data. Do not report point estimates without intervals — a model with precision 0.81 ± 0.09 and a model with precision 0.83 ± 0.02 are not interchangeable claims.

### Online HITL Evaluation

An online HITL (Human-in-the-Loop) evaluation places an analyst in the workflow and measures their performance on representative mission tasks with and without the model. This is the definitive category for mission-utility claims. It measures analyst-utility rather than algorithmic performance — the model may have lower recall than an offline benchmark suggests once analysts learn to compensate for its error modes, or it may underperform expectations if its interface creates friction that slows the analyst.

Design requirements: the task set must be representative of actual mission workload (not toy examples); analysts must be drawn from the target population (not convenience samples); a baseline condition without the model must be run to establish the comparison point; analyst effort must be measured by instrumented workflow, not self-report alone. A 90-day pilot with a five-analyst team on an NSA cyber-analytic workflow, instrumented for triage latency and analyst action logs, is a well-designed HITL study. A two-week demo with volunteer analysts on a curated dataset is a prototype demonstration, not a defensible HITL eval.

Emphasis on workflow integration: HITL eval results are only valid for the interface and workflow in which they were collected. A model that performs well when analysts use a purpose-built review interface may perform differently when the same model output is injected into an existing mission system via an API. Report the workflow context explicitly.

### Adversarial Robustness

Adversarial robustness evaluation tests model performance under adversarial perturbation — inputs deliberately crafted to degrade model output, or distribution shifts that represent realistic adversarial tradecraft. For IC use cases, adversarial robustness is not an academic exercise: a foreign actor who understands the IC's automated triage model may craft collection to evade it.

Relevant perturbation categories: input perturbation (small modifications to entity names, timestamps, or signal characteristics designed to avoid detection); semantic adversarial examples (content that preserves surface meaning but shifts model classification); distribution shift (model trained on historical data encounters a changed operating environment — relevant for an all-source fusion model when adversary doctrine shifts). Cross-reference `intel-refs/capability-patterns/` adversarial threat models when that directory is populated (forward reference — content pending Phase 7 SME curation).

Report format: degradation curve showing model performance as adversarial strength increases; minimum perturbation budget required to cause a material performance drop; comparison of robustness across model variants. For a classification model, "material drop" is defined as a recall decrease exceeding 10 percentage points relative to the clean-data baseline.

Adversarial robustness eval results inform red-team scoping and should be shared with `gsd-adversary-modeler` when preparing threat model artifacts. A model that degrades sharply under modest perturbation is a mission risk even if its clean-data performance is strong; this risk must be disclosed in any customer-facing capability claim.

### Classification-Aware Test Data

Eval data must respect classification ceilings. A model trained on data at one classification level cannot be evaluated against test data at a higher classification level without a separate authorization path. This creates practical constraints: if the training data is at the SECRET level and test ground truth requires TS/SCI-adjudicated labels, the evaluation must occur in an environment authorized for that ceiling, with data movement authorized through proper channels.

Synthetic data is the preferred solution for cross-classification evaluation and for demo and pre-ATO phases. Synthetic test data generated to match the statistical distribution of real mission data allows evaluation without touching classified holdings. Distribution-fidelity requirements for synthetic eval data: schema completeness (all fields populated at realistic rates), entity-name plausibility (not obvious placeholders), temporal coherence (event timestamps follow realistic cadences), and label accuracy (synthetic ground truth is independently reviewable). See the Synthetic Data Quality Eval section below and cross-reference `gsd-synthetic-data-engineer` for generation tooling.

---

## Defensible Measurement Claims

A defensible measurement claim follows the evidence chain: claim → quantified evidence → mission impact, with explicit documentation of the test design, data provenance, and confidence bounds. Government customers — particularly contracting officers and program oversight staff — will scrutinize measurement claims when a capability is being proposed for a Program of Record. A claim that cannot be traced to a specific test design and dataset will not survive that scrutiny.

**Claim cadence (required structure):**
1. State the claim in operational terms ("the model reduces analyst triage time by approximately 60%").
2. Cite the quantified evidence with confidence interval ("median triage time 1.9 hours vs. 4.8 hours baseline, n=38 analyst-sessions, 95% CI on reduction: 47%–71%").
3. State the mission impact and the conditions under which it holds ("at current mission tempo, this frees approximately 18 analyst-hours per week across a four-analyst team, assuming triage volume remains below peak-surge thresholds observed in the evaluation window").

**Avoiding overstatement:** Point estimates without confidence intervals overstate precision. Prototype evaluation results generalize to operational conditions only with explicit qualification. Use ICD 203 Words of Estimative Probability (WEP) when extrapolating beyond test conditions — "likely" (roughly 55%–80% confidence) for claims supported by reasonable evidence, "moderately likely" for claims requiring operational assumptions to hold. Do not use "highly likely" for any claim that depends on infrastructure scaling or operational environment changes not tested in the evaluation.

**ICD 203 hedging norms:** Claims about operational performance that exceed tested conditions require a WEP parenthetical. Sample: "Sustained performance at operational volume is likely (ICD 203 WEP: ~55–80% confidence) contingent on infrastructure scaling to handle peak ingest rates not represented in the evaluation dataset."

**Reproducibility requirements:** Every eval claim must be backed by: eval scripts stored at a retrievable location, random seeds documented, dataset hashes (SHA-256) recorded, and a clear statement of which analyst population ran the HITL study. An eval that cannot be reproduced is not a defensible claim — it is a demonstration.

The following items constitute the minimum reproducibility package for a government-facing eval: (1) eval script and version tag; (2) dataset hash and access path; (3) random seed for any stochastic steps; (4) analyst cohort description (clearance level, experience band, mission area); (5) environmental parameters (model version, inference configuration, enclave tier). Without these, a follow-on auditor — including `gsd-ai-eval-auditor` in Phase 7 — cannot reconstruct the measurement.

---

## Synthetic Data Quality Eval

When real mission data is unavailable — during demo preparation, pre-ATO development phases, or cross-classification evaluation — synthetic data substitutes for real data. The quality of synthetic data directly determines the validity of any eval conducted on it. A model that performs well on low-fidelity synthetic data may perform materially differently on real mission data.

**Distribution-fidelity metrics for synthetic eval data:**

- **Schema completeness rate** — fraction of fields populated at realistic rates (a synthetic entity-resolution dataset where 40% of records are missing the entity identifier field is not representative of production data).
- **Entity-name plausibility score** — synthetic names and identifiers should pass basic plausibility checks; obvious placeholders ("Entity_001", "PERSON_ALPHA") bias model evaluation by creating artificially easy or artificially hard recognition tasks.
- **Temporal coherence** — event timestamps must follow realistic cadences (inter-event gaps, business-hour distributions, seasonal patterns relevant to the domain). Uniform random timestamps fail this check.
- **Label accuracy rate** — synthetic ground truth labels must be independently reviewable; the labeling logic must be documented and the error rate in the synthetic labels themselves must be estimated.

Cross-reference `gsd-synthetic-data-engineer` for generation tooling and schema-fidelity validation scripts. When reporting eval results on synthetic data, state explicitly that the data is synthetic and include the fidelity metrics above so a reviewer can assess the generalization gap.

**Acceptable use boundary:** Synthetic data eval results are appropriate for go/no-go decisions at prototype and pre-ATO phases. They are not appropriate as the primary evidence base for a production deployment claim without a subsequent HITL eval on real or mission-representative data. A synthetic-data result may be cited to justify proceeding to an HITL study; it does not substitute for one.

---

## See Also

- `tradecraft/icd-203.md` — ICD 203 analytic standards and Words of Estimative Probability definitions; governs hedging language in all measurement claims.
- `capability-patterns/entity-resolution.md` — entity resolution is a foundational layer for many IC AI/ML capabilities; eval patterns for entity-resolution models are a primary application of the Mission-Utility Metrics section.
- `capability-patterns/pattern-of-life.md` — pattern-of-life analytic models are a primary use case for HITL evaluation design and adversarial robustness testing.
- `modernization/modernization-themes.md` — specifically the AI/ML Adoption section, which grounds the model-governance and defensible-measurement-claims requirements in IC acquisition priorities.
