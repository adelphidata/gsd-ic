const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { wireHooks } = require('../../bin/lib/gsd-ic/wire-hooks.cjs');

function tmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `gsd-ic-wire-hooks-${label}-`));
}

const IC_HOOK_NAMES = [
  'gsd-classification-banner.js',
  'gsd-classified-leak-detector.js',
  'gsd-prompt-injection-scan-intel.js',
];

describe('wireHooks', () => {
  it('creates .claude/settings.json with IC-pack hooks if missing', () => {
    const target = tmp('new');
    wireHooks({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    assert.ok(Array.isArray(s.hooks?.PostToolUse));
    const cmds = s.hooks.PostToolUse.flatMap((e) => (e.hooks || []).map((h) => h.command || ''));
    for (const name of IC_HOOK_NAMES) {
      assert.ok(cmds.some((c) => c.includes(name)), `expected ${name} in PostToolUse commands`);
    }
  });

  it('preserves existing non-IC hooks during install', () => {
    const target = tmp('existing');
    fs.mkdirSync(path.join(target, '.claude'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/settings.json'), JSON.stringify({
      hooks: {
        PostToolUse: [
          { matcher: 'Write|Edit', hooks: [{ type: 'command', command: 'node ~/.claude/hooks/some-other-hook.js' }] },
        ],
      },
      otherKey: { kept: true },
    }));
    wireHooks({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    assert.equal(s.otherKey.kept, true);
    const cmds = s.hooks.PostToolUse.flatMap((e) => (e.hooks || []).map((h) => h.command || ''));
    assert.ok(cmds.some((c) => c.includes('some-other-hook.js')));
    for (const name of IC_HOOK_NAMES) {
      assert.ok(cmds.some((c) => c.includes(name)));
    }
  });

  it('is idempotent — re-running does not duplicate IC entries', () => {
    const target = tmp('reinstall');
    wireHooks({ target });
    wireHooks({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    const cmds = s.hooks.PostToolUse.flatMap((e) => (e.hooks || []).map((h) => h.command || ''));
    for (const name of IC_HOOK_NAMES) {
      const count = cmds.filter((c) => c.includes(name)).length;
      assert.equal(count, 1, `${name} appears ${count} times after re-install (expected 1)`);
    }
  });

  it('records __gsd_ic.managed_hooks metadata', () => {
    const target = tmp('meta');
    wireHooks({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    assert.ok(Array.isArray(s.__gsd_ic?.managed_hooks));
    assert.equal(s.__gsd_ic.managed_hooks.length, IC_HOOK_NAMES.length);
  });
});
