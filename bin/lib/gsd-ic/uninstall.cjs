'use strict';

const fs = require('fs');
const path = require('path');
const { IC_HOOKS } = require('./wire-hooks.cjs');
const { isIcPackAgent, isIcPackHook, IC_PACK_SKILL_NAMES } = require('./install-pack.cjs');

function rmIfExists(p) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function rmAgents(target) {
  const dir = path.join(target, '.claude/agents');
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
    const p = path.join(dir, entry.name);
    if (isIcPackAgent(p)) fs.rmSync(p);
  }
}

function rmHooks(target) {
  const dir = path.join(target, '.claude/hooks');
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name.endsWith('.js')) {
      const p = path.join(dir, entry.name);
      if (isIcPackHook(p)) fs.rmSync(p);
    }
  }
  // Pattern catalogs are IC-pack-only.
  rmIfExists(path.join(dir, 'patterns'));
}

function rmSkills(target) {
  const dir = path.join(target, '.claude/skills');
  if (!fs.existsSync(dir)) return;
  for (const skillName of IC_PACK_SKILL_NAMES) {
    rmIfExists(path.join(dir, skillName));
  }
}

function rmIntelRefs(target) {
  rmIfExists(path.join(target, '.claude/intel-refs'));
}

function rmContractRegistry(target) {
  rmIfExists(path.join(target, '.claude/references/agent-contracts.ic-pack.md'));
}

function rmOverlay(target, customer) {
  if (!customer) return;
  rmIfExists(path.join(target, '.claude/config-overlays', customer));
}

function unwireSettingsHooks(target) {
  const p = path.join(target, '.claude/settings.json');
  if (!fs.existsSync(p)) return;
  let settings;
  try { settings = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return; }
  if (settings.hooks) {
    for (const event of Object.keys(settings.hooks)) {
      const arr = settings.hooks[event] || [];
      settings.hooks[event] = arr
        .map((entry) => {
          if (!entry || !Array.isArray(entry.hooks)) return entry;
          const filtered = entry.hooks.filter((h) =>
            !IC_HOOKS.some((ich) => h.command && h.command.includes(ich.name))
          );
          if (filtered.length === entry.hooks.length) return entry;
          if (filtered.length === 0) return null;
          return { ...entry, hooks: filtered };
        })
        .filter(Boolean);
      if (settings.hooks[event].length === 0) delete settings.hooks[event];
    }
    if (Object.keys(settings.hooks).length === 0) delete settings.hooks;
  }
  delete settings.__gsd_ic;
  fs.writeFileSync(p, JSON.stringify(settings, null, 2) + '\n');
}

function unwireConfigOverlay(target) {
  const p = path.join(target, '.planning/config.json');
  if (!fs.existsSync(p)) return null;
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return null; }
  const customer = cfg.__gsd_ic && cfg.__gsd_ic.customer;
  const managedAgents = (cfg.__gsd_ic && cfg.__gsd_ic.managed_agents) || [];
  if (cfg.agent_skills) {
    for (const a of managedAgents) delete cfg.agent_skills[a];
    if (Object.keys(cfg.agent_skills).length === 0) delete cfg.agent_skills;
  }
  delete cfg.__gsd_ic;
  fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
  return customer;
}

function uninstall({ target }) {
  if (!target) throw new Error('uninstall requires { target }');
  // Read customer from target metadata BEFORE we strip the metadata.
  const customer = unwireConfigOverlay(target);
  unwireSettingsHooks(target);
  rmAgents(target);
  rmHooks(target);
  rmSkills(target);
  rmIntelRefs(target);
  rmContractRegistry(target);
  rmOverlay(target, customer);
}

module.exports = { uninstall };
