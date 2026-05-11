<!-- UNCLASSIFIED -->

# Hands-On: Scaffold a Prototype with the IC Pack (30 minutes)

---

## Audience and prerequisites

**Audience:** Developer about to start a new IC-community prototype who wants hands-on experience with the full install flow before touching a real program directory.

**Prerequisites:**

- Node 22+ (`node --version` returns `v22.*` or higher).
- Internet access to the npm registry (for Step 2).
- The `gsd-ic` repo cloned locally (for `npm pack` in Setup).
- Writable `/tmp`.
- Claude Code installed to run Step 5 interactively; if not available, Step 5 describes what the execution would look like.

---

## What you will accomplish

Produce a local IC-pack tarball, create a scratch program directory in `/tmp/gsd-ic-training-prototype`, install GSD and then the IC pack, write a minimal `.planning/intel-context.md`, invoke `gsd-customer-context-mapper`, and tear down the scratch directory cleanly. No artifacts persist after Step 6.

---

## Setup (≈3 min)

From the root of your local `gsd-ic` clone, produce a distributable tarball and capture its path:

```bash
npm pack
PACK_TGZ="$(pwd)/adelphi-gsd-ic-0.1.0.tgz"
echo "$PACK_TGZ"
node --version    # must be v22.x.x or higher
```

`npm pack` writes `adelphi-gsd-ic-0.1.0.tgz` in the current directory. You will reference `$PACK_TGZ` in Step 3.

---

## Step 1 (≈5 min): Create a scratch program directory

GSD requires a git context. Create the directory and initialize a repo:

```bash
mkdir -p /tmp/gsd-ic-training-prototype
cd /tmp/gsd-ic-training-prototype
git init
git commit --allow-empty -m "init"
```

The empty commit gives GSD's git-history checks a HEAD to reference.

---

## Step 2 (≈5 min): Install upstream GSD

IC-pack agents layer on top of stock GSD. Install GSD first:

```bash
npx get-shit-done-cc@latest
```

The GSD installer writes its scaffold into `.claude/`. Accept the defaults.

```bash
ls .claude/
# Expected: agents/  commands/  settings.json  (and other GSD scaffold files)
```

If `.claude/` is missing, confirm internet access (`npm ping`) and retry.

---

## Step 3 (≈5 min): Install the IC pack

Run the IC-pack installer from the tarball you produced in Setup:

```bash
npx "$PACK_TGZ" install --customer=nga
```

**Expected stderr output** (the installer writes progress to stderr):

```
[gsd-ic] GSD detected (<version>); pack pinned to GSD <gsd_pinned_version>
[gsd-ic] pack content installed under /tmp/gsd-ic-training-prototype/.claude/
[gsd-ic] customer overlay wired (nga)
[gsd-ic] IC-pack hooks registered in .claude/settings.json
```

**Expected stdout output** (success line, written last):

```
install complete: @adelphi/gsd-ic for customer=nga in /tmp/gsd-ic-training-prototype
```

If you see `error: GSD not found` on stderr, GSD did not install cleanly in Step 2 — rerun `npx get-shit-done-cc@latest` then retry.

**Verify the install:**

```bash
ls .claude/agents/gsd-*.md | wc -l
# Expected: 58 or more
# (58 IC-pack agents plus any upstream GSD agents that also use the gsd-* prefix)
```

```bash
grep -c "gsd-classification-banner\|gsd-classified-leak-detector\|gsd-prompt-injection-scan-intel" \
  .claude/settings.json
# Expected: 3
```

Both checks passing confirms IC-pack agents, customer overlay, and all three hooks are installed.

---

## Step 4 (≈5 min): Create `.planning/intel-context.md`

IC-pack agents read `.planning/intel-context.md` at startup to ground their reasoning in your specific program. The install does not create this file — it is program-owned. Create it now:

