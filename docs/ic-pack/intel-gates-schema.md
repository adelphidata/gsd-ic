---
classification: UNCLASSIFIED
title: intel-gates.json — schema reference
---

# `intel-gates.json` — schema reference

`intel-gates.json` is the per-program config file at `.planning/intel-gates.json` that controls IC-pack hook + workflow-gate behavior. It is consumer-owned (lives in the consumer's program repo) and is OPTIONAL — when absent, all hooks default to `enabled: true` and no workflow gates fire.

## File location

`<program-root>/.planning/intel-gates.json`

## Top-level shape

```json
{
  "version": "2026.05",
  "hooks": {
    "<hook_id>": {
      "enabled": true,
      "<per_hook_config_key>": <value>
    }
  },
  "gates": {
    "<gate_id>": {
      "enabled": false,
      "trigger": "<workflow-name>.<step-name>",
      "agent": "<gsd-agent-name>",
      "config": { "<gate_specific_keys>": <values> }
    }
  }
}
```

## `hooks` object

One key per IC-pack hook. Hook IDs are documented in each hook's source file. Currently shipping (Plan 1):

| Hook ID | File | Default | Per-hook keys |
|---|---|---|---|
| `classification_banner` | `hooks/gsd-classification-banner.js` | `enabled: true` | (none) |
| `classified_leak` | `hooks/gsd-classified-leak-detector.js` | `enabled: true`, `block_on_match: false` | `block_on_match: boolean` |
| `prompt_injection_intel` | `hooks/gsd-prompt-injection-scan-intel.js` | `enabled: true` | (none) |

When a hook key is absent, defaults apply. Setting `enabled: false` disables the hook entirely.

## `gates` object

One key per workflow gate. Gates are workflow-side hooks that invoke an agent at a specific step boundary. Plan 1-fix only locks the schema; no gates ship in this plan.

| Field | Required | Notes |
|---|---|---|
| `enabled` | yes | `false` by default. Setting `true` activates the gate. |
| `trigger` | yes | Format: `<workflow-name>.<step-name>` (e.g., `new-project.context-mapper`). Must resolve to a real heading slug or anchor in the named workflow file. Validated by `tools/ci/validate-triggers.sh`. |
| `agent` | yes | Name of the IC-pack agent to invoke at the trigger (e.g., `gsd-customer-context-mapper`). |
| `config` | no | Free-form per-gate config. Schema defined per gate in the agent's frontmatter. |

## Validation

- `tools/ci/validate-triggers.sh` validates that every `gates.*.trigger` resolves to a real workflow step.
- `tools/ci/validate-seamless-fork.sh` validates that the workflow patches applied for active gates are semantically inert when gates are disabled.
- Schema validation per se is currently advisory — there is no JSON-schema-backed validator. Future plans may add `validate-intel-gates.sh`.

## Default behavior (no `intel-gates.json`)

When the file is absent:

- All hooks: `enabled: true`, default per-hook config.
- All gates: `enabled: false` (no gates fire).

This matches the seamless-fork guarantee: a fresh install with no `.planning/intel-gates.json` behaves bit-for-bit as stock GSD plus advisory-only hooks.

## Example

```json
{
  "version": "2026.05",
  "hooks": {
    "classified_leak": { "enabled": true, "block_on_match": true }
  },
  "gates": {
    "context-mapper": {
      "enabled": true,
      "trigger": "new-project.intel-context",
      "agent": "gsd-customer-context-mapper"
    }
  }
}
```

This config: enables blocking-mode for the leak detector + enables the context-mapper gate at the new-project workflow's `intel-context` step.

## Versioning

The `version` field uses the same `YYYY.MM` shape as `intel-refs/MANIFEST.json` and gets bumped on framework releases. Consumers are forward-compatible within the same `YYYY.MM` series.

## Why this schema

- Hooks and gates are separate top-level objects because they are distinct mechanisms (Claude Code event hooks vs. workflow-side gate dispatchers per spec §9.6).
- Per-hook/per-gate config is opt-in: defaults work for most programs; per-program tuning is per spec §15.1's per-program PM model.
- The schema deliberately does NOT enumerate every IC-pack hook/gate at the schema level — agents and hooks self-document their config requirements in their source files. The schema only specifies the shape; the contents are open.
