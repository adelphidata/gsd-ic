<!-- CLASSIFICATION: UNCLASSIFIED -->
# SME Curation Framework

## Audience

This document has two audiences:

- **Subject Matter Experts (SMEs):** intelligence-discipline practitioners who contribute tradecraft
  content to `intel-refs/`. Sections marked `[SME]` are written for you.
- **Pack maintainers:** the small team that owns `gsd-ic` repository health, merge gates, and
  schema compliance. Sections marked `[Maintainer]` are written for you.
- Sections marked `[Both]` apply to everyone involved in ref curation.

---

## Why curation matters

The v1 pack shipped 36 refs as scaffolds-plus — enough content to establish routing surfaces,
link to authoritative external sources, and exercise the framework end-to-end. That baseline is
intentional: it lets the pack go live and generate agent dispatch value before any individual SME
has invested significant curation time. Most refs in v1 are `scaffold` state by design, not by
neglect.

Without a structured, SME-driven curation process, ref content decays. Regulations are revised,
IC doctrine is updated, and the gap between what a ref says and what a practitioner would actually
say grows. Agents loading a stale ref can still route correctly, but they cannot quote from it
with confidence. Left unmanaged, that gap erodes the pack's value as an authoritative tradecraft
resource — the bottleneck described in spec §15.1.1 R-01 around staff-onboarding quality.

This framework is the mechanism that takes refs from `scaffold` to `curated` with documented
quality bars at each transition. It defines who is responsible, what each state requires, and how
the governance trail is maintained. The goal is not to impose process overhead; it is to give each
discipline's SME a clear, lightweight path to bring their refs to a state where agents and
engineers can rely on them.

---

## The three curation states

The `curation_status` field in `intel-refs/MANIFEST.json` tracks one of three values:
`scaffold`, `partial`, or `curated`. These are the only valid values; the validator enforces the
enum.

**Important:** line count is a starting heuristic used to seed initial values, not the criterion
for state assignment. SME judgment governs the state. A tightly written 90-line ref can be
`curated`; a sprawling 200-line draft with unverified claims cannot.

### scaffold

The initial state for every ref when it enters the pack. A scaffold ref establishes the topic,
links to authoritative external sources (NIST publications, ICDs, CNSSI standards, public
DoD/IC doctrine), and defines the `applies_when` routing surface that agents use for dispatch.
Body is brief — typically 50 lines or fewer. The content is correct but not deep: it tells an
agent what domain it is operating in and where to look, but it does not provide enough
substantive tradecraft for direct quote-back. Most v1 refs ship at `scaffold`. This state is
appropriate until a domain SME takes ownership and expands the content.

### partial

The SME has expanded the ref body with substantive tradecraft. Typically 51–110 lines, though
again this is a heuristic. Citations to authoritative sources are present. Coverage of the
topic's primary applications and standard procedures is in place. Gaps remain: edge cases,
cross-INT interaction, customer-specific variation, or recent regulatory updates may not yet be
addressed. Agents loading a `partial` ref can quote from it with attribution to the owner listed
in the manifest, with the understanding that coverage is not complete. A `partial` ref may be
more useful than a `scaffold` ref for prompt engineering, but practitioners should not treat it
as the definitive word on a topic.

### curated

Full SME-validated treatment. Depth, not length, is the criterion — though substantive refs
typically exceed 110 lines. Coverage includes primary uses, common edge cases, cross-INT
interactions where relevant, and citations to current authoritative sources. A named SME
signed off within the last 12 months, and the `last_reviewed` field in the manifest reflects
that date. Agents can rely on a `curated` ref as authoritative within its stated scope. If
`last_reviewed` is older than 12 months, the ref is treated as `partial` for practical purposes
until the SME re-validates — the validator does not auto-downgrade in v1, but maintainers and
SMEs should apply this policy when evaluating ref quality.

---

## Roles

### Subject Matter Expert (SME) `[SME]`

The SME holds domain expertise in one or more `intel-refs/` topics. The SME's responsibilities
are:

- Author and update ref content within their discipline.
- Ensure citations are current and traceable to authoritative external sources.
- Sign off on `curation_status` bumps by stating so explicitly in the PR description.
- Respond to cross-SME review requests for topics adjacent to their expertise.
- Update `last_reviewed` in the manifest entry whenever they validate a ref's content.

The `owner` field in manifest entries currently reads `intel-pack@adelphi.ai` as a stand-in
pending formal SME ownership assignment. When a SME takes ownership of a subdirectory, that
field is updated via a manifest PR.

### Reviewer `[SME]`

