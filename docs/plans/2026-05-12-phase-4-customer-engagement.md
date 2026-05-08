# Phase 4 Customer Engagement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 9 customer-engagement agents (`gsd-after-action-recorder`, `gsd-tim-facilitator`, `gsd-capability-brief-generator`, `gsd-white-paper-drafter`, `gsd-demo-scripter`, `gsd-rfi-analyst`, `gsd-capability-statement-generator`, `gsd-proposal-drafter`, `gsd-past-performance-manager`), 2 skills (`prototyping-discipline`, `adelphi-house-style`), 3 IC house-style reference docs (`white-papers.md`, `proposals.md`, `briefs.md`), 1 update to `gsd-customer-context-mapper` (AAR delta ingestion at phase boundary), 3 manifest entries, 9 registry rows, and 9 package allowlist entries — all per spec §13 Phase 4 deliverables. End state: a fresh install gives teams the full speed-to-demo and contracting-paperwork toolkit, with shared narrative content (Plan 4) flowing into customer-facing artifacts.

**Architecture:** Phase 4 is the **customer-facing layer** — it consumes the mission-framing artifacts produced by Phase 3 (`gsd-mission-narrative-writer` for narrative blocks, `gsd-mission-gap-analyst` for mission gap, `gsd-sow-decomposer` for SoW structure, `gsd-capability-gap-analyst` for portfolio context) and turns them into deliverables: capability briefs, white papers, demo scripts, AARs, TIM prep, RFI analyses, capability statements, full proposal drafts, and past-performance logs. The 2 skills (`prototyping-discipline`, `adelphi-house-style`) are behavioral overlays injected into specific agents per spec §7.2 / §7.4. The 3 house-style refs are content templates the white-paper / proposal / brief agents consume alongside the skills (dual-loaded: refs supply content scaffolds, skills supply voice rules). The context-mapper update (per locked decision) gives `gsd-customer-context-mapper` the ability to ingest AAR deltas at phase boundary so customer-feedback findings update the master context file.

**Tech Stack:** Same as Plans 0-4 — Node.js 20+ (CommonJS `.cjs`), `node:test` for install-side JS tests, bash + jq for validators, Markdown for refs/skills/agents. No new runtime dependencies. The `marp-cli` tool is referenced by the brief / proposal slide-format outputs but is not packed (consumer tooling).

**Spec reference:** `docs/specs/2026-05-05-ic-agent-pack-design.md` — §13 Phase 4 row (line 1072); Family E #22-#23 (line 295-302); Family F #24-#26 (line 304-310); Family G #28-#31 (line 313-320); §7.2 prototyping-discipline (line 471); §7.4 adelphi-house-style (line 487); Appendix B ref-doc template; Appendix A agent file template.

**Prerequisites:** Plans 0, 1, 1-fix, 2, 3, and 4 merged on main (confirmed — 1 context mapper, 8 compliance agents, 3 hooks, 23 ref docs, 9 Phase 2 domain agents, 5 Phase 3 mission-design agents, 1 modernization ref, 6 skills, full validator suite passing). `npm install` run. `tools/ci/_run-all.sh` exits 0. `intel-refs/house-style/` directory exists empty (Plan 0 scaffold). `skills/` directory has 3 existing skill subdirs (`intel-coding-conventions/`, `classification-conventions/`, `poam-conventions/`).

**Seamless-fork compliance:** Plan 5 only ADDS files at IC-pack-controlled paths plus modifies the existing IC-pack-owned `gsd-customer-context-mapper.md` agent. The upstream-owned files modified are `package.json` (already-permitted modification per Plans 0-4) and `references/agent-contracts.ic-pack.md` (an IC-pack-named file already owned by this pack). No upstream agents/hooks/skills/configs are touched.

---

## File Structure

Files this plan creates or modifies (paths absolute from repo root `/Users/romansky/gsd-ic/`):

**House-style reference docs (new, all `intel-refs/house-style/`):**
- `intel-refs/house-style/white-papers.md`
- `intel-refs/house-style/proposals.md`
- `intel-refs/house-style/briefs.md`

**Manifest (modified):**
- `intel-refs/MANIFEST.json` — 3 new house-style entries

**Customer-engagement agents (new, all `agents/`):**
- `agents/gsd-after-action-recorder.md`
- `agents/gsd-tim-facilitator.md`
- `agents/gsd-capability-brief-generator.md`
- `agents/gsd-white-paper-drafter.md`
- `agents/gsd-demo-scripter.md`
- `agents/gsd-rfi-analyst.md`
- `agents/gsd-capability-statement-generator.md`
- `agents/gsd-proposal-drafter.md`
- `agents/gsd-past-performance-manager.md`

**Skills (new, both directories already declared in package.json files allowlist):**
- `skills/prototyping-discipline/SKILL.md`
- `skills/adelphi-house-style/SKILL.md`

**Existing agent modified (per locked decision):**
- `agents/gsd-customer-context-mapper.md` — add AAR delta-ingestion section

**Completion marker registry (modified):**
- `references/agent-contracts.ic-pack.md` — append 9 agent rows

**Package metadata (modified):**
- `package.json` — `files` field gets 9 new explicit per-file entries (skills directories and intel-refs/ glob already cover the new skills + refs)

**Total new files:** 14. Modified files: 4.

---

## Decomposition Decision Log

1. **AAR sidecar pattern.** Per locked decision, `gsd-after-action-recorder` writes deltas to `.planning/aar/delta-{date}.md` (sidecar) — NOT directly to `.planning/intel-context.md`. The context-mapper consumes deltas at phase boundary. This avoids cross-agent write collisions and makes the ingestion auditable.

2. **Demo-scripter graceful degradation.** Per locked decision, `gsd-demo-scripter` references `gsd-synthetic-data-engineer` (Phase 5) as a future spawn target via the `Task` tool but includes a fallback path: when SDE is not yet shipped, the agent provides inline data-generation guidance. This avoids blocking on Phase 5.

