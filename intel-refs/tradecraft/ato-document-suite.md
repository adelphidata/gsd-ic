---
classification: UNCLASSIFIED
topic: tradecraft/ato-document-suite
applies_when: [ssp, system security plan, irp, incident response, conmon, continuous monitoring, contingency, dr, disaster recovery, evidence package, pdr, cdr, trr, ato submission]
ic_pack: true
owners: ["unassigned-sme"]
---

# ATO Document Suite

This reference consolidates the four NIST publications that govern the formal ATO documentation suite —
SP 800-18 Rev 1 (System Security Plan), SP 800-34 Rev 1 (Contingency Plan), SP 800-61 Rev 2 (Incident
Response Plan), and SP 800-137 (Continuous Monitoring) — plus an evidence-packaging conventions section
for milestone deliverables. NIST SP 800-37 Rev 2 (RMF lifecycle) is intentionally covered in the sibling
reference `intel-refs/tradecraft/ato-process-overview.md`; this document focuses on the documents that
lifecycle produces. The seven direct consumers are `gsd-ssp-drafter`, `gsd-irp-author`,
`gsd-conmon-planner`, `gsd-contingency-planner`, `gsd-evidence-packager`, `gsd-sar-dryrun`, and
`gsd-iv-and-v-dryrun`; each agent draws primarily from the section that corresponds to its output artifact
(see the Cross-References table below). In addition, `gsd-isso` (Family C) consumes this reference in its
entirety via the ISSO synthesis pattern: the ISSO uses all four document types plus the evidence-packaging
conventions when assembling the authorization package and status reports for ISSM review. Scope boundary:
the ATO lifecycle phases, RACI, decision types, and continuous authorization posture are covered in
`tradecraft/ato-process-overview.md`; this document addresses the formal artifact content requirements that
the lifecycle produces.

## System Security Plan (SSP)

*Per NIST SP 800-18 Rev 1 — Guide for Developing Security Plans for Federal Information Systems.*

The SSP is the primary artifact produced by `gsd-ssp-drafter`. It is the authoritative description of how
an information system implements its required security controls and must be current, accurate, and complete
before the authorization package is submitted to the AO. The SSP is a living document — it is updated
whenever the system undergoes a significant change, control implementation status changes, or a new finding
is accepted into the POA&M.

### Required SSP Sections

**System Identification.** Full system name, unique identifier (system identifier assigned by the authorizing
organization), system owner name and contact, ISSO name and contact, authorization boundary description,
system description and purpose, system operational environment (cloud, on-premise, hybrid, deployment tier),
applicable laws and regulations, and applicable agreements (ISAs, MOUs, contracts).

**System Operational Status.** Operational (system is in production), under development (system is not yet
operational), or major modification (significant change underway). The operational status affects assessment
scheduling and monitoring requirements.

**Control Implementation Summary.** For each control in the tailored baseline: implementation status
(implemented, partially implemented, planned, not applicable, inherited), a narrative describing how the
control is implemented or why it is not applicable, any compensating controls, and identification of whether
the control is system-specific, hybrid, or inherited from a common control provider. The control matrix
output of `gsd-rmf-control-mapper` is the direct input to this section — the mapper produces a structured
control list that `gsd-ssp-drafter` expands into full implementation narratives.

**ATO Milestones.** A table of planned and completed authorization activities aligned to the program's
acquisition milestones (PDR, CDR, TRR, initial operational capability). For each milestone: activity name,
planned completion date, actual completion date (if complete), responsible party, and status. This table
enables the AO to assess authorization progress against the program schedule.

**System Interconnections.** All external systems that exchange data with the system under authorization:
system name, organization, interconnection purpose, data classification handled at the interface, applicable
interconnection agreement (ISA or MOU), and authorization status of the connected system. For interfaces
that cross authorization tiers (e.g., from the appropriate-impact partition to a lower-sensitivity
environment), the interface control document and applicable transfer approval must be referenced.

