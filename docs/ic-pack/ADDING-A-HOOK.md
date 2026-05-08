---
classification: UNCLASSIFIED
title: Adding an IC-pack hook
---

# Adding an IC-pack hook

This guide is for IC-pack contributors adding a new Claude Code hook to the pack. Hooks fire on `PostToolUse` (or other Claude Code events) and emit advisories or blocks based on tool inputs/outputs.

## When to add a hook vs. a skill vs. an agent

- **Hook** — automatic, runs on every matching tool call, sub-second budget, no LLM. Use for pattern detection, audit trails, banner stamping.
- **Skill** — behavioral injection into an agent's prompt. Use for per-agent conventions or reasoning patterns.
- **Agent** — full LLM context with multi-step reasoning. Use when the work is structured, produces an artifact, or needs decision-making.

## File layout

```
hooks/
├── gsd-<name>.js              ← the hook script (Node CommonJS)
├── patterns/
│   └── <name>-patterns.json   ← (optional) data tables consumed by the hook
└── ...
tests/hooks/
└── <name>.test.cjs            ← node:test unit tests
```

## Required hook conventions

1. **First-line marker.** Every IC-pack hook script MUST have `// ic_pack: true` in the first 10 lines. This is what `bin/lib/gsd-ic/install-pack.cjs` uses to distinguish IC-pack hooks from upstream stock hooks (which share the `gsd-` prefix). Without the marker, the hook is treated as upstream and not copied to consumer installs.

2. **Module shape.** Export a `run(payload)` function plus a CLI wrapper:
   ```javascript
   #!/usr/bin/env node
   // ic_pack: true
   // <description>
   'use strict';

   function run(payload) {
     // returns { ok: boolean, action?: string, advisory?: string, ... }
   }

   module.exports = { run /*, ...other testable helpers */ };

   // CLI entry: read JSON payload from stdin (Claude Code hook protocol), invoke run.
   if (require.main === module) {
     let raw = '';
     process.stdin.setEncoding('utf8');
     process.stdin.on('data', (c) => { raw += c; });
     process.stdin.on('end', () => {
       let payload = {};
       try { payload = raw ? JSON.parse(raw) : {}; } catch {}
       const result = run(payload);
       if (result.advisory) process.stderr.write(`${result.advisory}\n`);
       process.exit(result.blocked ? 1 : 0); // or always 0 if hook is advisory-only
     });
   }
   ```

3. **Configuration.** Read `payload.config.hooks.<your_hook_name>` for enable/disable + per-hook config. Default `enabled: true`. Provide a graceful no-op when payload omits config.

4. **Tool filtering.** Check `payload.tool` early and exit `{ ok: true, action: 'skipped' }` for irrelevant tool events. Don't waste compute on `Read` events when you only care about `Write|Edit`.

5. **Pattern catalogs (when applicable).** For data-driven hooks (regex matchers, denylist scanners, etc.), put patterns in a sibling `hooks/patterns/<name>-patterns.json`. The hook `require`s the catalog at runtime relative to its own directory.

6. **Tests.** Use `node:test`, one test file at `tests/hooks/<name>.test.cjs`. Cover: happy path, every flag-trigger condition, disabled config, irrelevant tool events. Use `fs.mkdtempSync` for fixture isolation.

## Registration steps

A new hook needs entries in three places:

### A. `package.json` `files` field

Add the explicit per-file paths:

```json
"files": [
  "hooks/gsd-<name>.js",
  "hooks/patterns/<name>-patterns.json",
  ...
]
```

NOT a `hooks/gsd-*.js` glob — that would also pull in upstream stock hooks. We use per-file listings; the trade-off is that adding a new hook requires touching `package.json`.

### B. `bin/lib/gsd-ic/wire-hooks.cjs` `IC_HOOKS` array

Add:

```javascript
const IC_HOOKS = [
  // ...existing...
  { name: 'gsd-<name>.js', event: 'PostToolUse', matcher: 'Write|Edit' },
];
```

The `matcher` field uses Claude Code's tool-name-pattern syntax (e.g., `Write|Edit`, `Write`, `*`). The `event` field is the Claude Code event name (`PostToolUse`, `PreToolUse`, `SessionStart`, etc.).

### C. (Optional) Validator extension

If the hook depends on a new file path or new convention, the validator suite (`tools/ci/validate-*.sh`) may need an update. Most hooks need no validator changes — the existing `validate-no-classified-leak`, `validate-classification`, `validate-publish-scope` already cover the common cases.

## Authoring checklist (before submitting)

- [ ] Hook file has `// ic_pack: true` marker in first 10 lines.
- [ ] Module exports `run(payload)` and a CLI wrapper.
- [ ] Config schema documented in the hook's header comment.
- [ ] Tests at `tests/hooks/<name>.test.cjs` cover happy + flagging + disabled + irrelevant-tool paths.
- [ ] Pattern catalog (if any) at `hooks/patterns/<name>-patterns.json`, valid JSON.
- [ ] `package.json` `files` updated with explicit paths.
- [ ] `bin/lib/gsd-ic/wire-hooks.cjs` `IC_HOOKS` array updated.
- [ ] `bash tools/ci/_run-all.sh` and `node --test tests/hooks/*.test.cjs tests/install/*.test.cjs` both green.
- [ ] Commit subject prefixed `[U]` per `skills/classification-conventions`.

## Reference: existing hooks

See Plan 1's three hooks for working examples:

- `hooks/gsd-classification-banner.js` — frontmatter / first-line classification reader.
- `hooks/gsd-classified-leak-detector.js` — pattern-catalog-driven scanner with severity-based blocking.
- `hooks/gsd-prompt-injection-scan-intel.js` — pattern-catalog-driven advisory.

Each uses the conventions above and has a test file at `tests/hooks/<name>.test.cjs` covering the same shapes.
