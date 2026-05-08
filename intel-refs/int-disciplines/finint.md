---
classification: UNCLASSIFIED
title: FININT — Financial Intelligence
topic_id: int-disciplines/finint
---

# FININT — Financial Intelligence

> **Phase 2 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

FININT is the collection and analysis of intelligence derived from financial transactions, flows, and records. It supports counter-proliferation, counter-narcotics, sanctions enforcement, and illicit-finance detection. Phase 2 focus: SWIFT messaging patterns, blockchain/virtual-asset tracing, sanctions screening, and illicit-finance analytic methodologies.

## Sub-disciplines

- **Transaction monitoring** — SWIFT MT/MX message analysis; correspondent banking flows; layering detection.
- **Virtual asset tracing** — blockchain analysis; VASP identification; on-chain / off-chain bridge detection.
- **Sanctions screening** — OFAC SDN list; EU consolidated sanctions; UN Security Council lists; PEP databases.
- **Illicit finance typologies** — trade-based money laundering (TBML); bulk cash; professional money laundering networks.

## Authoritative sources

- SWIFT Standards — *ISO 20022 Universal Financial Industry Message Scheme* (SWIFT / ISO). (Message format baseline.)
- FinCEN Advisories — *Financial Crimes Enforcement Network* advisories on typologies (US Treasury).
- FATF Recommendations — *International Standards on Combating Money Laundering* (FATF, 2023 revision).
- OFAC SDN List guidance — *Sanctions Compliance Guidance* (US Treasury / OFAC, current).

## Cross-references

- `tradecraft/icd-203.md` — analytic standards applicable to financial-intelligence assessments.
- `capability-patterns/entity-resolution.md` — entity disambiguation across financial records and beneficial ownership structures.

## Pack engineering notes

- Financial data (account numbers, beneficial owner identities, transaction amounts) MUST be treated as CUI minimum. Apply `gsd-classified-leak-detector` patterns.
- Virtual-asset tracing tooling prototyped against FININT findings may interface with `gsd-domex-engineer` blockchain-forensic pipelines.
