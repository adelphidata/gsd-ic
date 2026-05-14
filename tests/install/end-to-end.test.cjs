const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

function tmp(label) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `gsd-ic-e2e-${label}-`));
}

const PACK_ROOT = path.resolve(__dirname, '..', '..');

// Fixture mirrors what `npx get-shit-done-cc@latest` actually writes for
// Claude runtime: `.claude/agents/gsd-*.md` and `.claude/commands/gsd/*.md`
// (see upstream bin/install.js:8177 — "Claude Code reads local project
// commands from .claude/commands/gsd/, not .claude/skills/"). Earlier
// fixtures wrote `.claude/skills/gsd-help/SKILL.md`, a layout stock GSD
// does not produce for Claude — leading to false-positive test passes that
// masked a real install bug in verifyGsd's probe paths.
function setupFakeGsdInstall(target) {
  fs.mkdirSync(path.join(target, '.claude/agents'), { recursive: true });
  fs.writeFileSync(path.join(target, '.claude/agents/gsd-planner.md'), 'stock');
  fs.mkdirSync(path.join(target, '.claude/commands/gsd'), { recursive: true });
  fs.writeFileSync(path.join(target, '.claude/commands/gsd/help.md'), 'stock');
}

function runInstall(args, opts = {}) {
  return execFileSync('node', [path.join(PACK_ROOT, 'bin/gsd-ic-install.js'), ...args], {
    encoding: 'utf8',
    cwd: opts.cwd || process.cwd(),
    env: { ...process.env, ...(opts.env || {}) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

describe('end-to-end install', () => {
  it('--help prints usage and exits 0', () => {
    const out = runInstall(['--help']);
    assert.match(out, /npx.*\.tgz.*install/);
  });

  it('errors clearly when GSD is not installed in target', () => {
    const target = tmp('no-gsd');
    assert.throws(() => runInstall(['install', '--customer=nga', `--target=${target}`]), /GSD not detected/);
  });

  it('happy path: install --customer=nga produces the expected file tree', () => {
    const target = tmp('happy');
    setupFakeGsdInstall(target);
    const out = runInstall(['install', '--customer=nga', `--target=${target}`]);
    assert.match(out, /install complete/i);
    // managed paths exist (manifest copied)
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs/MANIFEST.json')), true);
    // config.json was created/wired
    const cfg = JSON.parse(fs.readFileSync(path.join(target, '.planning/config.json'), 'utf8'));
    assert.equal(cfg.__gsd_ic.customer, 'nga');
    // .claude/settings.json was created/wired with IC-pack hooks
    const settings = JSON.parse(fs.readFileSync(path.join(target, '.claude/settings.json'), 'utf8'));
    assert.ok(Array.isArray(settings.__gsd_ic?.managed_hooks));
    assert.equal(settings.__gsd_ic.managed_hooks.length, 3);
  });

  it('errors on customer switch without --confirm-customer-switch', () => {
    const target = tmp('switch');
    setupFakeGsdInstall(target);
    runInstall(['install', '--customer=nga', `--target=${target}`]);
    assert.throws(() => runInstall(['install', '--customer=nsa', `--target=${target}`]), /customer switch/i);
  });

  it('install → uninstall round-trip leaves only stock content', () => {
    const target = tmp('roundtrip');
    setupFakeGsdInstall(target);
    runInstall(['install', '--customer=nga', `--target=${target}`]);
    // Sanity: IC-pack content is present.
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs/MANIFEST.json')), true);
    const out = runInstall(['uninstall', `--target=${target}`]);
    assert.match(out, /uninstall complete/i);
    // IC-pack content gone.
    assert.equal(fs.existsSync(path.join(target, '.claude/intel-refs')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-customer-context-mapper.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.claude/hooks/gsd-classification-banner.js')), false);
    // Stock GSD signal still present.
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-planner.md')), true);
    assert.equal(fs.existsSync(path.join(target, '.claude/commands/gsd/help.md')), true);
  });

  it('uninstall is idempotent on a non-installed target', () => {
    const target = tmp('clean-uninstall');
    setupFakeGsdInstall(target);
    // Just-set-up-stock-GSD target; never installed IC pack.
    const out = runInstall(['uninstall', `--target=${target}`]);
    assert.match(out, /uninstall complete/i);
    // Stock content still present.
    assert.equal(fs.existsSync(path.join(target, '.claude/agents/gsd-planner.md')), true);
    assert.equal(fs.existsSync(path.join(target, '.claude/commands/gsd/help.md')), true);
  });
});