3. **Family E/F/G output paths.** Each family writes to its own canonical subdirectory under `.planning/`:
   - Family E (#22 AAR, #23 TIM): `.planning/aar/`, `.planning/tims/`
   - Family F (#24 brief, #25 white paper, #26 demo): `.planning/briefs/`, `.planning/papers/`, `.planning/demos/`
   - Family G (#28 RFI, #29 capability statement, #30 proposal, #31 PP): `.planning/captures/`, `.planning/capabilities/`, `.planning/proposals/{name}/`, `.planning/past-performance/`

4. **Skills format.** Skill files match the existing pack convention (`skills/poam-conventions/SKILL.md`, `skills/classification-conventions/SKILL.md`). Frontmatter uses `name`, `description`, `injected_into` (array), and `activation` keys consistent with prior pack skills.

5. **House-style refs as content templates, skills as voice overlays.** Per spec §7.4 line 492, the agents that produce written deliverables are dual-loaded: they read content templates from `intel-refs/house-style/{whitepapers,proposals,briefs}.md` AND have the `adelphi-house-style` skill injected for behavioral voice rules. The two are complementary, not redundant.

6. **Phase 4 agents do NOT append to POA&M.** POA&M append is exclusively Family A compliance-agent behavior (Plans 1-2). Phase 4 agents produce customer-facing deliverables, not compliance findings.

7. **`gsd-mission-narrative-writer` already shipped (Plan 4).** Phase 4 agents (capability-brief-generator, white-paper-drafter, RFI-analyst, capability-statement-generator, proposal-drafter) consume its outputs by reading `.planning/narrative/{capability}-NARRATIVE.md`. No reshipment needed.

8. **`gsd-customer-context-mapper` modification is additive.** The existing agent file gains a new section ("Delta ingestion at phase boundary") and remains backward-compatible — programs that don't use AAR deltas see no behavioral change.

9. **3 manifest entries (3 house-style refs only).** Skills are NOT in the intel-refs MANIFEST (they're under `skills/`, not `intel-refs/`). Agent files are also NOT in the manifest (they're tracked by the registry + package.json). Only the 3 house-style refs need manifest entries.

10. **Skill directories already in package.json allowlist.** `skills/prototyping-discipline/` and `skills/adelphi-house-style/` are pre-declared as directory globs in the allowlist (Plan 0). The plan creates the directories + SKILL.md files inside; no package.json change for skills.

11. **`intel-refs/house-style/` already covered by `intel-refs/` glob in package.json.** The 3 new house-style refs are automatically packed via the existing glob.

12. **Single Plan 5.** Per locked decision (vs. Plan 5a/5b split), all 9 agents + 2 skills + 3 refs + context-mapper update ship in one PR. Largest plan to date but coherent: it's the customer-engagement layer.

13. **Implementer subagent model: sonnet, not haiku.** Plan 4 used haiku for verbatim copying because all content was inlined in the plan. Plan 5 uses task-level specs (this approach saves plan size; full inlined content would push plan ~2500 lines). Implementer subagents synthesize the actual file content from: the spec section pointer, the task's structural requirements, and Plan 4's agent patterns. Sonnet is needed for that synthesis. The implementer is briefed with: (a) target file path, (b) spec line range to read, (c) key frontmatter values, (d) required sections, (e) Plan 4 agent file to crib from for pattern. It writes the file and reports DONE; the controller reviews each file before commit.

---

## Task 1: white-papers.md house-style reference

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/house-style/white-papers.md`

Establishes the IC white-paper content templates. Read by `gsd-white-paper-drafter` (alongside the `adelphi-house-style` skill). Follows Appendix B ref-doc template. The `intel-refs/house-style/` directory already exists empty (Plan 0).

**Content requirements:**
- Frontmatter: `classification: UNCLASSIFIED`, `owner: intel-pack@adelphi.ai`, `last_reviewed: 2026-05-12`, `applies_when: [white paper, technical paper, capability paper, pitch paper, ic deliverable, technical writing]`
- Title: `# IC White Paper Templates`
- Purpose section (1 paragraph): explain the doc is consumed by `gsd-white-paper-drafter` to ground content templates; voice/tone rules are layered separately via the `adelphi-house-style` skill
- 7 section templates, each with 2-3 sample bullets and a guidance paragraph:
  1. **Executive Summary** — 1-paragraph framing, mission gap statement, capability claim, requested action
  2. **Problem Framing** — analyst pain point, current workflow gaps, why this matters now (mission urgency)
  3. **Capability Claim** — what the prototype does in mission terms, supporting evidence pattern (claim → quantified evidence → mission impact), ICD 203 hedging norms
  4. **Mission Impact** — analyst hours saved / decision speed / breadth of coverage, with measurement caveats
  5. **Technical Approach** — architecture sketch, data flow, integration boundaries, transition stages (low-side / mid / high)
  6. **Transition Path** — control inheritance from current environment to PoR target, partition portability notes, ATO milestone mapping
  7. **Supporting Evidence** — past performance citations (link to `.planning/past-performance/CITATIONS.md`), demo dataset references, eval-result pointers
- "See Also" section linking: `tradecraft/icd-203.md`, `ecosystem/{customer}.md`, `house-style/proposals.md`, `house-style/briefs.md`
- Length target: ~120-150 lines

**Tone:** Substantive content — section guidance is a real instruction, not "TBD." Sample bullets read as plausible IC-flavored content (no marketing language, no "best-in-class").

- [ ] **Step 1: Write the doc**

The implementer subagent writes the file based on the content requirements above. Reference Plan 4's `intel-refs/modernization/modernization-themes.md` (similarly-shaped scaffolded ref) for header/structure pattern.

- [ ] **Step 2: Validate against template**

```bash
head -8 /Users/romansky/gsd-ic/intel-refs/house-style/white-papers.md
```

Expected: frontmatter with all 4 required keys (classification, owner, last_reviewed, applies_when).

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/house-style/white-papers.md
git commit -m "[N] docs(refs): IC white-paper content templates (Phase 4 house-style)"
```

---

## Task 2: proposals.md house-style reference

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/house-style/proposals.md`

Establishes IC proposal content templates (FAR 15 / OT). Read by `gsd-proposal-drafter` alongside the `adelphi-house-style` skill.

**Content requirements:**
- Frontmatter: `classification: UNCLASSIFIED`, `owner: intel-pack@adelphi.ai`, `last_reviewed: 2026-05-12`, `applies_when: [proposal, far 15, ota, contract response, technical volume, management volume, past performance volume, cost volume, win themes]`
- Title: `# IC Proposal Templates`
- Purpose section: consumed by `gsd-proposal-drafter` for FAR 15 / OT contract responses. Volumes drafted in separate files; this ref defines the structural skeleton each volume.
- 4 volume sections:
  1. **Technical Volume** — executive summary, technical approach, architecture, key innovation areas, evaluation criteria mapping, technical risk + mitigation
  2. **Management Volume** — organizational structure, key personnel, schedule + milestones, risk management, subcontracting plan, security plan
  3. **Past Performance Volume** — recent and relevant projects (citation format from `.planning/past-performance/CITATIONS.md`), customer references, lessons-learned application
  4. **Cost Volume Narrative** — basis of estimate (assumptions documented), labor categories, ODCs, fee structure (humans finalize numbers per spec line 319; agent proposes with documented assumptions only)
- Win-themes integration: how each volume threads `.planning/win-themes.md` content
- "See Also" section linking: `house-style/white-papers.md`, `house-style/briefs.md`, `tradecraft/icd-203.md`, `ecosystem/{customer}.md`
- Length target: ~130-160 lines

- [ ] **Step 1: Write the doc**

Implementer writes per content requirements. Reference Plan 4 modernization-themes.md for header/structure pattern.

- [ ] **Step 2: Validate frontmatter**

```bash
head -8 /Users/romansky/gsd-ic/intel-refs/house-style/proposals.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/house-style/proposals.md
git commit -m "[N] docs(refs): IC proposal volume templates (Phase 4 house-style)"
```

---

## Task 3: briefs.md house-style reference

**Files:**
- Create: `/Users/romansky/gsd-ic/intel-refs/house-style/briefs.md`

Establishes capability-brief / Marp-format slide templates. Read by `gsd-capability-brief-generator` and `gsd-milestone-brief-generator` (Phase 6 — forward reference) alongside the `adelphi-house-style` skill.

**Content requirements:**
- Frontmatter: `classification: UNCLASSIFIED`, `owner: intel-pack@adelphi.ai`, `last_reviewed: 2026-05-12`, `applies_when: [capability brief, milestone brief, slides, marp, slide deck, briefing, customer brief, audience adaptation]`
- Title: `# IC Brief Templates`
- Purpose section: dual-format Markdown convention — readable as plain Markdown AND convertible to slide deck via `marp-cli`. Marp-compatible front-matter + slide breaks (`---`).
- 7 slide templates with content guidance:
  1. **Title slide** — capability name, audience, date, classification, presenter
  2. **Agenda slide** — 4-6 bullets, audience-tailored
  3. **Mission framing slide** — gap statement (from `.planning/MISSION-GAP.md`)
  4. **Capability claim slide** — what we built + key evidence
  5. **Demo placeholder** — pointer to `.planning/demos/{name}-DEMO-SCRIPT.md` + screenshot/video reference
  6. **Ask slide** — what we're requesting (next phase, follow-on funding, integration support)
  7. **Next steps + appendix** — risk + mitigation, transition status, supporting links
- Marp frontmatter pattern (`marp: true`, theme, paginate, etc.) explained
- Audience variants — guidance on which narrative-writer voice to pick (Technical / Executive / Mission-Tactical) based on the audience
- "See Also" section linking: `house-style/white-papers.md`, `house-style/proposals.md`, `tradecraft/icd-203.md`
- Length target: ~110-140 lines

- [ ] **Step 1: Write the doc**

Implementer writes per content requirements.

- [ ] **Step 2: Validate frontmatter**

```bash
head -8 /Users/romansky/gsd-ic/intel-refs/house-style/briefs.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/house-style/briefs.md
git commit -m "[N] docs(refs): IC capability/milestone brief templates (Phase 4 house-style)"
```

---

## Task 4: Update MANIFEST.json with 3 new house-style entries

**Files:**
- Modify: `/Users/romansky/gsd-ic/intel-refs/MANIFEST.json`

Adds 3 manifest entries — one per Phase 4 house-style ref. Bundled as a single task to touch MANIFEST.json once. The existing 24 entries (from Plans 0-4) are unchanged.

- [ ] **Step 1: Add 3 entries**

Edit tool, `intel-refs/MANIFEST.json`. Locate the last existing entry (`modernization/modernization-themes.md`):

```json
    "modernization/modernization-themes.md": {
      "applies_when": ["modernization", "data fabric", "ai/ml adoption", "zero trust", "hybrid cloud", "it modernization", "classification-aware compute"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-11",
      "classification": "UNCLASSIFIED"
    }
```

Replace with:

```json
    "modernization/modernization-themes.md": {
      "applies_when": ["modernization", "data fabric", "ai/ml adoption", "zero trust", "hybrid cloud", "it modernization", "classification-aware compute"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-11",
      "classification": "UNCLASSIFIED"
    },
    "house-style/white-papers.md": {
      "applies_when": ["white paper", "technical paper", "capability paper", "pitch paper", "ic deliverable", "technical writing"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-12",
      "classification": "UNCLASSIFIED"
    },
    "house-style/proposals.md": {
      "applies_when": ["proposal", "far 15", "ota", "contract response", "technical volume", "management volume", "past performance volume", "cost volume", "win themes"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-12",
      "classification": "UNCLASSIFIED"
    },
    "house-style/briefs.md": {
      "applies_when": ["capability brief", "milestone brief", "slides", "marp", "slide deck", "briefing", "customer brief", "audience adaptation"],
      "owner": "intel-pack@adelphi.ai",
      "last_reviewed": "2026-05-12",
      "classification": "UNCLASSIFIED"
    }
```

- [ ] **Step 2: Validate JSON**

```bash
jq empty /Users/romansky/gsd-ic/intel-refs/MANIFEST.json && echo "JSON valid"
```

Expected: `JSON valid`.

- [ ] **Step 3: Verify topic count**

```bash
jq '.topics | keys | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
```

Expected: `27` (24 existing + 3 new house-style entries).

- [ ] **Step 4: Validate against `applies_when` in each ref**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-manifest.sh
```

Expected: `[validate-manifest] OK`.

- [ ] **Step 5: Commit**

```bash
cd /Users/romansky/gsd-ic
git add intel-refs/MANIFEST.json
git commit -m "[U] docs(manifest): add 3 Phase 4 house-style ref entries"
```

---

## Task 5: gsd-after-action-recorder agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-after-action-recorder.md`

Family E agent #22. Captures customer feedback / exit-brief content. **Three input formats**: paste / transcript / structured form (via AskUserQuestion). Writes both an AAR and a delta sidecar that `gsd-customer-context-mapper` ingests at next phase boundary (Task 16).

**Spec source:** Line 301 in spec.

**Frontmatter:**
- `name: gsd-after-action-recorder`
- `description`: capture customer feedback into structured artifacts; accepts paste / transcript path / structured form (multi-turn AskUserQuestion); produces AAR file + delta sidecar for context-mapper ingestion
- `ic_pack: true`, `classification: UNCLASSIFIED`
- `tools: [Read, Write, Bash, Grep, Glob, AskUserQuestion]` (one of two Phase 4 agents with AskUserQuestion — see also Task 6 TIM facilitator does NOT have it; this is the only Phase 4 agent with the tool)
- `applies_when: [demo, ecosystem, aar, after action, customer feedback, meeting notes, exit brief, transcript, retrospective]`

**Required sections:**
1. `# gsd-after-action-recorder` heading + role paragraph
2. `## When you run` — after a customer meeting / exit brief / TIM / phase-end review
3. `## Inputs you accept` — pasted notes, path to transcript file, or structured form (interview)
4. `## What you produce` — `.planning/aar/{date}-AAR.md` (canonical) + `.planning/aar/delta-{date}.md` (sidecar for context-mapper)
5. `## How you do the work` — branch on input type:
   - If user pastes notes: parse + normalize
   - If user provides transcript path: Read the file
   - If neither: AskUserQuestion to interview (attendees, decisions, action items, customer reactions, surprising findings)
   Then synthesize → write AAR → derive deltas → write delta sidecar
6. AAR shape — frontmatter (classification, title, generated, attendees) + sections: Meeting Summary, Decisions, Action Items, Customer Reactions, Surprising Findings, Risks Surfaced
7. Delta sidecar shape — frontmatter (`processed: false`, `target: intel-context.md`, `generated`, `aar_source: {date}-AAR.md`) + structured deltas (e.g., new stakeholder, changed transition target, new pain point, AO refinement)
8. `## Constraints` — UNCLASSIFIED default; honest synthesis (no fabrication of decisions); flag classified content if pasted (halt + emit blocked marker)
9. `## Completion marker` — emit `## AFTER ACTION COMPLETE` (success); `## AFTER ACTION BLOCKED` (input unusable / classification escalation needed)
10. Trailing self-emit `## AFTER ACTION COMPLETE` heading

**Length target:** ~150-180 lines. Pattern reference: Plan 4 `gsd-mission-gap-analyst.md` (similar AskUserQuestion + hybrid intake pattern).

- [ ] **Step 1: Write the agent**

Dispatch sonnet implementer with: target path, spec line 301 reference, Plan 4 mission-gap-analyst as pattern reference, the section requirements above.

- [ ] **Step 2: Verify markers + frontmatter**

```bash
grep -E "^## AFTER ACTION (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-after-action-recorder.md
grep -E "^tools: \[" /Users/romansky/gsd-ic/agents/gsd-after-action-recorder.md
grep "AskUserQuestion" /Users/romansky/gsd-ic/agents/gsd-after-action-recorder.md | head -1
```

Expected: complete + blocked markers present; tools line includes AskUserQuestion.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-after-action-recorder.md
git commit -m "[N] feat(agents): gsd-after-action-recorder — Phase 4 AAR + delta sidecar"
```

---

## Task 6: gsd-tim-facilitator agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-tim-facilitator.md`

Family E agent #23. Prepares Technical Interchange Meeting materials. Distinct from milestone briefs (formal reviews) and capability briefs (pitch-style).

**Spec source:** Line 302.

**Frontmatter:**
- `name: gsd-tim-facilitator`
- `description`: prepares TIM materials — agenda, customer-ask anticipation, talking points, decision-prep matrix; ongoing two-way working-level meetings (vs. formal milestone reviews)
- `tools: [Read, Write, Bash, Grep, Glob]` (no AskUserQuestion — reads from files)
- `applies_when: [ecosystem, tradecraft, tim, technical interchange, meeting prep, agenda, talking points, customer asks, decision prep]`

**Required sections:**
1. Role paragraph
2. `## When you run` — before a scheduled TIM
3. `## Inputs you accept` — `.planning/intel-context.md`, prior `.planning/aar/*.md`, current phase status, target meeting date + topic (user-supplied)
4. `## What you produce` — `.planning/tims/{date}-TIM-PREP.md`
5. `## How you do the work` — read context + AAR archive; identify recurring customer asks; draft agenda; write anticipation matrix (likely customer questions + prepared answers); write decision-prep matrix (decisions team needs from customer with options + recommendations); write talking-points list
6. Output shape — frontmatter + sections: Agenda, Anticipated Customer Asks (table), Decision Prep Matrix (table), Talking Points, Risks to Surface, Action Items Carried Over (from prior TIM)
7. `## Constraints` — UNCLASSIFIED default; honest framing; recommendation rationale required for each decision
8. `## Completion marker` — `## TIM PREP COMPLETE` / `## TIM PREP BLOCKED`
9. Trailing self-emit marker

**Length target:** ~110-140 lines. Pattern reference: Plan 4 `gsd-sow-decomposer.md` (similar Read-and-write pattern, no AskUserQuestion).

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## TIM PREP (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-tim-facilitator.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-tim-facilitator.md
git commit -m "[N] feat(agents): gsd-tim-facilitator — Phase 4 Technical Interchange Meeting prep"
```

---

## Task 7: gsd-capability-brief-generator agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-capability-brief-generator.md`

Family F agent #24. Slides + talking points (dual-format Markdown / Marp). Consumes narrative blocks (executive or mission-tactical voice variant per audience).

**Spec source:** Line 308.

**Frontmatter:**
- `name: gsd-capability-brief-generator`
- `description`: capability brief generator — dual-format Markdown (readable + Marp-convertible); consumes narrative blocks (picks executive or mission-tactical variant); slides for customer briefings
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [demo, ecosystem, capability brief, slides, marp, customer brief, presentation, executive brief]`

**Required sections:**
1. Role paragraph
2. `## When you run` — when a customer brief is needed (pre-TIM, capability pitch, exec walkthrough)
3. `## Inputs you accept` — project state, `.planning/narrative/{capability}-NARRATIVE.md` (Plan 4 output), target audience (engineer-supplied), `intel-refs/house-style/briefs.md` (Task 3)
4. `## What you produce` — `.planning/briefs/capability-{date}-BRIEF.md` in dual-format Marp Markdown (with `marp: true` frontmatter, `theme: default`, slide breaks via `---`)
5. `## How you do the work` — read narrative blocks; pick voice variant by audience (Executive for PM/leadership; Mission-Tactical for analysts/operators); read brief template ref; assemble 7-slide brief (title, agenda, mission frame, capability claim, demo, ask, next steps)
6. Output shape — Marp frontmatter + 7 slides, each with title (`#`) + 3-6 bullets + speaker-notes section (`<!-- _notes... -->`)
7. `## Constraints` — UNCLASSIFIED default; voice consistency (single voice per brief); house-style skill applies (adelphi-house-style — check `agent_skills` config)
8. `## Completion marker` — `## CAPABILITY BRIEF COMPLETE`
9. Trailing self-emit marker

**Length target:** ~130-160 lines. Pattern reference: Plan 4 `gsd-mission-narrative-writer.md`.

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## CAPABILITY BRIEF COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-capability-brief-generator.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-capability-brief-generator.md
git commit -m "[N] feat(agents): gsd-capability-brief-generator — Phase 4 dual-format Marp capability brief"
```

---

## Task 8: gsd-white-paper-drafter agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-white-paper-drafter.md`

Family F agent #25. Pitch / technical white papers. **Dual-loaded** — content templates from `intel-refs/house-style/white-papers.md` AND `adelphi-house-style` skill for voice rules.

**Spec source:** Line 309.

**Frontmatter:**
- `name: gsd-white-paper-drafter`
- `description`: drafts pitch / technical white papers in IC house style; dual-loaded with content templates (intel-refs/house-style/white-papers.md) and adelphi-house-style skill for voice
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [demo, ecosystem, white paper, technical paper, pitch paper, capability paper]`

**Required sections:**
1. Role paragraph (mention dual-loaded with skill + ref)
2. `## When you run` — pitch / technical white papers needed (RFI response, capability pitch, unsolicited proposal supplement)
3. `## Inputs you accept` — narrative blocks (`.planning/narrative/{capability}-NARRATIVE.md`); technical findings; target program; `intel-refs/house-style/white-papers.md` (Task 1); `intel-refs/ecosystem/{customer}.md`
4. `## What you produce` — `.planning/papers/{title}.md` — single white paper file with frontmatter (classification, title, audience, capability, generated)
5. `## How you do the work` — read white-papers template; pick voice variant from narrative (technical or executive); apply adelphi-house-style voice rules (claim → quantified evidence → mission impact); assemble 7 sections (executive summary, problem framing, capability claim, mission impact, technical approach, transition path, supporting evidence)
6. Output shape — frontmatter + 7 sections, each grounded in narrative block content + technical findings
7. `## Constraints` — UNCLASSIFIED default; ICD 203 hedging; no marketing language ("best-in-class", "game-changing"); adelphi-house-style enforces voice; cite past performance from `.planning/past-performance/CITATIONS.md` for evidence
8. `## Completion marker` — `## WHITE PAPER COMPLETE` / `## WHITE PAPER BLOCKED`
9. Trailing self-emit marker

**Length target:** ~140-170 lines.

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## WHITE PAPER (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-white-paper-drafter.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-white-paper-drafter.md
git commit -m "[N] feat(agents): gsd-white-paper-drafter — Phase 4 dual-loaded white paper drafter"
```

---

## Task 9: gsd-demo-scripter agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-demo-scripter.md`

Family F agent #26. Repeatable demo scripts. **Data strategy: all-three** (external paths + checksums for big data; inline samples for tiny seed; spawn synthetic-data-engineer for sensitive placeholders). **Graceful degradation** for SDE (Phase 5 forward reference).

**Spec source:** Line 310.

**Frontmatter:**
- `name: gsd-demo-scripter`
- `description`: repeatable demo scripts — scenarios, datasets, expected outputs, fallback paths; mixes external-with-checksum + inline-sample + synthetic-data-engineer spawn (graceful fallback when SDE not yet shipped)
- `tools: [Read, Write, Bash, Grep, Glob, Task]` (Task tool is for spawning gsd-synthetic-data-engineer when shipped — see Constraints for graceful degradation)
- `applies_when: [demo, demo script, repeatable demo, dataset, scenario, fallback, walkthrough]`

**Required sections:**
1. Role paragraph
2. `## When you run` — demo prep before TIM / customer brief / milestone review
3. `## Inputs you accept` — capability description; dataset references; project state; user-supplied target audience + scenario
4. `## What you produce` — `.planning/demos/{name}-DEMO-SCRIPT.md` (single canonical script per scenario)
5. `## How you do the work` — assess data needs (big real data → external paths + SHA256 checksums; tiny seed → inline; sensitive placeholders → spawn synthetic-data-engineer if available, else inline-generation guidance); assemble script: scenario, prerequisites, dataset list, walkthrough steps (with expected outputs), fallback paths (what to do if dataset unavailable / step fails)
6. **Graceful degradation note** — explicitly: "if `gsd-synthetic-data-engineer` is not yet shipped (Phase 5), fall back to inline data-generation guidance using Faker/Mimesis/GDAL primitives per data family"
7. Output shape — frontmatter + sections: Scenario, Prerequisites, Datasets (table — name, location, checksum, classification), Walkthrough Steps (numbered, each with expected output), Fallback Paths (per-step), Reset Procedure (return demo state to initial)
8. `## Constraints` — UNCLASSIFIED default; never use real classified or PII data — flag and halt; demo repeatability over robustness (per `prototyping-discipline` skill — Task 14)
9. `## Completion marker` — `## DEMO SCRIPT COMPLETE`
10. Trailing self-emit marker

**Length target:** ~160-200 lines (longest Phase 4 agent due to data-strategy complexity).

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## DEMO SCRIPT COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-demo-scripter.md
grep "synthetic-data-engineer" /Users/romansky/gsd-ic/agents/gsd-demo-scripter.md | head -2
```

Expected: marker present; SDE forward-reference present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-demo-scripter.md
git commit -m "[N] feat(agents): gsd-demo-scripter — Phase 4 demo scripter (graceful SDE degradation)"
```

---

## Task 10: gsd-rfi-analyst agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-rfi-analyst.md`

Family G agent #28. RFI/RFP intake → prototype scope + win themes. Consumes per-program win-theme library at `.planning/win-themes.md`.

**Spec source:** Line 317.

**Frontmatter:**
- `name: gsd-rfi-analyst`
- `description`: parses RFI / RFP documents into prototype scope + win themes; consumes `.planning/win-themes.md`; produces structured analysis at `.planning/captures/{date}-{name}-RFI-ANALYSIS.md`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ecosystem, rfi, rfp, request for information, request for proposal, capture, win themes, opportunity analysis]`

**Required sections:**
1. Role paragraph
2. `## When you run` — at RFI/RFP arrival; before proposal-drafter
3. `## Inputs you accept` — RFI/RFP doc (path supplied or auto-detect from `.planning/`); `.planning/win-themes.md` (per-program); `.planning/past-performance/CITATIONS.md` (for evidence-based scoping); `intel-refs/ecosystem/{customer}.md`
4. `## What you produce` — `.planning/captures/{date}-{name}-RFI-ANALYSIS.md` — structured analysis
5. `## How you do the work` — locate doc; read win-themes; extract opportunity description, evaluation criteria, requirements; map each win theme to a relevant requirement; identify capability fit (what we have / partial / gap); recommend prototype scope; flag agent dispatch needs (e.g., compliance triggers); call out open questions for government clarification
6. Output shape — frontmatter + sections: Opportunity Summary, Evaluation Criteria (extracted), Requirements Inventory, Win-Theme Mapping (table), Capability Fit Assessment, Recommended Prototype Scope, Agent Dispatch Recommendations, Open Questions
7. `## Constraints` — UNCLASSIFIED default; do not invent customer asks; flag classified content
8. `## Completion marker` — `## RFI ANALYSIS COMPLETE` / `## RFI ANALYSIS BLOCKED`
9. Trailing self-emit marker

**Length target:** ~140-170 lines. Pattern reference: Plan 4 `gsd-sow-decomposer.md` (similar structured-doc-parsing pattern).

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## RFI ANALYSIS (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-rfi-analyst.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-rfi-analyst.md
git commit -m "[N] feat(agents): gsd-rfi-analyst — Phase 4 RFI/RFP intake to prototype scope"
```

---

## Task 11: gsd-capability-statement-generator agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-capability-statement-generator.md`

Family G agent #29. Short on-demand "what do you have on X?" responses. Consumes capability list, narrative blocks, past-performance citations.

**Spec source:** Line 318.

**Frontmatter:**
- `name: gsd-capability-statement-generator`
- `description`: short on-demand capability statements — "what do you have on X?" — consumes narrative blocks + past-performance citations; produces statement at `.planning/capabilities/{topic}-STATEMENT.md`
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ecosystem, capability statement, on-demand response, what do you have, customer ask, capability summary]`

**Required sections:**
1. Role paragraph
2. `## When you run` — when customer asks "what do you have on X" / on-demand capability inquiries
3. `## Inputs you accept` — target topic (user-supplied); capability list (`.planning/capabilities/` index); narrative blocks; past-performance citations; ecosystem ref for the customer
4. `## What you produce` — `.planning/capabilities/{topic}-STATEMENT.md` — concise statement (~1-2 pages)
5. `## How you do the work` — identify relevant capabilities by topic; pick narrative voice (typically Executive for the customer); cite past-performance entries; assemble statement with capability claim, evidence (citations), mission impact
6. Output shape — frontmatter + sections: Topic, Capability Summary (1 paragraph), Specific Capabilities (bullets), Past Performance Citations (list pointing to `.planning/past-performance/CITATIONS.md` entries), Mission Impact, Next Steps (e.g., "TIM available", "demo available", "white paper available")
7. `## Constraints` — UNCLASSIFIED default; only cite past-performance entries that exist (no fabrication); voice consistency with `adelphi-house-style` skill
8. `## Completion marker` — `## CAPABILITY STATEMENT COMPLETE`
9. Trailing self-emit marker

**Length target:** ~110-140 lines.

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## CAPABILITY STATEMENT COMPLETE$" /Users/romansky/gsd-ic/agents/gsd-capability-statement-generator.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-capability-statement-generator.md
git commit -m "[N] feat(agents): gsd-capability-statement-generator — Phase 4 on-demand capability statements"
```

---

## Task 12: gsd-proposal-drafter agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-proposal-drafter.md`

Family G agent #30. Formal FAR 15 / OT contract response. **Drafts all written volumes** (technical, management, past performance) plus cost basis with stated assumptions. Humans finalize cost numbers.

**Spec source:** Line 319.

**Frontmatter:**
- `name: gsd-proposal-drafter`
- `description`: drafts formal FAR 15 / OT proposal — all written volumes (technical, management, past performance) plus cost-basis narrative with documented assumptions; humans finalize cost numbers; produces per-volume files
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ecosystem, proposal, far 15, ota, contract response, technical volume, management volume, past performance volume, cost volume]`

**Required sections:**
1. Role paragraph (emphasize: drafts all WRITTEN volumes; cost numbers proposed-only with assumptions)
2. `## When you run` — proposal drafting; consumes RFI/RFP analysis (Task 10) and narrative blocks
3. `## Inputs you accept` — RFP doc; `.planning/captures/{date}-{name}-RFI-ANALYSIS.md`; narrative blocks; technical approach docs (project state); past-performance from `.planning/past-performance/` (Task 13); win themes; `intel-refs/house-style/proposals.md` (Task 2)
4. `## What you produce` — `.planning/proposals/{name}/{volume}.md` — one file per volume:
   - `technical.md`
   - `management.md`
   - `past-performance.md`
   - `cost-narrative.md`
