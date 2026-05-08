#!/usr/bin/env node
// ic_pack: true
// gsd-classified-leak-detector — PostToolUse hook on Write|Edit.
// Scans the just-written file for IC compartment markings using the pattern
// catalog in hooks/patterns/classified-markings.json. Advisory by default;
// blocks when config.hooks.classified_leak.block_on_match=true AND a match's
// severity is "block".
//
// See spec §6.2.

'use strict';

const fs = require('fs');
const path = require('path');

function loadPatterns() {
  const p = path.join(__dirname, 'patterns', 'classified-markings.json');
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function scan(content, patterns) {
  const matches = [];
  for (const p of patterns) {
    const re = new RegExp(p.regex);
    const m = content.match(re);
    if (m) matches.push({ id: p.id, label: p.label, severity: p.severity, snippet: m[0] });
  }
  return matches;
}

function run(payload) {
  const config = (payload && payload.config) || {};
  const cfg = config.hooks?.classified_leak || {};
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

  const hasBlockSeverity = matches.some((m) => m.severity === 'block');
  const blocked = !!cfg.block_on_match && hasBlockSeverity;

  return {
    ok: false,
    blocked,
    matches,
    advisory: `[gsd-classified-leak-detector] ${matches.length} marking(s) detected in ${filePath}: ${matches.map((m) => m.id).join(', ')}.${blocked ? ' BLOCKED.' : ''}`,
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
    process.exit(result.blocked ? 1 : 0);
  });
}
