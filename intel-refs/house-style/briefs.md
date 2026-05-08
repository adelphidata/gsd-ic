---
classification: UNCLASSIFIED
owner: intel-pack@adelphi.ai
last_reviewed: 2026-05-12
applies_when: [capability brief, milestone brief, slides, marp, slide deck, briefing, customer brief, audience adaptation]
---

# IC Brief Templates

This reference covers the slide-deck brief format used across IC customer engagements. Briefs follow a dual-format Markdown convention: readable as plain Markdown in any editor AND convertible to a polished slide deck via `marp-cli` without modification. The convention relies on Marp-compatible front-matter and slide-break markers (`---`) between slides. `gsd-capability-brief-generator` (Phase 4) and `gsd-milestone-brief-generator` (Phase 6) both consume this ref to produce conformant output.

## Marp Front-Matter Pattern

Every brief file that targets slide output opens with:

```yaml
---
marp: true
theme: default
paginate: true
---
```

Each `---` separator in the body becomes a slide boundary. Speaker notes embed inline: `<!-- _notes: ... -->`.

## Slide Templates

### 1. Title Slide

**Purpose.** Orients the room: capability name, audience, date, classification, and presenter. One clean visual — no bullets.

```markdown
# [Capability Name]
**Audience:** [e.g., NGA Analytics Division — PM + Technical Leads]
**Date:** [YYYY-MM-DD] | **Presenter:** [Name, Title, Org]
**Classification:** UNCLASSIFIED // FOUO
<!-- _notes: Open with a single-sentence mission-gap hook before advancing. -->
```

**Audience-tailoring note.** For executive audiences, replace the subtitle with the mission outcome the capability enables — not the system name.

### 2. Agenda Slide

**Purpose.** Sets expectations for the meeting arc: mission framing, capability claim, demo, discussion, ask, next steps. Tailor depth to available time.

```markdown
## Agenda
- Mission gap: where the current stack falls short
- What we built and what it proves
- Live demonstration
- Integration pathway and timeline
- What we are asking for today
<!-- _notes: Acknowledge time box upfront. Offer to skip to demo if the audience already knows the gap. -->
```

**Audience-tailoring note.** For PM-side meetings, front-load the ask and timeline bullets — they often have a hard stop and need the decision item early.

### 3. Mission Framing Slide

**Purpose.** Grounds the capability in a documented gap before any product claim. Source the gap statement from `.planning/MISSION-GAP.md`; do not generalize.

```markdown
## The Gap
> "[Verbatim or lightly edited gap statement from MISSION-GAP.md]"
**Current state:** [What analysts do today — manual steps, latency, error rate]
**Cost of the gap:** [Operational consequence — missed windows, decision lag]
<!-- _notes: If the customer validated the gap statement, name them. Credibility compounds when they recognize their own language. -->
```

**Audience-tailoring note.** Mission-Tactical audiences respond to operational consequence metrics. Executives respond to risk framing. Technical audiences want the current-state architecture diagram.

### 4. Capability Claim Slide

**Purpose.** States what was built and what the evidence shows. Claims must be defensible — cite artifact types, not adjectives.

```markdown
## What We Built
- **Core capability:** [One sentence anchored to the gap]
- **Key differentiator:** [What makes this approach distinct]
- **Evidence:** [Metric 1 — e.g., "40% triage-time reduction on NGA reference dataset"]
  - [Metric 2 — integration proof]; [Metric 3 — compliance gate passed]
<!-- _notes: Do not cite metrics you cannot reproduce on demand. Have supporting artifact links ready. -->
```

**Audience-tailoring note.** Technical audiences want architecture depth — consider a companion diagram slide. Executives need the lead metric in the headline.

### 5. Demo Placeholder Slide

**Purpose.** Marks the transition into the live or recorded demonstration. All demo logic lives in `.planning/demos/{name}-DEMO-SCRIPT.md`.

```markdown
## Demonstration
**Script:** `.planning/demos/{capability-name}-DEMO-SCRIPT.md`
[Screenshot or video thumbnail]
*Fallback: recorded walkthrough at [link or path] if live environment is unavailable.*
<!-- _notes: Run the pre-demo checklist 30 min prior. If something breaks, walk the screenshot verbally — keep narrative momentum. -->
```

**Audience-tailoring note.** For analyst-side meetings, prioritize workflow interaction over architecture animations. Technical audiences benefit from seeing the API call during the demo.

### 6. Ask Slide

**Purpose.** Makes the specific request explicit. The audience should leave knowing exactly what decision or action is being requested.

```markdown
## What We Are Asking For
- **Next phase approval:** [Specific phase name, scope, duration]
- **Follow-on funding:** [Amount or vehicle if discussable]
- **Integration support:** [Named system and POC needed]
- **Decision needed by:** [Date — tied to a real constraint]
<!-- _notes: If multiple decision-makers are present, name who owns each ask. Undivided asks go undecided. -->
```

**Audience-tailoring note.** PMs need the ask framed around program schedule and funding vehicle. Executives need it framed as a risk-reduction decision. Technical audiences may lack authority — redirect to "what do you need to recommend approval."

### 7. Next Steps and Appendix Slide

**Purpose.** Closes the meeting with concrete follow-through and points to supporting material without cluttering the main deck.

```markdown
## Next Steps
| Action | Owner | By |
|---|---|---|
| [Action 1] | [Name/Org] | [Date] |
**Risk + Mitigation:** [Top risk] — [Mitigation in place or planned]
**Supporting links:** Transition status: `.planning/TRANSITION-STATUS.md` | Evidence package: [path]
<!-- _notes: Read action items aloud before closing. Unread action items are unowned action items. -->
```

**Audience-tailoring note.** Technical audiences value a transition-architecture link in the appendix. Executives benefit from a one-line transition-status summary directly on this slide.

## Audience Variants

Select the `gsd-mission-narrative-writer` voice variant based on the primary decision-maker:

- **Technical** — Engineers, architects, data scientists. Emphasizes architecture, integration specifics, benchmarks, and failure modes. Use for analyst-side technical meetings and integration design reviews.
- **Executive** — SES, flag-equivalent, program directors. Leads with mission outcome and risk; buries mechanism. Use for executive briefings and budget hearings.
- **Mission-Tactical** — Operators, analysts, collection managers. Emphasizes workflow change and burden reduction. Use for end-user readiness reviews and pilot kickoffs.
- **Mixed rooms** — Default to Executive for Title, Agenda, and Mission Framing slides; shift to Technical for Capability Claim and Demo; return to Executive for Ask and Next Steps.

## See Also

- `house-style/white-papers.md` — long-form written artifacts using the same classification and voice conventions.
- `house-style/proposals.md` — proposal-format artifacts; complements briefs when a written deliverable accompanies the slide deck.
- `tradecraft/icd-203.md` — analytic standards that inform claim defensibility on Capability Claim and Mission Framing slides.
