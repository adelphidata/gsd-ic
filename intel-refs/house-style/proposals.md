---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-12
applies_when: [proposal, far 15, ota, contract response, technical volume, management volume, past performance volume, cost volume, win themes]
---

# IC Proposal Templates

This reference defines the structural skeleton for IC proposal volumes consumed by `gsd-proposal-drafter` when generating FAR 15 and Other Transaction Authority (OTA) contract responses. Each volume is drafted as a separate file; this ref specifies the required subsections, the purpose each subsection serves, how subsections relate to one another, and how win themes from `.planning/win-themes.md` thread through the full document. Voice and tone are governed separately by the `adelphi-house-style` skill. Humans perform final review of all figures, compliance matrices, and cost tables before submission. The structural pattern here applies to competitive negotiated acquisitions under FAR Part 15; OTA-specific deviations are noted in each section.

---

## Technical Volume

The Technical Volume is the evaluator's primary lens on mission fit and technical credibility. It must map directly to the solicitation's evaluation criteria — typically Section M for FAR 15 acquisitions, or the equivalent framework in OTA solicitations (which often have more flexible structure requirements). Confirm mandatory section headings in the solicitation before finalizing the outline. Every subsection should be traceable to a specific evaluation criterion; content that does not tie to criteria wastes page count and evaluator attention.

**Subsections:**

- **Executive Summary** — A one-to-two page distillation of the offer's value proposition, written to
  be read independently by a senior evaluator who may not read the full volume. Anchors the proposal's
  win themes and key differentiators upfront. Should answer the implicit question: "Why this team for
  this mission?"

- **Technical Approach** — Narrative description of the methodology, tools, frameworks, and processes
  used to meet the requirement. Must be specific enough for a technical evaluator to assess feasibility;
  avoid marketing language and vague capability claims. Reference authoritative standards (e.g., NIST
  SP 800-series, NSA guidance, IC ITE frameworks). For analytic mission systems, address ICD 203
  analytic standards explicitly.

- **System Architecture** — Diagrams and supporting narrative describing the proposed solution
  architecture. For IC work, explicitly address classification-level support, cross-domain considerations,
  enclave constraints, ATO pathway, and relevant IC enterprise service integrations (IC ITE, ICITE data
  layer, NSA data ecosystem). Architecture descriptions should distinguish the proposed design from a
  generic COTS deployment.

- **Key Innovation Areas** — Articulates where the proposed approach advances the state of practice
  beyond baseline contract performance. Innovations must be defensible — cite evidence, prior results,
  or technical rationale for each claim. For IC AI/ML proposals, address model governance, explainability,
  and mission-representative performance evidence.

- **Evaluation Criteria Mapping** — A compliance matrix or narrative crosswalk tracing each Section M
  criterion (or OTA evaluation element) to the specific page, section, and paragraph where it is
  addressed. This is not optional; it directly enables evaluators to confirm compliance without
  searching the document.

- **Technical Risk and Mitigation** — Identifies material technical risks with likelihood and impact
  assessment and specific mitigation strategies. Risks should be genuine — evaluators discount proposals
  that claim no technical risk. Include schedule risk where the approach depends on customer-furnished
  equipment, facility access, or data outside the offeror's control.

*Win themes integration:* Load `.planning/win-themes.md` before drafting. Each theme with a technical dimension (novel architecture, proven toolchain, mission-relevant AI/ML) requires an explicit anchor in Technical Approach or Key Innovation Areas. Themes not surfaced in the technical narrative are invisible to technical evaluators who do not read the Management or Past Performance volumes.

---

## Management Volume

The Management Volume demonstrates that the team is structured, adequately staffed, and process-mature enough to deliver on schedule and within cost. For classified programs, evaluators scrutinize security plan substance and key-personnel clearance levels carefully. OTA agreements have lighter formal reporting requirements than FAR 15 cost-type contracts but still require a credible management narrative. Section lengths, resume formats, and required attachments vary across IC agencies — confirm solicitation requirements before building the outline. The volume should read as an integrated story: the org structure enables the schedule, the risk framework protects it, and the security plan ensures it all happens in the right environment.

**Subsections:**

- **Organizational Structure** — Org chart and supporting narrative showing how the prime, subcontractors,
  and teammates integrate into a functional delivery team. Clarify lines of authority, reporting
  relationships, and the single point of accountability to the Government COR/COTR. IC proposals should
  indicate cleared personnel ratios and facility clearance levels where relevant.

