---
classification: UNCLASSIFIED
topic: tradecraft/ato-process-overview
applies_when: [ato, rmf, authorization, isso, issm, ao, authorizing official, atc, denial, continuous authorization]
ic_pack: true
owners: ["unassigned-sme"]
---

# ATO Process Overview

An Authority to Operate (ATO) is the formal authorization granted by a designated Authorizing Official (AO) that
permits an information system to process, store, or transmit information at an approved risk posture. Within the
federal and DoD acquisition context, ATOs are issued under the Risk Management Framework (RMF) defined in NIST SP
800-37 Rev 2, which replaced the legacy Certification and Accreditation (C&A) process. An ATO is not a one-time
event — it is the output of a structured, repeatable lifecycle that begins at system inception, runs through security
control assessment, and continues via ongoing continuous monitoring. IC pack Phase 6 agents (`gsd-rmf-control-mapper`,
`gsd-sar-dryrun`, `gsd-iv-and-v-dryrun`, `gsd-issm`, `gsd-conmon-planner`, and their siblings) instrument every
phase of this lifecycle, reducing the manual documentation burden on the ISSO and ISSM while preserving human
judgment at the AO boundary.

## RMF Six-Step Lifecycle

### Step 1 — Categorize

NIST SP 800-37 Rev 2, Task C-1 through C-2, requires the organization to categorize the information system
based on the potential adverse impact a security breach would have on organizational operations, assets, or
individuals. Categorization follows the FIPS 199 methodology, which produces a system-level impact rating of
Low, Moderate, or High across the three security objectives — Confidentiality, Integrity, and Availability.
The system's overall categorization uses the "high-water mark" of the three objectives.

The ISSO leads the categorization effort in consultation with the system owner and mission owner; the ISSM
reviews and approves the categorization before it is recorded in the System Security Plan (SSP).

Within the IC pack, `gsd-rmf-control-mapper` initiates categorization analysis by reading the program's
`intel-context.md` — extracting the `system_impact_level`, `data_types`, and `mission_context` fields —
and proposing a FIPS 199 categorization table with rationale. The ISSO refines the table before it enters
the SSP. The categorization outcome gates every subsequent lifecycle step: a Moderate categorization produces
a Moderate baseline (approximately 225 controls from NIST SP 800-53 Rev 5); a High categorization produces
a High baseline (approximately 330 controls). Getting the categorization right at Step 1 prevents significant
downstream rework.

### Step 2 — Select

After categorization, NIST SP 800-37 Rev 2, Task S-1 through S-4, requires the selection of an appropriate
set of security controls from NIST SP 800-53 Rev 5 (or a DoD/IC-approved overlay) commensurate with the
system's impact level. The baseline control set is the starting point; tailoring — adding controls for
specific threats or removing controls that are genuinely not applicable — produces the tailored baseline
documented in the SSP.

The ISSO performs the initial control selection and tailoring; the ISSM approves the tailored baseline.
Common tailoring actions include:

- Adding controls for cloud-specific threats (e.g., SC-8 for data-in-transit encryption in SaaS environments)
- Removing controls that do not apply to the deployment architecture (e.g., PE controls when operating in
  an authorized FedRAMP cloud service provider environment)
- Inheriting controls from a FedRAMP-authorized cloud service provider or organizational common control provider
- Applying program-specific overlays for ITAR/CUI data handling or mission-specific threat profiles

`gsd-rmf-control-mapper` generates the initial control selection list, applying program-specific tailoring
guidance from `intel-context.md` (e.g., `target_cmmc_level`, `deployment_environment`, inheritance from a
FedRAMP-authorized cloud service provider). The agent outputs a machine-readable control list that feeds
downstream assessment planning and SSP population.

### Step 3 — Implement

NIST SP 800-37 Rev 2, Task I-1 and I-2, requires that the selected security controls be implemented and
that the implementation be documented in the SSP with sufficient detail for an assessor to evaluate.
Implementation is primarily an engineering and configuration-management activity: controls are realized in
code, infrastructure-as-code, operating procedures, and configuration baselines.

