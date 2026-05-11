---
classification: UNCLASSIFIED
topic: tradecraft/words-of-estimative-probability
title: Words of Estimative Probability (WEP)
applies_when: [wep, words of estimative probability, sherman kent, confidence language, hedging, estimative language, icd 203, analytic confidence]
ic_pack: true
owners: [intel-pack@adelphi.ai]
last_reviewed: 2026-05-11
---

# Words of Estimative Probability (WEP)

Words of Estimative Probability (WEP) is the standardized IC vocabulary for communicating analytic
confidence in finished intelligence products. Analysts use WEP terms in place of raw percentages or
uncontrolled hedging language to give readers a calibrated, unambiguous signal about how much confidence
underlies an analytic judgment — distinct from the sources that inform it and the facts those sources
report.

WEP originates with Sherman Kent's 1964 essay "Words of Estimative Probability," published in *Studies
in Intelligence*, the in-house journal of the Central Intelligence Agency. Kent observed that common
hedging words ("probably," "might," "could") carried wildly different probability interpretations across
readers, destroying the communicative function of the hedge. His proposal: fix a small vocabulary of
estimative terms and bind each term to a probability band, so that "likely" means the same thing to
every producer and consumer of finished intelligence.

The modern IC WEP table is published as part of ICD 203 implementation guidance and is the canonical
reference for hedging language in any analytic claim disseminated across the IC or to IC customers.
Compliance with WEP conventions is required under ICD 203 §C.6.5(2), which mandates that analysts
"properly express and explain confidence in analytic judgments." Any analytic product audited by
`gsd-icd-203-enforcer` is evaluated against the table below.

**Canonical version for Adelphi products:** The ODNI 2015 publication of the WEP table. Other
publications — including NATO Intelligence Doctrine (which uses an eight-band variant) and some legacy
IC training materials — use slightly different band boundaries. The seven-band, ODNI 2015 version is
the authoritative reference for all Adelphi IC pack products. Future maintainers should not "correct"
the table against other sources; any change requires an explicit policy decision and a `last_reviewed`
update to this file.

## The 7-Band Vocabulary

| WEP Term | Confidence Band | Usage Signal |
|---|---|---|
| almost certainly | 95–100% | Judgment is supported by overwhelming evidence; alternative explanations are effectively excluded |
| highly likely | 80–95% | Strong evidence; residual uncertainty is minor and does not change the analytic bottom line |
| likely | 55–80% | Reasonable evidence; uncertainty is present and material but does not tip the balance |
| roughly even chance | 45–55% | Evidence roughly balances; neither outcome is clearly favored |
| unlikely | 20–45% | Evidence favors the complement; the stated outcome is plausible but not well-supported |
| highly unlikely | 5–20% | Strong evidence against; the stated outcome is a low-probability residual |
| almost no chance | 0–5% | Overwhelming evidence against; the stated outcome is effectively excluded |

**Note on band thresholds:** The boundaries above reflect the ODNI 2015 implementation of the Kent WEP
table. The 55/80/95 breakpoints (and their mirrors at 45/20/5) are the Adelphi canonical values.
Slight variations appear across IC publications; when a source product cites a different band mapping,
note the discrepancy but apply the Adelphi canonical table for compliance evaluation.

## When to Use Which Band

Selecting the correct WEP band is an analytic judgment, not a mechanical counting of sources. The
following guidance describes the evidentiary standard each band implies:

**`almost certainly`** — Reserve for claims where corroborating evidence is so strong that alternative
explanations have been explicitly considered and excluded. Multiple independent collection streams
converging on the same conclusion, with no credible disconfirming evidence, support this band. Using
`almost certainly` for any claim with a live alternative explanation overstates confidence.

**`highly likely`** — Appropriate when the evidence is strong and directionally consistent, but a minor
alternative remains theoretically possible. The analyst has considered and can name the residual
uncertainty; it does not change the bottom line but it cannot be fully excluded.

