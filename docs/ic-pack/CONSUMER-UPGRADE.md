<!-- CLASSIFICATION: UNCLASSIFIED -->
# Consumer-Side Upgrade: Bumping the Installed Pack Version

## When to upgrade

Upgrade the installed IC pack when:

- **A new IC pack release ships.** Watch the Adelphi internal distribution channel for new tarball releases, or the dev repo release notes.
- **Upstream GSD ships a security update** that the IC pack pins to. Check `gsd_pinned` in the new pack's `VERSION` file to confirm the upstream pin has moved.
- **The active customer overlay changes** (rare — should match the program's actual IC customer; see Step 3).

The install is idempotent: running `install` with the same `--customer=` replaces all pack-managed content and re-wires hooks without touching program-owned files.

---

## Step 1: Pre-upgrade snapshot

```bash
cd /path/to/your/program
git status                              # confirm clean working tree
git tag pre-upgrade-$(date +%Y-%m-%d)  # optional rollback tag
```

Note the current pack version and customer before proceeding — both are recorded in `.planning/config.json` under the `__gsd_ic` block (`customer`, `pack_version`, `installed_at`). The install overwrites pack-managed paths; uncommitted changes under those paths will be lost.

---

## Step 2: Re-run the install

Run with the same customer as before:

```bash
npx /path/to/adelphi-gsd-ic-<new-version>.tgz install --customer=<same-customer-as-before>
```

Pin to a specific version if you need a controlled rollout:

```bash
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<customer>
```

**Idempotency guarantee:** re-running with the same `--customer=` is safe. Pack-managed paths (agents, hooks, skills, intel-refs, config-overlays, agent-contracts registry) are replaced. Program-owned files are never touched.

---

## Step 3: Switching customer (only if needed)

If the target program's IC customer is changing (rare):

```bash
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<new-customer> --confirm-customer-switch
```

The `--confirm-customer-switch` flag is required when `--customer=` differs from the customer recorded in `.planning/config.json` `__gsd_ic.customer`. Without it the installer exits with code 4 to prevent accidental overlay swaps.

Valid customers: `cia`, `dia`, `nga`, `nro`, `nsa`.

---

## Step 4: Post-upgrade verification

```bash
ls .claude/agents/gsd-*.md | wc -l          # expect 58 IC-pack agents + stock GSD agents
grep -c "gsd-classification-banner" .claude/settings.json   # expect ≥1 (hooks wired)
```

Spot-check the installed version:

```bash
cat .planning/config.json | grep -A4 '"__gsd_ic"'
```

If agents are missing or hooks are not registered, consult [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

## What's preserved across upgrades

**Preserved (program-owned — never overwritten):**

| Path | Contents |
|---|---|
| `.planning/intel-context.md` | Your program context |
| `.planning/intel-gates.json` | Your gate enablement edits |
| `.claude/settings.json` non-IC sections | Program tool permissions, model config, etc. |
| All other files outside managed paths | Customer data, program docs, etc. |

**Replaced on every upgrade (pack-managed):**

| Path | Contents |
|---|---|
| `.claude/agents/gsd-*.md` | IC-pack agents (58 files) |
| `.claude/hooks/` | IC-pack hooks + pattern catalogs |
| `.claude/skills/` | IC-pack skills (5 named skills) |
| `.claude/intel-refs/` | INT-discipline and tradecraft refs |
| `.claude/config-overlays/<customer>/` | Active customer overlay |
| `.claude/references/agent-contracts.ic-pack.md` | Agent contract registry |

Hook registrations in `.claude/settings.json` are re-wired on each install; the IC-managed entries are replaced while non-IC entries are left untouched.

---

## Rollback

```bash
# Option 1 — revert via git tag (recommended if tag was captured above)
git checkout pre-upgrade-<date>

# Option 2 — install a specific older version
npx /path/to/adelphi-gsd-ic-<older-version>.tgz install --customer=<customer>

# Option 3 — full uninstall + re-install
npx /path/to/adelphi-gsd-ic-<version>.tgz uninstall
npx /path/to/adelphi-gsd-ic-<target-version>.tgz install --customer=<customer>
```