The reviewer is a second SME who reads the drafted ref before it merges. The reviewer is named
explicitly in the PR description. For single-discipline refs (e.g., a `tradecraft/` compliance
ref), the reviewer should be another practitioner in that discipline. For cross-INT topics
(e.g., `capability-patterns/`), reviewers from each affected discipline should weigh in.
The reviewer's responsibilities are:

- Validate that the content is technically accurate and reflects current practice.
- Confirm that citations are present, authoritative, and correctly described.
- Confirm that the quality bars (see below) are satisfied for the proposed `curation_status`.
- Approve or request changes on the PR. Approval is required before a `partial` or `curated`
  status bump.

### Pack maintainer `[Maintainer]`

The pack maintainer owns repository health and the merge gate. Responsibilities are:

- Confirm that validators pass (`npm run ci`) before merging any curation PR.
- Confirm schema compliance: manifest entry is valid JSON, required fields present, enum values
  correct.
- Confirm classification compliance: no CUI, no portion markings, no SCI/SAP content.
- Regenerate `REF-CURATION-STATUS.md` after any status change lands.
- Does NOT validate tradecraft content — that is the SME's responsibility.

---

## Workflow (per ref)

Each ref moves through curation in four phases. Phases 2 and 3 iterate until the reviewer
approves; a single PR can cover multiple iteration cycles.

### Phase 1: Scaffold seed (ships with pack) `[Maintainer]`

Every ref enters the pack at `scaffold` state. The maintainer ensures the file exists with
correct frontmatter (see [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md)), the manifest entry is
present with all required fields, and `curation_status` is set to `scaffold`. This is the v1
baseline. No SME involvement is required for Phase 1.

### Phase 2: SME drafts content `[SME]`

The SME opens a branch and creates a PR using the template at
`templates/sme-curation-pr.md`. The PR must contain:

- The ref-content delta (the expanded body of the `.md` file).
- An updated `last_reviewed` date in the manifest entry.
- Optionally: new or revised `applies_when` keywords if the routing surface should change.
- The name of the Phase 3 reviewer in the PR description.
- If a status bump is being requested: explicit statement of which quality bars are satisfied.

The SME should not merge their own PR. Opening the PR is the handoff to Phase 3.

### Phase 3: Cross-SME review `[SME]`

The named reviewer reads the PR diff, validates the content against the quality bars, and either
approves or requests changes on GitHub. Review comments should be specific: point to the claim
that needs a citation, the section that needs expansion, or the quality bar that is not yet met.
The SME addresses review comments and pushes additional commits to the same branch. This phase
iterates until the reviewer approves.

### Phase 4: Merge + status bump `[Maintainer]`

Once the reviewer has approved:

1. Maintainer confirms reviewer approval is present in the PR.
2. Maintainer runs `npm run ci` — all validators must pass.
3. If the PR requests a status bump, maintainer confirms the PR description names a reviewer
   and includes their sign-off.
4. Maintainer merges the PR (squash is preferred).
5. Maintainer regenerates `REF-CURATION-STATUS.md` from the manifest (see
   [REF-CURATION-STATUS.md](REF-CURATION-STATUS.md) for the generation script).
6. Pack version is NOT bumped — `curation_status` is metadata, not pack content.

---

## Quality bars (must hold for curated state) `[SME]`

The following five bars must all hold for a ref to carry `curation_status: curated`. The
reviewer verifies these during Phase 3. The PR template includes a checklist.

1. **UNCLASSIFIED only.** The ref body contains no CUI, no FOUO markings, no portion
   markings of any kind. All sources cited are themselves publicly available and unclassified.
   If a topic cannot be addressed at UNCLASSIFIED, the ref stays at `scaffold` and notes that
   limitation.

2. **Authoritative sources cited.** Every tradecraft claim, regulatory requirement, or
   procedural statement has a citation to a current, authoritative external source: NIST
   publications, Intelligence Community Directives (ICDs), CNSSI standards, public DoD/IC
   doctrine, or peer-reviewed academic literature where applicable. Assertions without
   citations do not satisfy this bar.

3. **No SCI/SAP content.** Even unclassified-but-sensitive compartmented program names,
   collection system names, or Special Access Program titles are out of scope. Tradecraft is
   described in terms of the discipline, not in terms of specific programs.

4. **No customer-specific operational detail.** Customer programs, acquisition office names,
   schedules, and authorizing officials are not named. Where customer-type context is needed,
   use abstractions: "an SCI customer," "a DoD program office," "a civilian IC agency." Customer
   overlays handle customer-specific content (see
   [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md)).

5. **Last-reviewed within 12 months.** The `last_reviewed` field in the manifest entry is
   dated within the last 12 months. A ref with a `last_reviewed` date older than 12 months is
   treated as `partial` for practical purposes, regardless of its stated `curation_status`.

