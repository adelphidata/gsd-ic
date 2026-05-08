const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { installPack } = require('../../bin/lib/gsd-ic/install-pack.cjs');
const { wireOverlay } = require('../../bin/lib/gsd-ic/wire-overlay.cjs');
const { wireHooks } = require('../../bin/lib/gsd-ic/wire-hooks.cjs');
const { uninstall } = require('../../bin/lib/gsd-ic/uninstall.cjs');

function tmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `gsd-ic-uninstall-${label}-`));
}

function makePackSource() {
  const src = tmp('src');
  fs.writeFileSync(path.join(src, 'VERSION'), 'pack: 0.1.0\ngsd_pinned: 1.39.0\n');
  fs.mkdirSync(path.join(src, 'agents'), { recursive: true });
  fs.writeFileSync(path.join(src, 'agents/gsd-x.md'),
    '---\nic_pack: true\nclassification: UNCLASSIFIED\n---\n## X COMPLETE\n');
  fs.mkdirSync(path.join(src, 'hooks/patterns'), { recursive: true });
  fs.writeFileSync(path.join(src, 'hooks/gsd-test-hook.js'), '// ic_pack: true\nmodule.exports = {};\n');
  fs.writeFileSync(path.join(src, 'hooks/patterns/p.json'), '{"patterns":[]}');
  fs.mkdirSync(path.join(src, 'intel-refs'), { recursive: true });
  fs.writeFileSync(path.join(src, 'intel-refs/MANIFEST.json'), '{"version":"2026.05","topics":{}}');
  fs.mkdirSync(path.join(src, 'config-overlays/nga'), { recursive: true });
  fs.writeFileSync(path.join(src, 'config-overlays/nga/overlay.json'),
    JSON.stringify({ customer: 'nga', agent_skills: { 'gsd-x': ['.claude/skills/y'] } }));
  return src;
}

function fullInstall(target, customer) {
  const packSource = makePackSource();
  installPack({ packSource, target, customer });
  wireOverlay({ packSource, target, customer });
  wireHooks({ target });
}

describe('uninstall', () => {
  it('removes IC-pack agents but preserves stock agents', () => {
    const target = tmp('agents');
    fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/agents/gsd-stock.md'), 'stock content (no ic_pack frontmatter)');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-x.md')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-x.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-stock.md')), true);
  });

  it('removes IC-pack hooks + patterns but preserves stock hooks', () => {
    const target = tmp('hooks');
    fs.mkdirSync(path.join(target, '.claude/hooks'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/hooks/gsd-stock.js'), '// stock content (no ic_pack marker)');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-test-hook.js')), true);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/patterns/p.json')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-test-hook.js')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/patterns')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-stock.js')), true);
  });

  it('removes intel-refs entirely', () => {
    const target = tmp('refs');
    fullInstall(target, 'nga');
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs/MANIFEST.json')), true);
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs')), false);
  });

  it('removes config-overlays/<customer>/ but not other customers', () => {
    const target = tmp('overlay');
    fullInstall(target, 'nga');
    fs.mkdirSync(path.join(target, '.claude/config-overlays/nsa'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/config-overlays/nsa/overlay.json'), '{"customer":"nsa"}');
    uninstall({ target });
    assert.equal(fs.existsSync(path.join(target, '.claude/config-overlays/nga')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/config-overlays/nsa')), true);
  });

  it('removes IC-pack hooks from settings.json but preserves other hooks', () => {
    const target = tmp('settings');
    fs.mkdirSync(path.join(target, '.claude'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/settings.json'), JSON.stringify({
      hooks: {
        PostToolUse: [
          { matcher: 'Write|Edit', hooks: [{ type: 'command', command: 'node ~/.claude/hooks/some-other.js' }] },
        ],
      },
      otherKey: { kept: true },
    }));
    fullInstall(target, 'nga');
    uninstall({ target });
    const s = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    const cmds = (s.hooks?.PostToolUse || []).flatMap((e) => (e.hooks || []).map((h) => h.command || ''));
    assert.ok(cmds.some((c) => c.includes('some-other.js')), 'pre-existing hook preserved');
    assert.ok(!cmds.some((c) => c.includes('gsd-classification-banner')), 'IC-pack hook entry removed');
    assert.equal(s.__gsd_ic, undefined);
    assert.equal(s.otherKey.kept, true);
  });

  it('removes IC-pack metadata from .planning/config.json but preserves other keys', () => {
    const target = tmp('config');
    fs.mkdirSync(path.join(target, '.planning'), { recursive: true });
    fs.writeFileSync(path.join(target, '.planning/config.json'), JSON.stringify({
      workflow: { auto_advance: true },
      agent_skills: { 'gsd-planner': ['.claude/skills/some-stock-skill'] },
    }));
    fullInstall(target, 'nga');
    uninstall({ target });
    const cfg = JSON.parse(fs.readFileSync(path.join(target, '.planning/config.json'), 'utf8'));
    assert.equal(cfg.workflow.auto_advance, true);
    assert.deepEqual(cfg.agent_skills['gsd-planner'], ['.claude/skills/some-stock-skill']);
    assert.equal(cfg.agent_skills['gsd-x'], undefined, 'IC-pack agent_skills entry removed');
    assert.equal(cfg.__gsd_ic, undefined);
  });

  it('preserves program-owned files (.planning/intel-context.md)', () => {
    const target = tmp('preserve');
    fs.mkdirSync(path.join(target, '.planning'), { recursive: true });
    fs.writeFileSync(path.join(target, '.planning/intel-context.md'), 'PROGRAM CONTEXT');
    fullInstall(target, 'nga');
    uninstall({ target });
    assert.equal(fs.readFileSync(path.join(target, '.planning/intel-context.md'), 'utf8'), 'PROGRAM CONTEXT');
  });

  it('is idempotent — uninstall on a non-installed target is no-op', () => {
    const target = tmp('clean');
    // Should not throw.
    uninstall({ target });
    // Re-running should also not throw.
    uninstall({ target });
  });
});