The system owner and engineering team own implementation; the ISSO tracks implementation status and ensures
that the SSP implementation descriptions reflect the as-built state. Implementation gaps — controls selected
but not yet implemented — must be captured in the POA&M with remediation timelines before the authorization
package can be submitted.

No dedicated IC pack agent generates implementation artifacts — engineering execution drives this step.
`gsd-rmf-control-mapper` generates a control implementation worksheet that engineering teams populate,
and `gsd-issm` reviews implementation descriptions against assessment findings when producing the ISSM
determination. Clear, specific SSP implementation descriptions are the single largest determinant of
assessment duration at Step 4; vague descriptions dramatically lengthen assessment timelines.

### Step 4 — Assess

NIST SP 800-37 Rev 2, Task A-1 through A-3, requires an independent assessment of the implemented controls
to determine whether they are implemented correctly, operating as intended, and producing the desired
outcomes. The assessment produces a Security Assessment Report (SAR) documenting findings, identified
weaknesses, and a risk summary.

The assessor role must be independent of the implementation team. For DoD programs, a Defense Contract
Management Agency (DCMA) assessor or a government-designated third-party assessor organization (3PAO)
typically fills this role. The ISSO coordinates the assessment; the ISSM reviews and signs the SAR.

Assessment methods include:

- **Examine:** reviewing documentation, policies, procedures, and configurations
- **Interview:** questioning personnel responsible for implementing and operating controls
- **Test:** exercising the system to observe control behavior under realistic conditions

Within the IC pack, `gsd-sar-dryrun` performs a dry-run assessment by systematically evaluating each
control in the tailored baseline against documented implementation evidence and returning findings in a
structured SAR-format output. `gsd-iv-and-v-dryrun` performs independent verification and validation of
the same control set, providing a second analytic perspective on control effectiveness. Both agents produce
findings that are incorporated into the program's `POAM.md` via `poam-format` conventions before the
ISSM review. The dry-run outputs are pre-assessment preparation artifacts — they do not replace the
formal assessment required by NIST SP 800-37 Rev 2.

### Step 5 — Authorize

NIST SP 800-37 Rev 2, Task R-1 through R-3, requires the ISSM to assemble an authorization package and
submit it to the AO for a final authorization decision. The standard authorization package consists of:

- System Security Plan (SSP) — complete, current, describing all controls and their implementation status
- Security Assessment Report (SAR) — the independent assessor's findings
- Plan of Action and Milestones (POA&M) — open findings with remediation timelines and responsible parties

The AO evaluates whether the residual risk documented in the package is acceptable given the mission need,
and issues an authorization decision: ATO, ATO-with-conditions, Interim Authority To Test (IATT), or denial.
The ISSM owns the authorization package assembly and submission; the AO owns the decision.

**Framework boundary (per spec §5, line 280):** The IC pack framework stops at the ISSM. `gsd-issm`
produces the ISSM determination section (`READY-FOR-AO`, `REMEDIATE-FIRST`, or
`RISK-ACCEPTED-WITH-MITIGATION`), prepares the "Likely AO Questions" appendix, and drafts the cover
memo — but it does not submit to or communicate with the AO. The human-to-human conversation in which
the ISSM presents the package and receives the decision is outside the framework boundary.

### Step 6 — Monitor

NIST SP 800-37 Rev 2, Task M-1 through M-7, requires ongoing monitoring of the system's security controls
throughout the operational life of the system. Continuous monitoring activities include:

- Assessing a subset of controls on a defined frequency specified in the monitoring strategy
- Reporting security status to the AO on a defined schedule
- Conducting ongoing risk determination and risk acceptance as the threat environment evolves
- Updating the authorization package when significant changes occur to the system or its environment
- Managing and closing POA&M items within committed timelines

A significant change — one that alters the system's risk posture — may trigger a formal re-authorization
event. The ISSO executes the monitoring strategy; the ISSM reviews security status reports and recommends
continued authorization or re-authorization as appropriate.