**Lower bars for `partial`:** Quality bars 1, 2, 3, and 4 must hold. Bar 5 is relaxed to
within 18 months. Citations may be incomplete — coverage of the primary topic is present but
gaps are acknowledged.

**Lower bars for `scaffold`:** Bars 1 and 3 must hold (classification and no SCI/SAP). Bars 2,
4, and 5 are aspirational rather than required. The scaffold exists to establish the routing
surface, not to be a comprehensive tradecraft resource.

---

## Per-discipline curation owners `[Both]`

The table below maps each `intel-refs/` subdirectory to the current owner-of-record in the
manifest and the desired SME assignment. The `demo/` directory is excluded — it contains
demonstration fixtures, not curation-eligible refs.

| Subdirectory         | Current owner           | Desired SME owner                             |
|----------------------|-------------------------|-----------------------------------------------|
| `int-disciplines/`   | intel-pack@adelphi.ai   | TBC per INT discipline                        |
| `tradecraft/`        | intel-pack@adelphi.ai   | TBC — compliance lead + IC tradecraft lead    |
| `capability-patterns/` | intel-pack@adelphi.ai | TBC — cross-INT                               |
| `ecosystem/`         | intel-pack@adelphi.ai   | TBC per customer                              |
| `house-style/`       | intel-pack@adelphi.ai   | Adelphi voice lead                            |
| `ai-ml/`             | intel-pack@adelphi.ai   | AI/ML practice lead                           |
| `classification/`    | intel-pack@adelphi.ai   | Pack maintainer (long-term)                   |
| `modernization/`     | intel-pack@adelphi.ai   | Pack maintainer (long-term)                   |

SME owner assignment is a separate organizational process. This table tracks the landing state
once assignments are made. When a SME takes ownership, the `owner` field in all manifest
entries for that subdirectory is updated to the SME's identifier (email or team handle).

---

## Tracking status changes over time `[Both]`

The canonical `curation_status` for every ref lives in `intel-refs/MANIFEST.json`. This is the
single source of truth. Do not edit status anywhere else without also editing the manifest.

[REF-CURATION-STATUS.md](REF-CURATION-STATUS.md) is a human-readable snapshot of the manifest,
organized by subdirectory with summary counts. It is regenerated by the pack maintainer after
any status-changing PR merges. In v1 this regeneration is manual; the generation script is
embedded in that document.

The git history on `intel-refs/MANIFEST.json` is the audit trail for all status changes. Each
status bump appears as a discrete commit (one per curation PR) with the PR author, reviewer
name, and sign-off date in the PR description associated with that commit. To see when a ref
last changed state, use `git log -p -- intel-refs/MANIFEST.json` and filter by the ref path.

---

## How status changes propagate `[Maintainer]`

When a PR bumps `curation_status` in the manifest:

1. The validator (`tools/ci/validate-manifest.sh`) confirms the new value is one of
   `scaffold | partial | curated`. Any other value causes a `vfail` and blocks CI.
2. The PR description must include the reviewer name and their sign-off date for any `partial`
   or `curated` bump. The maintainer confirms this before merging.
3. After merge, the maintainer regenerates `REF-CURATION-STATUS.md` from the manifest using
   the generation script in that document, then commits the updated snapshot.
4. The pack version in `package.json` is NOT bumped. `curation_status` is governance metadata,
   not pack content; consumers do not need to re-pin for status changes.

---

## What this framework does NOT cover

- **Initial ref scaffolding.** The process for adding a new ref file, writing its frontmatter,
  and registering it in the manifest is covered by
  [ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md).
- **Customer overlay creation.** Customer-specific tradecraft adaptations live in customer
  overlays, not in `intel-refs/`. That process is covered by
  [ADDING-A-CUSTOMER-OVERLAY.md](ADDING-A-CUSTOMER-OVERLAY.md).
- **Reclassification beyond UNCLASSIFIED.** Handling refs that need to carry classification
  markings above UNCLASSIFIED is out of scope for v1 per spec §16 O-05. If a topic cannot be
  addressed at UNCLASSIFIED, the ref stays at `scaffold` with a note.
- **Programmatic freshness enforcement.** The 12-month auto-downgrade from `curated` to
  `partial` described in the quality bars section is policy, not validator behavior in v1.
  Enforcement is manual. Automated enforcement is a future enhancement.
- **SME assignment as an organizational process.** This framework hosts the workflow once SMEs
  are assigned. The process for deciding who owns which discipline — hiring, onboarding, role
  assignment — is outside the scope of this document.
