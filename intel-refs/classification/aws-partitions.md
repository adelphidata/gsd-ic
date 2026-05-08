---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-13
applies_when: [classification, aws, govcloud, il4, il5, iso, isob, isof, partition, cloud architecture]
---

# IC AWS Partition Map

> **Phase 5 scaffold.** Content reflects publicly available partition architecture and authorization-framework information. High-side partition specifics use abstract language only; no literal classification markings appear in this file per the `validate-no-classified-leak.sh` CI constraint (spec §6.2). Service availability entries should be verified against authoritative partition service lists before program commitment.

This reference establishes the vocabulary and translation guide for AWS cloud partitions relevant to IC programs. `gsd-intel-devops` reads this doc to ground partition-translation notes in IaC scaffolds — ensuring generated Terraform and CloudFormation correctly targets the intended partition and documents service-availability constraints. `gsd-transition-advisor` (Phase 6) and `gsd-fm-adaptation-engineer` (Phase 7) use this as a forward reference when advising programs on cloud migration paths and foundation-model deployment constraints across partition boundaries. The partition map covers Commercial AWS, GovCloud, DoD Impact Level tiers, and the ICITE-aligned high-classification partitions, with a service availability matrix and migration path guidance.

## Commercial AWS

The standard `aws` partition covering all public AWS regions (e.g., `us-east-1`, `us-west-2`, `eu-west-1`). Offers the full AWS service catalog including all AI/ML services (Bedrock, SageMaker, Comprehend, Textract, Rekognition), data services, and networking primitives. Internet-accessible; no US-person or citizenship requirements for access. FedRAMP Moderate authorization covers a broad subset of services, making it suitable for UNCLASSIFIED non-CUI workloads where FedRAMP Moderate controls are sufficient.

Typical IC use cases: UNCLASSIFIED development and prototyping, demo environments, pre-ATO development for capabilities that will later migrate to GovCloud or higher-side partitions. Not authorized for Controlled Unclassified Information (CUI) without additional controls. The unrestricted service catalog makes Commercial AWS the baseline reference environment for assessing what service capabilities exist before applying partition-availability constraints during architecture translation.

Commercial AWS is the only partition where the full Bedrock model catalog, all SageMaker managed endpoints, and all generative AI managed services are available without restriction. When evaluating AI/ML capabilities for a program, benchmark against the commercial partition first, then apply the service-availability matrix to determine what degrades or disappears at the target partition. This "start in commercial, translate upward" workflow is the standard IC IC development pattern for pre-ATO work.

## GovCloud (US)

The `aws-us-gov` partition comprising two regions: `us-gov-east-1` and `us-gov-west-1`. Physically and logically separated from the commercial `aws` partition — separate API endpoints, separate IAM namespaces, separate ARN structures. Accessible from the commercial internet but restricted to US persons; AWS requires citizenship/residency attestation for GovCloud account access, making it ITAR-eligible by design.

Authorization levels: GovCloud achieves FedRAMP Moderate by default across most services. FedRAMP High authorization is available for a targeted subset of services and is required for CUI requiring a higher protection baseline. Most commercial AWS services are replicated in GovCloud, though some newer services launch in commercial first with GovCloud availability following on a lag (typically three to eighteen months). FedRAMP High in GovCloud is also the foundational authorization baseline that DoD IL4 and IL5 build upon — programs planning for IL4/IL5 should architect to FedRAMP High controls from initial GovCloud deployment to reduce rework at the next authorization step.

Typical IC use cases: UNCLASSIFIED CUI workloads, contractor collaboration environments, program office administrative systems, and as the migration staging environment before IL4/IL5 transition. GovCloud is the lowest partition tier that can handle CUI under DoD and ODNI data-handling requirements, and it is the starting point for programs building toward higher-partition authorization. Service availability is extensive but not identical to commercial — verify specific services against the AWS GovCloud service availability list before committing an architecture to GovCloud-only primitives.

GovCloud also serves as the primary partition for IC programs that need to collaborate with cleared contractors who are not credentialed for higher-side partitions. The ITAR-eligibility and US-persons restriction make GovCloud a practical shared environment for government–contractor teaming on programs involving export-controlled technical data. Programs at this tier should use FedRAMP High controls even if only FedRAMP Moderate is strictly required, to ease the eventual step to IL4 authorization.

## DoD Impact Level Partitions (IL4, IL5)

DoD Cloud Computing Security Requirements Guide (CC SRG) defines Impact Levels as authorization tiers layered on top of FedRAMP. IL4 and IL5 are the two DoD-specific tiers above FedRAMP High that apply to AWS GovCloud (and in some IL5 configurations, dedicated regions authorized by the DoD Authorizing Official).