**`likely`** — The workhorse band for finished analytic judgments where evidence is reasonable but not
overwhelming. The analyst's reading of the available evidence favors this outcome, but a reasonable
analyst working the same material might weigh it differently. "Likely" is not a weak hedge — it carries
a specific 55–80% implication and should not be inflated toward `highly likely` without corresponding
evidentiary support.

**`roughly even chance`** — Use when the evidence genuinely splits — not as a hedge to avoid committing
to a position, but as an honest characterization of epistemic balance. Overuse of `roughly even chance`
is a sign that the analyst is avoiding a judgment call rather than making one.

**`unlikely`, `highly unlikely`, `almost no chance`** — The lower bands mirror the upper bands in
evidentiary standard. `unlikely` implies evidence favoring the complement but with material uncertainty;
`highly unlikely` implies strong evidence against; `almost no chance` implies the outcome is effectively
excluded by the available evidence. Lower bands are underused in practice; analysts tend to drop to
`unlikely` when the evidence would support `almost no chance`.

**Avoiding "possibly":** The word "possibly" is not a WEP term. It carries no calibrated band semantics —
readers interpret it anywhere from 10% to 50% depending on context and personal priors. ICD 203 treats
"possibly" (and similar uncalibrated terms) as non-compliant hedging. When evidence is genuinely thin,
use `roughly even chance` or `unlikely` with an explicit sourcing note rather than "possibly."

## Forbidden Patterns

ICD 203 identifies categories of WEP misuse that recur in finished analytic products. The following
patterns are treated as violations in `gsd-icd-203-enforcer` audits:

**Uncalibrated qualifiers.** Terms such as "very likely," "almost positively," "pretty certain,"
"moderately confident," or "very probably" are not WEP bands. They do not map to a defined probability
range and cannot be evaluated against the ICD 203 standard. All analytic confidence language in finished
products must use a term from the 7-band table.

**WEP terms applied to known facts.** WEP bands express confidence in analytic *judgments* — predictions,
assessments, or inferences that go beyond the directly observed record. Applying a WEP term to an
established, cited fact ("the meeting almost certainly occurred on 14 March") is a category error: if
the fact is sourced and confirmed, it does not require a confidence band; if it requires a confidence
band, it is a judgment, not a sourced fact. Analysts should use WEP only where the band applies to an
inference or extrapolation, not to the factual record underlying it.

**WEP terms mixed with numeric probabilities in the same sentence.** Analytic products should express
confidence either through WEP vocabulary or through a numeric probability, not both simultaneously.
Constructions such as "the program is likely (approximately 67% probability) to be operational by Q3"
embed a precision claim that the WEP band cannot support and that the numeric figure may contradict.
If a specific numeric estimate is warranted (e.g., a quantitative risk model output), it should be
presented separately from the WEP-hedged analytic judgment, with an explicit note on the source of
the numeric estimate.

**Bands that contradict the body of evidence cited.** A WEP term that is inconsistent with the
reliability and credibility of the cited sources constitutes a compound violation — a WEP error and a
sourcing error. Example: asserting `almost certainly` for a claim resting on a single F-6 source
(reliability cannot be judged; information cannot be confirmed) overstates the evidentiary foundation.
The WEP band must be calibrated to the sourcing picture, not to the analyst's intuition.

**Band stacking.** Using two WEP terms together ("highly likely to almost certainly") to suggest a
finer distinction than the 7-band table supports. The table does not have inter-band entries; pick the
band whose boundaries best contain the intended confidence level.

## How gsd-icd-203-enforcer Uses This Ref

The `gsd-icd-203-enforcer` agent reads the 7-band WEP table and the forbidden patterns defined in this
reference when auditing an analytic artifact for uncertainty-expression compliance. The audit workflow
for WEP discipline is:

1. The enforcer scans every analytic judgment in the artifact for a WEP term or a WEP-absent confidence
   hedge.
2. It checks whether the term appears in the 7-band table. Uncalibrated terms (not in the table)
   produce an immediate finding.
