<!-- CLASSIFICATION: UNCLASSIFIED -->
# Reference Curation Status (auto-snapshot from MANIFEST.json)

## Summary counts

| State | Count | % |
|---|---|---|
| scaffold | 22 | 61% |
| partial | 6 | 17% |
| curated | 8 | 22% |
| **total** | **36** | 100% |

Last regenerated: 2026-05-11

## By subdirectory

### int-disciplines/ (10)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `int-disciplines/cybint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-10 |
| `int-disciplines/finint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-10 |
| `int-disciplines/geoint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-07 |
| `int-disciplines/humint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-07 |
| `int-disciplines/masint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-10 |
| `int-disciplines/medint.md` | partial | intel-pack@adelphi.ai | 2026-05-11 |
| `int-disciplines/osint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-10 |
| `int-disciplines/sigint.md` | scaffold | intel-pack@adelphi.ai | 2026-05-10 |
| `int-disciplines/techint.md` | partial | intel-pack@adelphi.ai | 2026-05-11 |
| `int-disciplines/techsigint.md` | partial | intel-pack@adelphi.ai | 2026-05-11 |

### tradecraft/ (13)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `tradecraft/ato-document-suite.md` | curated | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/ato-process-overview.md` | curated | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/cmmc-2.0.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/dfars-252-204-7012.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/eo-14028.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/fips-140-3.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/icd-203.md` | scaffold | intel-pack@adelphi.ai | 2026-05-07 |
| `tradecraft/icd-206.md` | curated | intel-pack@adelphi.ai | 2026-05-11 |
| `tradecraft/itar-ear.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/nist-800-171.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/nist-800-53-rev5.md` | scaffold | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/poam-format.md` | partial | intel-pack@adelphi.ai | 2026-05-09 |
| `tradecraft/words-of-estimative-probability.md` | curated | intel-pack@adelphi.ai | 2026-05-11 |

### capability-patterns/ (2)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `capability-patterns/entity-resolution.md` | scaffold | intel-pack@adelphi.ai | 2026-05-07 |
| `capability-patterns/pattern-of-life.md` | scaffold | intel-pack@adelphi.ai | 2026-05-07 |

### ecosystem/ (5)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `ecosystem/cia.md` | scaffold | intel-pack@adelphi.ai | 2026-05-08 |
| `ecosystem/dia.md` | scaffold | intel-pack@adelphi.ai | 2026-05-08 |
| `ecosystem/nga.md` | scaffold | intel-pack@adelphi.ai | 2026-05-08 |
| `ecosystem/nro.md` | scaffold | intel-pack@adelphi.ai | 2026-05-08 |
| `ecosystem/nsa.md` | scaffold | intel-pack@adelphi.ai | 2026-05-08 |

### house-style/ (3)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `house-style/briefs.md` | curated | intel-pack@adelphi.ai | 2026-05-12 |
| `house-style/proposals.md` | curated | intel-pack@adelphi.ai | 2026-05-12 |
| `house-style/white-papers.md` | curated | intel-pack@adelphi.ai | 2026-05-12 |

### ai-ml/ (1)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `ai-ml/eval-patterns.md` | partial | intel-pack@adelphi.ai | 2026-05-13 |

### classification/ (1)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `classification/aws-partitions.md` | curated | intel-pack@adelphi.ai | 2026-05-13 |

### modernization/ (1)

| Path | curation_status | owner | last_reviewed |
|---|---|---|---|
| `modernization/modernization-themes.md` | partial | intel-pack@adelphi.ai | 2026-05-11 |

## Generation script

Run the following to regenerate the per-subdirectory table bodies from the manifest. v1 does not automate this step — maintainers run it on any PR merge that touches `curation_status` fields, then paste the output into the sections above.

```bash
jq -r '
  .topics | to_entries | sort_by(.key) |
  group_by(.key | split("/")[0]) |
  .[] |
  "\n### " + (.[0].key | split("/")[0]) + "/ (" + (length | tostring) + ")\n" +
  "\n| Path | curation_status | owner | last_reviewed |\n|---|---|---|---|\n" +
  (map("| `" + .key + "` | " + (.value.curation_status // "—") + " | " + .value.owner + " | " + .value.last_reviewed + " |") | join("\n"))
' intel-refs/MANIFEST.json
```
