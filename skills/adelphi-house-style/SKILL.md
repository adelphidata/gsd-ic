---
name: adelphi-house-style
description: Adelphi voice rules — confident-not-boastful tone, pronoun discipline, evidence cadence, prohibited phrases; behavioral overlay on top of intel-refs/house-style/{white-papers,proposals,briefs}.md content templates
classification: UNCLASSIFIED
ic_pack: true
injected_into: [gsd-white-paper-drafter, gsd-proposal-drafter, gsd-capability-brief-generator, gsd-capability-statement-generator, gsd-mission-narrative-writer]
activation: always
---

# Adelphi House Style

You are injecting the **adelphi-house-style** skill. Apply these voice rules to every sentence you draft in white papers, proposals, capability briefs, capability statements, and mission narrative blocks. This skill is a behavioral overlay: the content templates in `intel-refs/house-style/` tell you what to write; these rules govern how you write it. Every rule here applies before you emit any deliverable text. The skill itself is written in its own voice — read it as an exemplar, not as background information.

## Voice Rules

### Rule 1 — Tone

Write with confidence grounded in demonstrated results. Name the mission, name the capability, name the outcome. Do not reach for superlatives; let evidence carry the weight.

- **Good:** "Adelphi's entity-resolution pipeline reduced cross-domain deconfliction time at NGA from 14 days to 36 hours, freeing analyst cycles for all-source fusion."
- **Bad:** "Adelphi delivers best-in-class, game-changing AI-powered analytics that revolutionize intelligence workflows."

The first sentence earns its authority. The second claims authority it has not demonstrated. Confident prose asserts a specific result; boastful prose asserts importance without evidence.

### Rule 2 — Pronoun Discipline

"We" refers to the program team executing the contract — analysts, engineers, PMs named in Section C. "We" never refers to Adelphi Technologies as a company asserting corporate identity.

- **Good:** "We will deploy the extraction pipeline in two sprints, with the program manager coordinating directly with the NRO contracting officer."
- **Bad:** "We at Adelphi have years of experience delivering solutions to the IC community."

Reserve third-person "Adelphi" for formal citations of past performance. In proposal body text and narrative blocks, "we" is the team the government is buying.

### Rule 3 — Evidence Cadence

Every substantive claim follows a three-step pattern: **claim → quantified evidence → mission impact**. No claim stands without evidence. No evidence stands without connecting it to mission effect.

**Pattern:**
> [Claim]. [Quantified evidence]. [Mission impact].

**Example:**
> Adelphi's geospatial anomaly-detection model flags priority sites with 94% precision at NGA's production ingest rate of 2.4 TB/day. In a 90-day pilot, analysts acted on 340 flagged sites; 312 were confirmed as valid targets by all-source review. The reduction in false-positive triage freed approximately 1,200 analyst-hours, directly expanding GEOINT production capacity during a high-tempo collection period.

Never compress the pattern into one sentence. Three sentences establish credibility; one sentence reads as assertion.

### Rule 4 — Prohibited Phrases

Do not use any of the following in deliverable text. No exceptions, no paraphrases that preserve the underlying concept.

- "best-in-class"
- "industry-leading"
- "game-changing"
- "revolutionary" / "revolutionize"
- "synergistic" / "synergy"
- "leverage" (as a verb — use "use", "apply", "deploy")
- "AI-powered" without an immediately following parenthetical specifying the model type, training data, or inference method
- "next-generation"
- "cutting-edge"
- "state-of-the-art" (unless citing a peer-reviewed benchmark with a date)
- "holistic"
- "robust solution"
- "seamless integration"
- Vague analyst-filler: "actionable insights", "informed decision-making", "enhanced situational awareness" without specific quantification

If you find yourself reaching for any of these, stop and ask: what specifically happened, at what scale, with what result?

### Rule 5 — Sentence Length

Target 12-22 words per sentence in body paragraphs. Short sentences anchor transitions and topic statements (8-12 words). Long sentences are permitted for technical specifications with enumerated conditions, where compression would lose precision — but a sentence over 30 words must be audited for a split. Vary length deliberately: a sequence of 22-word sentences reads as monotone.

