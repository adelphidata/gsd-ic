---
classification: UNCLASSIFIED
title: GEOINT — Geospatial Intelligence
topic_id: int-disciplines/geoint
---

# GEOINT — Geospatial Intelligence

> **Phase 0 scaffold.** Full SME curation deferred to pre-rollout per spec §15.1.1.

GEOINT is the analysis and visual representation of security-related activities on the earth, integrating IMINT (imagery), GIS (geographic information), MASINT-overlap, and GEOSPATIAL-INFORMATION sources. It is the largest INT discipline by data volume and the primary domain of the National Geospatial-Intelligence Agency (NGA).

## Sub-disciplines / formats

- **IMINT** — National Technical Means + commercial imagery; EO, IR, SAR, hyperspectral.
- **FMV** — Full-Motion Video from airborne ISR (ScanEagle, Predator/Reaper class, Group 5 UAS).
- **STANAG 4609** — NATO motion-imagery standard; defines metadata streams for FMV.
- **NITF** — National Imagery Transmission Format; the legacy still-imagery container.
- **KML / GeoJSON** — vector annotation formats.
- **MGRS** — Military Grid Reference System; the standard coordinate system for ground operations.
- **GeoTIFF** — common georeferenced raster format.

## Authoritative sources

- NGA Standardization Documents (NSDs) — public catalog at nga.mil.
- STANAG 4609 — *Motion Imagery Standard* (NATO).
- ICD 113 — *Functional Managers for IMINT/GEOINT* (DNI).
- DoDI 5105.60 — *National Geospatial-Intelligence Agency (NGA)* (DoD).

## Cross-references

- `capability-patterns/pattern-of-life.md` — POL analysis is GEOINT-FMV's primary analytic mode.
- `capability-patterns/entity-resolution.md` — geo-temporal entity resolution.

## Pack engineering notes

- Coordinate systems vary; engineers writing geocoding code MUST normalize to MGRS or WGS84 lat/lon at API boundaries; never mix.
- Imagery files often carry classified metadata even when the imagery itself is open-source. Treat NITF/GeoTIFF metadata as classification-pending until checked.
- Public mapping APIs (Google Maps, OpenStreetMap) are dev-time conveniences only; production geocoding for IC programs must use authorized providers.
