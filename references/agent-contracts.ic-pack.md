<!-- CLASSIFICATION: UNCLASSIFIED -->
# IC Pack Agent Contracts (Completion Marker Registry)

This file is the IC-pack-specific completion-marker registry, loaded alongside upstream `references/agent-contracts.md`. Every IC pack agent's completion marker is registered here.

Format (one row per agent):

```
| agent | completion-marker | failure-marker (if any) | output artifact |
```

## Registry

| agent | completion-marker | failure-marker | output artifact |
|---|---|---|---|
| gsd-customer-context-mapper | ## CONTEXT MAPPING COMPLETE | ## CONTEXT MAPPING BLOCKED | `.planning/intel-context.md` |
| gsd-rmf-control-mapper | ## RMF MAPPING COMPLETE | ## RMF MAPPING BLOCKED | `.planning/phases/{phase}/{phase}-CONTROL-MATRIX.md` |
| gsd-cmmc-auditor | ## CMMC AUDIT COMPLETE | ## CMMC GAPS FOUND | `.planning/CMMC-AUDIT.md` |
| gsd-itar-screener | ## ITAR SCREEN COMPLETE | ## ITAR EXPOSURE FOUND / ## ITAR ESCALATE | `.planning/phases/{phase}/{phase}-ITAR-SCREEN.md` |
| gsd-fips-140-3-validator | ## FIPS VALIDATION COMPLETE | ## FIPS NON-VALIDATED FOUND | `.planning/phases/{phase}/{phase}-FIPS-VALIDATION.md` |
| gsd-sbom-generator | ## SBOM COMPLETE | ## SBOM INCOMPLETE | `.planning/SBOM/{date}-sbom.cdx.json` + `.planning/SBOM/SUMMARY.md` |
| gsd-nist-800-171-auditor | ## NIST 800-171 AUDIT COMPLETE | ## NIST 800-171 GAPS FOUND | `.planning/NIST-800-171-AUDIT.md` |
| gsd-dfars-incident-responder | ## DFARS PLAYBOOK COMPLETE | (none — playbook always produced) | `.planning/DFARS-INCIDENT-PLAYBOOK.md` |
| gsd-privacy-reviewer | ## PRIVACY REVIEW COMPLETE | ## PRIVACY ISSUES FOUND / ## PIA REQUIRED | `.planning/phases/{phase}/{phase}-PRIVACY-REVIEW.md` (+ `.planning/PIA.md`, `.planning/PTA.md` when applicable) |
| gsd-humint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-HUMINT-RESEARCH.md` |
| gsd-geoint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-GEOINT-RESEARCH.md` |
| gsd-sigint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-SIGINT-RESEARCH.md` |
| gsd-osint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-OSINT-RESEARCH.md` |
| gsd-masint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-MASINT-RESEARCH.md` |
| gsd-cybint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-CYBINT-RESEARCH.md` |
| gsd-finint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-FININT-RESEARCH.md` |
| gsd-all-source-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-FUSION-RESEARCH.md` |
| gsd-domex-engineer | ## DOMEX ENGINEERING COMPLETE | (none) | `.planning/phases/{phase}/{phase}-DOMEX-DESIGN.md` + implementation code in project source tree |
| gsd-mission-gap-analyst | ## MISSION GAP COMPLETE | ## MISSION GAP BLOCKED | `.planning/MISSION-GAP.md`; `.planning/use-case.md` (if filled via interview) |
| gsd-sow-decomposer | ## SOW DECOMPOSITION COMPLETE | ## SOW DECOMPOSITION BLOCKED | `.planning/SOW-DECOMPOSITION.md` |
| gsd-mission-narrative-writer | ## NARRATIVE BLOCKS COMPLETE | ## NARRATIVE BLOCKS BLOCKED | `.planning/narrative/{capability}-NARRATIVE.md` |
| gsd-capability-gap-analyst | ## CAPABILITY GAP ANALYSIS COMPLETE | ## CAPABILITY GAP ANALYSIS BLOCKED | `.planning/captures/CAPABILITY-GAP-{date}.md` |
| gsd-fusion-architect | ## FUSION ARCHITECTURE COMPLETE | ## FUSION ARCHITECTURE BLOCKED | `.planning/phases/{phase}/{phase}-FUSION-ARCH.md` |

(populated as agents land across Plans 1–8 — see Appendix D of the design spec for the full target list)
