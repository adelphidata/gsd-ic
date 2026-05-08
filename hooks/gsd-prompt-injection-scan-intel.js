#!/usr/bin/env node
// ic_pack: true
// gsd-prompt-injection-scan-intel — PostToolUse hook.
// Layered IC-flavored prompt-injection scanner. Runs ALONGSIDE stock scanner;
// does not modify or merge its output. Advisory only.
//
// See spec §6.3.

'use strict';

const fs = require('fs');
const path = require('path');

function loadPatterns() {
  const p = path.join(__dirname, 'patterns', 'intel-injection-patterns.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function scan(content, patterns) {
  const matches = [];
  for (const p of patterns) {
    const re = new RegExp(p.regex, 'i');
    const m = content.match(re);
    if (m) matches.push({ id: p.id, label: p.label, severity: p.severity, snippet: m[0] });
  }
  return matches;
}

function run(payload) {
  const config = (payload && payload.config) || {};
  const cfg = config.hooks?.prompt_injection_intel || {};
  if (cfg.enabled === false) return { ok: true, action: 'disabled' };

  const tool = payload && payload.tool;
  if (tool !== 'Write' && tool !== 'Edit') return { ok: true, action: 'skipped', matches: [] };

  const filePath = payload?.toolInput?.file_path;
  if (!filePath || !fs.existsSync(filePath)) return { ok: true, action: 'skipped', matches: [] };

  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); }
  catch { return { ok: true, action: 'skipped', matches: [] }; }

  const { patterns } = loadPatterns();
  const matches = scan(content, patterns);

  if (matches.length === 0) return { ok: true, action: 'noop', matches: [] };

  return {
    ok: false,
    matches,
    advisory: `[gsd-prompt-injection-scan-intel] ${matches.length} IC-flavored injection signal(s) in ${filePath}: ${matches.map((m) => m.id).join(', ')}.`,
  };
}

module.exports = { run, loadPatterns, scan };

if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; } catch {}
    const result = run(payload);
    if (result.advisory) process.stderr.write(`${result.advisory}\n`);
    process.exit(0); // never block
  });
}
