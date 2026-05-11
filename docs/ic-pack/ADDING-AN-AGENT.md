<!-- CLASSIFICATION: UNCLASSIFIED -->
# Adding a New IC Pack Agent

## Decide: should this be a new agent at all?

Check whether the behavior belongs as a skill. Per spec
[§7.0](../specs/2026-05-05-ic-agent-pack-design.md#70-skill--agent-promotion-rule)
(line 447), promote to a full agent when **two or more** of the following apply:

1. **Multi-step reasoning required.** Distinct steps that don't fit into a host agent's flow.
2. **Own context-window benefit.** A fresh ~200K window would reduce context pressure on the caller.
3. **Produces a distinct artifact.** A discrete output file, not just modified host behavior.

Single criterion = stay a skill. See [ADDING-A-SKILL.md](ADDING-A-SKILL.md).

## Step 1: Pick a family and name

All 58 IC pack agents belong to one of 15 families (spec §5, line 252):

```
A — Compliance Specialists (8)      I — Per-INT Discipline Researchers (10)
B — Privacy (1)                     J — All-Source Research & Tradecraft (2)
C — Security Personas (2)           K — Specialty Domain (1)
D — ATO Documentation (8)           L — Mission-Framing Analysts (4)
E — CDRL & Customer Artifacts (4)   M — Architecture / Fusion (1)
F — Customer Engagement (4)         N — Engineering Enablement (4)
G — Capture / BD (4)                O — Transition (1)
H — Mission & Prototype Design (4)
```

**Naming:** `gsd-<role-name>` — kebab-case, lowercase. The `gsd-` prefix is mandatory;
`tools/ci/validate-agents.sh` rejects files without it. Pattern: `<domain>-<role-noun>`
(e.g., `gsd-icd-203-enforcer`, `gsd-medint-researcher`).

Place the file at `agents/gsd-<name>.md`.

## Step 2: Write the agent file

Start from the Appendix A template (reproduced verbatim in the
[Reference section](#reference-agent-file-template-appendix-a-of-spec), spec line 1156),
then add the project-local frontmatter fields:

```yaml
---
name: gsd-<role-name>
description: <One-line role description>
ic_pack: true
classification: UNCLASSIFIED
tools: [Read, Write, Bash, Grep, Glob, WebSearch, WebFetch, mcp__context7__*]
applies_when: [<keyword>, <keyword>]
color: <terminal-color>   # optional
---
```

- `ic_pack: true` — **load-bearing**. `install-pack.cjs` skips agents without this field.
- `tools:` — least privilege. Add `Edit` for implementers only; `Task` for orchestrators only.
- `applies_when:` — prefer keywords from [Appendix E — Manifest Topic Tag Vocabulary](../specs/2026-05-05-ic-agent-pack-design.md#appendix-e--manifest-topic-tag-vocabulary) (search `### Appendix E` in the spec if the anchor drifts); justify one-offs in PR.
- Length targets: researchers 80–120 lines; auditors 100–150; dual-mode/orchestrators 200–260.

## Step 3: Register the completion marker

Open `references/agent-contracts.ic-pack.md` and add one row per `(agent, marker)` pair.
The marker heading in `<structured_returns>` must match this regex exactly.

**Validator regex (POSIX-ERE):**

```
^##[[:space:]]+[A-Z][A-Z0-9 _&-]*[[:space:]]+(COMPLETE|BLOCKED|FOUND|FAILED|UPDATE COMPLETE)$
```

Registry row format: `| gsd-<name> | ## <ROLE> COMPLETE | <one-line description> |`

```bash
bash tools/ci/validate-completion-markers.sh
```

## Step 4: Register in package.json files[]

Add the agent path to the `files` array in **alphabetical order**:

```json
"agents/gsd-<new-name>.md"
```

`tools/ci/validate-publish-scope.sh` enforces sort and confirms every path is real.

```bash
bash tools/ci/validate-publish-scope.sh
```

## Step 5: Wire workflow trigger (optional)

Most agents are invoked ad-hoc or via another agent's `Spawned by:` reference. Note:
`Spawned by:` is a human-readable cross-reference for documentation purposes; it does not
trigger automatic invocation. Agents are invoked by user request, by gate triggers, or by
another agent's tool calls.

For always-on gating, add an entry to `workflow-patches/intel-gates.template.json` (schema below):

```json
{
  "id": "family-<x>-<role>",
  "trigger": "plan-phase.<step>",
  "agent": "gsd-<name>",
  "enabled": false
}
```

`enabled: false` is required for all new gates — consumers opt in per-program.
`tools/ci/validate-triggers.sh` enforces the `<workflow>.<step>` slug format.

## Step 6: Run the validators

`npm run ci` runs all 12 validators. The five most relevant for agent additions:

```bash
bash tools/ci/validate-agents.sh              # frontmatter schema, gsd- prefix, required fields
bash tools/ci/validate-completion-markers.sh  # marker regex + registry coverage
bash tools/ci/validate-publish-scope.sh       # package.json files[] sorted + all paths exist
bash tools/ci/validate-classification.sh      # classification banner present
bash tools/ci/validate-seamless-fork.sh       # new gates/hooks default to disabled
```

The remaining 7 (`validate-manifest.sh`, `validate-skills.sh`, `validate-workflow-patches.sh`,
`validate-triggers.sh`, `validate-no-classified-leak.sh`, `validate-audit-log.sh`,
`validate-reference-staleness.sh`) cover the rest of the pack surface; they run on every PR
and rarely trip on agent-only additions, but will fail loudly if a change cross-cuts. All 12
validators are under `tools/ci/validate-*.sh` with sibling tests at
`tools/ci/tests/validate-*.test.sh`.

## Step 7: Smoke-test the agent

No automated end-to-end "fire-the-agent-in-Claude-Code" test exists in v1 — see
[ARCHITECTURE.md](ARCHITECTURE.md) "What's deliberately not in v1". Manual steps:

1. `npm pack`; unpack into a scratch GSD program directory.
2. Invoke the agent from Claude Code with a minimal test prompt.
3. Confirm the output contains the exact completion marker registered in Step 3.
4. Confirm `gsd-classified-leak-detector.js` (an IC-pack hook under `hooks/`; fires on every
   `Read`/`Write`/`Bash` tool call during agent execution) does not fire on the output.

## Step 8: Commit

```bash
git add agents/gsd-<name>.md \
        references/agent-contracts.ic-pack.md \
        package.json
# If a gate was added:
git add workflow-patches/intel-gates.template.json

git commit -m "agents: add gsd-<name> (Family <X>)"
```

## Reference: agent file template (Appendix A of spec)

Source: `docs/specs/2026-05-05-ic-agent-pack-design.md` line 1156.

```markdown
---
name: gsd-<role-name>
description: <One-line role description>
tools: Read, Write, Bash, Grep, Glob   # principle of least privilege
color: <terminal-color>
---

<role>
You are a GSD <role-name>. <One paragraph describing the role's responsibility.>

Spawned by:
- <gate or workflow that fires this agent>

Your job: <What the agent produces and what it must NOT do.>

@~/.claude/get-shit-done/references/mandatory-initial-read.md
</role>

<knowledge_loading>
At startup, read `intel-refs/MANIFEST.json` and `.planning/intel-context.md`.
Match phase scope keywords against `applies_when` tags; load the matched
reference docs. Do not load references whose classification field is not
"UNCLASSIFIED".
</knowledge_loading>

<execution_flow>
<step name="load_context">
  Read .planning/intel-context.md and the manifest.
</step>
<step name="<task>">
  <Description of the agent's work>
</step>
<step name="produce_output">
  Write to <output-path> using the structure in Appendix B.
</step>
</execution_flow>

<structured_returns>
## <COMPLETION_MARKER>
<Output schema>
</structured_returns>

<critical_rules>
- Never determine classifications. Honor user-declared classification only.
- Reference docs you load are UNCLASSIFIED only.
- Do not write classified content. If your output would contain it, halt and emit `## <ROLE> BLOCKED: classification escalation required`.
</critical_rules>
```

The spec template does not include `ic_pack: true`, `classification:`, or `applies_when:` —
add those between `description:` and `tools:` in every IC pack agent (see Step 2).