5. `## How you do the work` — read all inputs; draft each volume per the proposals.md template (Task 2); apply adelphi-house-style voice; cite past performance with claim-by-claim evidence; for cost: propose labor categories + ODCs + fee structure with documented assumptions ("assume 6 SWE FTE @ $X/hr per FAR 31 cost-principles, customer to validate"); never finalize cost numbers
6. Output shape — per-volume files with frontmatter (classification, volume, version, generated) + standard volume sections
7. `## Constraints` — UNCLASSIFIED default; do not finalize cost figures; document every assumption; flag if RFP requires non-FAR-15 vehicle (e.g., OT) and adapt template
8. `## Completion marker` — `## PROPOSAL DRAFT COMPLETE` / `## PROPOSAL DRAFT BLOCKED`
9. Trailing self-emit marker

**Length target:** ~180-220 lines (longest Phase 4 agent — multi-volume scope).

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## PROPOSAL DRAFT (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-proposal-drafter.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-proposal-drafter.md
git commit -m "[N] feat(agents): gsd-proposal-drafter — Phase 4 multi-volume proposal drafter (cost-as-assumption)"
```

---

## Task 13: gsd-past-performance-manager agent

**Files:**
- Create: `/Users/romansky/gsd-ic/agents/gsd-past-performance-manager.md`

Family G agent #31. **Per-program tracker** — not a corporate KB (per spec §2.3 single-program-instantiation constraint). Maintains chronological PP-LOG and citation-ready CITATIONS file.

**Spec source:** Line 320.

**Frontmatter:**
- `name: gsd-past-performance-manager`
- `description`: per-program past-performance tracker — chronological PP-LOG.md (delivered prototypes, customer feedback, lessons-learned) + claim-by-claim CITATIONS.md (consumed by capability-statement-generator and proposal-drafter); per-program scoped per §2.3
- `tools: [Read, Write, Bash, Grep, Glob]`
- `applies_when: [ecosystem, past performance, pp, citations, lessons learned, customer feedback, prototype delivery, citation library]`

**Required sections:**
1. Role paragraph (emphasize per-program scope; reuse across programs is procedural inter-repo copy)
2. `## When you run` — at phase completion / milestone close; on-demand when capability-statement or proposal needs PP citations
3. `## Inputs you accept` — `.planning/SUMMARY.md` files (per-phase summaries); `.planning/aar/*.md` archives; customer references (user-supplied); milestone briefs
4. `## What you produce` — two files:
   - `.planning/past-performance/PP-LOG.md` — chronological delivery log (one entry per delivered prototype / phase / milestone)
   - `.planning/past-performance/CITATIONS.md` — claim-by-claim citation library (each claim has: claim text, evidence pointer, customer if cited, date)