**Supplemental Detail.** Items that do not fit the standard sections but that the assessor or AO requires
to understand the system's security posture: system diagrams, data flow diagrams, hardware and software
inventories, configuration baselines, cryptographic inventory, and formal risk acceptance decisions for
known gaps.

### SSP Quality Gates

Before `gsd-sar-dryrun` or `gsd-iv-and-v-dryrun` initiates assessment, the SSP must meet four quality
gates: (1) all controls in the tailored baseline have an implementation status entry; (2) all partially
implemented or planned controls have corresponding POA&M entries with target dates; (3) the authorization
boundary diagram is current; (4) all interconnections are documented with agreement references. Missing
quality-gate items are the most common cause of assessment delays.

## Incident Response Plan (IRP)

*Per NIST SP 800-61 Rev 2 — Computer Security Incident Handling Guide.*

The IRP is the primary artifact produced by `gsd-irp-author`. It establishes the program's capability to
detect, contain, eradicate, and recover from security incidents, and documents the procedures, roles, and
communication channels that the response team uses. The IRP must be consistent with the SSP's IR control
family implementation descriptions and must be tested (via tabletop or simulation) within the authorization
period.

### Lifecycle Phases

**Preparation.** Establishment of the incident response capability before incidents occur: appointing a
Computer Incident Response Team (CIRT), defining roles and responsibilities, acquiring and configuring
detection and analysis tools, establishing communication channels and contact lists (internal escalation
path, organizational CIRT or SOC, government CERT contacts), and conducting initial training and awareness.
Preparation artifacts include the approved IRP document, the contact list, and the tool inventory.

**Detection and Analysis.** Activities for identifying and confirming that a security incident has occurred:
monitoring sources (SIEM alerts, audit log anomalies, user reports, automated scanning findings), triage
procedures for distinguishing incidents from non-incident events, incident classification by type (malware,
unauthorized access, denial-of-service, data exfiltration, etc.) and severity, and initial documentation
of indicators of compromise (IOCs). Detection artifacts include the incident ticket with initial
classification, timeline of observed events, and preliminary scope assessment.

**Containment, Eradication, and Recovery.** Containment stops the spread of the incident and limits
damage; eradication removes the root cause; recovery restores affected systems to operational status.
Containment procedures vary by incident type — network isolation, account suspension, and image rollback
are common containment actions. Eradication includes removing malware, closing the vulnerability that
enabled the incident, and verifying system integrity. Recovery includes restoring from known-good backups,
re-enabling network connectivity under enhanced monitoring, and confirming that systems are operating
normally. These three phases are documented together because they often overlap and must be executed
under time pressure with parallel workstreams.

**Post-Incident Activity.** After the system is recovered and normal operations resume: conducting a
lessons-learned meeting within a defined period (two weeks is the NIST SP 800-61 Rev 2 guidance), updating
the IRP based on lessons learned, updating the threat model and SSP IR control descriptions if the incident
revealed gaps in the implemented controls, and filing required external reports.

### Team Roles

The IRP must define the following roles at minimum: Incident Commander (decision authority during active
response), Technical Lead (directs containment and eradication activities), Evidence Custodian (maintains
chain of custody for digital evidence), Communications Lead (manages internal and external communications),
and Legal/Compliance Liaison (advises on reporting obligations and preserves attorney-client privilege for
legal hold items). Large programs may staff these as separate individuals; small programs may assign
multiple roles to a single person with clear precedence rules for conflicts.

### Communication Plan

Internal escalation: from first responder to Incident Commander, to ISSO, to ISSM, to Program Manager,
with defined maximum time-to-escalation at each step (commonly 1 hour for Moderate-impact events, 15
minutes for High-impact). External notification: the program's organizational CIRT or SOC, the designated
federal or DoD reporting authority, and — where contractually required — the customer's security officer.
Communication templates (incident notification, status update, resolution notification) should be pre-drafted
in the IRP so that communications are accurate and timely under response pressure.

