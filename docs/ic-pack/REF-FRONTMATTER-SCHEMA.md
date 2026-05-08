---
classification: UNCLASSIFIED
title: Reference doc frontmatter schema
---

# Reference doc frontmatter schema

Every Markdown reference doc under `intel-refs/` (and `config-overlays/<customer>/refs/`) MUST start with a YAML frontmatter block of the form:

```yaml
---
classification: UNCLASSIFIED
title: <human-readable title>
topic_id: <stable-slug>
---
```

## Fields

| Field | Required | Notes |
|---|---|---|
| `classification` | yes | Must equal `UNCLASSIFIED`. Validated by `tools/ci/validate-classification.sh`. |
| `title` | recommended | Display title shown when the doc is rendered. Distinct from the filename. |
| `topic_id` | recommended | Stable slug for cross-doc linking (e.g., `int-disciplines/humint`). Conventionally matches the path-without-extension. |

## What does NOT live in frontmatter

The manifest (`intel-refs/MANIFEST.json`) is the source of truth for `applies_when`, `owner`, and `last_reviewed`. These deliberately do NOT duplicate into per-doc frontmatter — keep the manifest the single point of truth so agents query one place.

## Why this shape

Resolves spec Open Question O-01. The minimal schema satisfies validate-classification.sh, supports doc-as-standalone consumption (title for rendering), and supports cross-doc linking (topic_id) without inflating the per-doc cognitive load. Additional fields can be added later as a non-breaking extension; current consumers are tolerant of extra keys.
