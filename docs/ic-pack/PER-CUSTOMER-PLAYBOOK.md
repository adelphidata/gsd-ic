<!-- CLASSIFICATION: UNCLASSIFIED -->
# Per-Customer Playbook

## Audience and handling

Internal document. Redact before sharing externally (strip watch-outs, incident references, and program-name citations). Captures gotchas, language conventions, AO-specific compliance flavors, transition-target reality checks, and past-incident watch-outs per IC customer. Contents are best-effort and authored by program teams who have shipped to the customer. Entries marked `TBC` mean "not yet captured" rather than "will be added later". Treat this as living institutional knowledge, not authoritative tradecraft.

---

## Section template (per customer)

Copy this block when adding a new customer section or back-filling an existing one:

```markdown
## <CUSTOMER>
**Primary mission framings:** <2–3 sentences on how this AO frames its core mission>
**Common capability gaps:**
- <bullet>
**AO-specific compliance flavors:**
- <bullet — e.g., ATO authority, special IA requirements, network/enclave constraints>
**Tradecraft / language conventions:**
- <terminology to use and avoid in deliverables>
**Known PoR transition targets:**
- <program or capability class, with current status>
**Past-performance citation conventions:**
- <how to cite prior work for this customer — format, classification handling>
**Watch-outs:**
- <historical demo / delivery tripwires>
```

## CIA

**Primary mission framings:** CIA is the United States' principal foreign-intelligence service, operating under Title 50 authority. Its defining mission is clandestine HUMINT collection and all-source analysis to inform the President and senior policymakers. Capability pitches land best when framed against analytic production quality, source-attribution rigor, and covert-action support rather than bulk collection volume.

**Common capability gaps:**
- TBC — capture in next pilot AAR

**AO-specific compliance flavors:**
- CIA's classified IT environment (CITE) has its own approved-component library; production code targeting CITE must validate against CITE-approved stack before delivery.
- `intel-coding-conventions` "never log source attribution" rule is load-bearing for CIA mission systems — non-negotiable.
- ICD 203 analytic standards govern all CIA analytic products; conformance evidence should be part of any analytic-capability demo.

**Tradecraft / language conventions:**
- TBC — capture in next pilot AAR

**Known PoR transition targets:**
- TBC — capture in next pilot AAR

**Past-performance citation conventions:**
- TBC — capture in next pilot AAR

**Watch-outs:**
- CITE stack constraints can silently invalidate open-source dependencies that pass C2S/commercial checks; validate early against the CITE-approved list.
- Open Source Enterprise (now under DNI) corpus is publicly available and safe for unclassified dev-time prototyping; avoid conflating it with clandestine collection in demos.

## DIA

**Primary mission framings:** DIA is the principal foreign-military-intelligence agency of the DoD, providing all-source military intelligence to operators, planners, and policymakers. It is the IC's functional manager for MASINT (ICD 113). Capability pitches should emphasize support to military decision-making timelines and MASINT-aware collection or exploitation workflows.

**Common capability gaps:**
- TBC — capture in next pilot AAR

**AO-specific compliance flavors:**
- Many DIA programs run on JWICS; engineers should validate deployment topology against JWICS network assumptions before design is locked.
- MASINT-related code paths require partition-aware ARN handling per `intel-coding-conventions` when targeting DoD-managed cloud.
- DoDI 5105.21 and ICD 113 are the authoritative references for scope and authority.

**Tradecraft / language conventions:**
- TBC — capture in next pilot AAR

**Known PoR transition targets:**
- TBC — capture in next pilot AAR

**Past-performance citation conventions:**
- TBC — capture in next pilot AAR

**Watch-outs:**
- The DIA Director is dual-hatted as J2/Joint Staff; proposals touching joint-intelligence workflows may require separate J2-track approval in addition to DIA program office buy-in.
- Worldwide Threat Assessment (public, annual) is a safe unclassified corpus for ICD 203 conformance experiments; cite it as "DIA WTA" not "DIA analytic product."

## NGA

**Primary mission framings:** NGA is the IC's functional manager for GEOINT (ICD 113), serving both DoD and the broader IC with imagery, FMV, and geospatial-information products. It stewards GEOINT standards and ATO/accreditation guidance for GEOINT systems. Capability pitches are strongest when they address GEOINT exploitation tradecraft, activity-based intelligence, or NSDs compliance rather than generic data-science approaches.

**Common capability gaps:**
- TBC — capture in next pilot AAR