### Evidence Preservation

Digital evidence must be preserved in a manner admissible for potential legal or regulatory proceedings.
The Evidence Custodian documents the chain of custody beginning at the moment of evidence collection.
Collection methods prioritize volatile evidence (running processes, active network connections, memory
contents) before non-volatile (disk images, log files). Evidence is stored in a write-protected format
with cryptographic hashes recorded at collection time. Evidence preservation procedures must be consistent
with the forensic handling guidance applicable to the deployment environment.

### Regulatory Reporting

For programs under FISMA, reportable incidents must be reported to the federal CERT within defined timeframes
based on incident category and severity. For DoD programs, additional reporting obligations apply under
applicable acquisition regulations. For programs handling CUI under DFARS-covered contracts, a specific
72-hour reporting obligation applies with distinct content requirements. The IRP must reference but not
re-state those DFARS-specific requirements: for the post-incident DFARS reporting playbook see
`gsd-dfars-incident-responder` (Phase 1, `.planning/DFARS-INCIDENT-PLAYBOOK.md`). All DFARS-specific
72-hour reporting flow lives in that artifact exclusively; the IRP references it rather than duplicating
the content.

## Continuous Monitoring Plan (ConMon)

*Per NIST SP 800-137 — Information Security Continuous Monitoring for Federal Information Systems and
Organizations.*

The ConMon Plan is the primary artifact produced by `gsd-conmon-planner`. It operationalizes the Step 6
(Monitor) phase of the RMF by defining what is monitored, how frequently, by what means, and at what
thresholds the results trigger escalation or re-authorization events. The `gsd-isso` synthesis output is a
typical downstream consumer: the ISSO uses the ConMon Plan to track monitoring execution, aggregate findings
into the POA&M, and produce the periodic security status report to the ISSM and AO.

### Organization-Defined Monitoring Frequency

NIST SP 800-137 requires the organization to define a monitoring frequency for each control (or control
family) commensurate with the risk the control addresses and the volatility of the environment in which it
operates. The ConMon Plan must document, for each monitored control: the monitoring frequency (continuous,
monthly, quarterly, annually, event-driven), the monitoring method (automated tool, manual review, audit
log analysis, configuration compliance scan), and the responsible party. Frequency is not uniform across
the control baseline — high-criticality controls (e.g., privileged access, audit logging, vulnerability
patching) warrant continuous or monthly monitoring; low-volatility controls (e.g., personnel security
procedures, physical protection policy) may be monitored annually.

### Automation Strategy

The ConMon Plan documents the automated monitoring toolset and its integration with the program's
development and operations pipeline. Typical automation includes: vulnerability scanning (SAST, DAST,
SCA, container image scanning) integrated into the CI/CD pipeline with pre-deployment security gates;
configuration compliance scanning against approved baselines (e.g., CIS Benchmarks, DISA STIGs) on a
defined schedule; log aggregation and SIEM alerting for audit-relevant events; and software composition
analysis for ongoing supply-chain risk monitoring. The automation strategy must specify how automated
findings are routed to the POA&M upsert workflow so that no finding is lost between scan cycles.

### Escalation Thresholds

The ConMon Plan must define the conditions under which a monitoring finding triggers escalation beyond
the normal POA&M update workflow. Threshold categories include:

- **AO-notification threshold:** a finding type or severity level that requires direct notification to the
  AO within a defined period (e.g., a critical vulnerability in a High-baseline control that is unmitigated
  after 30 days).
- **Re-authorization threshold:** a condition that triggers a formal re-authorization event (e.g., a
  significant architecture change, a finding that alters the system's security categorization, or
  accumulation of open High-severity findings above a defined count).
- **Operational-hold threshold:** a finding severity or type that requires halting new deployments until
  the finding is remediated (e.g., a CVSS 9.0+ vulnerability in a production-facing component).