`gsd-conmon-planner` generates the continuous monitoring plan that specifies control assessment frequency,
reporting cadence, and automated monitoring tool configuration. The plan output drives the scheduling of
periodic automated and manual assessment activities, and its findings feed back into POA&M updates and
eventual re-authorization decisions.

## ISSO / ISSM / AO RACI

The following table maps the six RMF steps to the three primary security personas using the RACI notation:
**R** (Responsible — does the work), **A** (Accountable — approves or is answerable for the outcome),
**C** (Consulted — provides input before action), **I** (Informed — receives notification of outcome).

| RMF Step | ISSO | ISSM | AO |
|---|---|---|---|
| 1. Categorize | R | A | I |
| 2. Select | R | A | I |
| 3. Implement | C | A | I |
| 4. Assess | R (coordinates) | A (reviews SAR) | I |
| 5. Authorize | R (assembles package) | A (signs & submits) | A (decides) |
| 6. Monitor | R | A | I |

**Framework boundary note (per spec §5, line 280):** The IC pack framework stops at the ISSM. The AO
interaction — the human-to-human conversation in which the ISSM presents the package and receives the
authorization decision — is outside the framework boundary and must not be automated. `gsd-issm` prepares
the ISSM for this conversation (via the "Likely AO Questions" appendix and the `## Determination` section)
but does not interface with the AO or with systems controlled by the AO's office.

## Authorization Decision Types

### ATO — Full Authority to Operate

A full ATO is issued when the AO determines that the residual risk documented in the authorization package
is acceptable for mission operations. All required controls are implemented and assessed; any open POA&M
items are low-risk findings with credible remediation timelines that the AO considers acceptable. A full
ATO typically carries an expiration date — three years is the DoD/FISMA standard — after which
re-authorization is required, unless the program has adopted a continuous authorization posture that the
AO agrees supersedes the fixed expiration.

When `gsd-issm` determines that the system is ready for AO submission with no blocking findings, it emits
a `## Determination` section labeled `READY-FOR-AO`, documenting the residual risk summary across the three
security objectives, the count and severity distribution of open POA&M items, the agent's assessment that
open items do not constitute blocking risk, the recommended authorization term and monitoring frequency, and
the pre-populated "Likely AO Questions" appendix. The ISSM reviews, modifies as appropriate, and submits
the package to the AO.

### ATO-with-Conditions

An ATO-with-conditions (also called a conditional ATO) is issued when the AO is willing to authorize
operations but only subject to specific conditions — typically the remediation of identified medium-risk
findings within a defined period, or the implementation of compensating controls for a known gap. Conditions
are documented in the authorization decision letter and tracked as binding commitments in the POA&M. Failure
to satisfy conditions within the specified period requires a re-authorization event.

When `gsd-issm` identifies residual risk above low but not sufficient to recommend denial — typically
medium-severity open findings with a clear remediation path and credible timelines — it emits a
`## Determination` section labeled `RISK-ACCEPTED-WITH-MITIGATION`, documenting each open finding that
constitutes a condition (with control reference, severity, proposed remediation action, responsible party,
target date, and any compensating controls). The ISSM reviews, adds program-specific context (e.g., contractual
constraints that affect timelines), and presents it to the AO as the basis for a conditional decision.

### IATT — Interim Authority to Test

An Interim Authority to Test is a time-limited authorization that permits a system to operate in a controlled
testing environment for the purpose of completing assessment activities that cannot be performed in a
development environment. IATTs are not authorizations for operational use — they authorize testing only,
under defined scope and duration constraints. The ISSM requests an IATT from the AO with a scope-limited
package; the AO issues an IATT letter specifying the allowed activities, the test boundary, and the
expiration date.

IATT constraints typically include: testing within a defined network boundary, operation by specific
designated personnel only, no processing of operational or live-mission data without explicit AO approval,
and a fixed expiration date regardless of testing progress (extension requires a new IATT request).