- **Key Personnel** — Resumes or abbreviated bios for each named Key Personnel position in the
  solicitation. Qualifications must meet solicitation-specified minimums exactly. Highlight direct
  mission-relevant experience in analogous IC programs; generic technical credentials are necessary
  but not sufficient in IC competitions where evaluators distinguish mission-experienced personnel
  from generic IT staff.

- **Schedule and Milestones** — Integrated master schedule (IMS) covering all phases from contract
  award through final deliverable and option periods. Phase milestones must map to PWS/SOW task
  deliverables. Include explicit assumptions about Government-furnished data, facility access timelines,
  and COR review turnaround that affect the critical path.

- **Risk Management** — Program-level framework describing how risks are identified, logged, tracked,
  escalated, and retired across the period of performance. Reference a standard probability-×-impact
  risk taxonomy and describe the cadence of risk reviews. Distinguish programmatic and schedule risks
  (addressed here) from technical risks (addressed in the Technical Volume); evaluators check for this
  distinction.

- **Subcontracting Plan** — Required under FAR 52.219-9 for large business prime offerors above
  applicable thresholds. Identify small business subcontractors by name where possible, describe their
  roles, and state participation percentages by dollar value. OTA agreements may not mandate a formal
  subcontracting plan — verify before devoting significant space to this subsection.

- **Security Plan** — Describes how the team maintains program security requirements throughout
  performance: facility clearance levels, personnel clearance processes and timelines for new hires,
  classified information handling procedures, foreign national access controls, and OPSEC measures.
  For SAP/SAR or other controlled-access programs, address compartment-specific requirements explicitly.

*Win themes integration:* Management volume themes typically center on low delivery risk, team depth, and proven program management discipline. Confirm `.planning/win-themes.md` risk and delivery themes appear substantively in the Risk Management and Key Personnel subsections, not only in introductory narrative.

---

## Past Performance Volume

Past performance is an independent evaluation factor under FAR 15.305(a)(2) and carries significant weight in IC competitions where evaluators can verify claims directly with Government references. Evaluators assess recency, relevancy, and quality — not volume of citations. Three tightly relevant citations outperform six loosely related ones. Citation data pulls from `.planning/past-performance/CITATIONS.md`; use that file's format exactly so `gsd-proposal-drafter` can resolve references without ambiguity. OTA solicitations may allow broader relevancy criteria than FAR 15 — confirm before eliminating borderline citations. Relevancy statements are the critical element; a strong statement can elevate a moderately relevant project.

**Subsections:**

- **Recent and Relevant Projects** — Three to five citations following the format in `.planning/past-performance/CITATIONS.md`. Each must include: contract number, contracting agency, period of performance, total contract value, a two-to-three sentence scope summary, and a relevancy statement explicitly mapping the cited work to the current solicitation's key technical and mission elements. "Recent" is typically within three to five years — confirm the solicitation's recency window before pulling citations.

- **Customer References** — Contact information for Government POCs who can speak directly to each cited program: name, title, organization, phone, and email. References must be cleared for contact and available within the source selection timeline. Stale contacts, unresponsive references, or contacts unfamiliar with the specific program materially damage past performance ratings. Confirm availability before submission.

- **Lessons Learned Application** — Narrative describing specific lessons from prior performance and how they are applied in the proposed technical approach and management plan. This converts past performance from a backward-looking credential into a forward-looking risk reducer. Name the challenge, describe what was learned, and state how the proposed approach applies it — generic organizational-learning prose does not score.

*Win themes integration:* Citation selection is itself a win-theme decision. Each cited project should be chosen in part because it directly substantiates one or more themes from `.planning/win-themes.md`. The Lessons Learned Application subsection is the explicit bridge between past execution and the differentiated claims made in the Technical and Management volumes.

---

## Cost Volume Narrative

The Cost Volume Narrative provides the Government with the basis for evaluating cost realism and price reasonableness. Under FAR 15.404-1, cost realism analysis applies to cost-reimbursement contracts; price reasonableness analysis applies to fixed-price. OTA agreements frequently use fixed-price milestone structures and may not require a formal cost volume at all — confirm solicitation requirements before building this section. The `gsd-proposal-drafter` agent structures the narrative, proposes labor categories and ODC line items, and documents assumptions; humans verify all rates, figures, and totals against current rate cards, fringe and overhead actuals, and the final negotiated contract structure before submission. No agent-generated cost figure should appear in a submitted proposal without human review and sign-off.