Thresholds are agreed with the ISSM and AO at the time of initial authorization and documented in the
ConMon Plan; they may not be changed unilaterally by the ISSO.

### Reporting Cadence to ISSM and AO

The ConMon Plan specifies the schedule and format of security status reports. The ISSM receives a security
status report on the monitoring cadence (monthly is common for Moderate-baseline systems); the AO receives
an aggregated status report on the cadence agreed at authorization (quarterly or semi-annual is common for
continuous-authorization postures). Each report includes: the count and severity distribution of findings
identified since the last report, POA&M item status (opened, closed, overdue), monitoring coverage
completeness (controls assessed vs. controls due in the period), and any threshold exceedances and their
disposition. The `gsd-conmon-planner` output pre-populates the report template; the ISSO reviews and
supplements with program-specific context before distribution.

## Contingency Plan / Disaster Recovery

*Per NIST SP 800-34 Rev 1 — Contingency Planning Guide for Federal Information Systems.*

The Contingency Plan is the primary artifact produced by `gsd-contingency-planner`. It documents the
program's strategy and procedures for recovering the information system from a disruptive event, ranging
from minor component failures to full site loss. The Contingency Plan addresses the CP control family in
the SSP and must be consistent with the system's impact-level categorization: a High-baseline system
requires more aggressive recovery targets and more thorough contingency coverage than a Low-baseline system.

### BIA Inputs — RTO and RPO per System

The Business Impact Analysis (BIA) is the foundation of the Contingency Plan. For each critical system
function, the BIA defines: Recovery Time Objective (RTO) — the maximum acceptable time from disruption to
restoration of service; Recovery Point Objective (RPO) — the maximum acceptable data loss measured in time
(e.g., no more than 4 hours of transactions may be lost); and Maximum Tolerable Downtime (MTD) — the
absolute maximum time the function can be unavailable before the mission impact becomes unacceptable.
BIA inputs come from the system owner and mission owner; the ISSO documents them in the Contingency Plan's
BIA section. The RTO and RPO drive all downstream contingency strategy decisions — they are not arbitrary
targets but must be defensible against the mission criticality of the system.

### Contingency Strategies

**Alternate Site.** For systems requiring resumption at a physically separate location following a site
loss: the alternate site type (cold, warm, hot, or mirrored), location and access procedures, the time
required to activate the alternate site relative to the RTO, and the authority that must approve alternate
site activation. Programs operating on a commercial cloud provider in a multi-region configuration should
document the failover architecture and the conditions under which automatic region failover is triggered
versus requiring manual authorization.

**Alternate Processing.** Procedures for maintaining or resuming critical system functions using degraded
or substitute processing capacity when primary processing is unavailable. This may include operating in a
reduced-functionality mode that satisfies the highest-priority mission functions while full recovery
proceeds.

**Backup.** Backup strategy specifying: what data and configuration is backed up, the backup frequency
and retention period (must satisfy RPO), backup storage location (on-site, off-site, or cloud), and
backup media protection (encryption, access controls, physical security). The backup strategy must include
a recovery test cadence — backups that have not been successfully restored are not a valid contingency
control.

### Recovery Procedures per Failure Scenario

The Contingency Plan must document specific recovery procedures for each identified failure scenario, at
minimum: (1) system component failure (hardware or software failure of a primary component); (2) facility
or infrastructure failure (loss of power, network, or physical facility); (3) data corruption or loss
(accidental or malicious data destruction); (4) cyber incident (system compromise requiring clean
restoration). Each scenario procedure specifies: trigger conditions, activation authority, step-by-step
recovery actions, personnel responsibilities, time estimates per step, and success criteria for declaring
recovery complete.

### Testing and Exercises