### Rule 6 — Structural Patterns

Apply these layout rules in every deliverable section:

- **Claim → evidence → impact rhythm:** Use three-sentence paragraphs for capability claims (see Rule 3). Do not pad to four or compress to one.
- **Tables for comparisons:** Whenever you compare two or more approaches, systems, or configurations, use a Markdown table. Prose comparisons obscure differences; tables expose them.
- **Bullets for lists of three or more:** Three or more parallel items become a bulleted list, not a run-on sentence with commas. Two items may stay inline.
- **Section leads:** Open every major section with a one-sentence claim that could stand alone as a finding. Do not open with context-setting throat-clearing ("This section describes...").
- **No orphan bullets:** Every bullet list is preceded by a complete sentence that frames what the list contains.

---

## Examples

### Example 1 — Capability claim rewrite

**Before (bad):**
> Adelphi leverages best-in-class AI-powered analytics to deliver holistic, game-changing solutions that provide actionable insights and enhance situational awareness for IC customers.

**After (good):**
> Adelphi's named-entity extraction model — a fine-tuned RoBERTa variant trained on IC-formatted reporting — identifies entity co-occurrence patterns across 14 intelligence disciplines. In a 60-day DIA proof-of-concept, the model surfaced 47 previously uncorrelated entity clusters; analysts confirmed 39 as operationally significant. Reduced manual cross-referencing time by 28% during the evaluation period.

---

### Example 2 — Pronoun discipline rewrite

**Before (bad):**
> We at Adelphi have revolutionized the way the intelligence community approaches data fusion, and our industry-leading platform seamlessly integrates with existing IC infrastructure.

**After (good):**
> We will integrate the fusion pipeline with the customer's existing JWICS-hosted data fabric using a REST adapter that requires no modification to downstream analytic tools. Integration testing is scheduled for Sprint 4, with the program lead coordinating directly with the contracting officer's representative.

---

### Example 3 — Evidence cadence applied to past performance

**Before (bad):**
> In a previous NGA engagement, Adelphi delivered next-generation geospatial analytics that provided enhanced situational awareness and improved decision-making for analysts.

**After (good):**
> Under NGA Task Order 2024-GEO-114, Adelphi delivered a change-detection pipeline processing 1.8 TB of SAR imagery per day against a baseline of 0.6 TB. Analysts identified 23% more sites of interest in Q3 2024 compared to the prior quarter, with zero pipeline downtime during a 90-day operational window. The improved throughput allowed NGA to retire one manually-operated workflow and reallocate two FTEs to higher-priority collection tasks.

---

### Example 4 — Prohibited-phrase replacement in an NSA proposal

**Before (bad):**
> Our synergistic approach leverages state-of-the-art cryptographic AI-powered tools to deliver robust, next-generation SIGINT processing capabilities.

**After (good):**
> The proposed SIGINT processing architecture combines homomorphic encryption at the ingestion layer with a transformer-based classifier (BERT-large, fine-tuned on 40M labeled SIGINT tokens) for automated traffic categorization. In a prior NSA pilot, the combined pipeline processed 500K records per hour with a false-accept rate below 0.3%. That precision level meets NSA's published threshold for automated pre-screening without human-in-the-loop review.

---

## When this skill applies

Apply these rules when producing any of the following:

- White papers submitted to IC program offices or contracting authorities
- Proposal volumes (technical, management, past performance) for IC solicitations
- Capability briefs distributed to government customers or teaming partners in a competitive context
- Capability statements (SF-129 attachments, sources-sought responses, market survey responses)
- Mission narrative blocks — the "so what" paragraphs that connect technical capability to mission effect in briefings, decks, or executive summaries

---

## When this skill does NOT apply

Do not apply these rules to:

- Internal documentation (architecture decision records, sprint planning notes, retrospective reports)
- Technical specifications (API contracts, data dictionaries, system design documents)
- Code comments, commit messages, or pull request descriptions
- `.planning/` files including SUMMARY.md, POAM.md, and AAR archives
- Communications between team members (Slack, email threads, meeting notes)

In those contexts, clarity and precision matter; style discipline and prohibited-phrase enforcement do not.
