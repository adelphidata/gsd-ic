# Training Materials (Post-v1 Track #3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan task-by-task. Two-stage review (spec compliance, then code quality) after every task is skipped on T6 (purely mechanical doc-map update); other tasks get reviewer. Sonnet implementers.

**Goal:** Ship the three training artifacts required by spec §15.3 (60-min walkthrough + two 30-min hands-on sessions) as self-guided learner docs. New training subdirectory under `docs/ic-pack/training/`. Hands-on sessions produce throwaway content (cleanup step at session end) — they exercise real install + real `intel-refs/` + real validators against a scratch repo.

**Architecture:** Three top-level training docs in `docs/ic-pack/training/`. Each is self-contained, runnable by a new hire reading along, and includes timing cues (e.g., "≈5 min"), checkpoint questions, and explicit completion criteria. No facilitator notes required; the docs ARE the training.

**Tech Stack:** Markdown only. Commands are real (`npx`, `jq`, `bash tools/ci/...`). Hands-on sessions assume the learner has the repo checked out and Node 22+.

**Branch:** `training-materials`. Squash-merge with `--delete-branch` after CI green.

---

## Operating mode

- Controller creates `training-materials` branch off `main` once before Task 2.
- **One commit per task.** Commit message: `docs(training): <one-line>` or per-file convention.
- **Subagent dispatch:** sonnet `staff-software-engineer` for content; sonnet `code-review-enforcer` for review. Each training doc gets a combined spec+quality review (one pass).
- **Forbidden-language scan:** zero hits across new docs on `stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]`.
- **Real-but-throwaway content:** hands-on docs create real files in `intel-refs/` then have a cleanup step. No content should ship to the pack from hands-on sessions.

---

## Inventory facts (verified at plan-write time)

- 58 IC-pack agents, 5 customer overlays (cia/dia/nga/nro/nsa), 5 skills, 3 hooks, 12 CI validators, 36 reference docs (22 scaffold / 6 partial / 8 curated).
- GSD pinned to `1.39.0-rc.4` (per `VERSION`).
- Pack version `0.1.0` (per `VERSION`).
- Install entry point: `bin/gsd-ic-install.js`. Subcommands: `install`, `uninstall`, `help`.
- `npx @adelphi/gsd-ic@latest install --customer=<cia|dia|nga|nro|nsa>`.
- Anchor agent for walkthrough: `gsd-customer-context-mapper` (Phase 0 anchor; well-tested).
- `docs/ic-pack/` already covered by `package.json` `files[]` glob — new subdirectory auto-ships.

---

## Task 1: Plan + branch setup (controller-only)

- [ ] **Step 1: Branch + commit plan**

```bash
git checkout -b training-materials
git add docs/plans/2026-05-11-training-materials.md
git commit -m "docs(plans): post-v1 track #3 — training materials plan"
```

No subagent dispatch. Proceeds to Task 2.

---