```bash
mkdir -p .planning
cat > .planning/intel-context.md <<'EOF'
---
classification: UNCLASSIFIED
ao: NGA
mission: Training prototype — demonstrates IC pack install flow against a scratch program directory.
primary_ints: [geoint, osint]
transition_target: N/A (training session only)
---

# Program context

## Mission detail
This is a throwaway training program created during the IC pack hands-on session. It
exists to validate the install flow and allow invocation of gsd-customer-context-mapper
against realistic (if minimal) program context. It will be deleted at the end of the
session.

The notional program is an NGA-sponsored GEOINT feature-extraction prototype evaluating
open-source imagery pipelines for transition to a program of record.

## Key stakeholders
- PM: Training Participant
- Customer technical POC: NGA/GEOINT Solutions
- SMEs: (to be named — GEOINT lead, OSINT lead)

## Phase tempo / cadence
2-week prototype phases, demo every 8 weeks.
EOF
```

Verify the file was written:

```bash
head -6 .planning/intel-context.md
# Expected: YAML frontmatter block starting with classification: UNCLASSIFIED
```

---

## Step 5 (≈5 min): Invoke your first agent

This step requires Claude Code. If not installed, read the alternate block below and proceed to Step 6.

**If Claude Code is installed**, open it in the scratch directory and type:

> "Run gsd-customer-context-mapper for this prototype."

The agent fires, reads `.planning/intel-context.md`, validates the required fields, prompts for anything missing, and writes the completed context record. When it finishes successfully, the last line of its output is:

```
## CONTEXT MAPPING COMPLETE
```

If required information is unavailable (fields are empty or conflicting), it emits `## CONTEXT MAPPING BLOCKED` instead, along with a list of what is missing. Fill in the missing fields in `.planning/intel-context.md` and run the agent again.

**If Claude Code is not yet installed:**

`gsd-customer-context-mapper` is the Phase 0 anchor agent. It reads `.planning/intel-context.md`, cross-references required fields for the NGA overlay, prompts for anything missing, and rewrites the file with a fully-structured context record. On success its final output line is `## CONTEXT MAPPING COMPLETE`. The agent file at `.claude/agents/gsd-customer-context-mapper.md` documents the full execution flow and output contract.

---

## Step 6 (≈2 min): Cleanup

Remove the scratch directory entirely:

```bash
cd /tmp && rm -rf /tmp/gsd-ic-training-prototype
```

Confirm it is gone:

```bash
ls /tmp/gsd-ic-training-prototype 2>&1
# Expected: No such file or directory
```

The session is complete. Nothing was committed to any real program directory and nothing was published to any registry.

---

## What you learned

- **Install order matters:** GSD (`npx get-shit-done-cc@latest`) must be present before the IC-pack installer runs. The installer detects GSD and errors if it is absent.
- **Where files land:** All IC-pack content goes into `.claude/` only. `.planning/` is program-owned — `intel-context.md` and `intel-gates.json` are yours to create and own.
- **Customer overlay:** `--customer=nga` selects the NGA overlay from `config-overlays/nga/` and wires NGA-specific agent skills into `.claude/agent_skills/`.
- **Hooks are auto-wired:** The three IC-pack hooks are registered in `.claude/settings.json` automatically.
- **Completion markers:** Agents signal success via a structured final-output line (`## CONTEXT MAPPING COMPLETE`). The full contract registry lives at `.claude/references/agent-contracts.ic-pack.md`.
- **Teardown:** Deleting the directory removes all installed content. The install is also reversible via `npx <tarball> uninstall`.

---

## Cheat sheet

```bash
# Setup (from gsd-ic repo root)
npm pack && PACK_TGZ="$(pwd)/adelphi-gsd-ic-0.1.0.tgz"

# Step 1
mkdir -p /tmp/gsd-ic-training-prototype && cd /tmp/gsd-ic-training-prototype
git init && git commit --allow-empty -m "init"

# Step 2
npx get-shit-done-cc@latest

# Step 3
npx "$PACK_TGZ" install --customer=nga
ls .claude/agents/gsd-*.md | wc -l    # expect 58+
grep -c "gsd-classification-banner\|gsd-classified-leak-detector\|gsd-prompt-injection-scan-intel" \
  .claude/settings.json               # expect 3

# Step 4 — copy template from Step 4 above into .planning/intel-context.md
mkdir -p .planning

# Step 5 — open Claude Code; ask: "Run gsd-customer-context-mapper for this prototype."
# Look for: ## CONTEXT MAPPING COMPLETE

# Step 6
cd /tmp && rm -rf /tmp/gsd-ic-training-prototype
```