`gsd-issm` does not emit a distinct IATT determination label. An IATT request is a scoped version of the
`READY-FOR-AO` determination with a `scope: testing-only` annotation in the package cover memo. The ISSM
applies this annotation manually when the intent is test-only authorization. SAR and POA&M artifacts
included in an IATT package may be in-progress versions — the IATT is the mechanism that enables the
formal assessment to be completed before full operational authorization is sought.

### Denial

A denial is issued when the AO determines that the residual risk is not acceptable and that the program
may not operate. Denial is typically issued when high-severity findings remain open with no credible
remediation plan, when the system's architecture presents structural risks that cannot be resolved through
POA&M commitments, or when the authorization package is materially incomplete. A denial is not a permanent
bar to authorization — it is a decision that the current package is insufficient. The program must address
the blocking findings, rebuild the authorization package, and re-submit.

When `gsd-issm` identifies open high-severity findings or structural control failures it assesses as
authorization-blocking, it emits a `## Determination` section labeled `REMEDIATE-FIRST`, documenting each
blocking finding (control reference, severity, and rationale for blocking assessment), the remediation steps
required before re-submission, whether a scoped IATT might allow progress during remediation, and estimated
timelines. The ISSM reviews, adds program judgment on escalation to management, and communicates the
situation to the system owner before re-submitting.

## Continuous Authorization

The modern RMF posture under NIST SP 800-37 Rev 2 encourages a shift from point-in-time authorization —
a fixed-term ATO followed by a comprehensive re-authorization at expiration — toward continuous authorization:
an ongoing process in which security status is monitored in near-real time and the AO maintains situational
awareness of the system's risk posture without requiring a full re-authorization event except when a
significant change occurs.

Continuous authorization is enabled by:

- Automating control monitoring using SAST, DAST, SCA, container scanning, and configuration compliance tools
- Integrating security tooling into the CI/CD pipeline so that each software release includes a security gate
- Maintaining a live POA&M that reflects current findings rather than a point-in-time snapshot
- Establishing AO-agreed escalation thresholds: finding types or severity levels that trigger automatic
  AO notification or a re-authorization event
- Producing recurring security status reports (quarterly or semi-annual) that keep the AO informed without
  requiring a full package re-submission

Under continuous authorization, the ISSM and AO agree on escalation thresholds and reporting cadence at
the time of initial authorization; the authorization remains in effect as long as those thresholds are not
exceeded. Re-authorization events are triggered by finding severity thresholds rather than calendar dates.

The `gsd-conmon-planner` output is the primary artifact that operationalizes continuous authorization within
the IC pack. The conmon plan specifies which controls are monitored automatically (and at what frequency),
which require periodic manual assessment, the escalation thresholds that trigger AO notification, and how
continuously discovered findings feed into the `POAM.md` upsert workflow. A program that adopts continuous
authorization replaces the fixed re-authorization cycle with the conmon plan's monitoring cadence — a posture
increasingly required by DoD and IC customers as programs move toward DevSecOps delivery models where the
release velocity is incompatible with point-in-time authorization.

## Likely AO Questions

The following pattern catalog documents the categories of question that an AO typically raises during an
authorization review. `gsd-issm` uses these patterns to populate the "Likely AO Questions" appendix in
its authorization package output, enabling the ISSM to anticipate and pre-answer questions the AO is most
likely to raise. Each pattern describes the question category, why the AO asks it, and the type of evidence
that satisfies it.

**1. Residual Risk Posture.**
The AO will ask for a plain-language summary of what risk remains after all controls are implemented and
all POA&M items are accounted for. This tests whether the ISSM understands the risk — not just whether
the SAR documented findings. Satisfying evidence: a risk summary table keyed to the three security
objectives (C, I, A) with an overall residual risk rating, a count of open POA&M items by severity, and
a one-paragraph narrative explaining why the residual risk is acceptable.

**2. Control Inheritance and Shared Responsibility.**
The AO will ask which controls are inherited from a cloud service provider, a common control provider
(e.g., a DoD-managed authentication service), or a FedRAMP-authorized platform. Misrepresenting inherited
controls as fully implemented is a common authorization-package deficiency. Satisfying evidence: a control
inheritance table that identifies the control, the inheriting provider, the provider's authorization status
(e.g., FedRAMP Moderate ATO, IL4 PA), and the residual customer responsibility.