5. `## How you do the work` — read SUMMARY archives + AARs; for each delivery, append to PP-LOG with frontmatter date; extract citation-worthy claims (capabilities demonstrated, customer feedback, quantified outcomes) and append to CITATIONS with evidence pointers; idempotent (do not duplicate)
6. Output shape — PP-LOG: chronological entries with frontmatter + standard fields (project, phase, customer, period, delivered capabilities, customer feedback, lessons-learned). CITATIONS: claim-evidence pairs.
7. `## Constraints` — UNCLASSIFIED default; per-program scope (do not pull from outside this `.planning/`); no fabrication of customer feedback; cite explicit evidence for every claim
8. `## Completion marker` — `## PP UPDATE COMPLETE` / `## PP UPDATE BLOCKED`
9. Trailing self-emit marker

**Note on completion marker:** The validator regex requires `[A-Z]` after `##`; `## PP UPDATE COMPLETE` is valid (`P` is the first char). The marker uses `UPDATE COMPLETE` which is a recognized terminal in the validator regex (`COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE`).

**Length target:** ~130-160 lines.

- [ ] **Step 1: Write the agent**
- [ ] **Step 2: Verify**

```bash
grep -E "^## PP UPDATE (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-past-performance-manager.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-past-performance-manager.md
git commit -m "[N] feat(agents): gsd-past-performance-manager — Phase 4 per-program PP tracker"
```

