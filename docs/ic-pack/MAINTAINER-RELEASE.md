<!-- CLASSIFICATION: UNCLASSIFIED -->

# Maintainer: Cutting a Pack Release

## Audience and scope

For `gsd-ic` repo maintainers cutting a pack release. Cutting a release means:
bumping the pack version, tagging git, building the tarball, and uploading to
Adelphi's internal distribution channel.

This is distinct from upstream-sync (keeping the dev fork aligned with Claude
Code upstream), which is covered in [UPGRADE-PROCEDURE.md](UPGRADE-PROCEDURE.md).

Consumers re-installing after a release follow [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md).

---

## Prerequisites

- **Clean working tree on `main`.** `git status` must show no uncommitted
  changes. The release script aborts if the tree is dirty.
- **All validators green.** Run `npm run ci` and confirm all validators pass.
- **Write access to the internal distribution channel.** You need access before
  you begin Step 5.

---

## Step 1: Decide the version number

Pack versions use the format `YYYY.MM.N`:

- `YYYY` — four-digit year.
- `MM` — two-digit month, zero-padded (e.g. `05`).
- `N` — zero-based patch counter within the month.

The release script validates against the regex `^[0-9]{4}\.[0-9]{2}\.[0-9]+$`
and rejects any input that does not match.

| Scenario | Action |
|---|---|
| First release in a calendar month | `YYYY.MM.0` — e.g. `2026.05.0` |
| Patch release in the same month | Increment N — e.g. `2026.05.1` |
| First release in a new month | Reset N to 0, update YYYY.MM |

The script does not auto-compute the version — decide it before running.

---

## Step 2: Run the release script

From the repo root on `main`:

```bash
bash tools/release/release-pack.sh --version=YYYY.MM.N
```

Example: `bash tools/release/release-pack.sh --version=2026.05.0`

The script performs these steps in order:
1. Validates version format, aborts on mismatch.
2. Confirms working tree is clean, aborts if dirty.
3. Runs the full validator suite (`tools/ci/_run-all.sh`).
4. Bumps the `pack:` field in `VERSION`.
5. Mirrors version into `package.json`.
6. Commits both files: `[U] release: pack v<version>`.
7. Creates annotated local tag `v<version>` (not yet pushed).
8. Runs `npm pack --dry-run` and prints the file-list preview.

Review the `--dry-run` output before continuing. Confirm the listed files match
expectations and no unexpected files appear.

---

## Step 3: Push the tag

```bash
git push origin main && git push origin v<version>
```

The pushed tag is the audit trail — trace any distributed tarball back to this
tag. Do not distribute a tarball before the tag is pushed.

---

## Step 4: Build the tarball

```bash
npm pack
```

Produces `adelphi-gsd-ic-<version>.tgz` in the repo root (e.g.
`adelphi-gsd-ic-2026.05.0.tgz`). Verify the file list matches the `--dry-run`
preview from Step 2. Do not proceed if there is a discrepancy.

Do not run `npm publish`. The package is marked `"private": true`; `npm publish`
will error out. Distribution is via the internal channel, not any npm registry.

---

## Step 5: Upload to the internal distribution channel

Upload `adelphi-gsd-ic-<version>.tgz` to Adelphi's internal distribution
channel (shared drive / S3 / artifact server — exact mechanism per Adelphi
infra).

- Retain the full versioned filename. Do not rename or overwrite prior versions.
- There is no "latest" alias. Consumers install by referencing the specific
  tarball path.

Record the upload location (path, URL, or share link) for use in Step 6.

---

## Step 6: Notify consumers

Send the following to each consuming program:

- New version number and a link to the tag (`v<version>`) as the audit reference.
- Tarball location (from Step 5).
- Brief summary of what changed.

Consumers re-run install per [CONSUMER-UPGRADE.md](CONSUMER-UPGRADE.md):

```bash
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<slug>
```

---

## What the release script automates

- Version format validation (regex `^[0-9]{4}\.[0-9]{2}\.[0-9]+$`).
- Working-tree-clean check.
- Full validator suite (`tools/ci/_run-all.sh`).
- `VERSION` bump (`pack:` field) and `package.json` sync (`version` field).
- Version-bump commit (`[U] release: pack v<version>`).
- Annotated git tag `v<version>` (local only).
- `npm pack --dry-run` preview.

---

## What the release script does NOT do

- Push to remote — manual (Step 3).
- Run actual `npm pack` — only `--dry-run` is run; the real build is manual (Step 4).
- Upload the tarball — manual (Step 5).
- Notify consumers — manual (Step 6).
- Publish to any npm registry — the package is `"private": true`; `npm publish` is never called.

---

## Rollback

**Tag not yet pushed:**

```bash
git tag -d v<version>
git reset HEAD~1
```

Verify `git log` and `git status`. No remote state is affected.

**Tag already pushed:**

Coordinate with the team before deleting a remote tag. Procedure:

```bash
git push origin --delete v<version>
git tag -d v<version>
git reset HEAD~1
git push origin main --force-with-lease
```

`--force-with-lease` is safer than `--force` but still rewrites shared history.
Only proceed after confirming no other maintainer has pulled the release commit,
and notify the team immediately.
