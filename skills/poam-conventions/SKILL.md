---
name: poam-conventions
description: POA&M upsert algorithm for compliance agents. Idempotent append-or-update of findings to .planning/POAM.md keyed by (agent-prefix, control-shortid, finding-hash). Read POAM, search Open/Closed tables for existing key, update Open or insert; leave Closed alone.
classification: UNCLASSIFIED
ic_pack: true
allowed-tools: Read, Write, Edit, Bash
---

# poam-conventions

You are injecting the **poam-conventions** skill. Follow this upsert algorithm precisely whenever you append findings to `.planning/POAM.md`.

## When to use this skill

Use this skill as the last step before emitting your completion marker, after you have identified all compliance findings from your analysis.

## Upsert algorithm

### Step 1 — Read or create

```bash
# Check if POAM exists; if not, create the scaffold
test -f .planning/POAM.md || echo "CREATE"
```

If `.planning/POAM.md` does not exist, create it with this exact scaffold:

```markdown
---
classification: UNCLASSIFIED
title: Plan of Action and Milestones (POA&M)
created: <current ISO-8601 timestamp>
last_updated: <current ISO-8601 timestamp>
---

# Plan of Action and Milestones

This file is auto-populated by IC-pack compliance agents (Family A specialists + privacy reviewer) per spec §9.5. Each finding becomes one POA&M row. Idempotent: rows are keyed by `(source_agent, control_id)`; re-running a compliance agent with overlapping findings updates existing rows rather than duplicating.

## Open findings

| ID | Source agent | Control reference | Severity | Finding | Recommended action | Due date | Status |
|---|---|---|---|---|---|---|---|

## Closed findings

| ID | Source agent | Control reference | Severity | Finding | Action taken | Closed date | Status |
|---|---|---|---|---|---|---|---|
```

### Step 2 — Compute finding keys

For each finding, compute the idempotency key:

```
key = <agent-prefix>-<control-shortid>-<finding-hash[:8]>
```

- `agent-prefix`: provided per agent (see agent's "POA&M append" section)
- `control-shortid`: lowercase the control identifier, replace spaces/dots/slashes with hyphens (e.g., `AC-2` → `ac-2`, `CMMC.L2.AC.L2-3.1.1` → `l2-ac-l2-3-1-1`)
- `finding-hash[:8]`: compute `echo -n "<finding text>" | sha256sum | cut -c1-8`

### Step 3 — Check for existing rows

Search the Open and Closed tables for a row whose `ID` column matches the computed key.

- **Found in Open** → update the row: overwrite Severity, Finding, Recommended action, Due date. Leave Status as-is.
- **Found in Closed** → leave the row alone. Do not reopen. Do not add a duplicate to Open.
- **Not found** → insert a new row into the Open table with `Status: Open`.

### Step 4 — Update timestamp

Set the `last_updated` field in the frontmatter to the current ISO-8601 timestamp.

### Step 5 — Write back

Write the complete updated `.planning/POAM.md` file. Preserve all existing rows not touched by this run.

## Due date convention

Set `Due date` to 90 days from the current date for `High` severity findings, 180 days for `Medium`, and `TBD` for `Low`. The human reviewer may adjust.

## What you must NOT do

- Do not delete rows (open or closed).
- Do not change the `Status` of a Closed row.
- Do not invent findings. Only append findings your analysis actually identified.
- Do not write PII or credentials into any POA&M field.
