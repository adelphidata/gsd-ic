---
name: classification-conventions
description: Always declare classification in frontmatter/header when creating a file. Default UNCLASSIFIED unless explicitly told otherwise. Never auto-determine classification from content. Commit subjects prefixed [U]. CUI handling requires human authorization.
classification: UNCLASSIFIED
ic_pack: true
allowed-tools: Write, Edit, Bash
---

# Classification conventions

> Behavioral skill. Injected into agents that produce text artifacts (`gsd-executor`, `gsd-debugger`, `gsd-code-fixer`, `gsd-doc-writer`, narrative agents). Activates whenever the host agent runs.

## The four rules

### Rule 1 — Always declare classification

Every file you create or modify SHOULD carry an explicit classification declaration. Three accepted forms:

- **Markdown / prose** — YAML frontmatter:
  ```yaml
  ---
  classification: UNCLASSIFIED
  ---
  ```
- **Markdown without frontmatter** — first-line HTML comment:
  ```html
  <!-- CLASSIFICATION: UNCLASSIFIED -->
  ```
- **Source code** — first-line shebang-or-language comment:
  ```python
  # CLASSIFICATION: UNCLASSIFIED
  ```

CI (`tools/ci/validate-classification.sh`) enforces this for `intel-refs/` and `config-overlays/`. Apply the convention everywhere unless the file type explicitly cannot carry comments (e.g., binary, JSON without comments).

### Rule 2 — Default UNCLASSIFIED

When the user has not specified a classification, write `UNCLASSIFIED`. Never silently assume otherwise. Never infer classification from content.

### Rule 3 — Never auto-determine; never elevate

If a user references content that *might* be classified higher (CUI, S//, TS//), STOP and ask for explicit human authorization before proceeding. Document the authorization in the file header. Do not unilaterally apply CUI/Secret markings to a low-side artifact even if the content suggests it.

### Rule 4 — Commit subject prefix

When committing, prefix the subject with `[U]` (e.g., `[U] feat: add gsd-fusion-architect agent`). This carries the classification declaration into git history and is validated by CI on the IC-pack repo.

## Behavior notes

- This skill modifies behavior only — it adds NO new tool capabilities.
- If your agent is already producing classified-handling code (e.g., for a customer overlay that authorizes CUI handling), the skill yields to explicit instruction in your prompt; the skill is the default.
- The companion hook `gsd-classification-banner.js` will stamp a banner into files lacking one as a defense-in-depth measure. The banner enforces this skill at write time.

## When NOT to use

- File types that cannot carry comments (raw binaries, certain JSON files when frontmatter would invalidate the schema). Document the exemption in a `.classification` sidecar file.
- Files where the convention conflicts with an external schema you don't control. Flag and ask.
