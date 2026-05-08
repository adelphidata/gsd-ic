---
classification: UNCLASSIFIED
title: NSA — National Security Agency
topic_id: ecosystem/nsa
---

# NSA — National Security Agency

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NSA is the IC's functional manager for SIGINT (signals intelligence) and the lead US authority for cybersecurity and information assurance. Co-located with US Cyber Command at Fort Meade, MD. NSA also manages the Central Security Service (CSS), the cryptologic combat support agency.

## Mission

- Collect, process, and disseminate SIGINT for national security and military operations.
- Functional manager (per ICD 113 / 200) for SIGINT.
- National authority for cryptologic systems, cybersecurity standards (NIAP / Common Criteria), and IA.

## Primary INTs

- **SIGINT** (primary) — comint, elint, fisint.
- **Cyber Defense / CNO support**.
- **MASINT** subordinate sub-disciplines that fall under SIGINT collection (e.g., RFINT).

## Operational footprint

- Cybersecurity Directorate (defensive mission).
- Signals Intelligence Directorate (offensive collection mission).
- Research Directorate.

## Authoritative sources

- nsa.gov — public web presence.
- ICD 113 — *Functional Managers for IMINT/GEOINT/SIGINT/MASINT*.
- USSID 18 — *Limitations and procedures in signals intelligence operations* (governs USP-related SIGINT).
- CNSSP 28 — *Policy on the use of public-key cryptography for the protection of US national security systems* (NSA-led).

## Cross-references

- `int-disciplines/sigint.md` — to be added in Phase 2 per spec §13.
- `tradecraft/icd-203.md` — analytic standards apply to SIGINT-derived assessments.

## Pack engineering notes

- NSA-mission code is held to the highest cryptographic and IA standards in the IC. `intel-coding-conventions`'s "no commercial-internet-only deps" rule applies absolutely.
- USP (US Person) data handling has specific procedures (USSID 18); any code touching collection metadata must respect minimization rules.
- NSA programs frequently target air-gapped and high-side environments; early pipeline design should assume disconnect-tolerance.
