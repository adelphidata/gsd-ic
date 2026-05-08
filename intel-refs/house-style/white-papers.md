---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-12
applies_when: [white paper, technical paper, capability paper, pitch paper, ic deliverable, technical writing]
---

# IC White Paper Templates

This reference establishes content templates for IC-audience white papers, technical papers, capability papers, and pitch papers. It is consumed by `gsd-white-paper-drafter` to ground section structure and evidence patterns when drafting deliverables. Voice and tone rules — including classification hedging, sentence-level register, and forbidden phrase lists — are layered separately via the `adelphi-house-style` skill and are not repeated here. Guidance in each section below is prescriptive: treat it as a real writing instruction, not a placeholder.

---

## Usage Note

Each section template below includes: (a) a **Required elements** line listing the structural pieces the section must contain, (b) a guidance paragraph explaining what to write and how, and (c) 2–3 sample bullets that read as plausible IC content.

Samples use ICD 203 hedging norms where claims are extrapolated beyond test conditions. Bracket tokens such as `[CUSTOMER]` or `[MISSION DATASET]` are fill-in placeholders, not literal text.

Do not use marketing language ("game-changing," "best-in-class," "industry-leading") anywhere in a white paper; the IC reader will discount a document that reads like a product sheet. Do not assert analytic judgments without sourcing or evidence backing — unsupported assertions undermine credibility with technically literate government reviewers.

---

## Section Templates

### 1. Executive Summary

**Required elements:** mission gap statement · capability name and operational function · primary evidence reference · specific requested action.

The Executive Summary is a single paragraph (150–250 words) orienting a senior analyst or program manager who will not read the full paper. The first sentence must name the gap or problem — avoid preamble. Name the capability and state what it does in operational terms. Cite the headline evidence number and close with a concrete requested action (authorize a pilot, schedule a demo, issue a task order).

This section asserts; ICD 203 hedges belong in body sections where claims are tied to supporting evidence.

- Current SIGINT workflow requires analysts to manually correlate across three separate tools, adding an estimated four to six hours per target package; this prototype automates that step.
- Prototype evaluation against a representative mission dataset reduced median triage time from 5.2 hours to 1.1 hours across 42 test cases (see Section 7 for dataset details).
- The requested action is a 90-day pilot authorization on the [CUSTOMER] development enclave, with an ATO milestone at day 60 and a go/no-go review at day 45.

### 2. Problem Framing

**Required elements:** current analyst workflow description · specific workflow breakdown point · downstream mission consequence · explanation of why the problem is acute now.

Problem Framing grounds the paper in the specific analyst workflow that is broken or burdened. Describe the current state concretely: which tools the analyst uses, where the workflow fails, and what happens to the mission when that failure occurs. Do not label the problem "critical" or "urgent" — show the consequence instead (a target window closes, a lead goes unworked, a collection gap persists).

Explain why the problem is acute now: a new data source, a changed threat posture, a mission tempo shift, or an enterprise contract sunset removing a workflow dependency.

- Analysts working the [TARGET SET] problem receive raw feed data from three separate ingest systems with no automated deconfliction; cross-system correlation is performed manually using a shared spreadsheet updated at shift change.
- When feed volume spikes, the manual correlation backlog grows to 18–24 hours, meaning actionable leads surface after the relevant decision window has already closed.
- The enterprise contract for [LEGACY TOOL] expires in Q3 FY26 with no follow-on vehicle identified, removing the primary deduplication capability the current workflow depends on.

### 3. Capability Claim

**Required elements:** operational description of what the prototype does · evidence pattern (claim → quantified evidence → mission impact) · ICD 203 WEP hedging on extrapolated claims · explicit scope limitations.

Describe what the prototype does in mission terms, not implementation terms. Follow the evidence pattern for every major claim: state the claim, cite the quantified evidence, then state the mission impact. Do not assert precision the underlying data does not support, and state scope limitations explicitly rather than implying broader applicability.

Apply ICD 203 Words of Estimative Probability (WEP) when claims are extrapolated beyond test conditions — use "likely," "moderately likely," or "highly likely" calibrated to evidence strength, with a WEP parenthetical for audiences unfamiliar with IC usage.

- The prototype ingests, deduplicates, and correlates records from heterogeneous feed sources in under 90 seconds per batch; in controlled evaluation this reduced analyst triage time by 79% (from 5.2 to 1.1 hours) across 42 test cases drawn from [MISSION DATASET].
- Extrapolation to full operational volume is moderately likely (ICD 203 WEP: ~55–75% confidence) to sustain sub-two-hour triage cycles, contingent on infrastructure scaling to handle peak ingest rates observed during [OPERATIONAL PERIOD].
- The prototype does not currently handle [EXCEPTION CASE]; addressing that case requires an additional normalization step estimated at 3–4 weeks of engineering effort.

### 4. Mission Impact

**Required elements:** quantified analyst-level outcomes (hours saved · latency reduced · coverage breadth) · measurement period and dataset scope · explicit generalization caveats.

Translate the capability claim into analyst-level and mission-level outcomes. Quantify where possible: analyst hours recovered per analyst per week, reduction in lead latency (time from data arrival to analyst action), increase in targets covered per analyst, or reduction in decision cycle time.

Every quantified claim must include the measurement context — what was measured, over what period, on what dataset — and an explicit statement of what assumptions must hold for the result to generalize to operational conditions. Do not present prototype evaluation results as equivalent to operational results without qualification.

