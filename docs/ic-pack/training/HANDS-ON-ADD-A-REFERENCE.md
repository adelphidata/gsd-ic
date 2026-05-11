<!-- CLASSIFICATION: UNCLASSIFIED -->
# Hands-On: Add a Reference Doc (30 minutes)

Work through this session top-to-bottom. Every command is real and runnable.
You will create a throwaway ref, register it, run validators, and clean up.
No commit is produced; the tree ends where it started.

---

## Audience and prerequisites

**Audience:** Developers new to the IC Pack (after the 60-min walkthrough).

**Prerequisites:** repo cloned, Node 22+, `jq` installed, working tree clean.

---

## What you will accomplish

1. Create `intel-refs/capability-patterns/training-example.md`.
2. Register it in `intel-refs/MANIFEST.json` (subdir-relative key, all required fields).
3. Run `validate-manifest.sh`, `validate-reference-staleness.sh`, and `validate-classification.sh` — all pass.
4. Clean up so no trace of the session remains.

---

## Setup (≈3 min)

Confirm a clean tree:

```bash
git status --porcelain   # must produce no output
```

Confirm baseline CI passes:

```bash
npm run ci               # all 12 validators OK
```

Resolve any pre-existing failures before continuing.

---

## Step 1 (≈5 min): Pick a topic and subdirectory

| Decision | Value |
|---|---|
| Subdirectory | `capability-patterns/` |
| Topic slug | `training-example` |
| File path | `intel-refs/capability-patterns/training-example.md` |
| Manifest key | `capability-patterns/training-example.md` |

The manifest key is **always subdir-relative** — never prefixed with `intel-refs/`.
Existing siblings in `capability-patterns/` (e.g., `entity-resolution.md`) use `topic_id:`
frontmatter; you will follow that convention in Step 2.

No commands in this step — confirm you understand the paths before proceeding.

---

## Step 2 (≈5 min): Write the reference file with frontmatter

```bash
cat > intel-refs/capability-patterns/training-example.md <<'EOF'
---
topic_id: training-example
title: Training Example (throwaway — do not ship)
classification: UNCLASSIFIED
last_reviewed: 2026-05-11
owner: training@adelphi.ai
applies_when: [training, example]
---

# Training Example (throwaway)

This reference exists for the IC Pack hands-on training session.
It is created at the start of the session and removed at the end.
It is NOT shipped with the pack.

## Why this exists

To exercise the full ref-creation workflow against real validators.
`topic_id:` matches the `capability-patterns/` sibling convention
(`entity-resolution.md`). `owner` is a singular string; `applies_when`
is an array. All v1 content is UNCLASSIFIED.
EOF
```

Verify the file was created:

```bash
ls intel-refs/capability-patterns/
# expect: entity-resolution.md  pattern-of-life.md  training-example.md
```

---

## Step 3 (≈5 min): Register the ref in MANIFEST.json

```bash
jq '.topics["capability-patterns/training-example.md"] = {
  "applies_when": ["training", "example"],
  "owner": "training@adelphi.ai",
  "last_reviewed": "2026-05-11",
  "classification": "UNCLASSIFIED",
  "curation_status": "scaffold"
}' intel-refs/MANIFEST.json > /tmp/manifest-training.json \
  && mv /tmp/manifest-training.json intel-refs/MANIFEST.json
```

Verify the entry landed:

```bash
jq '.topics["capability-patterns/training-example.md"]' intel-refs/MANIFEST.json
```

Expected:

```json
{
  "applies_when": ["training", "example"],
  "owner": "training@adelphi.ai",
  "last_reviewed": "2026-05-11",
  "classification": "UNCLASSIFIED",
  "curation_status": "scaffold"
}
```

Field notes: `applies_when` is the only array field; `owner` is a singular string; `curation_status: "scaffold"` is required for all new refs.

---

## Step 4 (≈5 min): Run validators

```bash
bash tools/ci/validate-manifest.sh
# validate-manifest: OK

bash tools/ci/validate-reference-staleness.sh
# validate-reference-staleness: OK

bash tools/ci/validate-classification.sh
# validate-classification: OK
```

Full suite (optional but recommended):

```bash
npm run ci
# all 12 validators: OK
```

If any validator fails, common causes: manifest key has `intel-refs/` prefix (remove it);
`owner` written as an array (use a plain string); `last_reviewed` missing or wrong format.

---

## Step 5 (≈5 min): Cleanup

```bash
git checkout -- intel-refs/MANIFEST.json
rm intel-refs/capability-patterns/training-example.md
git status --porcelain    # must produce no output
npm run ci                # all 12 validators OK — back to baseline
```

Session complete. No commit produced; working tree restored.

---

## What you learned

- **Full ref-creation workflow:** file → frontmatter → manifest entry → validators → cleanup.
- **Per-directory frontmatter convention:** `capability-patterns/` uses `topic_id:` (follow the most-recent sibling).
- **Manifest key format:** always subdir-relative; never prefixed with `intel-refs/`.
- **Field contract:** `applies_when` is the only array; `owner` is a singular string; new refs start at `curation_status: scaffold`.
- **Ref-gating validators:** `validate-manifest.sh`, `validate-reference-staleness.sh`, `validate-classification.sh`.

---

## Cheat sheet

```
FILE PATH
  intel-refs/<subdir>/<slug>.md

FRONTMATTER (capability-patterns convention)
  ---
  topic_id: <slug>
  title: <Human-Readable Title>
  classification: UNCLASSIFIED
  last_reviewed: YYYY-MM-DD
  owner: <email>
  applies_when: [<keyword>, ...]
  ---

MANIFEST KEY
  "<subdir>/<slug>.md"         ← relative to intel-refs/ only
  NOT "intel-refs/<subdir>/..."  ← fails validation

MANIFEST ENTRY
  {
    "applies_when": ["<kw>", ...],  ← only array field
    "owner": "<email>",             ← singular string
    "last_reviewed": "YYYY-MM-DD",
    "classification": "UNCLASSIFIED",
    "curation_status": "scaffold"   ← all new refs start here
  }

ADD ENTRY
  jq '.topics["<subdir>/<slug>.md"] = { ... }' \
    intel-refs/MANIFEST.json > /tmp/m.json \
    && mv /tmp/m.json intel-refs/MANIFEST.json

VALIDATORS
  bash tools/ci/validate-manifest.sh
  bash tools/ci/validate-reference-staleness.sh
  bash tools/ci/validate-classification.sh
  npm run ci                          ← all 12

CLEANUP (throwaway sessions)
  git checkout -- intel-refs/MANIFEST.json
  rm intel-refs/<subdir>/<slug>.md
  git status --porcelain              ← must be empty

SEE ALSO
  docs/ic-pack/ADDING-A-REFERENCE.md      ← full contributor guide
  docs/ic-pack/SME-CURATION-FRAMEWORK.md  ← advancing past scaffold
```