NIST SP 800-34 Rev 1 requires that the Contingency Plan be tested at a frequency commensurate with the
system's impact level. Test types include: tabletop exercise (discussion-based walkthrough of scenarios
with recovery team), functional exercise (limited activation of contingency capabilities), and full
interruption test (actual failover to alternate site or processing). Test results must be documented and
incorporated into the plan's lessons-learned section; gaps identified during testing must be reflected in
updated procedures or POA&M entries, as appropriate. Tabletop exercises are the minimum acceptable test
type; full interruption tests are expected for High-baseline systems.

### Plan Maintenance

The Contingency Plan must be reviewed and updated: (1) annually as a routine review; (2) following any
significant system change that affects the recovery architecture, RTOs/RPOs, or backup strategy; (3) after
any contingency plan activation or test; (4) when the organizational contingency planning policy changes.
The ISSO is responsible for plan maintenance; the ISSM approves updates. The plan version, review date,
and approval signature must be maintained in the document header.

## Evidence Packaging Conventions

Evidence packages are the primary artifacts produced by `gsd-evidence-packager`. An evidence package is
the structured collection of artifacts that demonstrates the system's security posture and authorization
readiness at a specific program milestone. Evidence packages support both internal review (SAR dry-run,
IV&V dry-run, ISSM determination) and external delivery (customer-facing ATO submission package,
CDR deliverables).

### Per-Milestone Packaging

Evidence packages are assembled at four standard program milestones. The artifacts required grow as the
program matures:

**PDR (Preliminary Design Review).** At PDR, the authorization package is in early formation. Required
artifacts: initial control matrix from `gsd-rmf-control-mapper` (controls selected and tailoring rationale
documented), preliminary SSP (system identification, operational environment, and initial control
implementation stubs), initial threat model, and applicable audit outputs. The PDR package demonstrates
that security planning has begun in earnest.

**CDR (Critical Design Review).** At CDR, the implementation baseline is frozen. Required artifacts: a
current SSP with implementation status for all selected controls, a current control matrix, all available
audit outputs (SAST, DAST, SCA, container scan results), current POA&M reflecting known gaps, and customer
deliverable copies as specified by the CDRL. CDR is the first milestone at which the package may trigger
formal assessment planning.

**TRR (Test Readiness Review).** At TRR, the system is ready for formal assessment. Required artifacts:
all CDR artifacts updated to as-tested state, SAR dry-run output from `gsd-sar-dryrun`, IV&V dry-run
output from `gsd-iv-and-v-dryrun`, current IRP with evidence of at least one tabletop exercise, current
ConMon Plan, current Contingency Plan with test evidence, complete test results package, and updated
POA&M. The TRR package must be complete enough to support independent assessment without the assessor
requesting additional artifacts.

**ATO Submission.** The final package submitted to the AO. Required artifacts: the complete, current SSP;
the formal SAR (from the independent assessor); the current POA&M with all open findings; the ISSM
Determination section (produced by `gsd-issm`); the IRP, ConMon Plan, and Contingency Plan; the evidence
package index; and all customer-deliverable copies per the CDRL. The ATO Submission package is the
definitive record of the system's security posture at the time of authorization.

### Directory Layout Convention

All evidence packages use the following directory layout under the program's `.planning/` directory:

```text
.planning/evidence-packages/{date}/
    index.md                    ← catalog of all artifacts in this package
    ssps/                       ← SSP current version
    control-matrix/             ← control matrix output from gsd-rmf-control-mapper
    audits/                     ← SAST, DAST, SCA, container scan results
    poam/                       ← POA&M current version
    test-results/               ← formal test execution results
    sar/                        ← SAR dry-run and/or formal SAR
    ivv/                        ← IV&V dry-run output
    plans/                      ← IRP, ConMon Plan, Contingency Plan
    customer-deliverables/      ← copies of CDRL-deliverable artifacts
```

The `{date}` component uses ISO 8601 format (YYYY-MM-DD) reflecting the package assembly date.

### index.md Catalog Format