**IL4 — Controlled Unclassified Information (CUI) for DoD:** Covers DoD CUI including export-controlled technical data, privacy data, and mission-sensitive but unclassified operational data. IL4 authorization is a FedRAMP High baseline plus DoD CC SRG Volume 2 controls. The service catalog available at IL4 is a subset of GovCloud — certain services with external dependencies, third-party integrations, or unresolved DoD-specific control gaps are excluded. AI/ML services are partially available at IL4; verify each service against the DoD CC SRG-authorized service list, as Bedrock and some SageMaker features may not be in scope for all IL4 authorizations.

**IL5 — National Security System (NSS) CUI:** IL5 extends IL4 to cover CUI designated as National Security System data — mission-critical unclassified information requiring NSS-level protection controls. IL5 applies additional DoD controls beyond FedRAMP High and typically requires dedicated infrastructure. Service availability at IL5 is further reduced relative to IL4 — many AI/ML managed services are not available, and programs relying on Bedrock or managed inference services must plan for alternative approaches (self-hosted models on EC2/ECS, SageMaker endpoints with additional validation, or deferral to lower-classification preprocessing tiers).

Typical use cases: DoD program offices, defense contractors handling CUI, and intelligence community programs whose workloads are unclassified but mission-sensitive. IL4 and IL5 are distinct from the ICITE-aligned high-classification partitions — they handle unclassified data with strict controls, not classified data.

Key practical implication for architecture: at IL5, the absence of managed AI/ML services is a structural characteristic of the authorization model, not a temporary gap. Programs that discover this constraint late in development face significant rework. IaC scaffolds targeting IL4 or IL5 must include partition-aware service substitution patterns from the start: Bedrock → self-hosted model on EC2/ECS with appropriate instance types; Comprehend → open-source NLP pipeline in a container; Textract → self-hosted OCR pipeline. `gsd-intel-devops` generates these substitution notes inline with IaC output when the target partition is IL4 or IL5.

## ICITE-Aligned IC Partitions (ISO, ISOB, ISOF)

The ICITE-aligned AWS partitions represent the high-side IC cloud environments. These are air-gapped from the commercial internet and from the `aws-us-gov` partition — they operate on physically and logically separate infrastructure accessible only from within cleared facilities and cleared networks. ARN namespaces, API endpoints, and service control planes are entirely separate from GovCloud; tooling, credentials, and configurations do not transfer across the partition boundary without explicit translation.

**ISO** is the primary high-side IC partition. It provides an AWS-compatible cloud environment within the cleared IC enclave, enabling IC mission systems to use cloud-native architectures at classification levels above IL5. Access requires appropriate facility clearance and network connectivity through authorized access points — there is no internet path into ISO from commercial or GovCloud environments.

**ISOB and ISOF** are additional high-classification partitions within the ICITE-aligned family, each with distinct authorization scopes, network topologies, or mission-area alignments. The partition family shares the characteristic of air-gapped, cleared-access-only operation but differs in specifics of authorized users, interconnection agreements, and service availability subsets. `gsd-intel-devops` treats ISO, ISOB, and ISOF as a family for IaC partition-translation purposes — scaffolds use a `target_partition` variable that accepts any of the three identifiers and applies the same conservative service-availability assumptions: compute and storage are available; managed AI/ML services require alternatives; identity federation uses partition-native mechanisms.

**Developer access pattern:** Developers working against the high-side IC partitions do not use commercial AWS credentials or tooling downloaded from the internet. All SDKs, CLI tools, Terraform providers, and container base images must be sourced from partition-resident artifact repositories. This means that a program's supply chain — not just its runtime architecture — must be partition-aware. IaC that references external provider registries (e.g., `registry.terraform.io`) or public container registries (e.g., Docker Hub, public ECR) will fail in the high-side IC partitions. `gsd-intel-devops` scaffolds flag external registry references and substitute partition-resident equivalents where known.

Service availability in the high-side IC partitions is significantly reduced relative to GovCloud and IL4/IL5. Services that depend on public internet connectivity, third-party data, or commercial data licensing are not available. This creates a material gap for AI/ML workloads: managed foundation model services (Bedrock, fully managed inference endpoints) that rely on commercially licensed model weights or public-data RAG pipelines are not available in the high-side IC partitions. Programs targeting these partitions must plan for alternative approaches: self-hosted open-weight models, fine-tuned models trained on partition-resident data, or capability decomposition that places AI/ML inference on a lower-side tier with results passed through an approved cross-domain solution.

