---
classification: UNCLASSIFIED
title: NIST SP 800-53 Rev 5 — Security and Privacy Controls
topic_id: tradecraft/nist-800-53-rev5
---

# NIST SP 800-53 Rev 5 — Security and Privacy Controls

> **Phase 1 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

NIST SP 800-53 Rev 5 (September 2020) is the federal baseline catalog of security and privacy controls for information systems and organizations. It defines 20 control families (AC, AT, AU, CA, CM, CP, IA, IR, MA, MP, PE, PL, PM, PS, PT, RA, SA, SC, SI, SR) organized across three impact baselines — Low, Moderate, and High — as defined by FIPS 199 categorization. Rev 5 added a dedicated Privacy control family (PT) and Supply Chain Risk Management (SR) family absent from earlier revisions.

## Control families (abbreviated)

AC (Access Control), AT (Awareness & Training), AU (Audit & Accountability), CA (Assessment, Authorization & Monitoring), CM (Configuration Management), CP (Contingency Planning), IA (Identification & Authentication), IR (Incident Response), MA (Maintenance), MP (Media Protection), PE (Physical & Environmental Protection), PL (Planning), PM (Program Management), PS (Personnel Security), PT (Personally Identifiable Information Processing & Transparency), RA (Risk Assessment), SA (System & Services Acquisition), SC (System & Communications Protection), SI (System & Information Integrity), SR (Supply Chain Risk Management).

## Baselines

- **Low baseline:** ~100 controls; minimal impact systems.
- **Moderate baseline:** ~225 controls; default for most federal/DoD contractor systems handling CUI.
- **High baseline:** ~330 controls; national-security and high-impact systems.

## Authoritative sources

- NIST SP 800-53 Rev 5 — *Security and Privacy Controls for Information Systems and Organizations* (NIST, Sept 2020). https://doi.org/10.6028/NIST.SP.800-53r5
- NIST SP 800-53B — *Control Baselines for Information Systems and Organizations* (NIST, Oct 2020).
- FIPS 199 — *Standards for Security Categorization of Federal Information and Information Systems* (NIST, Feb 2004).
- NIST SP 800-37 Rev 2 — *Risk Management Framework* (NIST, Dec 2018).

## Cross-references

- `tradecraft/cmmc-2.0.md` — CMMC Level 2 maps to NIST 800-171 (a subset of 800-53 Moderate).
- `tradecraft/nist-800-171.md` — the CUI-specific 110-control subset.
- `tradecraft/poam-format.md` — POA&M rows reference 800-53 control IDs (e.g., `AC-2`, `SI-7`).