## Task 2: WALKTHROUGH.md (60-min framework overview)

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/training/WALKTHROUGH.md`. Target 280–380 lines.

**Implementer:** staff-software-engineer (sonnet).

The `training/` subdirectory does not yet exist — first task creating a file there must `mkdir -p`.

### Required outline (exact headings, in order)

```
# Walkthrough: 60-Minute IC Pack Framework Overview
## Audience and prerequisites
## What you will know by the end
## Agenda
## Block 1 (≈5 min): What is the IC pack?
## Block 2 (≈10 min): The six-layer architecture
## Block 3 (≈10 min): Agent families — when to use which agent
## Block 4 (≈10 min): Hooks + the classification model
## Block 5 (≈10 min): Gates + the dispatcher protocol
## Block 6 (≈10 min): Live walkthrough — invoking `gsd-customer-context-mapper`
## Block 7 (≈5 min): Where to go next
## Checkpoint quiz (self-graded)
```

### Per-block content (per plan; implementer follows precisely)

**Block 1 (≈5 min): What is the IC pack?**
- Brief: soft-fork of GSD with 58 agents, 5 skills, 3 hooks, 36 refs.
- When to use vs not (mirror README §When to use / When not to use).
- The seamless-fork guarantee — gates and hooks off = stock GSD behavior.
- Reference: link to [README.md](../README.md) and [ARCHITECTURE.md](../ARCHITECTURE.md).

**Block 2 (≈10 min): The six-layer architecture**
- Show the layer diagram (verbatim from ARCHITECTURE.md).
- One-line per layer (Hooks / Agents / Refs / Skills / Customer overlay / Program context).
- Reference: [ARCHITECTURE.md](../ARCHITECTURE.md) §Layered model.

**Block 3 (≈10 min): Agent families — when to use which**
- List the 15 families (A through O) with 1-line each (cross-link to ARCHITECTURE.md).
- 3 worked examples: "I need to write a capability statement" → Family F; "I need to do GEOINT research" → Family I; "I need an ATO POA&M" → Family A.

**Block 4 (≈10 min): Hooks + classification model**
- 3 hooks: `gsd-classification-banner.js`, `gsd-classified-leak-detector.js`, `gsd-prompt-injection-scan-intel.js`.
- Classification model: UNCLASSIFIED only in v1; CUI/CLASSIFIED handling out-of-scope.
- The leak detector pattern catalog (`hooks/patterns/classified-markings.json`).
- Reference: [ARCHITECTURE.md](../ARCHITECTURE.md) §Classification model.

**Block 5 (≈10 min): Gates + the dispatcher**
- `.planning/intel-gates.json` schema (link to [intel-gates-schema.md](../intel-gates-schema.md)).
- Family L canonical fan-out (4 agents, shared trigger `plan-phase.5-handle-research`, `enabled: false` default).
- Trigger format `<workflow>.<step>` (semantic resolution by `validate-triggers.sh`).

**Block 6 (≈10 min): Live walkthrough — `gsd-customer-context-mapper`**
- The learner reads through (does NOT execute) a step-by-step of what happens when a user invokes the agent.
- Show: agent file at `agents/gsd-customer-context-mapper.md`, its `applies_when`, its execution flow, its completion marker.
- This is **read-along** — for actual hands-on, point at the two hands-on docs.

**Block 7 (≈5 min): Where to go next**
- [HANDS-ON-ADD-A-REFERENCE.md](HANDS-ON-ADD-A-REFERENCE.md) — adding a ref to the manifest (30 min).
- [HANDS-ON-SCAFFOLD-A-PROTOTYPE.md](HANDS-ON-SCAFFOLD-A-PROTOTYPE.md) — scaffolding a new prototype with the pack (30 min).
- [SME-CURATION-FRAMEWORK.md](../SME-CURATION-FRAMEWORK.md) for SMEs.
- [ADDING-AN-AGENT.md](../ADDING-AN-AGENT.md) for new agent authors.

### Checkpoint quiz (self-graded)

5 questions covering the blocks (mix of multiple-choice and short-answer):
1. Name the six layers.
2. Which family covers ATO docs? (D)
3. Where does the classification leak detector live?
4. Default `enabled` value for newly-shipped gates?
5. What does Family L's `plan-phase.5-handle-research` trigger fan out to?

Answers section at the bottom (collapsed under "## Answer key").

### Verification (Task 2)

1. `wc -l docs/ic-pack/training/WALKTHROUGH.md` — 280-380.
2. Forbidden-language scan: zero hits.
3. All internal links resolve. Forward references to `HANDS-ON-*` docs are acceptable (next tasks create them).
4. Classification banner at line 1.
5. The 5 quiz questions have answers in the answer key.
6. The 15 families listed match `ARCHITECTURE.md` and spec §5 (A-O).
7. The 3 hooks named match disk inventory.
8. The 5 customer overlays referenced match disk.

### Commit

```bash
git add docs/ic-pack/training/WALKTHROUGH.md
git commit -m "docs(training): add 60-min framework walkthrough"
```

---

## Task 3: HANDS-ON-ADD-A-REFERENCE.md (30-min hands-on)

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/training/HANDS-ON-ADD-A-REFERENCE.md`. Target 160–230 lines.

**Implementer:** staff-software-engineer (sonnet).

### Required outline (exact headings, in order)

```
# Hands-On: Add a Reference Doc (30 minutes)
## Audience and prerequisites
## What you will accomplish
## Setup (≈3 min)
## Step 1 (≈5 min): Pick a topic and subdirectory
## Step 2 (≈5 min): Write the reference file with frontmatter
## Step 3 (≈5 min): Register the ref in MANIFEST.json
## Step 4 (≈5 min): Run validators
## Step 5 (≈5 min): Cleanup
## What you learned
## Cheat sheet
```