**AO-specific compliance flavors:**
- NGA programs typically run on AWS C2S or SC2S, or NGA-managed enclaves; `intel-coding-conventions` partition-aware AWS calls are required.
- Imagery pipelines targeting NGA are subject to NGA Standardization Documents (NSDs); engineers must reference the relevant NSD before building format-specific code.
- NGA Open Data is a usable fixture source for unclassified prototyping; do not conflate with classified imagery deliverables in demo materials.

**Tradecraft / language conventions:**
- TBC — capture in next pilot AAR

**Known PoR transition targets:**
- TBC — capture in next pilot AAR

**Past-performance citation conventions:**
- TBC — capture in next pilot AAR

**Watch-outs:**
- GEOINT tradecraft tradeoffs (resolution vs. revisit rate, EO vs. SAR vs. hyperspectral) should be acknowledged in analytic-capability demos; generic "imagery analytics" framing lands poorly with NGA audiences.
- Foundation GEOINT (basemaps, AGI) has distinct accreditation requirements from tasked-collection pipelines; confirm which tier a program touches before scoping an ATO.

## NRO

**Primary mission framings:** NRO designs, acquires, and operates the United States' overhead reconnaissance satellites, delivering IMINT and SIGINT collection to NGA and NSA respectively. It is the collection originator, not the exploitation authority. Capability pitches should map to the collection-to-exploitation handoff boundary: NRO cares about collection reliability, ground-system resilience, and formal handoff-point integrity rather than downstream analytic tradecraft.

**Common capability gaps:**
- TBC — capture in next pilot AAR

**AO-specific compliance flavors:**
- Aerospace-grade software development standards (analogous to NASA or DoD STIG-equivalent) typically apply on NRO programs; coding rigor expectations are higher than a typical IC program office.
- Strong segregation between collection and exploitation domains is structural; code crossing that boundary requires explicit authority and interface definition.
- DoDI 5105.23 and ICD 502 are the primary authoritative references.

**Tradecraft / language conventions:**
- TBC — capture in next pilot AAR

**Known PoR transition targets:**
- TBC — capture in next pilot AAR

**Past-performance citation conventions:**
- TBC — capture in next pilot AAR

**Watch-outs:**
- NRO programs touch space-vehicle ground systems; launch and mission-operations integration concerns are in scope and surface late if not asked about upfront.
- The producer→consumer handoff model with formal data-flow points means APIs that work fine in a DoD cloud context may need re-architecture to satisfy NRO's segregation requirements.

## NSA

**Primary mission framings:** NSA is the IC's functional manager for SIGINT (ICD 113 / ICD 200) and the national authority for cryptology, cybersecurity standards (NIAP / Common Criteria), and information assurance. It is co-located with US Cyber Command. Capability pitches must address cryptographic rigor, disconnect-tolerant operation, and SIGINT-selector handling precision; generic ML-analytics framing without explicit IA posture is a fast path to disqualification.

**Common capability gaps:**
- TBC — capture in next pilot AAR

**AO-specific compliance flavors:**
- NSA-mission code is held to the highest cryptographic and IA standards in the IC; `intel-coding-conventions` "no commercial-internet-only dependencies" rule applies absolutely with no exceptions.
- USP (US Person) data handling is governed by USSID 18 minimization rules; any code touching collection metadata must implement and demonstrate minimization compliance.
- NSA programs frequently target air-gapped and high-side environments; pipeline design must assume disconnect-tolerance from day one.

**Tradecraft / language conventions:**
- TBC — capture in next pilot AAR

**Known PoR transition targets:**
- TBC — capture in next pilot AAR

**Past-performance citation conventions:**
- TBC — capture in next pilot AAR

**Watch-outs:**
- SIGINT selector-handling rigor is a first-class review criterion; any demo that treats selectors as opaque strings without provenance or minimization handling will fail technical review.
- The cybersecurity and SIGINT directorates have distinct acquisition channels; confirm which directorate owns a program before scoping — a pitch tuned for Cybersecurity Directorate may not translate to Signals Intelligence Directorate and vice versa.

## Adding entries

When a program team accumulates new gotchas, language learnings, or ATO watch-outs for a customer, contribute via a PR against this file.

**PR requirements:**
- One section per customer per PR; do not bundle multiple AO updates in a single commit.
- PR description must include an AAR or incident reference (e.g., "AAR-2026-Q2-NGA-pilot") so reviewers can assess provenance.
- Redact before merging: strip program names, exact dates, and individual names. Write at the level of "a delivery team found that..." not naming specific contracts or personnel.
- `TBC` fields may be replaced or expanded; do not remove a `TBC` without replacing it with substantive content.
- Do not add entries sourced from public tradecraft guides — only content a program team can trace to a real delivery experience.
