<!-- CLASSIFICATION: UNCLASSIFIED -->
# Adding a New Behavioral Skill

Skills are markdown files injected into agents via `.planning/config.json`'s `agent_skills` map.
They modify agent behavior without forking agent source files.

## Decide: skill or agent?

Per spec [§7.0 Skill → Agent promotion rule](../specs/2026-05-05-ic-agent-pack-design.md#70-skill--agent-promotion-rule) (line 447), a behavior stays a skill when **fewer than 2** of these criteria apply:

1. **Multi-step reasoning required** — the behavior needs structured thinking with distinct steps
   that don't fit into a host agent's existing flow.
2. **Own context-window benefit** — the skill's content and task would meaningfully consume
   the host agent's context; a fresh ~200K window would make a real difference.
3. **Produces a distinct artifact** — the work produces a discrete output file or structured
   artifact rather than just shaping the host agent's prose.

One criterion → stay a skill. Two or more → promote to an agent (see [ADDING-AN-AGENT.md](ADDING-AN-AGENT.md)).

### The 5 existing skills

| Skill | Purpose |
|---|---|
| `adelphi-house-style` | Voice, terminology, and formatting conventions for customer artifacts |
| `classification-conventions` | UNCLASSIFIED-only defaults, classification banner rules |
| `intel-coding-conventions` | Code-style rules specific to IC prototyping |
| `poam-conventions` | POA&M (Plan of Action & Milestones) formatting |
| `prototyping-discipline` | Rapid-prototype mindset and constraints |

## Step 1: Pick a name and create the directory

Name the skill in kebab-case. The directory name is the skill name; consumers invoke it by that
exact string in `agent_skills`.

```bash
mkdir skills/<skill-name>
touch skills/<skill-name>/SKILL.md
```

## Step 2: Write SKILL.md

Use the Appendix C template (quoted in the [reference section](#reference-skill-file-template-appendix-c)
below). Project-local frontmatter conventions:

```yaml
---
name: <skill-name>                       # required; must match the directory name exactly
description: <behavioral summary ≤300 chars>  # consumed by validators and the manifest
classification: UNCLASSIFIED             # mandatory; never omit or change
ic_pack: true                            # mandatory — marks this as IC pack content
allowed-tools: Read, Write, Edit, Bash  # optional — least-privilege tool list for hosts
injected_into: [gsd-agent-a, gsd-agent-b]  # optional — explicit list of host agents
activation: always                       # optional — `always` or omit for on-demand
---
```

**Field choice guidance:**

- `name`, `description`, `classification`, `ic_pack` are mandatory in every shipped skill.
- `allowed-tools` is used by 4 of 5 existing skills (`classification-conventions`,
  `intel-coding-conventions`, `poam-conventions`, `prototyping-discipline`) to declare the
  least-privilege tool list available when the skill is injected.
- `injected_into` + `activation: always` is the alternate convention used by `adelphi-house-style`
  and `prototyping-discipline` when the skill is always-on across a fixed, enumerable set of host
  agents. Use this when activation is unconditional and the host agent set is known at authoring time.
- The two conventions are not mutually exclusive — `prototyping-discipline` carries both.

**Body conventions:**

- **First paragraph:** "When to invoke" — what the skill does and which host agents load it.
  Include activation semantics: skill activation is either **always-on** (every run of a host
  agent injects the skill, declared via `activation: always` paired with `injected_into:`) or
  **on-demand** (loaded only when the customer overlay's `agent_skills` map lists it for an agent).
  Always-on is appropriate for behavioral overlays that must apply to every output of the host
  (e.g., classification banners, voice conventions); on-demand is appropriate when applicability
  varies by customer or context.
- **Numbered or bulleted rules:** the actual behavioral content the model acts on; keep rules
  concrete and imperative.
- **Cross-references:** link to `intel-refs/...` docs where the skill draws on tradecraft
  material (e.g., `intel-refs/house-style/` for `adelphi-house-style`).

## Step 3: Validate

```bash
bash tools/ci/validate-skills.sh
```

Checks frontmatter schema, `classification` value, directory-name/`name` match, and kebab-case
naming. The same script runs in CI on every push.

## Step 4: Wire into the customer overlay (optional)

If the skill should auto-engage for a specific customer, add it to
`config-overlays/<customer>/overlay.json` under `agent_skills`:

```json
{
  "agent_skills": {
    "gsd-<agent>": ["existing-skill", "<new-skill>"]
  }
}
```

The install CLI merges this into `.planning/config.json` at install time; the agent source file
is unchanged. For the full overlay schema see
[ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md).

## Step 5: Commit

`package.json` `files[]` lists every skill directory explicitly. A 6th skill requires a 6th line:

```json
"skills/prototyping-discipline/",
"skills/<new-skill>/"    ← add this
```

Then commit:

```bash
git add skills/<name>/SKILL.md
git add package.json
# + config-overlays/<customer>/overlay.json  if wired in Step 4
git commit -m "skills: add <name> skill"
```

## Reference: skill file template (Appendix C)

Source: [spec §7](../specs/2026-05-05-ic-agent-pack-design.md) line 443 /
[Appendix C](../specs/2026-05-05-ic-agent-pack-design.md#appendix-c--skill-file-template) line 1235.

```markdown
---
name: <skill-name>
description: <One-line>
classification: UNCLASSIFIED
---

# <Skill Title>

<Behavioral guidance content. Read by agents when this skill is in their
agent_skills config.>

## Rules

1. <Rule>
2. <Rule>

## Examples

<Concrete examples showing the expected behavior>
```