### Per-section content

**Audience and prerequisites**
- Audience: developers new to the IC pack.
- Prerequisites: repo cloned, Node 22+, `jq` installed, working tree clean before starting.

**What you will accomplish**
- Create a real but throwaway reference doc at `intel-refs/capability-patterns/training-example.md`.
- Register it in `intel-refs/MANIFEST.json`.
- Run all relevant validators against it.
- Clean up (no commit; throwaway).

**Setup (≈3 min)**
- Confirm clean tree: `git status --porcelain` must be empty.
- Confirm validators run baseline-clean: `npm run ci`. All 12 pass.

**Step 1 (≈5 min): Pick a topic and subdirectory**
- Picked for the learner: subdirectory `capability-patterns/`, topic name `training-example`. Path: `intel-refs/capability-patterns/training-example.md`. Manifest key: `capability-patterns/training-example.md`.
- Justification: this exercises the per-directory frontmatter convention (capability-patterns uses sibling-follow; existing siblings use `topic_id:`).

**Step 2 (≈5 min): Write the reference file with frontmatter**

Provide a complete file body the learner copies — frontmatter + 2 short sections of body content. Use `topic_id:` (matching the capability-patterns sibling `entity-resolution.md`).

```markdown
---
topic_id: training-example
title: Training Example (throwaway — do not ship)
classification: UNCLASSIFIED
last_reviewed: <today's date>
owner: training@adelphi.ai
applies_when: [training, example]
---

# Training Example (throwaway)

This reference exists for the IC pack hands-on training session. It is created at the start of the session and removed at the end. It is NOT shipped with the pack.

## Why this exists

To exercise the full ref-creation workflow against real validators...
```

Show the exact `cat > intel-refs/capability-patterns/training-example.md <<'EOF' ... EOF` heredoc command.

**Step 3 (≈5 min): Register the ref in MANIFEST.json**
- Show the `jq` command to add the entry, matching the project-local schema (subdir-relative key, `applies_when` array, singular `owner`, `last_reviewed`, `classification`, optional `curation_status: scaffold`).
- Use the exact command pattern from `ADDING-A-REFERENCE.md`.

**Step 4 (≈5 min): Run validators**
- `bash tools/ci/validate-manifest.sh` — expect OK.
- `bash tools/ci/validate-reference-staleness.sh` — expect OK.
- `bash tools/ci/validate-classification.sh` — expect OK.
- (Optional) `npm run ci` to exercise full suite.

Each command lists the expected output. Learner sees the validators recognize their new ref.

**Step 5 (≈5 min): Cleanup**
- `git checkout -- intel-refs/MANIFEST.json` — restore the manifest.
- `rm intel-refs/capability-patterns/training-example.md` — remove the throwaway ref.
- `git status --porcelain` — confirm clean tree.
- Re-run `npm run ci` to confirm baseline-clean.

**What you learned**
- The full ref-creation workflow.
- Per-directory frontmatter convention (`topic_id:` vs `topic:`).
- Manifest schema (subdir-relative key, singular owner, applies_when array).
- Which validators gate ref additions.

**Cheat sheet**
- Compact reference card: file path pattern, frontmatter fields, manifest key format, validator commands. One page summary.

### Verification (Task 3)

1. `wc -l docs/ic-pack/training/HANDS-ON-ADD-A-REFERENCE.md` — 160-230.
2. Forbidden-language scan: zero hits.
3. All internal links resolve.
4. The frontmatter shown uses `topic_id:` (capability-patterns convention).
5. Manifest key in the example uses subdir-relative form (`capability-patterns/training-example.md`, NOT `intel-refs/capability-patterns/training-example.md`).
6. Cleanup step is explicit and present.
7. Classification banner at line 1.

### Commit

```bash
git add docs/ic-pack/training/HANDS-ON-ADD-A-REFERENCE.md
git commit -m "docs(training): add hands-on add-a-reference session"
```

---

