'use strict';

const fs = require('fs');
const path = require('path');

const IC_HOOKS = [
  { name: 'gsd-classification-banner.js',     event: 'PostToolUse', matcher: 'Write|Edit' },
  { name: 'gsd-classified-leak-detector.js',  event: 'PostToolUse', matcher: 'Write|Edit' },
  { name: 'gsd-prompt-injection-scan-intel.js', event: 'PostToolUse', matcher: 'Write|Edit' },
];

function readSettings(target) {
  const p = path.join(target, '.claude/settings.json');
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { throw new Error(`malformed settings.json at ${p}: ${e.message}`); }
}

function writeSettings(target, settings) {
  const dir = path.join(target, '.claude');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'settings.json'), JSON.stringify(settings, null, 2) + '\n');
}

function isIcHookCommand(cmd) {
  return IC_HOOKS.some((h) => cmd && cmd.includes(h.name));
}

function wireHooks({ target }) {
  const settings = readSettings(target);
  settings.hooks = settings.hooks || {};

  // Strip previously-managed IC entries so re-install is idempotent.
  for (const event of new Set(IC_HOOKS.map((h) => h.event))) {
    const arr = settings.hooks[event] || [];
    settings.hooks[event] = arr
      .map((entry) => {
        if (!entry || !Array.isArray(entry.hooks)) return entry;
        const filtered = entry.hooks.filter((h) => !isIcHookCommand(h.command));
        if (filtered.length === entry.hooks.length) return entry;
        if (filtered.length === 0) return null;
        return { ...entry, hooks: filtered };
      })
      .filter(Boolean);
  }

  // Add fresh IC entries.
  const managed_hooks = [];
  for (const h of IC_HOOKS) {
    settings.hooks[h.event] = settings.hooks[h.event] || [];
    settings.hooks[h.event].push({
      matcher: h.matcher,
      hooks: [{ type: 'command', command: `node ${path.join(target, '.claude/hooks', h.name)}` }],
    });
    managed_hooks.push(h.name);
  }

  settings.__gsd_ic = settings.__gsd_ic || {};
  settings.__gsd_ic.managed_hooks = managed_hooks;
  settings.__gsd_ic.hooks_wired_at = new Date().toISOString();

  writeSettings(target, settings);
}

module.exports = { wireHooks, IC_HOOKS };
