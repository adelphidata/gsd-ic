<!-- CLASSIFICATION: UNCLASSIFIED -->
# Quickstart: 30 Minutes from `npx` to First Agent Invocation

Consumer install path — assumes you are installing the pack into an existing program directory, not contributing to the pack itself.

## Prerequisites

- **Node 22+, npm** (`engines.node: >=22.0.0` in `package.json`).
- **A program repo with GSD already installed.** The IC pack layers on top of GSD; it does not replace it. Pinned compatible GSD version: `1.39.0-rc.4` (see `gsd_pinned` in the IC pack `VERSION` file).
- **SME readiness.** Per spec §15.1, your program should have at least one SME assigned per primary INT discipline in scope before enabling the pack. Without SMEs, reference docs decay and analytic agents produce lower-quality output. If your program is not yet staffed, you can install and scaffold now but defer enabling Family L gates until staffed.

---

## Step 1: Install GSD upstream (if not already installed)

If GSD is not yet in your program repo, install it first:

```bash
cd /path/to/your/program
npx get-shit-done-cc@latest
```

If GSD is already installed, this is a no-op refresh. The IC pack install step (Step 2) will verify GSD presence and abort if it cannot detect a GSD install in the target directory.

---

## Step 2: Install the IC pack

From your program directory:

```bash
npx @adelphi/gsd-ic@latest install --customer=<nga|nsa|nro|cia|dia>
```

`--customer` is required — there is no default. The five valid values are enforced by the CLI; an unknown name exits with code 2. (See Step 3 for details on what the customer overlay does.)

**Expected output** (stderr progress lines, then one stdout completion line):

```text
[gsd-ic] GSD detected (modern-skills); pack pinned to GSD 1.39.0-rc.4
[gsd-ic] pack content installed under /path/to/your/program/.claude/
[gsd-ic] customer overlay wired (nga)
[gsd-ic] IC-pack hooks registered in .claude/settings.json
install complete: @adelphi/gsd-ic for customer=nga in /path/to/your/program
```

The install verifies GSD is present, copies pack content (58 agents, 3 hooks, 5 skills, 36 reference docs) into `.claude/`, writes the customer overlay's `agent_skills` assignments into `.planning/config.json`, and registers the three IC-pack hooks in `.claude/settings.json`. Re-running with the same `--customer=<name>` is a safe idempotent refresh.

---

## Step 3: Select a customer overlay

The overlay you selected via `--customer=` in Step 2 maps specific agents to customer-appropriate skills and configures AO-specific defaults. Five overlays ship in v1:

| Value | Agency |
|---|---|
| `cia` | Central Intelligence Agency |
| `dia` | Defense Intelligence Agency |
| `nga` | National Geospatial-Intelligence Agency |
| `nro` | National Reconnaissance Office |
| `nsa` | National Security Agency |

**Switching customers later.** Customer is usually a property of the program, not the engineer. If your program genuinely needs a different customer overlay (e.g., a contract re-compete changed the AO), re-run install with the new `--customer=` and add `--confirm-customer-switch`:

```bash
npx @adelphi/gsd-ic@latest install --customer=nsa --confirm-customer-switch
```

Without `--confirm-customer-switch`, a detected customer switch aborts with an error. See [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md) for the full upgrade flow.

---

## Step 4: Fill in program context

Every IC-pack agent reads `.planning/intel-context.md` at startup to ground its reasoning in your specific program. This file is **not** created by the install — it is program-owned. Create it now:

```bash
mkdir -p .planning
touch .planning/intel-context.md
```

Populate it with the following template (fill in each angle-bracket field; leave a field empty or omit it if the information is not yet available):

```markdown
---
classification: UNCLASSIFIED
ao: <area of operations / customer agency, e.g., NGA>
mission: <one-paragraph mission summary>
primary_ints: [<comma-separated INT disciplines in scope, e.g., geoint, osint>]
transition_target: <eventual program-of-record or sustainment target, if known>
---

# Program context

## Mission detail
<2–3 paragraphs describing the program's mission, the problem being solved,
and the intended operational impact>

## Key stakeholders
- PM: <name>
- Customer technical POC: <name>
- SMEs: <name> (<INT discipline>), <name> (<INT discipline>)

## Phase tempo / cadence
<e.g., 2-week prototype phases, demo every 8 weeks>
```

The `gsd-customer-context-mapper` agent (Step 6) will validate and enrich this file on first run. You can also run it before any other agent to have it interview you for missing fields.