## Task 4: HANDS-ON-SCAFFOLD-A-PROTOTYPE.md (30-min hands-on)

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md`. Target 180–250 lines.

**Implementer:** staff-software-engineer (sonnet).

### Required outline (exact headings, in order)

```
# Hands-On: Scaffold a Prototype with the IC Pack (30 minutes)
## Audience and prerequisites
## What you will accomplish
## Setup (≈3 min)
## Step 1 (≈5 min): Create a scratch program directory
## Step 2 (≈5 min): Install upstream GSD
## Step 3 (≈5 min): Install the IC pack
## Step 4 (≈5 min): Create `.planning/intel-context.md`
## Step 5 (≈5 min): Invoke your first agent
## Step 6 (≈2 min): Cleanup
## What you learned
## Cheat sheet
```

### Per-section content

**Audience and prerequisites**
- Audience: developer about to start a new IC prototype.
- Prerequisites: Node 22+, internet access (npm registry), writable `/tmp` or equivalent.

**What you will accomplish**
- Set up a scratch program in `/tmp/gsd-ic-training-prototype`.
- Install stock GSD via `npx`.
- Install the IC pack via local tarball (since the package is not yet published to npm — use `npm pack` from the repo).
- Create a minimal `.planning/intel-context.md`.
- Invoke `gsd-customer-context-mapper` to validate the install.
- Tear down the scratch directory.

**Setup (≈3 min)**
- From the repo root: `npm pack` produces `adelphi-gsd-ic-<version>.tgz`. Note the path.
- Confirm npm and Node 22+ are available.

**Step 1 (≈5 min): Create a scratch program directory**
- `mkdir -p /tmp/gsd-ic-training-prototype && cd /tmp/gsd-ic-training-prototype`
- `git init` (so GSD has a git context).
- Optional: `git commit --allow-empty -m "init"` to make GSD happy.

**Step 2 (≈5 min): Install upstream GSD**
- `npx get-shit-done-cc@latest`
- Verify: `ls .claude/` shows GSD scaffold.

**Step 3 (≈5 min): Install the IC pack**
- `npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=nga`
- Expected stderr output (verified strings from `bin/gsd-ic-install.js`).
- Verify: `ls .claude/agents/gsd-*.md | wc -l` shows 58+ (IC pack agents + upstream GSD agents).

**Step 4 (≈5 min): Create `.planning/intel-context.md`**
- `mkdir -p .planning`
- Show the YAML+markdown template (verbatim from QUICKSTART.md Step 6).
- Fill in placeholder values for AO, mission, primary INTs.

**Step 5 (≈5 min): Invoke your first agent**
- Open Claude Code in this directory.
- Ask: "Run gsd-customer-context-mapper for this prototype."
- The agent fires, reads the intel-context.md, produces or refines it.
- Look for the completion marker `## CONTEXT MAPPING COMPLETE`.

**Step 6 (≈2 min): Cleanup**
- `cd /tmp && rm -rf /tmp/gsd-ic-training-prototype`
- Done. No artifacts persist.

**What you learned**
- The full install flow: GSD → IC pack → customer overlay → program context.
- Where the pack installs files (`.claude/` only; `.planning/` is program-owned).
- How to invoke an agent and recognize its completion marker.

**Cheat sheet**
- Commands in order, one block per step. Single page.

### Verification (Task 4)

1. `wc -l docs/ic-pack/training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md` — 180-250.
2. Forbidden-language scan: zero hits.
3. All internal links resolve.
4. `npx` commands match real CLI signature (verified against `bin/lib/gsd-ic/parse-args.cjs`).
5. Cleanup step is explicit, last step, and removes the scratch dir.
6. Classification banner at line 1.

### Commit

```bash
git add docs/ic-pack/training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md
git commit -m "docs(training): add hands-on scaffold-a-prototype session"
```

---

## Task 5: Update `docs/ic-pack/README.md` doc map

