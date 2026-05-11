<!-- CLASSIFICATION: UNCLASSIFIED -->
# Adding a New Reference Doc

Reference docs live under `intel-refs/` and form the knowledge layer (spec §8), indexed in
`intel-refs/MANIFEST.json`. Agents load refs whose `applies_when` tags overlap their own.

---

## Decide: where does it go?

Nine subdirectories exist under `intel-refs/`:

| Subdirectory | Scope |
|---|---|
| `int-disciplines/` | One doc per INT discipline (humint, sigint, geoint, masint, osint, finint, cybint, medint, techint, techsigint) |
| `tradecraft/` | Analytic standards, sourcing rules, ATO structures, compliance frameworks |
| `capability-patterns/` | Cross-INT analytic patterns (entity resolution, pattern of life, etc.) |
| `ai-ml/` | AI/ML-specific topics (eval patterns, foundation-model adaptation) |
| `classification/` | Classification-partition guidance |
| `ecosystem/` | IC-customer ecosystem briefs and artifact formats |
| `house-style/` | Adelphi house-style references (briefs, proposals, white papers) |
| `modernization/` | Cross-cutting modernization themes |
| `demo/` | Demo-specific refs (empty in v1; reserved) |

Do not create a new subdirectory unless 2+ refs will live there immediately.

---

## Step 1: Pick a subdirectory and topic key

The topic key is the file path **relative to `intel-refs/`** — e.g.,
`int-disciplines/sigint.md` or `tradecraft/nist-800-171.md` (NOT `intel-refs/int-disciplines/sigint.md`).
This is the **primary key** under the manifest's `"topics": { ... }` wrapper; there is no
separate `path` field. See spec
[§8.1](../specs/2026-05-05-ic-agent-pack-design.md#81-manifest-schema-intel-refsmanifestjson)
(line 499) for the canonical schema definition.

Name the file after the topic slug (kebab-case, lowercase) matching sibling conventions.

---

## Step 2: Write the file with classification frontmatter

**Per-directory topic-field convention** (for human readability; the manifest validator does
not enforce either field name):

| Directory | Topic field |
|---|---|
| `intel-refs/int-disciplines/` | `topic_id:` |
| `intel-refs/tradecraft/` | `topic:` |
| All other directories | Follow the most-recent sibling in that directory |

**Required frontmatter fields** (all directories):

```yaml
---
topic_id: int-disciplines/sigint     # or topic: tradecraft/icd-206 — see table above
title: <Human-Readable Title>
classification: UNCLASSIFIED
last_reviewed: <YYYY-MM-DD>
owner: intel-pack@adelphi.ai
applies_when: [<keyword>, <keyword>, ...]
---
```

All v1 content is `UNCLASSIFIED` (classified content handling deferred per spec §16 O-05).

`applies_when` drives routing: agents whose own `applies_when` overlaps with a ref's tags
will load it. Pull keywords from spec Appendix E where possible; one-offs require PR
justification. For the full schema and body conventions, see
[REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md).

---

## Step 3: Register in MANIFEST.json

Open `intel-refs/MANIFEST.json` and add one entry inside the existing top-level `"topics": { ... }`
block. The key is the path relative to `intel-refs/` (not the repo root):

```json
"tradecraft/example-framework.md": {
  "applies_when": ["example-framework", "compliance", "risk management"],
  "owner": "intel-pack@adelphi.ai",
  "last_reviewed": "2026-05-11",
  "classification": "UNCLASSIFIED",
  "curation_status": "scaffold"
}
```

New refs ship at `curation_status: scaffold`. Status is bumped via the SME curation workflow — see [SME-CURATION-FRAMEWORK.md](SME-CURATION-FRAMEWORK.md).

- `owner` is a **singular string** (not an array).
- `applies_when` is the only array field.
- No `path`, `id`, or `name` field — the key is the path.
- Keep entries sorted alphabetically. See `intel-refs/MANIFEST.json` for shipping examples.

---

## Step 4: Run the manifest validator

```bash
bash tools/ci/validate-manifest.sh          # schema, field types, key-path consistency
bash tools/ci/validate-reference-staleness.sh  # last_reviewed within staleness threshold
```

Both are in `tools/ci/` and both must pass. To run all 12 validators: `npm run ci`.

---

## Step 5: Cross-link from agents that should load it

Routing is overlap-driven — no explicit agent wiring beyond ensuring tag overlap. To verify:

1. Read the consuming agent's frontmatter `applies_when` and confirm at least one tag matches
   the ref's `applies_when`.
2. Read the agent's `## How you do the work` section; if this ref is relevant, add a prose
   citation there (not a hard file-path import).

Prefer Appendix E vocabulary for broad cross-cutting refs.

---

## Step 6: Commit

```bash
git add intel-refs/<subdir>/<name>.md intel-refs/MANIFEST.json
git commit -m "intel-refs: add <topic> (<subdir>)"
```

Use the `intel-refs:` prefix. Subject format: `intel-refs: add <slug> (<subdir>)`, under 72
characters.

---

## Reference: per-directory frontmatter convention

| Directory | Topic field | Example value |
|---|---|---|
| `intel-refs/int-disciplines/` | `topic_id:` | `int-disciplines/sigint` |
| `intel-refs/tradecraft/` | `topic:` | `tradecraft/icd-206` |
| `intel-refs/capability-patterns/` | `topic_id:` | `capability-patterns/entity-resolution` |
| `intel-refs/ai-ml/`, `classification/`, `ecosystem/`, `house-style/`, `modernization/` | follow most-recent sibling | |
| `intel-refs/demo/` | _(empty in v1)_ | |

The manifest validator enforces neither field name. When in doubt, match the most-recently-
modified sibling in the target directory. Full schema: [REF-FRONTMATTER-SCHEMA.md](REF-FRONTMATTER-SCHEMA.md).

---

## Reference: manifest schema (full)

Top-level structure of `intel-refs/MANIFEST.json`:

```json
{
  "version": "YYYY.MM",
  "topics": {
    "<subdir>/<file>.md": {
      "applies_when": ["<keyword>", ...],
      "owner": "<email-string>",
      "last_reviewed": "<YYYY-MM-DD>",
      "classification": "UNCLASSIFIED",
      "curation_status": "scaffold"
    }
  }
}
```

Per-entry field contract:

| Field | Type | Notes |
|---|---|---|
| `applies_when` | array of strings | One or more routing keywords; only array field |
| `owner` | string | Singular — one email, not an array |
| `last_reviewed` | string | ISO 8601 `YYYY-MM-DD` |
| `classification` | string | `"UNCLASSIFIED"` for all v1 content |
| `curation_status` | string (optional) | One of `scaffold \| partial \| curated`; new refs ship at `scaffold` |

The topic key is the path relative to `intel-refs/` (i.e., `<subdir>/<file>.md`). There is
no separate `path`, `id`, or `topic` field at the manifest level.

Spec reference: §8.1 (line 499) in
[`docs/specs/2026-05-05-ic-agent-pack-design.md`](../specs/2026-05-05-ic-agent-pack-design.md).