This transition gap — the absence of commercially available AI/ML managed services in the high-side IC partitions — is a primary architectural constraint for IC programs modernizing analytics and automation capabilities. It drives requirements for synthetic data pipelines, partition-aware model packaging, and cross-domain workflow design. `gsd-intel-devops` IaC scaffolds flag services unavailable in the target partition and propose alternative approaches inline.

## Partition Identification in IaC

Infrastructure-as-Code must explicitly target the correct partition — provider configuration, resource ARN patterns, service endpoint URLs, and feature flags all vary by partition. Key IaC patterns for partition-aware infrastructure:

- **Terraform AWS provider:** Set `partition` in the `aws` provider block. Use `data.aws_partition.current.partition` to dynamically resolve the partition name and construct partition-correct ARNs. Hardcoded `arn:aws:` prefixes will break in GovCloud (`arn:aws-us-gov:`) and in the high-side IC partitions.
- **CloudFormation:** Use the `AWS::Partition` pseudo-parameter in `!Sub` substitutions. `arn:${AWS::Partition}:iam::${AWS::AccountId}:role/...` resolves correctly across all partitions.
- **Endpoint configuration:** GovCloud and IC partitions use different FIPS-compliant endpoint URLs. Clients must be configured to use FIPS endpoints where required by the partition's authorization baseline. FIPS endpoint usage at GovCloud IL4/IL5 is not optional — it is an authorization requirement.
- **Feature flags:** Some AWS SDK features (e.g., S3 transfer acceleration, CloudFront integration, certain Bedrock model IDs) are partition-specific. Guard feature usage behind partition checks rather than hard-disabling globally.

`gsd-intel-devops` scaffolds output partition-parameterized IaC by default, with `target_partition` as a required input variable. This forces partition selection at IaC authoring time rather than discovering partition incompatibilities at deployment time.

## Service Availability Matrix

Key service availability by partition tier. "Full" means generally available with feature parity to the reference tier. "Partial" means available with feature or service-count gaps. "Limited" means available in restricted form; verify with authorizing official before committing architecture. "Not available" means no current authorized offering. Availability is subject to change; verify against the authoritative service list for the target partition before architecture finalization.

| Service | Commercial | GovCloud | IL4/IL5 | IC Partitions (high-side) |
|---|---|---|---|---|
| S3 | Full | Full | Full | Limited |
| RDS | Full | Full | Partial (engine subset) | Limited |
| DynamoDB | Full | Full | Full | Limited |
| EC2 | Full | Full | Full | Partial |
| ECS / EKS | Full | Full | Partial | Limited |
| Lambda | Full | Full | Partial | Limited |
| Fargate | Full | Full | Partial | Verify with AO |
| OpenSearch Service | Full | Full | Partial | Limited |
| Bedrock | Full | Partial | Not available (IL5) | Not available |
| SageMaker | Full | Partial | Partial (IL4); Not available (IL5) | Not available |
| Comprehend | Full | Partial | Not available | Not available |
| Textract | Full | Partial | Not available | Not available |
| Transit Gateway | Full | Full | Full | Partial |
| IAM Identity Center | Full | Full | Partial | Not available |
| GuardDuty | Full | Full | Full | Partial |
| Security Hub | Full | Full | Full | Partial |

Notes on the matrix:

1. "Not available" for AI/ML services at IL5 and in the high-side IC partitions is the single most consequential architectural constraint for IC programs modernizing analytics. It drives the requirement for self-hosted model infrastructure on EC2/ECS and partition-native container registries.
2. IAM Identity Center is not available in the high-side IC partitions; identity federation uses partition-native mechanisms. Design IAM role structures that do not assume Identity Center from day one.
3. Bedrock availability in GovCloud is partial — a subset of foundation models are available, and model selection is constrained by data-residency and export-control considerations on model weights. Not all commercial Bedrock models appear in GovCloud.
4. Verify all "Partial" and "Verify with AO" entries against the current authoritative service list before architecture finalization — availability changes with each DoD CC SRG revision cycle and each ICITE partition authorization update. This matrix reflects general availability patterns, not a guarantee of current status.

## Migration Path Considerations

Programs transitioning workloads from lower-side development environments to higher-partition production deployments face architectural decisions that must be made at day one — retrofitting partition-incompatible design patterns after the fact is a significant rework driver.

**Typical transition paths:**

- **Stepped progression (recommended for most programs):** Commercial AWS (dev/prototype) → GovCloud (FedRAMP Mod / CUI baseline) → IL4 (DoD CUI) → IL5 (NSS CUI) → ISO/ISOB/ISOF (high-side IC mission). Each hop inherits controls from the prior tier and adds requirements on top. ATO milestones track partition authorization at each step; control inheritance documentation at each hop reduces total authorization burden. At each transition, perform a service-availability audit against the target partition — identify which services must be substituted and document the substitution approach before the ATO submission.

