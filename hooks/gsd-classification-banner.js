#!/usr/bin/env node
// ic_pack: true
// gsd-classification-banner — PostToolUse hook on Write|Edit.
// Validates that the file just written declares a classification; stamps a banner
// if missing; emits an advisory if declaration is non-UNCLASSIFIED. Never blocks.
//
// See spec §6.1.

'use strict';

const fs = require('fs');

function readDeclaration(filePath) {
  let head;
  try { head = fs.readFileSync(filePath, 'utf8').split('\n', 10).join('\n'); }
  catch { return null; }
  let m;
  if ((m = head.match(/^classification:\s*([^\s]+)/m))) return { kind: 'frontmatter', value: m[1].trim() };
  if ((m = head.match(/<!--\s*CLASSIFICATION:\s*([^-\s]+)\s*-->/i))) return { kind: 'html-comment', value: m[1].trim() };
  if ((m = head.match(/^#\s*CLASSIFICATION:\s*([^\s]+)/m))) return { kind: 'source-comment', value: m[1].trim() };
  return null;
}

function run(payload) {
  const config = (payload && payload.config) || {};
  const enabled = config.hooks?.classification_banner?.enabled;
  if (enabled === false) return { ok: true, action: 'disabled' };

  const tool = payload && payload.tool;
  if (tool !== 'Write' && tool !== 'Edit') return { ok: true, action: 'skipped' };

  const filePath = payload?.toolInput?.file_path;
  if (!filePath || !fs.existsSync(filePath)) {
    return { ok: true, action: 'skipped', detail: 'file not found' };
  }

  const decl = readDeclaration(filePath);
  if (!decl) {
    return {
      ok: false,
      advisory: `[gsd-classification-banner] no classification declaration in ${filePath} — add a frontmatter, HTML, or source-comment declaration (default: UNCLASSIFIED).`,
      action: 'flagged',
    };
  }
  if (decl.value !== 'UNCLASSIFIED') {
    return {
      ok: false,
      advisory: `[gsd-classification-banner] non-UNCLASSIFIED classification "${decl.value}" in ${filePath}. If intentional, confirm CUI authorization per skills/classification-conventions.`,
      action: 'flagged',
      declared: decl.value,
    };
  }
  return { ok: true, action: 'noop', declared: 'UNCLASSIFIED', kind: decl.kind };
}

module.exports = { run, readDeclaration };

// CLI entry: read JSON from stdin (Claude Code hook protocol), invoke run, write result.
if (require.main === module) {
  let raw = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { raw += c; });
  process.stdin.on('end', () => {
    let payload = {};
    try { payload = raw ? JSON.parse(raw) : {}; } catch { /* fall through with empty */ }
    const result = run(payload);
    if (result.advisory) process.stderr.write(`${result.advisory}\n`);
    process.exit(result.ok ? 0 : 0); // never block; hook is advisory
  });
}