---

## Task 14: prototyping-discipline skill

**Files:**
- Create: `/Users/romansky/gsd-ic/skills/prototyping-discipline/SKILL.md`

Per spec §7.2 (line 471). Behavioral overlay injected into `gsd-planner` and `gsd-executor`. Substantive content — not a scaffold.

**Frontmatter (match existing skills convention — see `skills/poam-conventions/SKILL.md`):**
- `name: prototyping-discipline`
- `description`: prototyping discipline rules — cheapest-path-to-demo bias, tear-down as first-class deliverable, no premature scaling, demo repeatability over robustness
- `injected_into: [gsd-planner, gsd-executor]`
- `activation: always` (always active when injected per config)

**Required content (substantive, ~80-120 lines):**
1. `# Prototyping Discipline` heading + 1-paragraph purpose
2. `## Rules`:
   - **Cheapest-path-to-demo bias** — explanation + positive example + negative example
   - **Tear-down as first-class deliverable** — every demo / prototype / sandbox includes documented tear-down (one-command if possible); positive example (Terraform destroy, scripted cleanup); negative example (orphaned EC2 / S3 / Lambda costs accumulating)
   - **No premature scaling** — defer multi-region / autoscaling / HA until customer commits to PoR
   - **Show what you can show** — tearline-friendly framing (UNCLASSIFIED demo even when full system is classified)
   - **Demo repeatability over robustness** — invest in reliable reset procedures over perfect production-grade code; demo state must reset cleanly between runs
3. `## When this skill applies` — during phase planning; during prototype execution; when scoping a customer demo or eval
4. `## When this skill does NOT apply` — production-bound code (Phase 6+ transition work)
5. `## Examples` — 2-3 worked examples (e.g., "Customer asks for capability X demo in 2 weeks" → cheapest-path approach + tear-down plan)

**Length target:** ~80-120 lines.

- [ ] **Step 1: Create directory + file**

```bash
mkdir -p /Users/romansky/gsd-ic/skills/prototyping-discipline
```

Then write the SKILL.md.

- [ ] **Step 2: Verify**

