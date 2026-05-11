<!-- CLASSIFICATION: UNCLASSIFIED -->
# Adding a Customer Overlay to the Catalog

Customer overlays live in `config-overlays/<slug>/` and let the install CLI wire
customer-specific `agent_skills` into a program's `.planning/config.json` at
install time. This doc walks through adding a new overlay end-to-end.

---

## Decide: do you really need a new overlay?

The catalog ships five overlays: `cia`, `dia`, `nga`, `nro`, `nsa`. A new overlay
is justified when a new IC customer — or a major sub-org with distinct tradecraft,
skills, or ref wiring — adopts the pack. Per spec §2.3, one program = one customer
overlay; exactly one is active per installed instance. Sub-customer differences
within one IC element (different offices, different programs) do **not** warrant a
new overlay — handle those in `.planning/intel-context.md` instead.

---

## Step 1: Pick the customer slug

The slug is the value passed to `--customer=<slug>` at install time:

- Lowercase ASCII, 2–6 characters, no hyphens or underscores.
- Match the IC element's standard abbreviation. The five shipped slugs (`cia`,
  `dia`, `nga`, `nro`, `nsa`) are 3-char IC element abbreviations — follow that
  pattern. The slug becomes a directory name, a JSON key, and a CLI flag value.

---

## Step 2: Create the overlay directory

```bash
mkdir -p config-overlays/<slug>
mkdir -p config-overlays/<slug>/refs   # only if shipping customer-specific refs
```

The directory name must match the slug exactly.

---

## Step 3: Write overlay.json

Create `config-overlays/<slug>/overlay.json`. The schema has exactly two fields —
verified against all five shipped overlays and `bin/lib/gsd-ic/wire-overlay.cjs`
(the source of truth):

```json
{
  "customer": "<slug>",
  "agent_skills": {
    "gsd-<agent-name>": [
      ".claude/skills/<skill-name>",
      "config-overlays/<slug>/refs/<ref-topic>"
    ]
  }
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `customer` | string | yes | Must match the slug exactly. |
| `agent_skills` | object | yes | Agent-name → skill/ref path array. May be `{}`. |

**Do not add extra fields.** `wire-overlay.cjs` only reads `customer` (switch-guard)
and `agent_skills`. Fields like `version`, `agent_refs`, or `intel_context_template`
are not used by the code and will be ignored.

See spec [§8.3](../specs/2026-05-05-ic-agent-pack-design.md#line-595) for the
catalog structure and a worked example.

---

## Step 4: (Optional) Add customer-specific refs

Place additional reference docs at `config-overlays/<slug>/refs/<topic>.md` using
the same frontmatter conventions as `intel-refs/` (see
[ADDING-A-REFERENCE.md](ADDING-A-REFERENCE.md)).

`copyOverlay()` in `bin/lib/gsd-ic/install-pack.cjs` copies the entire
`config-overlays/<slug>/` tree — including `refs/` — to
`.claude/config-overlays/<slug>/` in the target program. These refs are available
on disk after install but are **not** automatically injected into `agent_skills`;
wire them explicitly in `overlay.json` to activate them. They add to `intel-refs/`
content; they do not replace anything from the base pack.

---

## Step 5: Register the slug in the install CLI

Open `bin/lib/gsd-ic/parse-args.cjs` and add the slug to `KNOWN_CUSTOMERS` (line 4):

```javascript
// Before
const KNOWN_CUSTOMERS = new Set(['nga', 'nsa', 'nro', 'cia', 'dia']);

// After
const KNOWN_CUSTOMERS = new Set(['nga', 'nsa', 'nro', 'cia', 'dia', '<new-slug>']);
```

Without this the CLI exits with code 2: `unknown customer "<slug>"`. `KNOWN_CUSTOMERS`
is exported and auto-populates the `--help` USAGE string — no other edits needed.

**Customer-switch guard:** re-running install with a different `--customer` fails
unless `--confirm-customer-switch` is passed (handled in `bin/gsd-ic-install.js`
line 62 via `wire-overlay.cjs`). No action needed when adding a new overlay, but
inform programs that migrate between slugs.

---

## Step 6: Validate

```bash
npm test                                   # unit + install-flow tests
npm run test:install                       # install-flow tests only
bash tools/ci/validate-publish-scope.sh   # confirms the overlay directory is in the package
```

The existing `"config-overlays/"` glob in `package.json` `files[]` covers new
subdirectories automatically; verify if `validate-publish-scope.sh` fails.

---

## Step 7: Test the install end-to-end

```bash
npm pack   # produces adelphi-gsd-ic-<version>.tgz in the repo root

mkdir -p /tmp/test-overlay-install
cd /tmp/test-overlay-install
npx get-shit-done-cc@latest   # base GSD must be installed first
npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<new-slug>
```

Verify the result:

```bash
ls .claude/agents/gsd-*.md | wc -l          # expect ~58
ls .claude/config-overlays/<new-slug>/       # overlay files present
cat .planning/config.json                    # __gsd_ic block: customer, pack_version, installed_at
```

The install record is written to `.planning/config.json` by `wire-overlay.cjs`
(there is no separate install-manifest file). Confirm `"customer": "<new-slug>"`.

---

## Step 8: Commit + ship

```bash
git add config-overlays/<slug>/ bin/lib/gsd-ic/parse-args.cjs
git commit -m "config-overlays: add <slug> overlay"
```

Bump the `pack:` field in `VERSION` per the minor/patch policy in `VERSIONING.md`
at next release. The overlay is inert until a program runs
`npx /path/to/adelphi-gsd-ic-<version>.tgz install --customer=<slug>`.

---

## Reference: overlay schema

Spec [§8.3](../specs/2026-05-05-ic-agent-pack-design.md#line-595) (line 595 of the spec)
documents the overlay structure and a worked example.

**Source of truth: the code.** `bin/lib/gsd-ic/wire-overlay.cjs` is authoritative
over the spec. The two load-bearing fields are `customer` and `agent_skills`;
anything else in the JSON is unused at install time. An empty `agent_skills` map
(`{}`) is valid — it means no skill wiring is applied for this customer.
