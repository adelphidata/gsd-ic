---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-11
applies_when: [modernization, data fabric, ai/ml adoption, zero trust, hybrid cloud, it modernization, classification-aware compute]
---

# IC Modernization Themes

> **Phase 3 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1. The structure below is stable; depth-of-knowledge expansion is the staff-onboarding work item.

This reference covers the primary technology and capability modernization themes shaping IC acquisition priorities. `gsd-capability-gap-analyst` reads this doc to ground portfolio-level gap analysis against the modernization directions customers are actively funding — avoiding recommendations for capabilities that are being phased out or duplicating commodity capabilities being delivered through enterprise contracts.

## Modernization Themes

### Data Fabric

Enterprise data fabric architectures that provide unified access to multi-domain, multi-classification data. Key patterns: data virtualization across enclaves, semantic metadata layers, lineage and provenance tracking, data mesh governance models. IC programs funding fabric-layer capabilities typically involve ICITE data layer integrations, NSA data ecosystem work, or IC-wide data-sharing frameworks.

Relevant to proposals when the opportunity involves: data integration across multiple mission systems, cross-domain data access, or enabling analytics against siloed data stores without physical data movement.

### AI/ML Adoption

Operationalizing AI/ML in mission environments — moving from prototype to Program of Record. Key themes: model governance, explainability for analyst workflows, bias auditing for mission-critical decisions, Human-in-the-Loop (HITL) design, model performance on mission-representative data (not academic benchmarks). IC-specific concerns include FM use on classified data, model training in air-gapped environments, and defensible-to-customer measurement claims.

Relevant to proposals when the opportunity involves: analyst augmentation tools, automated triage, predictive analytics, computer vision, or any AI/ML-powered capability where the customer must defend procurement to oversight.

### Zero Trust

Zero Trust Architecture (ZTA) frameworks applied to IC networks and application stacks. Key standards: NIST SP 800-207, NSA ZTA guidance, CISA ZTA Maturity Model. Core pillars: identity-driven access, micro-segmentation, continuous validation, device posture. IC-specific nuance: ZTA in classified environments intersects with cross-domain guard policies, physical security boundaries, and compartment-aware access control.

Relevant to proposals when the opportunity involves: network re-architecture, access control modernization, DevSecOps for mission systems, or any program where the customer is responding to OMB M-22-09 or equivalent ODNI directive.

### Hybrid Cloud

IC hybrid cloud posture — IC Commercial Cloud Services (IC3), AWS GovCloud (US-Gov partitions), on-prem classified facilities, and emerging ISO/ISOB/ISOF AWS partition capabilities. Key tensions: burst compute for analytic workloads vs. data-residency requirements; commercial AI/ML services availability on classified partitions vs. commercial equivalents; ATO burden in hybrid topologies.

Relevant to proposals when the opportunity involves: lift-and-shift of existing capabilities to cloud, new cloud-native development, cross-partition data flow, or advising customers on what commercial services exist in their target partition.

### Classification-Aware Compute

Computing environments that are natively aware of data classification — enforcing classification-based access policies at the compute layer, not just the network layer. Includes: Trusted Execution Environments (TEEs), homomorphic encryption research, cross-domain solutions (CDS) engineering, and classification-preserving analytics. This is distinct from standard data classification labeling — it refers to compute that changes behavior based on classification.

Relevant to proposals when the opportunity involves: processing data at multiple classification levels simultaneously, cross-domain workflow automation, CDS engineering, or enabling ML model training on classified data without human-adjudicated data movement.

## See Also

- `tradecraft/eo-14028.md` — EO 14028 zero-trust and SBOM mandates that operationalize modernization themes in contract requirements.
- `tradecraft/fips-140-3.md` — cryptographic requirements that underpin zero-trust and classification-aware compute architectures.
- `capability-patterns/entity-resolution.md` — data fabric and AI/ML adoption frequently require entity resolution as a foundational layer.
- `ecosystem/nsa.md` — NSA is the primary IC driver for zero-trust and data-fabric modernization priorities.
