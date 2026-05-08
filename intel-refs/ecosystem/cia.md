---
classification: UNCLASSIFIED
title: CIA — Central Intelligence Agency
topic_id: ecosystem/cia
---

# CIA — Central Intelligence Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

CIA is the principal foreign-intelligence service of the United States. Headquartered in Langley, VA. Reports to the Director of National Intelligence; the CIA Director also chairs the National Counterterrorism Center's intelligence component.

## Mission

- Collect, process, and analyze foreign intelligence to inform the President, NSC, and senior policymakers.
- Conduct covert action when authorized by the President under Title 50.
- Lead all-source analysis on geopolitical, economic, scientific, and technological topics of foreign-intelligence interest.

## Primary INTs

- **HUMINT** (primary; clandestine human-source operations are CIA's defining mission).
- **All-source analysis** (consuming GEOINT, SIGINT, OSINT, and HUMINT).
- **OSINT** (Open Source Enterprise was CIA-managed before transitioning to DNI).

## Operational footprint

- Directorate of Operations (clandestine HUMINT collection).
- Directorate of Analysis (all-source product).
- Directorate of Digital Innovation (digital, cyber).
- Directorate of Science & Technology (technical collection).
- Directorate of Support.

## Authoritative sources

- cia.gov — public web presence.
- *Studies in Intelligence* (CIA's unclassified scholarly journal).
- ICD 304 — *Human Intelligence* (DNI; CIA-influenced).
- 50 U.S. Code Ch. 15 — *National Security* (Title 50 authority basis).

## Cross-references

- `int-disciplines/humint.md` — CIA's primary collection discipline.
- `tradecraft/icd-203.md` — analytic standards govern CIA's analytic products.

## Pack engineering notes

- CIA-mission systems often process source-attribution metadata; `intel-coding-conventions`'s "never log source attribution" rule is foundational.
- CIA's classified IT environment (CITE) has its own stack constraints; production code targeting CITE must validate against CITE-approved component libraries.
- Open-Source Center products (now under DNI) are publicly available; useful as unclassified analytic-product corpora for ICD 203 conformance experiments.