**Subsections:**

- **Basis of Estimate** — Documents the assumptions underlying every cost element: period of performance interpretation, scope boundaries, labor mix rationale, on-site vs. remote work assumptions, travel frequency, Government-furnished equipment that offsets cost, and fee arrangement assumptions. Every assumption must trace to a specific PWS/SOW paragraph — undocumented assumptions cannot be defended during negotiations or DCAA audit.

- **Labor Categories** — Lists all proposed labor categories with brief role descriptions, mapped to the solicitation's required skill mix or defined category list. For GSA Schedule or IDIQ task orders, categories must align to the base contract's approved list. Rates are proposed with documented market-rate assumptions; humans validate against current executed agreements or market surveys before submission.

- **Other Direct Costs (ODCs)** — Itemizes all non-labor direct costs: travel (by trip and destination), materials, subcontractor costs (with separate price proposals for large subs as required), equipment, software licenses, cloud hosting, and other direct charges. Travel estimates reference specific PWS requirements; equipment above the simplified acquisition threshold requires vendor quotes or published price list justification.

- **Fee Structure** — Describes the proposed fee type (fixed fee, award fee, incentive fee) and proposed fee percentage, with rationale grounded in contract type, risk allocation, and market practice for analogous IC programs. For cost-plus-award-fee structures, address alignment with the solicitation's award fee evaluation plan criteria if provided. Humans finalize fee percentages before submission.

*Win themes integration:* Cost volume rarely carries explicit discriminating win themes, but value-for-money and small business participation themes (if present in `.planning/win-themes.md`) must be reflected in the fee narrative and the subcontracting cost breakdown. A competitive price is itself a win theme on cost-weighted evaluations.

---

## Win-Themes Integration

Win themes are the strategic frame that transforms a compliant proposal into a competitive one. Load `.planning/win-themes.md` at the start of every drafting session and verify each theme has at least one substantive anchor in each volume before declaring a draft complete. Themes that appear only in the executive summary and disappear from the technical narrative fail to reinforce with evaluators who read volumes independently — a common pattern in IC source selections. Every theme should have a primary home and secondary echoes across volumes.

- **Technical Volume:** Themes with a technical dimension (novel architecture, proven toolchain, mission-relevant AI/ML, classification-aware compute) require an explicit anchor in Technical Approach or Key Innovation Areas. The Evaluation Criteria Mapping subsection should tag each theme's location so evaluators can confirm discriminators without searching.

- **Management Volume:** Team-depth, cleared-workforce, low-delivery-risk, and small business commitment themes surface in Key Personnel bios, Organizational Structure narrative, the Risk Management framework, and the Subcontracting Plan. The "low risk" theme is credible only when Risk Management names real risks and specific mitigations — not when it asserts low risk in prose.

- **Past Performance Volume:** Citation selection is itself a win-theme decision — cite projects whose scope and outcomes directly substantiate claimed themes. The Lessons Learned Application subsection is the explicit bridge from past evidence to forward-looking theme claims; without it, past performance and the proposal's themes float independently.

- **Cost Volume:** Value-for-money and cost-control themes (if present) belong in the Basis of Estimate narrative and fee rationale, grounded in documented assumptions. If a small business participation theme is load-bearing, the ODC subcontractor breakdown must reinforce it quantitatively.

---

## See Also

- `house-style/white-papers.md` — White paper conventions for pre-solicitation influence documents and RFI responses; many proposal win themes and technical arguments originate in white papers submitted during market research and industry days.
- `house-style/briefs.md` — Capability brief and slide conventions for orals presentations, Q&A sessions, and final presentation rounds that accompany written proposal evaluation in competitive IC acquisitions.
- `tradecraft/icd-203.md` — IC Directive 203 analytic standards that define what "good analysis" means from the customer's perspective; directly relevant to framing technical approach and evaluation criteria responses for analytic mission systems.
- `ecosystem/{customer}.md` — Customer-specific ecosystem files document mission priorities, active program lines, incumbent contractor relationships, historical award patterns, and evaluator sensitivities that must inform volume-level framing decisions for each specific opportunity.