3. For terms that are in the table, it checks for forbidden-pattern conditions: WEP applied to a cited
   fact, WEP mixed with a numeric probability, or a band visibly inconsistent with the cited sources.
4. WEP-absent analytic judgments — claims that express a degree of confidence without any WEP term —
   are flagged for missing hedging vocabulary.

All WEP findings surface in the enforcer's output under the `## ICD 203 VIOLATIONS FOUND` block with
the `wep` category tag. Each finding maps to ICD 203 §C.6.5(2) (uncertainty expression) and identifies
the specific violation type: `uncalibrated-qualifier`, `wep-on-fact`, `wep-numeric-mix`,
`evidence-band-mismatch`, `band-stacking`, or `missing-wep`. Violations carry a severity of **Major**
(uncalibrated qualifier, WEP applied to a fact, WEP-numeric mix) or **Minor** (band marginally
inconsistent with evidence, lower-band underuse where a stronger band is defensible).

The enforcer reads the band table from this reference at runtime; changes to the table in this file
propagate immediately to enforcement behavior. Any change to the canonical band boundaries requires
an explicit policy decision, a `last_reviewed` update, and a note in the commit message.

## How gsd-ai-eval-auditor Uses This Ref

The `gsd-ai-eval-auditor` agent applies WEP discipline to measurement claims when reviewing AI/ML
evaluation artifacts. Eval artifacts routinely extrapolate from controlled test conditions to
operational performance; those extrapolations are analytic judgments and must be hedged with WEP
vocabulary.

The specific obligation, per `ai-ml/eval-patterns.md` ("Defensible Measurement Claims" section):
claims about operational performance that exceed tested conditions require a WEP band. A claim that
a model will sustain evaluation-period performance at operational volume — where operational volume,
infrastructure, or analyst population differs from the test environment — is an inference, not a
measured result. The auditor checks that such claims carry an appropriate WEP term and a corresponding
qualification of the conditions under which the claim holds.

**Band calibration for eval claims:**

- `likely` (55–80%) is appropriate for operational-generalization claims supported by reasonable test
  evidence and plausible scaling assumptions.
- `highly likely` (80–95%) requires test evidence that directly addresses the operational condition —
  for example, an evaluation that included load testing at operational volume, or adversarial testing
  at the target threat level.
- Claims that depend on untested infrastructure scaling, clearance-level changes, or mission
  environments not represented in the evaluation dataset do not support bands above `likely`.

Point estimates presented without confidence intervals, and prototype results presented without
explicit qualification of generalization conditions, are flagged as WEP-absent measurement claims —
the eval artifact equivalent of a WEP-missing finding in a finished analytic product.

## Authoritative Source

- Sherman Kent, "Words of Estimative Probability," *Studies in Intelligence*, Fall 1964. Public-domain;
  widely reprinted. Canonical source for the theoretical basis and original band framework. Cite by title
  and publication; do not transcribe.
- ODNI ICD 203 implementation guidance (public). The seven-band table above reflects the ODNI 2015
  publication. Cite as: *ICD 203 Analytic Standards — Implementation Guidance*, ODNI, 2015. Do not
  transcribe the full directive; this scaffold captures the WEP-specific standards.

## See Also

- `tradecraft/icd-203.md` — parent directive; §C.6.5(2) is the analytic standards obligation that
  WEP compliance satisfies. `gsd-icd-203-enforcer` evaluates WEP findings against this section.
- `tradecraft/icd-206.md` — paired companion reference (this phase); ICD 206 governs sourcing
  standards (§C.6.5(1)), which run parallel to uncertainty-expression standards (§C.6.5(2)) in
  `gsd-icd-203-enforcer` audits. WEP band selection and source reliability/credibility ratings are
  orthogonal but jointly required for a compliant finished product.
- `ai-ml/eval-patterns.md` — eval artifact standards; the "Defensible Measurement Claims" section
  describes the operational-generalization obligation that drives WEP use in eval audits. The WEP
  paragraph in that section cross-references this ref as the canonical band table.
