const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { verifyGsd } = require('../../bin/lib/gsd-ic/verify-gsd.cjs');

function tmp(label) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `gsd-ic-verify-${label}-`));
  return dir;
}

describe('verifyGsd', () => {
  // -- Realistic Claude-runtime stock GSD layout ---------------------------
  // Upstream `bin/install.js` (line 8177-8178) installs Claude runtime
  // commands to `.claude/commands/gsd/` and agents to `.claude/agents/`.
  // Neither `.claude/skills/gsd-*` nor `commands/gsd/` (target-root) is
  // populated for Claude. These two probes are the primary detection path
  // for real consumers on Claude runtime.

  it('returns ok=true when target has .claude/agents/gsd-*.md (Claude runtime — primary)', () => {
    const target = tmp('claude-agents');
    fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/agents/gsd-planner.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'claude-agents');
  });

  it('returns ok=true when target has .claude/commands/gsd/ (Claude runtime — secondary)', () => {
    const target = tmp('claude-commands');
    fs.mkdirSync(path.join(target, '.claude/commands/gsd'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/commands/gsd/help.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'claude-commands');
  });

  it('agents probe takes priority over commands probe when both present (realistic stock layout)', () => {
    // A real `npx get-shit-done-cc@latest` install writes BOTH paths. Verify
    // the more reliable agents probe wins, so the detected label is stable
    // across stock GSD's per-runtime install variations.
    const target = tmp('realistic');
    fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/agents/gsd-planner.md'), '');
    fs.mkdirSync(path.join(target, '.claude/commands/gsd'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/commands/gsd/help.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'claude-agents');
  });

  // -- Non-Claude runtime layouts ------------------------------------------

  it('returns ok=true when target has .codex/skills/gsd-* (Codex runtime)', () => {
    const target = tmp('codex');
    fs.mkdirSync(path.join(target, '.codex/skills/gsd-help'), { recursive: true });
    fs.writeFileSync(path.join(target, '.codex/skills/gsd-help/SKILL.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'modern-skills-codex');
  });

  it('returns ok=true when target has .claude/skills/gsd-* (Augment-style nested skills — back-compat)', () => {
    const target = tmp('modern');
    fs.mkdirSync(path.join(target, '.claude/skills/gsd-help'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/skills/gsd-help/SKILL.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'modern-skills');
  });

  it('returns ok=true when target has commands/gsd/ at root (legacy layout)', () => {
    const target = tmp('legacy');
    fs.mkdirSync(path.join(target, 'commands/gsd'), { recursive: true });
    fs.writeFileSync(path.join(target, 'commands/gsd/help.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, true);
    assert.equal(r.detected, 'legacy-commands');
  });

  // -- Negative cases ------------------------------------------------------

  it('returns ok=false when no GSD signals found', () => {
    const target = tmp('empty');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, false);
    assert.match(r.reason, /not detected/i);
  });

  it('returns ok=false when target dir does not exist', () => {
    const r = verifyGsd({ target: '/path/that/does/not/exist/anywhere', gsdPinned: '1.50.0' });
    assert.equal(r.ok, false);
  });

  it('returns ok=false when .claude/agents exists but contains no gsd-* files', () => {
    // Regression guard: probes match prefix+suffix, not just directory existence.
    const target = tmp('empty-agents');
    fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.claude/agents/custom-agent.md'), '');
    const r = verifyGsd({ target, gsdPinned: '1.50.0' });
    assert.equal(r.ok, false);
  });
});