- **Direct low-side to high-side:** Some programs begin development directly in GovCloud or the target IC partition when data residency requirements preclude commercial-side work. This approach trades development agility for reduced transition risk — the service-availability constraints are real from day one, avoiding the need to re-architect once migrating upward. Programs with strong data-sensitivity requirements (e.g., IC programs where prototype data is itself sensitive) should default to this path despite the added complexity.

**Architectural decisions with partition-portability impact:**

- **VPC design:** Use VPC CIDR ranges and subnet patterns compatible with the target partition's networking constraints. Inter-partition data paths require approved cross-domain solution integration; design the VPC boundary assuming it is the data-classification boundary.
- **IAM patterns:** IAM Identity Center is not available across all partition tiers. Design IAM role structures that can operate with both Identity Center federation (lower tiers) and partition-native identity mechanisms (high-side tiers). Avoid IAM designs that hardcode account IDs or partition-specific ARN prefixes.
- **KMS key strategies:** KMS key hierarchy and key policy patterns differ across partitions. Use customer-managed keys (CMKs) from the start; AWS-managed keys may have different availability or control characteristics in higher-classification partitions.
- **Container registries:** ECR is available in GovCloud and at IL4/IL5 with reduced feature sets. In high-side IC partitions, container image distribution uses partition-resident registries. Design image pipelines to support a registry endpoint parameter rather than hardcoding ECR endpoints.
- **FedRAMP Mod → FedRAMP High → IL4 → IL5 → ISO progression:** Each step in the authorization ladder adds control requirements and reduces service availability. Architecture reviews at each ATO milestone should confirm that service dependencies are available in the next target partition before committing to that tier.

`gsd-transition-advisor` provides runtime guidance on partition-transition decision points for specific program architectures.

**Data fabric considerations across partitions:** Cross-partition data flows require approved cross-domain solutions (CDS) and often involve downgrade or sanitization pipelines. Programs building data fabric architectures that span Commercial → GovCloud → high-side IC partitions must account for: (a) latency introduced by CDS mediation, (b) data format transformations imposed by downgrade filters, (c) metadata stripping that may occur at partition boundaries (lineage metadata, provenance tags), and (d) the asymmetry of cross-partition flows — data can typically move to a higher-classification partition more easily than it can be released to a lower one.

**ATO milestone implications:** Each partition transition requires a separate ATO or ATO amendment from the appropriate authorizing official. Control inheritance from the lower-partition ATO reduces (but does not eliminate) the authorization work at the next tier. Programs should obtain a GovCloud FedRAMP High ATO before targeting IL4, an IL4 ATO before targeting IL5, and an IL5 or equivalent high-side baseline before targeting ICITE-aligned partitions. Attempting to skip tiers (e.g., commercial direct to high-side IC partition) is possible in limited circumstances but requires significantly more authorization effort and typically results in longer time-to-operational-capability.

## See Also

- `tradecraft/eo-14028.md` — EO 14028 zero-trust and SBOM mandates that apply at each partition tier and affect ATO documentation requirements. The SBOM requirements are particularly relevant to the supply-chain considerations for high-side IC partition deployments, where third-party component provenance must be traceable within the partition.
- `tradecraft/fips-140-3.md` — FIPS 140-3 cryptographic requirements underpin partition-level data-at-rest and data-in-transit controls. Availability of FIPS-validated cryptographic modules varies by partition; high-side IC partitions require partition-resident validated modules.
- `tradecraft/nist-800-53-rev5.md` — The NIST SP 800-53 Rev 5 control catalog is the baseline for FedRAMP authorizations at all partition tiers. IL4, IL5, and IC partition authorizations add overlays on top of this baseline; understanding the baseline is prerequisite to understanding the overlays.
- `modernization/modernization-themes.md` — Hybrid Cloud and Classification-Aware Compute sections establish the program-level architectural context in which partition decisions are made. Read alongside this partition map for a complete picture of IC cloud modernization constraints.
- `ecosystem/nga.md` — NGA cloud programs span GovCloud through high-side IC partitions and represent a reference case for cross-partition architecture decision-making. NGA acquisition context is relevant to programs competing for geospatial and GEOINT analytics work across partition tiers.
- `ecosystem/nsa.md` — NSA is the primary IC driver for high-side partition architecture standards, zero-trust policy guidance applicable across partition tiers, and cross-domain solution standards that govern inter-partition data flow.
