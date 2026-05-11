<!-- CLASSIFICATION: UNCLASSIFIED -->
# Adelphi IC Pack for GSD

The IC pack is a soft-fork extension of [Get Shit Done (GSD)](https://github.com/gsd-build/get-shit-done) that adds 58 specialized agents, 3 deterministic hooks, and 5 behavioral skills tailored to intelligence-community software prototyping.

It is distributed as a local npm tarball (`adelphi-gsd-ic-<version>.tgz`) — built locally with `npm pack` and shared via Adelphi's internal distribution channel. The pack is NOT published to a public npm registry. Per program install:

```bash
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<nga|nsa|nro|cia|dia>
```

Per the [design spec](../specs/2026-05-05-ic-agent-pack-design.md) §2.3, each program runs its own GSD-IC instance — one program, one customer, one repo.

## When to use

- You are building IC-focused software prototypes that need rapid demo cadence + the contracting paperwork (capability statements, white papers, ATO drafts) alongside.
- Your program has at least one SME per primary INT discipline in scope.
- Your code is UNCLASSIFIED in this repo (the IC pack does not handle classified content; CI enforces this).

## When not to use

- Code that already lives on a classified system. The IC pack is for low-side prototyping only.
- Programs without SME staffing — references decay without curators.
- Non-IC programs. Stock GSD is the right tool.

## What v1 ships

- **58 agents** across 15 families (compliance, security personas, ATO docs, customer artifacts, capture/BD, mission design, per-INT researchers, all-source/tradecraft, mission-framing analysts, fusion architecture, engineering enablement, transition). See [agent-contracts.ic-pack.md](../../references/agent-contracts.ic-pack.md) for the full roster and completion-marker registry.
- **5 customer overlays:** `cia`, `dia`, `nga`, `nro`, `nsa` (select at install time via `--customer=`).
- **3 deterministic hooks:** classification banner, classified-leak detector, prompt-injection scan.
- **5 behavioral skills:** classification conventions, intel coding conventions, prototyping discipline, Adelphi house style, POA&M conventions.
- **36 reference docs** spanning 10 INT disciplines, 13 tradecraft / compliance / ATO topics, 2 capability patterns, 5 IC-customer ecosystem briefs, 3 house-style guides, and 3 cross-cutting topics (AI/ML eval patterns, classification partitions, modernization themes).
- **12 CI validators** that gate every change to the pack (manifest schema, completion markers, classification banners, workflow patches, trigger strings, seamless-fork guarantee, etc.).

## Documentation map

### Consumer-facing

- [QUICKSTART.md](QUICKSTART.md) — `npx install` to first agent invocation in 30 minutes
- [ARCHITECTURE.md](ARCHITECTURE.md) — layered architecture (customer-friendly subset of the design spec)
- [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md) — bumping the installed pack version
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — known install / CI / runtime failure modes
- [PER-CUSTOMER-PLAYBOOK.md](PER-CUSTOMER-PLAYBOOK.md) — AO-specific gotchas, tradecraft notes, and watch-outs

### Training

- [training/WALKTHROUGH.md](training/WALKTHROUGH.md) — 60-min framework overview (self-guided)
- [training/HANDS-ON-ADD-A-REFERENCE.md](training/HANDS-ON-ADD-A-REFERENCE.md) — 30-min hands-on: add a ref to the manifest
- [training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md](training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md) — 30-min hands-on: scaffold a prototype with the pack

### Contributing (dev-side)

- [ADDING-AN-AGENT.md](ADDING-AN-AGENT.md) — author and register a new agent
- [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md) — add a knowledge-layer reference doc
- [SME-CURATION-FRAMEWORK.md](SME-CURATION-FRAMEWORK.md) — SME workflow, curation states, quality bars
- [REF-CURATION-STATUS.md](REF-CURATION-STATUS.md) — per-ref curation state snapshot (auto-derived from manifest)
- [ADDING-A-SKILL.md](ADDING-A-SKILL.md) — author a behavioral skill (promotion criteria included)
- [ADDING-A-HOOK.md](ADDING-A-HOOK.md) — add a deterministic hook with patterns + tests
- [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md) — onboard a new customer to the catalog
- [UPGRADE-PROCEDURE.md](UPGRADE-PROCEDURE.md) — dev-side soft-fork sync from upstream `gsd-build/get-shit-done`

### Schemas

- [intel-gates-schema.md](intel-gates-schema.md) — `.planning/intel-gates.json` structure
- [REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md) — `intel-refs/**/*.md` frontmatter contract
