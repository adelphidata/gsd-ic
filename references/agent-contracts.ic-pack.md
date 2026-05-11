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
| gsd-techint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-TECHINT-RESEARCH.md` |
| gsd-medint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-MEDINT-RESEARCH.md` |
| gsd-techsigint-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-TECHSIGINT-RESEARCH.md` |
| gsd-all-source-researcher | ## RESEARCH COMPLETE | ## RESEARCH BLOCKED | `.planning/phases/{phase}/{phase}-FUSION-RESEARCH.md` |
| gsd-domex-engineer | ## DOMEX ENGINEERING COMPLETE | (none) | `.planning/phases/{phase}/{phase}-DOMEX-DESIGN.md` + implementation code in project source tree |
| gsd-mission-gap-analyst | ## MISSION GAP COMPLETE | ## MISSION GAP BLOCKED | `.planning/MISSION-GAP.md`; `.planning/use-case.md` (if filled via interview) |
| gsd-sow-decomposer | ## SOW DECOMPOSITION COMPLETE | ## SOW DECOMPOSITION BLOCKED | `.planning/SOW-DECOMPOSITION.md` |
| gsd-mission-narrative-writer | ## NARRATIVE BLOCKS COMPLETE | ## NARRATIVE BLOCKS BLOCKED | `.planning/narrative/{capability}-NARRATIVE.md` |
| gsd-capability-gap-analyst | ## CAPABILITY GAP ANALYSIS COMPLETE | ## CAPABILITY GAP ANALYSIS BLOCKED | `.planning/captures/CAPABILITY-GAP-{date}.md` |
| gsd-fusion-architect | ## FUSION ARCHITECTURE COMPLETE | ## FUSION ARCHITECTURE BLOCKED | `.planning/phases/{phase}/{phase}-FUSION-ARCH.md` |
| gsd-after-action-recorder | ## AFTER ACTION COMPLETE | ## AFTER ACTION BLOCKED | `.planning/aar/{date}-AAR.md` + `.planning/aar/delta-{date}.md` |
| gsd-tim-facilitator | ## TIM PREP COMPLETE | ## TIM PREP BLOCKED | `.planning/tims/{date}-TIM-PREP.md` |
| gsd-capability-brief-generator | ## CAPABILITY BRIEF COMPLETE | (none) | `.planning/briefs/capability-{date}-BRIEF.md` (dual-format Marp) |
| gsd-white-paper-drafter | ## WHITE PAPER COMPLETE | ## WHITE PAPER BLOCKED | `.planning/papers/{title}.md` |
| gsd-demo-scripter | ## DEMO SCRIPT COMPLETE | (none) | `.planning/demos/{name}-DEMO-SCRIPT.md` |
| gsd-rfi-analyst | ## RFI ANALYSIS COMPLETE | ## RFI ANALYSIS BLOCKED | `.planning/captures/{date}-{name}-RFI-ANALYSIS.md` |
| gsd-capability-statement-generator | ## CAPABILITY STATEMENT COMPLETE | (none) | `.planning/capabilities/{topic}-STATEMENT.md` |
| gsd-proposal-drafter | ## PROPOSAL DRAFT COMPLETE | ## PROPOSAL DRAFT BLOCKED | `.planning/proposals/{name}/{volume}.md` (per-volume) |
| gsd-past-performance-manager | ## PP UPDATE COMPLETE | ## PP UPDATE BLOCKED | `.planning/past-performance/PP-LOG.md` + `.planning/past-performance/CITATIONS.md` |
| gsd-synthetic-data-engineer | ## SYNTHETIC DATA COMPLETE | (none) | `.planning/synthetic-data/{name}/` (datasets + generator scripts) — **deviation: spec line 382 says `## SYNTHETIC DATA READY`; validator regex requires the recognized terminal `COMPLETE`, so we use `## SYNTHETIC DATA COMPLETE`. Same pattern as NIST 800-171 marker deviation in Plan 2.** |
| gsd-intel-devops | ## DEVOPS PLAN COMPLETE | (none) | `.planning/iac/` (IaC files + CI/CD configs + hardening guidance + partition-translation notes) |
| gsd-stig-auditor | ## STIG AUDIT COMPLETE | ## STIG AUDIT GAPS FOUND | `.planning/STIG-AUDIT.md` |
| gsd-ci-analyst | ## CI ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-CI-ANALYSIS.md` |
| gsd-targeting-analyst | ## TARGETING ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-TARGETING-ANALYSIS.md` |
| gsd-insider-threat-analyst | ## INSIDER THREAT ANALYSIS COMPLETE | (none) | `.planning/phases/{phase}/{phase}-INSIDER-THREAT.md` |
| gsd-adversary-modeler | ## ADVERSARY MODEL COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ADVERSARY-MODEL.md` |
| gsd-isso | ## ISSO REVIEW COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ISSO-BRIEF.md` — **deviation: spec §5 line 279 lists `## ISSO REVIEW COMPLETE` / `## ISSO BRIEF READY` as alternative success markers; we ship the single primary `## ISSO REVIEW COMPLETE` to keep one terminal state per agent. The brief-ready synonym is folded into REVIEW COMPLETE. Same deviation pattern as Plan 6 SYNTHETIC DATA marker.** |
| gsd-issm | ## ISSM DETERMINATION COMPLETE | (none) | `.planning/phases/{phase}/{phase}-ISSM-DETERMINATION.md` (Risk Assessment + `## Determination` body section labeled READY-FOR-AO / REMEDIATE-FIRST / RISK-ACCEPTED-WITH-MITIGATION + Likely AO Questions appendix) |
| gsd-ssp-drafter | ## SSP DRAFT COMPLETE | ## SSP DRAFT BLOCKED | `.planning/SSP.md` |
| gsd-poam-tracker | ## POAM UPDATE COMPLETE | (none) | `.planning/POAM.md` (idempotent upsert via `skills/poam-conventions`) |
| gsd-sar-dryrun | ## SAR DRYRUN COMPLETE | ## SAR DRYRUN GAPS FOUND | `.planning/SAR-DRYRUN.md` — **deviation: spec §5 line 288 says `## SAR FINDINGS`; validator regex requires terminal `(COMPLETE\|BLOCKED\|FOUND\|FAILED\|UPDATE COMPLETE)`, so we ship `## SAR DRYRUN GAPS FOUND`. Same pattern as Plan 6 SYNTHETIC DATA marker.** |
| gsd-iv-and-v-dryrun | ## IVV DRYRUN COMPLETE | ## IVV DRYRUN GAPS FOUND | `.planning/IVV-DRYRUN.md` — **deviation: spec §5 line 289 says `## IVV FINDINGS`; same validator-regex constraint, so we ship `## IVV DRYRUN GAPS FOUND`.** |
| gsd-conmon-planner | ## CONMON PLAN COMPLETE | (none) | `.planning/CONMON-PLAN.md` |
| gsd-irp-author | ## IRP COMPLETE | (none) | `.planning/IRP.md` |
| gsd-contingency-planner | ## CONTINGENCY PLAN COMPLETE | (none) | `.planning/CONTINGENCY-PLAN.md` |
| gsd-evidence-packager | ## EVIDENCE PACKAGE COMPLETE | ## EVIDENCE PACKAGE BLOCKED | `.planning/evidence-packages/{date}/` (directory + `index.md` + `MILESTONE.md`; engineer-driven `zip -r` is optional follow-step) — **deviation: spec §5 line 293 says `## EVIDENCE PACKAGE INCOMPLETE`; validator regex requires terminal `BLOCKED`, so we ship `## EVIDENCE PACKAGE BLOCKED`.** |
| gsd-cdrl-mapper | ## CDRL MAPPING COMPLETE | ## UNMAPPED CDRLS FOUND | `.planning/CDRL-MAP.md` — **deviation: spec §5 line 299 says `## UNMAPPED CDRLs FOUND` (lowercase `s`); validator regex character class `[A-Z][A-Z0-9 _&-]*` rejects lowercase, so we ship `## UNMAPPED CDRLS FOUND` (uppercase `S`).** |
| gsd-milestone-brief-generator | ## MILESTONE BRIEF COMPLETE | (none) | `.planning/briefs/{milestone}-{date}-BRIEF.md` (dual-format Marp) |
| gsd-transition-advisor | ## TRANSITION READINESS COMPLETE | ## TRANSITION GAPS FOUND | `.planning/TRANSITION-READINESS.md` (per-stage checks) |
| gsd-icd-203-enforcer | ## ICD 203 AUDIT COMPLETE | ## ICD 203 VIOLATIONS FOUND | `.planning/phases/{phase}/{phase}-ICD-203-AUDIT.md` |
| gsd-ai-eval-auditor | ## AI EVAL DESIGN COMPLETE | ## AI EVAL AUDIT COMPLETE / ## AI EVAL ISSUES FOUND | `.planning/phases/{phase}/{phase}-AI-EVAL-DESIGN.md` or `.planning/ai-evals/{capability}-DESIGN.md` (design mode); `.planning/phases/{phase}/{phase}-AI-EVAL-AUDIT.md` (audit mode) |
| gsd-fm-adaptation-engineer | ## FM ADAPTATION COMPLETE | (none) | `.planning/phases/{phase}/{phase}-FM-ADAPTATION-DESIGN.md` + implementation code in project source tree |

(populated across Plans 1–8 — v1 roster complete at 58 agents per Appendix D)