- Across the 42-case evaluation, analysts using the prototype averaged 1.4 hours per target package versus 5.8 hours in the baseline workflow; at current mission tempo this frees an estimated 22 analyst-hours per week across a five-analyst team.
- Measurement caveat: the evaluation dataset spans a six-week historical window and may not represent seasonal or surge-period volume; generalization to sustained peak conditions is moderately likely (ICD 203 WEP) pending an operational pilot of at least 90 days.
- Decision cycle reduction is assessed qualitatively from analyst self-report; a defensible quantitative measure requires instrumentation of the downstream tasking workflow, which was outside scope for this evaluation phase.

### 5. Technical Approach

**Required elements:** component list with roles · data flow from ingest to analyst interface · enclave boundary behavior · integration boundaries with existing mission systems · transition staging (low-side / mid / high) · standards references (ICD 503, NIST SP 800-37).

Provide an architecture sketch sufficient for a technical reviewer to assess feasibility, integration complexity, and security posture — without requiring deep software engineering background. Name the primary components and their roles, trace the data flow end to end, identify integration points with existing mission systems, and describe the transition staging plan across classification levels.

Reference specific standards (ICD 503, NIST SP 800-37 RMF) where the customer will need to see them named to route the paper to their ISSO or AO.

- The prototype consists of three components: an ingest normalizer (containerized), a correlation engine (graph-based, deployed on [PLATFORM]), and an analyst-facing web interface; all three run as OCI containers on customer-managed infrastructure with no external network dependencies.
- Data flow: raw feed records enter via [INGEST INTERFACE], pass through the normalizer for schema validation and deduplication, are written to the correlation graph store, and surface to the analyst interface as ranked candidate packages; no raw records cross the enclave boundary.
- Transition staging: low-side development complete on [UNCLASSIFIED ENVIRONMENT]; mid-tier integration testing planned for [SECRET ENVIRONMENT] in Q2; high-side operational deployment targets [TS/SCI ENCLAVE] in Q3 pending ATO; ICD 503 system security artifacts are in draft and available for government review.

### 6. Transition Path

**Required elements:** control inheritance mapping (inherited vs. new controls) · partition portability assessment per IC network · ATO milestone schedule tied to program dates · ISSO/AO engagement requirements.

Explain how the capability moves from its current state to a Program of Record (PoR) or sustained operational posture. Identify which security controls are inherited from the target environment's existing ATO package and which require independent assessment — customers use this breakdown to brief their ISSO and AO before committing to a pilot.

State whether the capability can be deployed across multiple IC partitions (NSANet, JWICS, SIPR) and what each additional partition requires. Map ATO milestones to specific program dates; a vague milestone is not actionable for an authorizing official.

- Control inheritance: deployment target is [CUSTOMER ENCLAVE] with an existing ATO covering [CONTROL BASELINE]; the prototype inherits [N] of [M] applicable controls; the [DELTA CONTROLS] require independent assessment estimated at 6–8 weeks with government ISSO engagement.
- Partition portability: current design supports single-enclave deployment; porting to a second partition requires re-evaluation of the normalization layer against that partition's data format standards and a separate ATO action estimated at 4–6 additional weeks.
- ATO milestone schedule: Authority to Test (ATT) targeted [DATE]; SSP submission for ATO targeted [DATE + 45 days]; ATO decision targeted [DATE + 90 days]; milestones are conditional on ISSO availability and no significant findings in penetration testing.

### 7. Supporting Evidence

**Required elements:** past performance citations linked to `.planning/past-performance/CITATIONS.md` · demo dataset provenance · evaluation result archive location with access instructions.

Provide the reviewable artifacts behind every claim in the paper. Point to specific locations rather than summarizing evidence the reviewer can examine directly. Include past performance citations by program name and contract vehicle, demo dataset references with provenance and access path, and evaluation result pointers with archive location and access instructions.

A reviewer who wants to validate a specific claim should be able to reach the artifact from this section without a follow-up question. Always link to `.planning/past-performance/CITATIONS.md` rather than restating citations inline.

- Past performance citations: see `.planning/past-performance/CITATIONS.md` for the complete list; relevant prior work includes [PROGRAM A] (contract vehicle [VEHICLE], period of performance [DATES]) and [PROGRAM B] (publicly available reference at [URL or document identifier]).
- Demo dataset: evaluation used a 42-case dataset assembled from [DATA SOURCE DESCRIPTION] covering a six-week window in [TIMEFRAME]; stored at [LOCATION / ACCESS PATH] and available for government reviewer access under data-sharing agreement [REFERENCE NUMBER].
- Evaluation results: raw triage-time measurements, analyst survey responses, and system performance logs are archived at [ARTIFACT LOCATION]; access requires [CLEARANCE LEVEL] and can be arranged through [POC NAME / ROLE].

---

## See Also

Linked refs are relative to the `intel-refs/` root unless prefixed otherwise.

- `tradecraft/icd-203.md` — ICD 203 analytic standards, Words of Estimative Probability definitions and calibration table, hedging requirements governing claim language in Sections 3 and 4.
- `ecosystem/{customer}.md` — customer-specific context (mission priorities, funded programs, incumbent vendors, known technical sensitivities) that informs framing in Sections 1 and 2.
- `house-style/proposals.md` — proposal-specific structure and FAR/DFARS compliance requirements; white papers transitioning into proposal volumes must be reconciled against the proposal template. Note: `proposals.md` is the authoritative source for volume-level compliance mapping; this doc governs pre-proposal white paper and pitch paper structure only.
- `house-style/briefs.md` — condensed brief format for audiences receiving white paper findings in a slide or verbal briefing context rather than a full read-ahead.

