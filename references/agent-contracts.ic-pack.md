<!-- CLASSIFICATION: UNCLASSIFIED -->
# IC Pack Agent Contracts (Completion Marker Registry)

This file is the IC-pack-specific completion-marker registry, loaded alongside upstream `references/agent-contracts.md`. Every IC pack agent's completion marker is registered here.

Format (one row per agent):

```
| agent | completion-marker | failure-marker (if any) | output artifact |
```

## Registry

| agent | completion-marker | failure-marker | output artifact |
|---|---|---|---|
| gsd-customer-context-mapper | ## CONTEXT MAPPING COMPLETE | ## CONTEXT MAPPING BLOCKED | `.planning/intel-context.md` |

(populated as agents land across Plans 1–8 — see Appendix D of the design spec for the full target list)