**3. Supply-Chain Risk and SBOM.**
Under EO 14028 and related acquisition policy, the AO will ask for evidence that the program has inventoried
its software supply chain and assessed supply-chain risk. Satisfying evidence: a CycloneDX or SPDX Software
Bill of Materials (SBOM) covering all runtime components, a summary of findings from the most recent SCA
scan, and a description of how supply-chain risk is monitored on an ongoing basis.

**4. Authorization Boundary and System Diagram.**
The AO must understand what is being authorized. An unclear authorization boundary is a frequent cause of
authorization delays. Satisfying evidence: an authorization boundary diagram that labels all in-scope
components, data classification at each boundary crossing, external connections and their authorization
status, and the network architecture layer at which the boundary is enforced.

**5. Incident Response Readiness.**
The AO will ask whether the program has an implemented and tested incident response capability — both
procedural (plan exists) and operational (plan has been exercised). Satisfying evidence: a current Incident
Response Plan (IRP) referencing NIST SP 800-61 Rev 2, evidence of a tabletop or simulation exercise within
the current authorization period, and documentation of the program's relationship to the organizational
CIRT or SOC.

**6. Contingency Posture.**
The AO will ask about the program's ability to recover from a disruptive event, mapped to the CP control
family. Satisfying evidence: a current Contingency Plan (CP) with defined Recovery Time Objectives (RTOs)
and Recovery Point Objectives (RPOs) appropriate to the system's impact level, evidence of a contingency
exercise, and backup and restore procedures tested against the RPO.

**7. Third-Party Risk.**
For systems that depend on third-party services, APIs, or data providers, the AO will ask how third-party
risk is managed. This is distinct from supply-chain risk (which focuses on software components) and focuses
on operational dependency on external services. Satisfying evidence: a third-party risk register, a summary
of the authorization status of each critical dependency, and a contingency plan for critical third-party
unavailability.

**8. FIPS-Validated Cryptography.**
The AO will ask whether cryptographic implementations use NIST-validated modules listed on the CMVP
validated modules list. Non-FIPS cryptography in a system handling CUI or operating at IL4 or above is
typically a blocking finding. Satisfying evidence: a cryptographic inventory listing each implementation,
its CMVP validation certificate number, the validation level (1–3), and where in the system it is used
(data at rest, data in transit, key management).

**9. CUI / ITAR Handling and Data Labeling.**
For programs handling Controlled Unclassified Information (CUI) or ITAR-controlled technical data, the AO
will ask how data is identified, labeled, and protected throughout its lifecycle. Satisfying evidence: a
data inventory identifying CUI categories per the CUI Registry (32 CFR Part 2002) and ITAR categories per
the USML, a description of how data is labeled at creation and during transmission, and how CUI handling
requirements are enforced in system workflows.

**10. FedRAMP Inheritance and Cloud Control Coverage.**
For cloud-hosted systems, the AO will ask how FedRAMP controls are inherited and how customer-responsibility
controls are implemented. The AO specifically tests whether the program has reviewed the cloud provider's
Customer Responsibility Matrix (CRM) and closed all customer-owned controls. Satisfying evidence: the CSP's
CRM with each customer-responsible control documented as implemented, inherited, or planned, and a mapping
of the program's SSP control descriptions to the CRM.

**11. Vulnerability Management Cadence.**
The AO will ask about the program's vulnerability scanning and patch management posture, mapping to the RA
and SI control families. Satisfying evidence: a vulnerability management policy with defined scan frequency
(at minimum monthly for Moderate systems), evidence of the most recent scan results with finding counts by
severity, a patch management SLA (e.g., critical findings remediated within 30 days), and a description of
how scanning integrates with the CI/CD pipeline for pre-deployment assessment.

