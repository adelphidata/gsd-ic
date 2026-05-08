---
name: prototyping-discipline
description: prototyping discipline rules — cheapest-path-to-demo bias, tear-down as first-class deliverable, no premature scaling, demo repeatability over robustness
classification: UNCLASSIFIED
ic_pack: true
injected_into: [gsd-planner, gsd-executor]
activation: always
allowed-tools: Read, Write, Edit, Bash
---

# Prototyping Discipline

This skill governs how IC-pack agents plan and execute prototype and demo work. The IC sales cycle is short and demo-gated: customers evaluate capability before committing to a Period of Relevance (PoR). That context demands fast, cheap, teardown-friendly prototypes — not production-grade systems. Every decision during the prototype phase must be evaluated against one question: does this get us to a credible, repeatable demo at minimum cost and maximum speed?

## Rules

### Rule 1 — Cheapest-path-to-demo bias

Pick the simplest technical path that lets the demo succeed; defer optimization, refactoring, and production-grade engineering until after customer commitment. If a SQLite database proves the capability, do not stand up RDS. If a single EC2 instance works, do not configure an EKS cluster.

**Rationale:** Prototype work that is never sold wastes engineering budget; overbuilt prototypes also signal poor cost discipline to government customers.

**Positive example:** NGA imagery processing demo uses a local Python script over a 500-image sample dataset — sufficient to show the detection pipeline working end-to-end. Full-scale processing is deferred.

**Negative example:** Spinning up a production-sized Aurora cluster with Multi-AZ for a demo that processes 50 test images, because "we'll need it later anyway."

---

### Rule 2 — Tear-down as first-class deliverable

Every prototype, sandbox, or demo environment ships with a documented tear-down procedure. One-command destruction (e.g., `terraform destroy`, a shell script) is the target. Tear-down instructions are written before the prototype is handed off, not after.

**Rationale:** Orphaned cloud resources accumulate billing charges and create unreviewed attack surface; government customers and internal cost controls both treat runaway spend as a red flag.

**Positive example:** The NSA cyber capability sandbox is provisioned with Terraform; the repo includes a `teardown.sh` that runs `terraform destroy -auto-approve` and deletes the S3 state bucket. The customer debrief package includes the tear-down step.

**Negative example:** Three EC2 instances, an ALB, and a CloudFront distribution left running for six weeks after demo day because tear-down was never scripted and the task got lost.

---

### Rule 3 — No premature scaling

Defer multi-region deployment, auto-scaling groups, high-availability configurations, and disaster-recovery runbooks until the customer signs a PoR or the statement of work explicitly funds those features. Single-region, single-AZ, fixed-capacity is the default prototype posture.

**Rationale:** HA and multi-region add cost, complexity, and operational overhead that is wasted if the deal does not close; they also obscure the core capability behind infrastructure noise during the eval period.

**Positive example:** DIA data-fusion demo runs in us-east-1 only, one fixed-size EC2 instance, no ASG. Documented note in the architecture diagram: "Multi-region and auto-scaling deferred to Phase 6 upon PoR award."

**Negative example:** Pre-configuring us-east-1 + us-gov-west-1 active-active replication "because the RFP will probably require it," before any customer feedback on whether the capability is viable.

---

### Rule 4 — Show what you can show

Frame every customer demo at the lowest classification level the content supports. If the full system operates at TS//SCI, build an UNCLASSIFIED demo environment that shows the same algorithmic capability over synthetic or publicly releasable data. Do not let classification be the reason a demo cannot happen.

**Rationale:** Most customer eval sessions happen in uncleared conference rooms or low-side collaboration environments; a TS-only demo excludes decision-makers and delays the sales cycle.

**Positive example:** Full geospatial change-detection system ingests classified imagery, but the demo environment runs the identical model over Sentinel-2 public imagery and shows the same detection outputs on a laptop in an unclassified venue.

**Negative example:** Telling the customer "we can't show you the system because it's all classified" — when a parallel UNCLASSIFIED environment with synthetic data could have demonstrated the core capability.

---

### Rule 5 — Demo repeatability over robustness

Invest engineering effort in reliable demo-reset procedures rather than production-grade error handling or resilience. The demo must start clean, run end-to-end, and reset to a known state between runs. A flawless ten-minute demo loop beats a robust but unreliable system.

**Rationale:** Demo failures in front of customers cause more deal damage than architectural shortcuts that the customer never sees; reset reliability is what converts a prototype into a credible sales tool.

**Positive example:** Before each demo session, a `reset-demo.sh` script drops and recreates the database, reloads fixture data, restarts services, and runs a smoke test — so the presenter starts every run from a known-good state regardless of what happened in the last session.

**Negative example:** Skipping the reset script and running demos on accumulated live state, resulting in stale data artifacts or half-processed records visible in the UI during the customer walk-through.

---

## When this skill applies

- During **phase planning** — when `gsd-planner` is tasked with prototyping, sandbox provisioning, or demo environment scoping
- During **prototype execution** — when `gsd-executor` is provisioning infrastructure, writing demo code, or assembling a customer eval environment
- When **scoping a customer demo or eval** — any task tagged `demo`, `prototype`, `sandbox`, `PoC`, or `eval` in the task list

## When this skill does NOT apply

- **Production-bound code** — Phase 6+ transition work where the deliverable is a production system for an awarded contract; at that point, HA, multi-region, and robustness requirements come from the SOW and are not deferred
- **Compliance and security controls** — classification handling, access control, and audit logging requirements are never deferred, even in prototypes; they are orthogonal to this skill

## Examples

### Example 1 — NGA imagery change-detection demo (2-week timeline)

Customer requests a demo of Adelphi's change-detection pipeline over NGA-style overhead imagery in two weeks.

**Cheapest path:** Single EC2 g4dn.xlarge, Docker Compose stack (model server + tile server + lightweight React frontend), 200-image synthetic dataset from public Sentinel-2 tiles. No RDS — SQLite for metadata. No CDN.

**Tear-down plan:** `docker compose down -v && aws ec2 terminate-instances --instance-ids $INSTANCE_ID` — documented in `README-demo.md` and run by the engineer after debrief.

**Reset procedure:** `reset-demo.sh` — truncates the results table, reloads the 200 test tiles, and restarts the model server. Runs in under 90 seconds.

**Deferred:** Multi-AZ, real classified imagery pipeline, model fine-tuning on customer data, production inference latency targets.

---

### Example 2 — NSA cyber capability sandbox

Customer wants to evaluate an anomaly detection capability in their JWICS environment but also needs a low-side walk-through for program managers.

**Show what you can show:** Maintain two environments — one on JWICS with real sensor data for the technical eval, one UNCLASSIFIED environment with synthetic network telemetry for the PM-level demo. Same codebase, same detection logic, different data.

**Tear-down:** Both environments provisioned with Terraform workspaces. `terraform destroy -var-file=env/demo-unclass.tfvars` and `terraform destroy -var-file=env/demo-jwics.tfvars` documented in the debrief package.

**No premature scaling:** Single-node Elasticsearch, no cluster. Documented: "Production deployment would use managed OpenSearch with 3-node cluster — deferred to Phase 6."

---

### Example 3 — DIA data-fusion PoC going long

A PoC originally scoped for 4 weeks has been running for 3 months. The prototype database has grown to 50 GB of real operational data and the EC2 instance is now $800/month.

**Correct action (per this skill):** Flag to the program manager — the prototype has crossed into de facto production operation without a PoR. Either (a) get a PoR and fund a proper production build, or (b) scope-limit the prototype back to demo-only data and run the tear-down script. Do not continue accruing cost on prototype posture for a production use case.