---

## Step 5: Verify the install

Run these three sanity checks from your program directory:

```bash
# 1. IC-pack agents are present
ls .claude/agents/gsd-*.md | wc -l
# Expected: 58 (only IC-pack agents have ic_pack:true frontmatter; upstream GSD agents that share the gsd-* prefix are not counted)
```

```bash
# 2. IC-pack hooks are registered in settings
grep -c "gsd-classification-banner\|gsd-classified-leak-detector\|gsd-prompt-injection-scan-intel" \
  .claude/settings.json
# Expected: 3
```

```bash
# 3. Customer overlay is recorded in planning config
grep -A3 '"__gsd_ic"' .planning/config.json
# Expected: customer, pack_version, installed_at fields
```

If check 1 returns fewer than 58, rerun `npx @adelphi/gsd-ic@latest install --customer=<name>` — the install is idempotent and safe to repeat. If check 2 returns 0, settings.json may be malformed; see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

## Step 6: Run your first agent

`gsd-customer-context-mapper` is the canonical first agent to run. It is the Phase 0 anchor: it reads `PROJECT.md` (if you have one), your `.planning/intel-context.md`, and any user-supplied program description, then writes or updates `.planning/intel-context.md` with a fully-structured context record.

To invoke it, open Claude Code in your program directory and ask it a customer-mapping question, for example:

> "Run gsd-customer-context-mapper — we're starting a new NGA prototype focused on GEOINT feature extraction."

The agent fires, reads your existing context files, prompts for any missing required fields, and writes the completed `.planning/intel-context.md`. When it finishes successfully, the last line of its output is:

```
## CONTEXT MAPPING COMPLETE
```

If required information is unavailable, it emits `## CONTEXT MAPPING BLOCKED` and lists what is missing. The completion marker registry for all 58 agents is at `.claude/references/agent-contracts.ic-pack.md`.

---

## Step 7: Run your first gate (optional)

Gates are workflow control points defined in `.planning/intel-gates.json`. The pack does not auto-create this file on install — you create it when you are ready to opt in to gates. Start with a minimal `intel-gates.json` containing one Family L gate:

```bash
mkdir -p .planning && cat > .planning/intel-gates.json <<'JSON'
{
  "version": "2026.05",
  "hooks": {
    "classification_banner": { "enabled": true },
    "classified_leak": { "enabled": true, "block_on_match": false },
    "prompt_injection_intel": { "enabled": true }
  },
  "gates": {
    "family-l-ci": {
      "enabled": false,
      "trigger": "plan-phase.5-handle-research",
      "agent": "gsd-ci-analyst"
    }
  }
}
JSON
```

All gates ship `"enabled": false` — the IC pack is a zero-footprint overlay; no gate fires until you opt in. To enable the gate above, open the file and flip `"enabled": false` to `"enabled": true`. Once enabled, the agent fires automatically when a `plan-phase` workflow reaches step 5. **Family L** contains four mission-framing agents (`gsd-ci-analyst`, `gsd-targeting-analyst`, `gsd-insider-threat-analyst`, `gsd-adversary-modeler`) that fire in parallel from the same trigger — add each as its own gate entry to enable the full fan-out.

The full v1 template with all four Family L gates lives in the pack repo at `workflow-patches/intel-gates.template.json`. The dispatcher schema is documented in [intel-gates-schema.md](intel-gates-schema.md).

---

## What's next

- [ARCHITECTURE.md](ARCHITECTURE.md) — full six-layer mental model, completion-marker contract, CI surface, and classification model
- [PER-CUSTOMER-PLAYBOOK.md](PER-CUSTOMER-PLAYBOOK.md) — AO-specific gotchas, tradecraft watch-outs, and recommended agent sequences per customer
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — known install, hook, CI, and runtime failure modes with resolutions
- [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md) — how to bump the installed pack version or switch customer overlays

---

## Uninstall

```bash
npx @adelphi/gsd-ic@latest uninstall
```

This removes all IC-pack content from `.claude/` (agents, hooks, skills, intel-refs, the contract registry, and the customer overlay directory), unwires the hooks from `.claude/settings.json`, and strips the IC-pack metadata block from `.planning/config.json`. Stock GSD files and program-owned files are not touched. `.planning/intel-context.md` and `.planning/intel-gates.json` (if you created it) are program-owned and are left in place.