```bash
test -f /Users/romansky/gsd-ic/skills/prototyping-discipline/SKILL.md && echo OK
head -8 /Users/romansky/gsd-ic/skills/prototyping-discipline/SKILL.md
```

Expected: file exists; frontmatter present.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add skills/prototyping-discipline/SKILL.md
git commit -m "[N] feat(skills): prototyping-discipline skill (Phase 4 §7.2)"
```

---

## Task 15: adelphi-house-style skill

**Files:**
- Create: `/Users/romansky/gsd-ic/skills/adelphi-house-style/SKILL.md`

Per spec §7.4 (line 487). Behavioral overlay injected into the deliverable-producing agents. Voice rules complement the content templates in `intel-refs/house-style/*.md`.

**Frontmatter:**
- `name: adelphi-house-style`
- `description`: Adelphi voice rules — confident-not-boastful tone, pronoun discipline, evidence cadence, prohibited phrases; behavioral overlay on top of intel-refs/house-style/{white-papers,proposals,briefs}.md content templates
- `injected_into: [gsd-white-paper-drafter, gsd-proposal-drafter, gsd-capability-brief-generator, gsd-capability-statement-generator, gsd-mission-narrative-writer]`
- `activation: always`

**Required content (substantive, ~120-160 lines):**
1. `# Adelphi House Style` heading + purpose
2. `## Voice Rules`:
   - **Tone** — confident not boastful; mission-grounded not jargon-soup; specific not vague; positive (claim-then-evidence) and negative ("best-in-class" / "industry-leading" / "game-changing" prohibited) examples
   - **Pronoun discipline** — "we" refers to the program team, not the company; explicit example
   - **Evidence cadence** — every claim follows the pattern: claim → quantified evidence → mission impact; example
   - **Prohibited phrases** — list: "best-in-class", "industry-leading", "game-changing", "revolutionary", "synergistic", "leverage" (as verb), "AI-powered" (without specifics), "next-generation"
   - **Sentence length** — preferred 12-22 words; explanation
   - **Structural patterns** — claim → evidence → impact (3-sentence rhythm); table for comparisons; bullets for lists of ≥3 items
3. `## Examples` — 3-4 before/after rewrites (bad → good)
4. `## When this skill applies` — when producing white papers / proposals / capability briefs / capability statements / narrative blocks
5. `## When this skill does NOT apply` — internal documentation; technical specs; code comments

**Length target:** ~120-160 lines.

- [ ] **Step 1: Create directory + file**

```bash
mkdir -p /Users/romansky/gsd-ic/skills/adelphi-house-style
```

Then write the SKILL.md.

- [ ] **Step 2: Verify**

```bash
test -f /Users/romansky/gsd-ic/skills/adelphi-house-style/SKILL.md && echo OK
head -8 /Users/romansky/gsd-ic/skills/adelphi-house-style/SKILL.md
```

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add skills/adelphi-house-style/SKILL.md
git commit -m "[N] feat(skills): adelphi-house-style skill (Phase 4 §7.4)"
```

---

## Task 16: Update gsd-customer-context-mapper with AAR delta ingestion

**Files:**
- Modify: `/Users/romansky/gsd-ic/agents/gsd-customer-context-mapper.md`

Add a "Delta ingestion at phase boundary" section to the existing context-mapper agent. The mapper consumes deltas produced by `gsd-after-action-recorder` (Task 5) at next phase boundary.

**Required additions to the agent:**
1. New section after `## How you do the work` titled `## Delta ingestion at phase boundary`. Content:
   - When the agent runs at a plan-phase boundary (per the existing lifecycle "auto-rechecks at every plan-phase boundary"), it scans `.planning/aar/delta-*.md` files
   - For each delta file with `processed: false` in frontmatter:
     - Read the delta
     - Apply each delta line to `.planning/intel-context.md` (e.g., new stakeholder → add to stakeholders list; changed transition target → update transition-target field; new pain point → append to pain-points)
     - Mark the delta `processed: true` (Edit the delta file's frontmatter)
     - Append a 1-line entry to a new "Change Log" section at the bottom of `intel-context.md` noting the source AAR
   - Idempotent: re-running on already-processed deltas is a no-op
2. Update the agent's `## How you do the work` step list to add: "If running at phase boundary, ingest unprocessed AAR deltas (see Delta ingestion section)"
3. Update the `## Inputs you accept` to mention `.planning/aar/delta-*.md`
4. Update the `## What you produce` to mention "Change Log section in `.planning/intel-context.md`"
5. Add to `## Constraints`: "Delta ingestion is only triggered at phase boundaries — not at every invocation. Manual ingestion can be triggered via explicit user request."

**Length impact:** ~30-50 lines added. The existing agent file is preserved.

- [ ] **Step 1: Read existing agent**

```bash
wc -l /Users/romansky/gsd-ic/agents/gsd-customer-context-mapper.md
```

Note current line count.

- [ ] **Step 2: Apply edits**

Implementer subagent uses Edit operations to:
1. Insert the new `## Delta ingestion at phase boundary` section
2. Update `## How you do the work`, `## Inputs you accept`, `## What you produce`, `## Constraints`

- [ ] **Step 3: Verify markers unchanged**

```bash
grep -E "^## CONTEXT (MAPPING|MAPPED) (COMPLETE|BLOCKED)$" /Users/romansky/gsd-ic/agents/gsd-customer-context-mapper.md
bash /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh
```

Expected: existing markers preserved; validator OK.

- [ ] **Step 4: Verify size budget**

```bash
wc -l /Users/romansky/gsd-ic/agents/gsd-customer-context-mapper.md
```

Expected: under 500 lines.

- [ ] **Step 5: Commit**

```bash
cd /Users/romansky/gsd-ic
git add agents/gsd-customer-context-mapper.md
git commit -m "[U] feat(agents): gsd-customer-context-mapper ingests AAR deltas at phase boundary"
```

---

## Task 17: Update agent-contracts.ic-pack.md with 9 rows

**Files:**
- Modify: `/Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md`

Append 9 new rows after the last Phase 3 row (`gsd-fusion-architect`).

- [ ] **Step 1: Append 9 rows**

Edit tool, `references/agent-contracts.ic-pack.md`. Locate the line:

```
| gsd-fusion-architect | ## FUSION ARCHITECTURE COMPLETE | ## FUSION ARCHITECTURE BLOCKED | `.planning/phases/{phase}/{phase}-FUSION-ARCH.md` |
```

Append the following 9 rows immediately after it:

```
| gsd-after-action-recorder | ## AFTER ACTION COMPLETE | ## AFTER ACTION BLOCKED | `.planning/aar/{date}-AAR.md` + `.planning/aar/delta-{date}.md` |
| gsd-tim-facilitator | ## TIM PREP COMPLETE | ## TIM PREP BLOCKED | `.planning/tims/{date}-TIM-PREP.md` |
| gsd-capability-brief-generator | ## CAPABILITY BRIEF COMPLETE | (none) | `.planning/briefs/capability-{date}-BRIEF.md` (dual-format Marp) |
| gsd-white-paper-drafter | ## WHITE PAPER COMPLETE | ## WHITE PAPER BLOCKED | `.planning/papers/{title}.md` |
| gsd-demo-scripter | ## DEMO SCRIPT COMPLETE | (none) | `.planning/demos/{name}-DEMO-SCRIPT.md` |
| gsd-rfi-analyst | ## RFI ANALYSIS COMPLETE | ## RFI ANALYSIS BLOCKED | `.planning/captures/{date}-{name}-RFI-ANALYSIS.md` |
| gsd-capability-statement-generator | ## CAPABILITY STATEMENT COMPLETE | (none) | `.planning/capabilities/{topic}-STATEMENT.md` |
| gsd-proposal-drafter | ## PROPOSAL DRAFT COMPLETE | ## PROPOSAL DRAFT BLOCKED | `.planning/proposals/{name}/{volume}.md` (per-volume) |
| gsd-past-performance-manager | ## PP UPDATE COMPLETE | ## PP UPDATE BLOCKED | `.planning/past-performance/PP-LOG.md` + `.planning/past-performance/CITATIONS.md` |
```

- [ ] **Step 2: Verify row count**

```bash
grep -c "## AFTER ACTION COMPLETE\|## TIM PREP COMPLETE\|## CAPABILITY BRIEF COMPLETE\|## WHITE PAPER COMPLETE\|## DEMO SCRIPT COMPLETE\|## RFI ANALYSIS COMPLETE\|## CAPABILITY STATEMENT COMPLETE\|## PROPOSAL DRAFT COMPLETE\|## PP UPDATE COMPLETE" /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `9`.

- [ ] **Step 3: Run completion-marker validator**

```bash
bash /Users/romansky/gsd-ic/tools/ci/validate-completion-markers.sh
```

Expected: `[validate-completion-markers] OK`.

- [ ] **Step 4: Commit**

```bash
cd /Users/romansky/gsd-ic
git add references/agent-contracts.ic-pack.md
git commit -m "[U] docs(contracts): register 9 Phase 4 agent completion markers"
```

---

## Task 18: Update package.json files field with 9 agent paths

**Files:**
- Modify: `/Users/romansky/gsd-ic/package.json`

Adds 9 explicit per-file entries to the `files` array. The 2 skill directories (`skills/prototyping-discipline/`, `skills/adelphi-house-style/`) are already declared as directory globs in the allowlist (Plan 0). The 3 house-style refs are covered by the existing `intel-refs/` glob. Only the 9 new agents need explicit entries.

- [ ] **Step 1: Add 9 entries**

Edit tool, `package.json`. Locate the line:

```
    "agents/gsd-fusion-architect.md",
```

Append the following 9 lines immediately after it:

```json
    "agents/gsd-after-action-recorder.md",
    "agents/gsd-tim-facilitator.md",
    "agents/gsd-capability-brief-generator.md",
    "agents/gsd-white-paper-drafter.md",
    "agents/gsd-demo-scripter.md",
    "agents/gsd-rfi-analyst.md",
    "agents/gsd-capability-statement-generator.md",
    "agents/gsd-proposal-drafter.md",
    "agents/gsd-past-performance-manager.md",
```

- [ ] **Step 2: Validate JSON**

```bash
node -e "require('/Users/romansky/gsd-ic/package.json'); console.log('JSON valid')"
```

Expected: `JSON valid`.

- [ ] **Step 3: Commit**

```bash
cd /Users/romansky/gsd-ic
git add package.json
git commit -m "[U] chore(package): add 9 Phase 4 agent paths to files allowlist"
```

---

## Task 19: Bottom-to-top smoke

**Files:** None (read-only validation).

Bottom-to-top smoke verifying all Phase 4 deliverables before push/PR/merge (handled by the human controller, not by an implementer subagent).

- [ ] **Step 1: All 12 IC pack validators**

```bash
cd /Users/romansky/gsd-ic && bash tools/ci/_run-all.sh
```

Expected: `[ci] all validators passed`.

- [ ] **Step 2: 9 new agent files exist**

```bash
for f in \
  agents/gsd-after-action-recorder.md \
  agents/gsd-tim-facilitator.md \
  agents/gsd-capability-brief-generator.md \
  agents/gsd-white-paper-drafter.md \
  agents/gsd-demo-scripter.md \
  agents/gsd-rfi-analyst.md \
  agents/gsd-capability-statement-generator.md \
  agents/gsd-proposal-drafter.md \
  agents/gsd-past-performance-manager.md; do
  [ -f "/Users/romansky/gsd-ic/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

Expected: 9 `OK:` lines.

- [ ] **Step 3: 3 new ref docs exist**

```bash
for f in \
  intel-refs/house-style/white-papers.md \
  intel-refs/house-style/proposals.md \
  intel-refs/house-style/briefs.md; do
  [ -f "/Users/romansky/gsd-ic/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

Expected: 3 `OK:` lines.

- [ ] **Step 4: 2 new skill files exist**

```bash
for f in \
  skills/prototyping-discipline/SKILL.md \
  skills/adelphi-house-style/SKILL.md; do
  [ -f "/Users/romansky/gsd-ic/$f" ] && echo "OK: $f" || echo "MISSING: $f"
done
```

Expected: 2 `OK:` lines.

- [ ] **Step 5: MANIFEST topic count**

```bash
jq '.topics | keys | length' /Users/romansky/gsd-ic/intel-refs/MANIFEST.json
```

Expected: `27`.

- [ ] **Step 6: 9 Phase 4 markers in registry**

```bash
grep -c "## AFTER ACTION COMPLETE\|## TIM PREP COMPLETE\|## CAPABILITY BRIEF COMPLETE\|## WHITE PAPER COMPLETE\|## DEMO SCRIPT COMPLETE\|## RFI ANALYSIS COMPLETE\|## CAPABILITY STATEMENT COMPLETE\|## PROPOSAL DRAFT COMPLETE\|## PP UPDATE COMPLETE" /Users/romansky/gsd-ic/references/agent-contracts.ic-pack.md
```

Expected: `9`.

- [ ] **Step 7: 9 Phase 4 paths in package.json**

```bash
node -e "const pkg = require('/Users/romansky/gsd-ic/package.json'); const phase4 = pkg.files.filter(f => f.match(/gsd-(after-action-recorder|tim-facilitator|capability-brief-generator|white-paper-drafter|demo-scripter|rfi-analyst|capability-statement-generator|proposal-drafter|past-performance-manager)/)); console.log(phase4.length)"
```

Expected: `9`.

- [ ] **Step 8: AskUserQuestion isolated to gsd-after-action-recorder**

```bash
for f in agents/gsd-after-action-recorder.md agents/gsd-tim-facilitator.md agents/gsd-capability-brief-generator.md agents/gsd-white-paper-drafter.md agents/gsd-demo-scripter.md agents/gsd-rfi-analyst.md agents/gsd-capability-statement-generator.md agents/gsd-proposal-drafter.md agents/gsd-past-performance-manager.md; do
  count=$(grep -c "AskUserQuestion" "/Users/romansky/gsd-ic/$f")
  echo "$f: $count"
done
```

Expected: only `gsd-after-action-recorder.md` has count > 0; all others = 0.

- [ ] **Step 9: Task tool only in gsd-demo-scripter (forward-ref to SDE)**

```bash
for f in agents/gsd-after-action-recorder.md agents/gsd-tim-facilitator.md agents/gsd-capability-brief-generator.md agents/gsd-white-paper-drafter.md agents/gsd-demo-scripter.md agents/gsd-rfi-analyst.md agents/gsd-capability-statement-generator.md agents/gsd-proposal-drafter.md agents/gsd-past-performance-manager.md; do
  grep "^tools:" "/Users/romansky/gsd-ic/$f" | grep -c "Task"
  echo "$f"
done
```

Expected: 1 line shows count `1` (the demo-scripter); rest show `0`.

- [ ] **Step 10: No Edit tool in any Phase 4 agent**

```bash
for f in agents/gsd-after-action-recorder.md agents/gsd-tim-facilitator.md agents/gsd-capability-brief-generator.md agents/gsd-white-paper-drafter.md agents/gsd-demo-scripter.md agents/gsd-rfi-analyst.md agents/gsd-capability-statement-generator.md agents/gsd-proposal-drafter.md agents/gsd-past-performance-manager.md; do
  grep "^tools:" "/Users/romansky/gsd-ic/$f" | grep -c "Edit"
done
```

Expected: all `0`.

- [ ] **Step 11: install-side tests**

```bash
cd /Users/romansky/gsd-ic && npm run test:install
```

Expected: 46+ tests pass; 0 fail.

- [ ] **Step 12: npm pack scope check**

```bash
cd /Users/romansky/gsd-ic && npm pack --dry-run 2>&1 | grep "npm notice " | grep -E "agents/gsd-(after-action-recorder|tim-facilitator|capability-brief-generator|white-paper-drafter|demo-scripter|rfi-analyst|capability-statement-generator|proposal-drafter|past-performance-manager)" | wc -l
```

Expected: `9`.

- [ ] **Step 13: Skill + house-style refs in pack**

```bash
cd /Users/romansky/gsd-ic && npm pack --dry-run 2>&1 | grep -E "(skills/(prototyping-discipline|adelphi-house-style)/SKILL\.md|intel-refs/house-style/(white-papers|proposals|briefs)\.md)" | wc -l
```

Expected: `5` (2 skill files + 3 house-style refs).

- [ ] **Step 14: Placeholder scan**

```bash
grep -nE "(TBD|TODO|implement later|fill in)" \
  /Users/romansky/gsd-ic/agents/gsd-after-action-recorder.md \
  /Users/romansky/gsd-ic/agents/gsd-tim-facilitator.md \
  /Users/romansky/gsd-ic/agents/gsd-capability-brief-generator.md \
  /Users/romansky/gsd-ic/agents/gsd-white-paper-drafter.md \
  /Users/romansky/gsd-ic/agents/gsd-demo-scripter.md \
  /Users/romansky/gsd-ic/agents/gsd-rfi-analyst.md \
  /Users/romansky/gsd-ic/agents/gsd-capability-statement-generator.md \
  /Users/romansky/gsd-ic/agents/gsd-proposal-drafter.md \
  /Users/romansky/gsd-ic/agents/gsd-past-performance-manager.md \
  /Users/romansky/gsd-ic/skills/prototyping-discipline/SKILL.md \
  /Users/romansky/gsd-ic/skills/adelphi-house-style/SKILL.md \
  /Users/romansky/gsd-ic/intel-refs/house-style/white-papers.md \
  /Users/romansky/gsd-ic/intel-refs/house-style/proposals.md \
  /Users/romansky/gsd-ic/intel-refs/house-style/briefs.md 2>/dev/null | head -10
```

Expected: zero matches. Curly-brace `{date}`, `{capability}`, `{name}`, `{title}`, `{topic}`, `{phase}`, `{volume}` patterns inside output-shape examples are intentional content.

- [ ] **Step 15: ic_pack frontmatter on 9 agents**

```bash
for f in agents/gsd-after-action-recorder.md agents/gsd-tim-facilitator.md agents/gsd-capability-brief-generator.md agents/gsd-white-paper-drafter.md agents/gsd-demo-scripter.md agents/gsd-rfi-analyst.md agents/gsd-capability-statement-generator.md agents/gsd-proposal-drafter.md agents/gsd-past-performance-manager.md; do
  grep -q "ic_pack: true" "/Users/romansky/gsd-ic/$f" && echo "OK: $f" || echo "MISSING ic_pack: $f"
done
```

Expected: 9 `OK:` lines.

---

## Self-Review (run before announcing completion)

### 1. Spec coverage

| Item from spec §13 Phase 4 (line 1072) | Plan 5 task | Notes |
|---|---|---|
| `gsd-capability-brief-generator` | T7 | Family F #24, dual-format Marp |
| `gsd-white-paper-drafter` | T8 | Family F #25, dual-loaded with skill + ref |
| `gsd-demo-scripter` | T9 | Family F #26, all-three data strategy + graceful SDE degradation |
| `gsd-after-action-recorder` | T5 | Family E #22, AAR + delta sidecar, AskUserQuestion |
| `gsd-tim-facilitator` | T6 | Family E #23, TIM agenda + decision-prep |
| `gsd-rfi-analyst` | T10 | Family G #28 |
| `gsd-capability-statement-generator` | T11 | Family G #29 |
| `gsd-proposal-drafter` | T12 | Family G #30, multi-volume |
| `gsd-past-performance-manager` | T13 | Family G #31 |
| `prototyping-discipline` skill | T14 | per spec §7.2 |
| `adelphi-house-style` skill | T15 | per spec §7.4 |

Additional plan deliverables (per locked decisions):
| Deliverable | Plan 5 task | Rationale |
|---|---|---|
| 3 house-style refs (white-papers, proposals, briefs) | T1, T2, T3 | Required by Family F/G agents per spec line 309/319 |
| 3 manifest entries | T4 | Each ref needs manifest indexing for the gate dispatcher |
| Context-mapper update | T16 | AAR delta ingestion at phase boundary per spec line 327 |
| 9 registry rows | T17 | Required for completion-marker validator |
| 9 package paths | T18 | Required for npm pack scope |
| Bottom-to-top smoke | T19 | Pre-push verification |

### 2. Completion marker validator compliance

Validator regex: `^##[[:space:]]+[A-Z][A-Z0-9 _&-]*[[:space:]]+(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)$`

| Agent | Marker | First char after `## ` | Valid? |
|---|---|---|---|
| gsd-after-action-recorder | `## AFTER ACTION COMPLETE` | `A` | Yes |
| gsd-after-action-recorder | `## AFTER ACTION BLOCKED` | `A` | Yes |
| gsd-tim-facilitator | `## TIM PREP COMPLETE` | `T` | Yes |
| gsd-tim-facilitator | `## TIM PREP BLOCKED` | `T` | Yes |
| gsd-capability-brief-generator | `## CAPABILITY BRIEF COMPLETE` | `C` | Yes |
| gsd-white-paper-drafter | `## WHITE PAPER COMPLETE` | `W` | Yes |
| gsd-white-paper-drafter | `## WHITE PAPER BLOCKED` | `W` | Yes |
| gsd-demo-scripter | `## DEMO SCRIPT COMPLETE` | `D` | Yes |
| gsd-rfi-analyst | `## RFI ANALYSIS COMPLETE` | `R` | Yes |
| gsd-rfi-analyst | `## RFI ANALYSIS BLOCKED` | `R` | Yes |
| gsd-capability-statement-generator | `## CAPABILITY STATEMENT COMPLETE` | `C` | Yes |
| gsd-proposal-drafter | `## PROPOSAL DRAFT COMPLETE` | `P` | Yes |
| gsd-proposal-drafter | `## PROPOSAL DRAFT BLOCKED` | `P` | Yes |
| gsd-past-performance-manager | `## PP UPDATE COMPLETE` | `P` | Yes (UPDATE COMPLETE in alternation) |
| gsd-past-performance-manager | `## PP UPDATE BLOCKED` | `P` | Yes |

All markers pass. No digit-leading, no lowercase-leading, all use recognized terminals.

### 3. Type / API consistency

- All 9 agent files have `ic_pack: true` frontmatter — consistent with `isIcPackAgent()` helper.
- All 9 agents have `classification: UNCLASSIFIED` in frontmatter.
- Only `gsd-after-action-recorder` has `AskUserQuestion` in tools — consistent with hybrid-intake pattern (3-format input).
- Only `gsd-demo-scripter` has `Task` tool in tools — for graceful SDE forward reference.
- No Phase 4 agent has the `Edit` tool — consistent with "deliverable producers, not implementers."
- No Phase 4 agent appends to POA&M — correct (Family A only).
- 3 house-style refs are in MANIFEST with applies_when matching their frontmatter exactly.
- 2 skills follow existing skill frontmatter convention (name, description, injected_into, activation).
- Context-mapper preserves existing markers (`## CONTEXT MAPPING COMPLETE` / `## CONTEXT MAPPED`); only adds delta-ingestion section.
- Registry rows: 24 → 33 total (24 from Plans 0-4 + 9 new).
- Package files allowlist: 9 new agent paths (skills + refs covered by existing globs).

### 4. Scope check

Plan 5 produces working software:
- `npm run ci` exits 0
- `npm pack --dry-run` includes all 9 agents + 2 skills + 3 refs (no upstream leak)
- `node bin/gsd-ic-install.js install --customer=nga --target=<dir>` lands all 9 agents + skills + refs
- All install + hook tests pass
- Registry has 33 rows total

### 5. Placeholder scan (plan-level)

```bash
grep -nE "(TBD|TODO|implement later|fill in)" /Users/romansky/gsd-ic/docs/plans/2026-05-12-phase-4-customer-engagement.md | head
```

Expected: zero matches. Curly-brace template tokens are intentional content.

---

## Plan complete

Plan saved to `/Users/romansky/gsd-ic/docs/plans/2026-05-12-phase-4-customer-engagement.md`.

**Execution model:**
- T1, T2, T3 (house-style refs) — sonnet implementer per task (synthesizes ref content from spec + Plan 4 modernization-themes pattern); commits per-task
- T4 (manifest) — controller inline (mechanical edit)
- T5-T13 (9 agents) — sonnet implementer per task (synthesizes from spec + Plan 4 agent patterns); writes file only (no commit); controller commits each sequentially
- T14, T15 (2 skills) — sonnet implementer per task (substantive content from spec §7.2 / §7.4)
- T16 (context-mapper update) — sonnet implementer (Edit operations, not Write)
- T17, T18 (registry, package.json) — controller inline (mechanical edits)
- T19 (smoke) — controller inline

**Push + PR + merge:** Handled by the controller (Claude Code) after all 18 task commits land — branch push, gh pr create with `--repo adelphidata/gsd-ic --base main` pin, monitor CI, squash-merge on green.

---

## Out-of-scope reminders for Plan 6+

These items are **not** in Plan 5 and belong to subsequent plans:

- `gsd-cdrl-mapper` (Family E #20), `gsd-milestone-brief-generator` (Family E #21) — Phase 6 per spec §13 line 1074
- `gsd-synthetic-data-engineer` (#54), `gsd-intel-devops` (#55), `gsd-stig-auditor`, `gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler` — Phase 5 per spec §13 line 1073
- `gsd-isso`, `gsd-issm`, all Family D ATO doc specialists, `gsd-transition-advisor` — Phase 6 per spec §13 line 1074
- `gsd-icd-203-enforcer`, `gsd-techint-researcher`, `gsd-medint-researcher`, `gsd-techsigint-researcher`, `gsd-ai-eval-auditor`, `gsd-fm-adaptation-engineer`, Family L always-on integration — Phase 7 per spec §13 line 1075