**File:** Modify `/Users/romansky/gsd-ic/docs/ic-pack/README.md` (currently 59 lines after T8 of Plan #2).

**Implementer:** staff-software-engineer (sonnet) — no separate review (mechanical).

### Required change

Add a new "Training" subsection to the doc map (or insert at the end of "Consumer-facing" section). Three new entries:

```markdown
### Training
- [training/WALKTHROUGH.md](training/WALKTHROUGH.md) — 60-min framework overview (self-guided)
- [training/HANDS-ON-ADD-A-REFERENCE.md](training/HANDS-ON-ADD-A-REFERENCE.md) — 30-min hands-on: add a ref to the manifest
- [training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md](training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md) — 30-min hands-on: scaffold a prototype with the pack
```

The "Training" subsection sits as a peer of "Consumer-facing", "Contributing (dev-side)", "Schemas".

### Verification

1. `wc -l docs/ic-pack/README.md` — was 59; expect 64-67.
2. Forbidden-language scan: zero hits.
3. All 3 new links resolve.

### Commit

```bash
git add docs/ic-pack/README.md
git commit -m "docs(ic-pack): add Training subsection to README doc map"
```

---

## Task 6: Controller cross-ref sweep + PR

**Audience:** controller (you), not subagents.

- [ ] **Step 1: Confirm all task commits landed**

```bash
git log main..training-materials --oneline | wc -l   # expect 5 (plan + T2/T3/T4/T5)
```

- [ ] **Step 2: Run forbidden-language scan across all 3 new docs**

```bash
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/training/*.md
```

Expected: zero hits.

- [ ] **Step 3: Verify internal links**

```bash
for f in docs/ic-pack/training/*.md docs/ic-pack/README.md; do
  grep -oE "\]\([^)]+\.md[^)]*\)" "$f" | sed -E 's/\]\(([^)]+)\)/\1/' | while read -r link; do
    target="${link%%#*}"
    base="$(dirname "$f")"
    [ -f "$base/$target" ] || echo "BROKEN: $f -> $link"
  done
done
```

Expected: no `BROKEN:` lines.

- [ ] **Step 4: Run CI**

```bash
npm run ci
```

Expected: all 12 validators OK.

- [ ] **Step 5: Push + open PR**

```bash
git push -u origin training-materials
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "docs(training): training materials per spec §15.3 (post-v1 track #3)" \
  --body "$(cat <<'EOF'
## Summary

Post-v1 track #3 — adds the three training artifacts required by spec §15.3:

- `docs/ic-pack/training/WALKTHROUGH.md` — 60-min framework overview (self-guided)
- `docs/ic-pack/training/HANDS-ON-ADD-A-REFERENCE.md` — 30-min hands-on: add a ref to the manifest (throwaway content, cleanup at end)
- `docs/ic-pack/training/HANDS-ON-SCAFFOLD-A-PROTOTYPE.md` — 30-min hands-on: scaffold a prototype in /tmp scratch dir

All sessions are self-guided learner docs — readable solo or facilitator-led. Hands-on sessions exercise real install + real validators against throwaway content; cleanup step at end of each session.

## What ships

- 3 new training markdown files in new `docs/ic-pack/training/` subdirectory.
- `docs/ic-pack/README.md` updated with Training subsection in doc map.
- `package.json` `files[]` already covers via `docs/ic-pack/` glob — no change needed.

## Test plan

- [x] `npm run ci` green
- [x] Forbidden-language scan across 3 new docs: zero hits
- [x] All internal links resolve
- [x] Real CLI commands match `bin/lib/gsd-ic/parse-args.cjs` signature
- [x] Hands-on sessions have explicit cleanup steps
- [x] Live walkthrough block references real `gsd-customer-context-mapper` markers

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 6: Squash-merge after CI green**

```bash
gh pr merge --repo adelphidata/gsd-ic --squash --delete-branch <PR-number>
git checkout main
git pull origin main
```

---

## Self-review checklist (controller, before dispatch)

- [x] **Spec coverage:** §15.3 calls for 60-min walkthrough + two 30-min hands-on (adding a ref + scaffolding a prototype). All three are tasks here.
- [x] **Placeholder scan:** plan contains no `TBD`/`TODO`/`fill in details`.
- [x] **Type consistency:** "self-guided learner docs" / "throwaway content" / "cleanup step" used consistently.
- [x] **Inventory facts:** 58/5/5/3/12/36 numbers; GSD pinned 1.39.0-rc.4. Consistent with prior-plan facts.
- [x] **Real commands:** every CLI shown is verifiable against `bin/lib/gsd-ic/parse-args.cjs` or actual repo tooling. No invented flags.
- [x] **Forbidden-language scan applied to plan:** zero hits (grep patterns inside instructions are quoted, not forbidden uses).

## Out of scope (do NOT do as part of this plan)

- Video / multimedia training materials.
- Slide decks (markdown only).
- Per-customer training (the 5 customer overlays are mentioned but not exercised individually).
- SME-specific training (covered by SME-CURATION-FRAMEWORK.md).
- Automated training-completion tracking / quizzes that grade themselves.
- Pack VERSION bump.