The `index.md` file at the root of each evidence package must contain: package metadata (milestone type,
assembly date, program name, assembler), a table of contents listing every artifact with its relative path
and artifact type, the SHA-256 hash of each artifact file at the time of packaging, and a completeness
declaration noting which required artifacts are present, which are intentionally absent (with justification),
and which are pending. The index enables assessors and AOs to verify package integrity and identify gaps
without opening every file.

### v1 Scope Note

In v1, `gsd-evidence-packager` creates the directory structure and populates `index.md`. Optional
compression into a single distributable archive is an engineer-driven follow-step and is not within the
agent's scope. Engineers who need a zip or tarball for delivery should compress the assembled directory
using their standard tooling after the agent completes.

## Cross-References

The following table maps each Family D agent to the section of this reference that it primarily implements.
`gsd-poam-tracker` is included because it consumes SSP control implementation status and evidence package
contents when managing gap-to-remediation conversion, even though its primary output (`.planning/POAM.md`)
is governed by `tradecraft/poam-format.md`.

| Agent | Primary Section |
|---|---|
| `gsd-ssp-drafter` | System Security Plan (SSP) |
| `gsd-irp-author` | Incident Response Plan (IRP) |
| `gsd-conmon-planner` | Continuous Monitoring Plan (ConMon) |
| `gsd-contingency-planner` | Contingency Plan / Disaster Recovery |
| `gsd-evidence-packager` | Evidence Packaging Conventions |
| `gsd-sar-dryrun` | SSP (assesses control implementation); Evidence Packaging (reads milestone-stage artifact catalog) |
| `gsd-iv-and-v-dryrun` | SSP (assesses full evidence package); Evidence Packaging (reads milestone-stage artifact catalog) |
| `gsd-poam-tracker` | SSP (control implementation status) + Evidence Packaging (artifact inputs) |

Cross-references to related tradecraft refs:

- `tradecraft/ato-process-overview.md` — RMF lifecycle, ISSO/ISSM/AO RACI, authorization decision types,
  and continuous authorization posture. Read this ref for the process context in which the documents above
  are produced.
- `tradecraft/poam-format.md` — POA&M file format; the SSP's partially-implemented and planned controls
  populate this file via `gsd-poam-tracker`.
- `tradecraft/nist-800-53-rev5.md` — NIST SP 800-53 Rev 5 control catalog; control IDs referenced in
  SSP implementation summaries, SAR findings, and POA&M rows.
- `tradecraft/dfars-252-204-7012.md` — DFARS 7012 cyber incident reporting; the DFARS-specific 72-hour
  reporting playbook lives in `gsd-dfars-incident-responder` output, not in the IRP.
- `tradecraft/cmmc-2.0.md` — CMMC Level 2 assessment framework; relevant for programs where CMMC
  assessment requirements layer on top of the RMF ATO process.

## Authoritative Sources

- NIST SP 800-18 Rev 1 — *Guide for Developing Security Plans for Federal Information Systems* (NIST, Feb 2006). https://doi.org/10.6028/NIST.SP.800-18r1
- NIST SP 800-34 Rev 1 — *Contingency Planning Guide for Federal Information Systems* (NIST, May 2010, updated Nov 2010). https://doi.org/10.6028/NIST.SP.800-34r1
- NIST SP 800-61 Rev 2 — *Computer Security Incident Handling Guide* (NIST, Aug 2012). https://doi.org/10.6028/NIST.SP.800-61r2
- NIST SP 800-137 — *Information Security Continuous Monitoring (ISCM) for Federal Information Systems and Organizations* (NIST, Sept 2011). https://doi.org/10.6028/NIST.SP.800-137
- NIST SP 800-37 Rev 2 — *Risk Management Framework for Information Systems and Organizations* (NIST, Dec 2018). https://doi.org/10.6028/NIST.SP.800-37r2
- NIST SP 800-53 Rev 5 — *Security and Privacy Controls for Information Systems and Organizations* (NIST, Sept 2020). https://doi.org/10.6028/NIST.SP.800-53r5
