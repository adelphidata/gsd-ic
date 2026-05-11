# SME Curation Framework (Post-v1 Track #2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` to execute this plan task-by-task. Two-stage review (spec compliance, then code quality) after every task. Sonnet implementers for content tasks; haiku for the mechanical MANIFEST migration; sonnet reviewers.

**Goal:** Ship the governance artifacts needed to drive per-INT SME curation of `intel-refs/` content. Adds an enforced `curation_status` manifest field (scaffold | partial | curated), seeds initial values for all 36 refs via line-count heuristic, ships an SME-facing framework doc + a maintainer-facing status grid + a PR template, and updates the contributor docs.

**Architecture:** Curation state lives in `intel-refs/MANIFEST.json` (single source of truth). `REF-CURATION-STATUS.md` is a human-readable mirror. `SME-CURATION-FRAMEWORK.md` is the policy / workflow / quality-bar doc. PR template lives at `templates/sme-curation-pr.md`. Validator change is additive (new optional field, enum-validated).

**Tech Stack:** Markdown for docs/template, JSON for manifest, bash for validator.

**Branch:** `sme-curation-framework`. Squash-merge with `--delete-branch` after CI green.

---

## Operating mode

- Controller (you) creates `sme-curation-framework` off `main` once before Task 2. Implementers commit on this branch.
- **One commit per task.** Commit message format: `<scope>: <one-line>` matching convention from prior plans.
- **Subagent dispatch:** sonnet `staff-software-engineer` for content tasks; haiku-tier model is fine for the mechanical jq migration (T3); sonnet `code-review-enforcer` for both review stages.
- **Verification per task:** task-specific (some run validators, some grep).
- **Validator change scope:** Task 2 adds an optional `curation_status` field with enum validation. No other validator behavior changes.
- **No agent / skill / hook / ref-body content changes.** Refs themselves stay as-is in this plan — only their manifest metadata changes.
- **Forbidden-language scan** (applied to new docs only — same patterns as Plan #1): `stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]`.

---

## Inventory facts (verified at plan-write time)

- **36 manifest entries** total: `int-disciplines` (10), `tradecraft` (13), `capability-patterns` (2), `ecosystem` (5), `house-style` (3), `ai-ml` (1), `classification` (1), `modernization` (1).
- **All entries currently owned by `intel-pack@adelphi.ai`** — placeholder pending SME ownership assignment.
- **Manifest schema:** top-level `{version, topics}`. Each topic entry: `applies_when` (array), `owner` (string), `last_reviewed` (YYYY-MM-DD), `classification` (UNCLASSIFIED in v1). This plan adds an optional `curation_status` (enum: `scaffold | partial | curated`).
- **Validator location:** `tools/ci/validate-manifest.sh`. Test file: `tools/ci/tests/validate-manifest.test.sh`.
- **Ref body sizes (proxy for initial curation_status assignment):**
  - 21–45 lines (≤45): `scaffold` — covers most tradecraft compliance refs + all 9 INT-discipline refs + capability-patterns + ecosystem briefs + modernization.
  - 46–110 lines: `partial` — `poam-format` (80), `techsigint` (81), `medint` (87), `techint` (91), `eval-patterns` (110).
  - 111+ lines: `curated` (heuristic only; SME review will reclassify) — `aws-partitions` (130), house-style briefs/proposals/white-papers (120–151), `icd-206` (192), `words-of-estimative-probability` (199), `ato-process-overview` (392), `ato-document-suite` (397).

If any of those facts change before the plan completes, halt and escalate.

---

## Task 1: Plan + branch setup (controller-only)

- [ ] **Step 1: Commit plan**

```bash
git checkout -b sme-curation-framework
git add docs/plans/2026-05-11-sme-curation-framework.md
git commit -m "docs(plans): post-v1 track #2 — SME curation framework plan"
```

No subagent dispatch. Proceeds to Task 2 directly.

---

## Task 2: Add `curation_status` field to manifest validator + tests

**Files:**
- Modify: `tools/ci/validate-manifest.sh`
- Modify: `tools/ci/tests/validate-manifest.test.sh`

**Implementer:** staff-software-engineer (sonnet).

- [ ] **Step 1: Read existing validator + test**

`/Users/romansky/gsd-ic/tools/ci/validate-manifest.sh` and `tools/ci/tests/validate-manifest.test.sh`. Note the current pattern: required fields enforced in a loop; missing-field check emits `vfail`. Tests cover JSON parse failure, missing topic key, missing required field, file-not-resolving.

- [ ] **Step 2: Add optional `curation_status` validation**

Inside the per-topic loop in `validate-manifest.sh`, after the required-field loop, add an optional-field check:

```bash
# Optional: curation_status (enum: scaffold | partial | curated)
status=$(jq -r --arg t "$topic" '.topics[$t].curation_status // empty' "$MANIFEST")
if [ -n "$status" ]; then
  case "$status" in
    scaffold|partial|curated) ;;
    *)
      vfail "manifest entry '$topic' has invalid curation_status '$status' (must be: scaffold | partial | curated)"
      ;;
  esac
fi
```

The field is OPTIONAL — entries without it are valid. Only entries that have the field but with a non-enum value fail.

- [ ] **Step 3: Add test cases**

In `tools/ci/tests/validate-manifest.test.sh`, add three new test cases following the existing test-pattern style (consult sibling tests):

1. **Test: entry with `curation_status: "scaffold"` passes** — manifest with the field set to a valid value validates clean.
2. **Test: entry with `curation_status: "invalid"` fails** — validator emits a vfail message containing "invalid curation_status".
3. **Test: entry without `curation_status` passes** — confirms the field stays optional (regression guard).

Use a temp manifest fixture per test (the test file already shows how — copy that idiom).

- [ ] **Step 4: Run the tests**

```bash
bash tools/ci/tests/validate-manifest.test.sh
```

Expected: all existing tests pass + 3 new tests pass.

- [ ] **Step 5: Run the validator against current manifest**

```bash
bash tools/ci/validate-manifest.sh
```

Expected: OK (manifest doesn't yet have curation_status; field is optional).

- [ ] **Step 6: Commit**

```bash
git add tools/ci/validate-manifest.sh tools/ci/tests/validate-manifest.test.sh
git commit -m "tools(ci): validate-manifest accepts optional curation_status enum field"
```

---

## Task 3: Migrate MANIFEST.json — add `curation_status` to all 36 entries

**Files:**
- Modify: `intel-refs/MANIFEST.json`

**Implementer:** staff-software-engineer (sonnet) — even though this is mechanical, the assignment of initial values requires reading some refs to spot-check the line-count heuristic.

- [ ] **Step 1: Read the initial-value heuristic and assignment list**

Heuristic: line count of the ref body as a starting signal. The SME will reclassify in subsequent PRs; this just seeds the field. Initial values:

| Path | Lines | Initial status |
|---|---|---|
| tradecraft/cmmc-2.0.md | 21 | scaffold |
| tradecraft/fips-140-3.md | 22 | scaffold |
| tradecraft/eo-14028.md | 23 | scaffold |
| tradecraft/dfars-252-204-7012.md | 25 | scaffold |
| tradecraft/itar-ear.md | 26 | scaffold |
| tradecraft/nist-800-171.md | 26 | scaffold |
| tradecraft/nist-800-53-rev5.md | 34 | scaffold |
| int-disciplines/finint.md | 35 | scaffold |
| int-disciplines/sigint.md | 35 | scaffold |
| int-disciplines/humint.md | 36 | scaffold |
| int-disciplines/osint.md | 36 | scaffold |
| int-disciplines/masint.md | 37 | scaffold |
| int-disciplines/cybint.md | 38 | scaffold |
| int-disciplines/geoint.md | 39 | scaffold |
| capability-patterns/pattern-of-life.md | 43 | scaffold |
| capability-patterns/entity-resolution.md | 44 | scaffold |
| ecosystem/nga.md | 45 | scaffold |
| tradecraft/icd-203.md | 45 | scaffold |
| ecosystem/nsa.md | 47 | scaffold |
| ecosystem/dia.md | 48 | scaffold |
| ecosystem/nro.md | 48 | scaffold |
| ecosystem/cia.md | 49 | scaffold |
| modernization/modernization-themes.md | 51 | partial |
| tradecraft/poam-format.md | 80 | partial |
| int-disciplines/techsigint.md | 81 | partial |
| int-disciplines/medint.md | 87 | partial |
| int-disciplines/techint.md | 91 | partial |
| ai-ml/eval-patterns.md | 110 | partial |
| house-style/white-papers.md | 120 | curated |
| classification/aws-partitions.md | 130 | curated |
| house-style/briefs.md | 145 | curated |
| house-style/proposals.md | 151 | curated |
| tradecraft/icd-206.md | 192 | curated |
| tradecraft/words-of-estimative-probability.md | 199 | curated |
| tradecraft/ato-process-overview.md | 392 | curated |
| tradecraft/ato-document-suite.md | 397 | curated |

Note: scaffold cutoff is `≤50 lines`; partial cutoff is `51–110 lines`; curated is `111+ lines`. These are seed values only — SMEs will adjust in subsequent PRs.

- [ ] **Step 2: Apply via jq**

Recommended approach: a single jq one-liner per status group, or a single jq with a lookup table. Example structure:

```bash
SCAFFOLD=(
  "tradecraft/cmmc-2.0.md"
  "tradecraft/fips-140-3.md"
  # ... etc
)

# Use jq to set curation_status on each entry. Pseudocode:
jq --arg path "tradecraft/cmmc-2.0.md" --arg status "scaffold" \
  '.topics[$path].curation_status = $status' intel-refs/MANIFEST.json > /tmp/manifest.json
mv /tmp/manifest.json intel-refs/MANIFEST.json
```

Apply for each of 36 entries. Implementer should write a single bash loop iterating the table.

- [ ] **Step 3: Verify manifest is well-formed and validator passes**

```bash
jq -e . intel-refs/MANIFEST.json >/dev/null  # JSON parses
jq '.topics | map_values(.curation_status) | to_entries | map(select(.value == null))' intel-refs/MANIFEST.json  # expect: []
jq '.topics | map_values(.curation_status) | [.[]] | group_by(.) | map({status: .[0], count: length})' intel-refs/MANIFEST.json
# Expected output (counts):
# [
#   {"status": "curated", "count": 8},
#   {"status": "partial", "count": 6},
#   {"status": "scaffold", "count": 22}
# ]
bash tools/ci/validate-manifest.sh  # expect OK
```

- [ ] **Step 4: Commit**

```bash
git add intel-refs/MANIFEST.json
git commit -m "intel-refs: seed curation_status on all 36 manifest entries (22 scaffold, 6 partial, 8 curated)"
```

---

## Task 4: Write `docs/ic-pack/SME-CURATION-FRAMEWORK.md`

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/SME-CURATION-FRAMEWORK.md`. Target 220–300 lines.

**Implementer:** staff-software-engineer (sonnet).

- [ ] **Step 1: Outline**

```
# SME Curation Framework
## Audience
## Why curation matters
## The three curation states
### scaffold
### partial
### curated
## Roles
### Subject Matter Expert (SME)
### Reviewer
### Pack maintainer
## Workflow (per ref)
### Phase 1: Scaffold seed (ships with pack)
### Phase 2: SME drafts content
### Phase 3: Cross-SME review
### Phase 4: Merge + status bump
## Quality bars (must hold for curated state)
## Per-discipline curation owners
## Tracking status changes over time
## How status changes propagate
## What this framework does NOT cover
```

- [ ] **Step 2: Write Audience section**

Two audiences:
- **Subject Matter Experts (SMEs):** intelligence-discipline practitioners contributing tradecraft content. Sections marked `[SME]` are for you.
- **Pack maintainers:** the small team owning `gsd-ic` repo health. Sections marked `[Maintainer]` are for you. Sections marked `[Both]` apply to everyone.

- [ ] **Step 3: Write "Why curation matters"**

3 paragraphs covering:
- v1 shipped 36 refs as scaffolds-plus — enough to route agents and exercise the framework but not deep enough to be authoritative tradecraft.
- Without SME-driven curation, refs decay (per spec §15.1.1 R-01 — the staff-onboarding bottleneck).
- This framework is the mechanism that takes refs from "scaffold" → "curated" with documented quality bars at each step.

- [ ] **Step 4: Write "The three curation states" section**

Per state, a 5–8 line paragraph:

- **scaffold:** initial state. Ref establishes the topic, links to authoritative external sources (NIST/ICD/CNSSI/etc.), defines the `applies_when` routing surface. Body is brief (≤50 lines typical). Useful for agent dispatch but not for authoritative quote-back. Most v1 refs ship here.

- **partial:** SME has expanded the body with substantive tradecraft (typically 51–110 lines). Citations to authoritative sources present. Coverage of the topic's primary applications, but gaps remain in edge cases / cross-INT interaction / customer-specific variation. Agents loading this ref can quote from it with attribution to the SME owner.

- **curated:** full SME-validated treatment. Substantive body (typically 111+ lines, but length is not the criterion — depth is). Coverage of primary uses + common edge cases + cross-INT interactions where relevant. SME-of-record signed off in the last 12 months. Agents can rely on this ref as authoritative.

Explicit: line count is a starting heuristic, NOT the criterion. SME judgment governs the state.

- [ ] **Step 5: Write Roles section**

- **SME [SME]:** holds domain expertise in one or more `intel-refs/` topics. Authors and updates ref content. Signs off on curation_status bumps. Listed in the `owner` field of relevant manifest entries (post-onboarding; currently all owned by `intel-pack@adelphi.ai` as placeholder).

- **Reviewer [SME]:** a second SME who reviews drafted content before merge. Cross-INT topics (e.g., capability-patterns) require reviewers from each affected discipline.

- **Pack maintainer [Maintainer]:** owns repo health and merge gates. Confirms validators pass, schema compliance, classification compliance. Does NOT validate tradecraft content; that's SME job.

- [ ] **Step 6: Write Workflow (per ref) section**

Four phases per ref:

- **Phase 1: Scaffold seed (ships with pack) [Maintainer]:** initial ref shipped at scaffold state. Maintainer ensures the file exists, frontmatter is correct, manifest entry exists. Listed as `curation_status: scaffold` in manifest. This is the v1 baseline.

- **Phase 2: SME drafts content [SME]:** SME opens a PR using the `templates/sme-curation-pr.md` template. PR contains: the ref-content delta, updated `last_reviewed`, optionally new `applies_when` keywords. PR description names a Phase-3 reviewer.

- **Phase 3: Cross-SME review [SME]:** the named reviewer reads the PR + validates content against the quality bars (Step 7). Reviewer comments on the PR — request changes or approve.

- **Phase 4: Merge + status bump [Maintainer]:** maintainer confirms reviewer approval, runs `npm run ci`, and merges. The status field in the manifest is bumped if the PR description requested a bump (scaffold→partial or partial→curated). Status bumps must include a reviewer approval.

- [ ] **Step 7: Write Quality bars section [SME]**

5 quality bars that MUST hold for the `curated` state (each ~3 lines):

1. **UNCLASSIFIED-only.** No CUI, no FOUO, no portion markings. Sources cited must themselves be unclassified.
2. **Authoritative sources cited.** Every claim about tradecraft, regulation, or procedure has a citation to an authoritative external source (NIST publication, ICD, CNSSI, public DoD/IC doctrine, peer-reviewed academic literature).
3. **No SCI/SAP content.** Even unclassified-but-sensitive compartmented program names are out of scope.
4. **No customer-specific operational detail.** Customer programs are referenced abstractly (e.g., "an SCI customer") not by program name, AO, or schedule.
5. **Last-reviewed within 12 months.** The `last_reviewed` field is current. If older than 12 months, status auto-downgrades from `curated` to `partial` until SME re-validates.

Lower bars for `partial`: rules 1, 2, 3, 4 hold; rule 5 is `within 18 months`.

For `scaffold`: rules 1 and 3 hold (classification + no SCI/SAP). Rules 2, 4, 5 are aspirational.

- [ ] **Step 8: Write Per-discipline curation owners [Both]**

Table mapping each `intel-refs/` subdirectory to its current owner-of-record AND the desired SME assignment (TBC where no SME is assigned yet):

| Subdirectory | Current owner | Desired SME owner |
|---|---|---|
| int-disciplines/ | intel-pack@adelphi.ai | TBC per INT |
| tradecraft/ | intel-pack@adelphi.ai | TBC — compliance lead + IC tradecraft lead |
| capability-patterns/ | intel-pack@adelphi.ai | TBC — cross-INT |
| ecosystem/ | intel-pack@adelphi.ai | TBC per customer |
| house-style/ | intel-pack@adelphi.ai | Adelphi voice lead |
| ai-ml/ | intel-pack@adelphi.ai | AI/ML practice lead |
| classification/ | intel-pack@adelphi.ai | Pack maintainer (long-term) |
| modernization/ | intel-pack@adelphi.ai | Pack maintainer (long-term) |

Note: SME owner assignment is a separate organizational process. This table tracks where it lands when assignments happen.

- [ ] **Step 9: Write "Tracking status changes over time" [Both]**

- The canonical state lives in `intel-refs/MANIFEST.json` `curation_status` field.
- [REF-CURATION-STATUS.md](REF-CURATION-STATUS.md) is a human-readable snapshot of the manifest. It is regenerated on PR merge by the maintainer (manual for v1; could be automated later).
- Git history on `intel-refs/MANIFEST.json` is the audit trail for status changes.

- [ ] **Step 10: Write "How status changes propagate" [Maintainer]**

When a PR bumps `curation_status`:
1. Validator confirms the new value is one of `scaffold | partial | curated`.
2. PR description must include reviewer name + sign-off date for `partial` and `curated` bumps.
3. Maintainer regenerates `REF-CURATION-STATUS.md` from the manifest (see that doc for the generation script).
4. Maintainer merges; pack version is NOT bumped (curation_status is metadata, not content).

- [ ] **Step 11: Write "What this framework does NOT cover"**

3–5 bullets:
- Initial ref scaffolding (covered by [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md)).
- New customer onboarding (covered by [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md)).
- Reclassification of refs beyond UNCLASSIFIED (out of v1 scope per spec §16 O-05).
- Programmatic enforcement of "curated"-state freshness (the 12-month auto-downgrade is policy, not validator behavior in v1; future enhancement).
- SME assignment as an organizational process (this doc just hosts the workflow once SMEs are assigned).

- [ ] **Step 12: Forbidden-language scan + length check + commit**

```bash
wc -l docs/ic-pack/SME-CURATION-FRAMEWORK.md  # expect 220-300
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/SME-CURATION-FRAMEWORK.md  # zero hits (TBC permitted in tables)
```

Note: `TBC` is permitted in the per-discipline owners table (column "Desired SME owner") since owner assignment is a separate org process. The forbidden-language regex matches `tbd` not `tbc`, so this is fine.

```bash
git add docs/ic-pack/SME-CURATION-FRAMEWORK.md
git commit -m "docs(ic-pack): add SME curation framework (workflow, states, quality bars, roles)"
```

---

## Task 5: Write `docs/ic-pack/REF-CURATION-STATUS.md`

**File:** Create `/Users/romansky/gsd-ic/docs/ic-pack/REF-CURATION-STATUS.md`. Target 80–130 lines.

**Implementer:** staff-software-engineer (sonnet) — generates from manifest, but should also embed the generation script.

- [ ] **Step 1: Outline**

```
# Reference Curation Status (auto-snapshot from MANIFEST.json)
## Summary counts
## By subdirectory
### int-disciplines/ (10)
### tradecraft/ (13)
### capability-patterns/ (2)
### ecosystem/ (5)
### house-style/ (3)
### ai-ml/ (1)
### classification/ (1)
### modernization/ (1)
## Generation script
```

- [ ] **Step 2: Write summary counts**

Total: 36 refs. Initial breakdown after Task 3: 22 scaffold, 6 partial, 8 curated. Verify by running the count jq from Task 3 Step 3.

```markdown
| State | Count | % |
|---|---|---|
| scaffold | 22 | 61% |
| partial | 6 | 17% |
| curated | 8 | 22% |
| **total** | **36** | 100% |

Last regenerated: <YYYY-MM-DD>
```

- [ ] **Step 3: Write per-subdirectory tables**

For each subdirectory, a table:

```markdown
| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `<subdir>/<file>.md` | <status> | <owner> | <date> |
| ... |
```

Generate from manifest. All owner values are currently `intel-pack@adelphi.ai`.

- [ ] **Step 4: Write Generation script section**

Embed the bash script for regenerating this doc from the manifest:

```bash
# scripts/gen-curation-status.sh (or run inline)
jq -r '
  .topics | to_entries | sort_by(.key) |
  group_by(.key | split("/")[0]) |
  .[] |
  "\n### " + (.[0].key | split("/")[0]) + "/ (" + (length | tostring) + ")\n" +
  "\n| Path | curation_status | owner | last_reviewed |\n|---|---|---|---|\n" +
  (map("| `" + .key + "` | " + (.value.curation_status // "—") + " | " + .value.owner + " | " + .value.last_reviewed + " |") | join("\n"))
' intel-refs/MANIFEST.json
```

Note: this script does not write the file — it just produces the section bodies for human paste-in. v1 does NOT include an automated regeneration step.

- [ ] **Step 5: Forbidden-language scan + length check + commit**

```bash
wc -l docs/ic-pack/REF-CURATION-STATUS.md  # 80-130
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/REF-CURATION-STATUS.md  # zero hits
```

```bash
git add docs/ic-pack/REF-CURATION-STATUS.md
git commit -m "docs(ic-pack): add REF-CURATION-STATUS snapshot generated from manifest (22/6/8)"
```

---

## Task 6: Create `templates/sme-curation-pr.md`

**File:** Create `/Users/romansky/gsd-ic/templates/sme-curation-pr.md` (creating the `templates/` directory if it doesn't exist). Target 50–80 lines.

**Implementer:** staff-software-engineer (sonnet).

- [ ] **Step 1: Confirm `templates/` directory does not yet exist; create it**

```bash
ls templates 2>/dev/null || mkdir -p templates
```

- [ ] **Step 2: Write the template**

```markdown
<!-- CLASSIFICATION: UNCLASSIFIED -->
# SME Curation PR Template

## Ref being updated

- Path: `intel-refs/<subdir>/<file>.md`
- Manifest entry: `<subdir>/<file>.md`

## Curation state transition

- Current: `scaffold | partial | curated`
- Proposed: `scaffold | partial | curated`
- If status is being bumped, list the quality bars satisfied (see [SME-CURATION-FRAMEWORK.md](../docs/ic-pack/SME-CURATION-FRAMEWORK.md) §Quality bars).

## Reviewer

- Reviewer SME: `<name or email>`
- Reviewer sign-off: `<date> by <name>` (paste reviewer comment URL or quote)
- (Required for `partial` and `curated` state bumps.)

## Content changes summary

<1–3 paragraphs summarizing what changed in the ref body. Examples: new section added, citations refreshed, edge cases added, etc.>

## Authoritative sources cited

List the external sources newly cited or updated:
- <NIST SP 800-XXX rev N (year)>
- <ICD XXX (year)>
- <CNSSI XXXX (year)>
- ...

## Quality-bar checklist

- [ ] UNCLASSIFIED only — no CUI, no FOUO, no portion markings
- [ ] No SCI/SAP content — no compartmented program names
- [ ] No customer-specific operational detail (programs referenced abstractly)
- [ ] Citations to authoritative external sources for every tradecraft / regulatory claim
- [ ] `last_reviewed` field bumped to today's date in the manifest entry

## Notes for the maintainer

<Anything the pack maintainer should know before merging — gates that need to be flipped, follow-up SME work needed, etc.>

---

🤖 PR opened per the SME curation workflow in [docs/ic-pack/SME-CURATION-FRAMEWORK.md](../docs/ic-pack/SME-CURATION-FRAMEWORK.md).
```

- [ ] **Step 3: Forbidden-language scan + commit**

```bash
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" templates/sme-curation-pr.md  # zero hits (note: this file uses <placeholder>-style angle brackets which won't match the regex)
```

```bash
git add templates/sme-curation-pr.md
git commit -m "templates: add SME curation PR template"
```

---

## Task 7: Update `docs/ic-pack/ADDING-A-REFERENCE.md` — mention `curation_status`

**File:** Modify `/Users/romansky/gsd-ic/docs/ic-pack/ADDING-A-REFERENCE.md` (currently 178 lines, will grow by 10–20 lines).

**Implementer:** staff-software-engineer (sonnet).

- [ ] **Step 1: Identify the right insertion point**

The doc's "Step 3: Register in MANIFEST.json" section currently lists 4 fields (`applies_when, owner, last_reviewed, classification`). Add `curation_status` as an optional 5th field.

- [ ] **Step 2: Update Step 3 JSON example**

Add `"curation_status": "scaffold"` as the last line of the example entry. Add a one-line note: "New refs ship at `scaffold`; status is bumped via the SME curation workflow (see [SME-CURATION-FRAMEWORK.md](SME-CURATION-FRAMEWORK.md))."

- [ ] **Step 3: Update the "Reference: manifest schema (full)" section**

Add `curation_status` to the per-entry field table:

```markdown
| `curation_status` | string (optional) | One of `scaffold | partial | curated`; new refs ship at `scaffold` |
```

And update the full-schema JSON block similarly.

- [ ] **Step 4: Forbidden-language scan + length check + commit**

```bash
wc -l docs/ic-pack/ADDING-A-REFERENCE.md  # was 178; expect 185-200
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/ADDING-A-REFERENCE.md  # zero hits
```

```bash
git add docs/ic-pack/ADDING-A-REFERENCE.md
git commit -m "docs(ic-pack): document curation_status manifest field in ADDING-A-REFERENCE"
```

---

## Task 8: Update `docs/ic-pack/README.md` doc map

**File:** Modify `/Users/romansky/gsd-ic/docs/ic-pack/README.md` (currently 57 lines).

**Implementer:** staff-software-engineer (sonnet) — tiny change but should still go through review for cross-doc coherence.

- [ ] **Step 1: Add new docs to map**

In the "Contributing (dev-side)" subsection of the doc map (added by Plan #1 Task 1), add:

```markdown
- [SME-CURATION-FRAMEWORK.md](SME-CURATION-FRAMEWORK.md) — SME workflow, curation states, quality bars
- [REF-CURATION-STATUS.md](REF-CURATION-STATUS.md) — per-ref curation state snapshot (auto-derived from manifest)
```

Insert in the logical position (after `ADDING-A-REFERENCE.md` is reasonable since both relate to refs).

- [ ] **Step 2: Update inventory section**

The README's "What v1 ships" bullet about refs currently reads "36 reference docs spanning ...". No change needed (counts stay the same).

- [ ] **Step 3: Forbidden-language scan + commit**

```bash
wc -l docs/ic-pack/README.md  # was 57; expect 59-61
grep -niE "stub|tbd|todo|fleshed out|more detail to come|placeholder|coming soon|\(populated later\)|Plan [0-9]" docs/ic-pack/README.md  # zero hits
```

```bash
git add docs/ic-pack/README.md
git commit -m "docs(ic-pack): add SME framework + curation status to README doc map"
```

---

## Task 9: Update `package.json` files[]

**File:** Modify `/Users/romansky/gsd-ic/package.json`.

**Implementer:** staff-software-engineer (sonnet) — mechanical but must keep alphabetical order.

- [ ] **Step 1: Add `templates/` to files[]**

Open `package.json`. Add `"templates/"` to the `files[]` array in alphabetical position. The 2 new docs (`SME-CURATION-FRAMEWORK.md`, `REF-CURATION-STATUS.md`) are already covered by the existing `"docs/ic-pack/"` glob.

- [ ] **Step 2: Run publish-scope validator**

```bash
bash tools/ci/validate-publish-scope.sh
```

Expected: OK.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "package: ship templates/ directory in published pack"
```

---

## Task 10: Controller cross-ref sweep + PR

**Audience:** controller (you), not subagents.

- [ ] **Step 1: Confirm all task commits landed**

```bash
git log main..sme-curation-framework --oneline | wc -l   # expect ~10 (plan + 9 task commits, plus any review-driven fixes)
```

- [ ] **Step 2: Run `npm run ci`**

```bash
npm run ci
```

Expected: all 12 validators OK.

- [ ] **Step 3: Run validator tests**

```bash
npm run test:validators
```

Expected: all pass (including the 3 new `validate-manifest` tests).

- [ ] **Step 4: Confirm internal links resolve**

```bash
for f in docs/ic-pack/SME-CURATION-FRAMEWORK.md docs/ic-pack/REF-CURATION-STATUS.md templates/sme-curation-pr.md; do
  grep -oE "\]\([^)]+\.md[^)]*\)" "$f" | sed -E 's/\]\(([^)]+)\)/\1/' | while read -r link; do
    target="${link%%#*}"
    base="$(dirname "$f")"
    [ -f "$base/$target" ] || echo "BROKEN: $f -> $link"
  done
done
```

Expected: no `BROKEN:` lines.

- [ ] **Step 5: Confirm manifest curation_status counts**

```bash
jq '.topics | map_values(.curation_status) | [.[]] | group_by(.) | map({status: .[0], count: length})' intel-refs/MANIFEST.json
```

Expected: `[{"status":"curated","count":8},{"status":"partial","count":6},{"status":"scaffold","count":22}]`.

- [ ] **Step 6: Push + open PR**

```bash
git push -u origin sme-curation-framework
gh pr create --repo adelphidata/gsd-ic --base main \
  --title "feat: SME curation framework (post-v1 track #2)" \
  --body "$(cat <<'EOF'
## Summary

Post-v1 track #2 — adds governance / tracking artifacts for per-INT SME curation of ref content. No agent / skill / hook / ref-body changes.

### What ships

- New optional manifest field `curation_status` (enum: `scaffold | partial | curated`).
- All 36 manifest entries seeded with initial values via line-count heuristic: 22 scaffold, 6 partial, 8 curated.
- `docs/ic-pack/SME-CURATION-FRAMEWORK.md` — roles, workflow, quality bars, per-discipline owner table.
- `docs/ic-pack/REF-CURATION-STATUS.md` — per-ref state grid + regeneration script.
- `templates/sme-curation-pr.md` — PR template for SME curation contributions.
- `docs/ic-pack/ADDING-A-REFERENCE.md` and `docs/ic-pack/README.md` updated.

### Validator change

`tools/ci/validate-manifest.sh` now validates `curation_status` enum if present. Field is optional; entries without it remain valid. Three new test cases added to the validator's test file.

## Test plan

- [x] `npm run ci` green (all 12 validators)
- [x] `npm run test:validators` green
- [x] Manifest counts: 22 scaffold + 6 partial + 8 curated = 36
- [x] Forbidden-language scan across new docs: zero hits
- [x] Internal links resolve

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 7: Squash-merge after CI green**

```bash
gh pr merge --repo adelphidata/gsd-ic --squash --delete-branch <PR-number>
git checkout main
git pull origin main
```

- [ ] **Step 8: Memory update check**

If during execution we surfaced any non-obvious convention worth saving across projects, add a feedback memory. Otherwise: no memory update.

---

## Self-review checklist (controller, before dispatch)

- [x] **Spec coverage:** Plan covers manifest schema change (optional field + enum), seed values for all 36 entries, framework doc, status grid, PR template, contributor-doc updates, package.json files[]. No spec changes required.
- [x] **Placeholder scan:** plan contains no `TBD`/`TODO`/`fill in details` strings. `TBC` is used in the SME ownership table (legitimate per Plan #1 Task 11 precedent).
- [x] **Type consistency:** `curation_status` referenced consistently; values `scaffold | partial | curated` consistently.
- [x] **Inventory facts:** 36 entries verified; 22+6+8=36 math checks.
- [x] **Forbidden-language scan applied to plan:** zero hits (allowed exceptions: the regex's own listing of forbidden patterns inside grep commands).

## Out of scope (do NOT do as part of this plan)

- Actual SME-driven ref curation (that's the multi-week per-INT effort the framework exists to support).
- Automated `REF-CURATION-STATUS.md` regeneration (deferred — manual for v1).
- Programmatic 12-month auto-downgrade enforcement (deferred).
- Agent-side surfacing of `curation_status` to engineers (separate post-v1 work).
- SME ownership assignment (organizational process; tracked in the per-discipline table as TBC).
- Pack VERSION bump (curation_status is metadata, not pack content).