**12. Identity and Access Lifecycle.**
The AO will ask how user accounts are managed — provisioned, reviewed, and deprovisioned — and how
privileged access is controlled. Maps to the AC and IA control families. Satisfying evidence: an account
management procedure including periodic access reviews (semi-annual at minimum for Moderate), multi-factor
authentication enforcement for all privileged accounts and remote access, a privileged access management
(PAM) description, and evidence that inactive accounts are disabled within the policy-defined period.

**13. Audit Log Retention and SIEM Integration.**
The AO will ask whether audit logs are collected, protected, retained for the required period, and monitored
for indicators of compromise. Maps to the AU control family. Satisfying evidence: an audit logging inventory
covering all in-scope components, evidence that logs are forwarded to a centralized log management or SIEM
system, a retention policy meeting the minimum required period (typically one year for Moderate systems per
NIST SP 800-92 and applicable DoD policy), and a description of alerting rules for log-based security events.

**14. Cross-Domain Transfer Controls.**
For programs that operate across authorization boundaries, the AO will ask how cross-domain transfers are
managed. Satisfying evidence: an identification of all cross-domain data flows, the approval status of the
cross-domain solution (CDS) used for each flow, and a description of the sanitization and release process
governing each transfer. Programs without current cross-domain requirements should document that the
architecture accommodates cross-domain solutions if the mission scope expands.

**15. Data-at-Rest Encryption.**
The AO will ask whether all sensitive data at rest is encrypted using FIPS-validated algorithms and key
management practices. Satisfying evidence: an inventory of all data stores containing sensitive data
(databases, object storage, file systems, backups) with confirmation that each uses a FIPS 140-3 validated
module, a description of the key management architecture (key ownership, rotation, and loss recovery),
and evidence that encryption is enforced by configuration rather than relying solely on application-layer
encryption.

## Authoritative Sources

- NIST SP 800-37 Rev 2 — *Risk Management Framework for Information Systems and Organizations* (NIST, Dec 2018). https://doi.org/10.6028/NIST.SP.800-37r2
- NIST SP 800-53 Rev 5 — *Security and Privacy Controls for Information Systems and Organizations* (NIST, Sept 2020). https://doi.org/10.6028/NIST.SP.800-53r5
- FIPS 199 — *Standards for Security Categorization of Federal Information and Information Systems* (NIST, Feb 2004).
- NIST SP 800-61 Rev 2 — *Computer Security Incident Handling Guide* (NIST, Aug 2012).
- NIST SP 800-92 — *Guide to Computer Security Log Management* (NIST, Sept 2006).
- NIST SP 800-137 — *Information Security Continuous Monitoring (ISCM) for Federal Information Systems and Organizations* (NIST, Sept 2011).
- DoD Instruction 8510.01 — *Risk Management Framework (RMF) for DoD Information Technology* (DoD, Mar 2014, incorporating change 3).
- OMB Circular A-130 — *Managing Information as a Strategic Resource* (OMB, Jul 2016).
- 44 U.S.C. § 3554 — Federal Information Security Modernization Act (FISMA) ATO requirement.

## Cross-References

- `tradecraft/nist-800-53-rev5.md` — NIST SP 800-53 Rev 5 control catalog; control IDs referenced in POA&M rows and SAR findings.
- `tradecraft/poam-format.md` — POA&M file format; assessment findings from `gsd-sar-dryrun` and `gsd-iv-and-v-dryrun` populate this file.
- `tradecraft/nist-800-171.md` — CUI-specific 110-control subset; relevant for programs where CMMC Level 2 applies.
- `tradecraft/dfars-252-204-7012.md` — DFARS 7012 cyber incident reporting; applies alongside the ATO lifecycle for covered defense programs.
- `tradecraft/fips-140-3.md` — FIPS 140-3 cryptographic validation; relevant to the FIPS cryptography AO question and data-at-rest encryption controls.
- `tradecraft/eo-14028.md` — EO 14028 SBOM and zero-trust mandates; relevant to the supply-chain risk AO question and CI/CD security gate integration.
- `classification/aws-partitions.md` — AWS partition map; ATO milestone implications for partition-transition programs are in the "Migration Path Considerations" section.
