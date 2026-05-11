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
