// ic_pack: true
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { run } = require('../../hooks/gsd-classified-leak-detector.js');

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'leak-')); }

describe('gsd-classified-leak-detector', () => {
  it('passes when file has no markings', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, '# Plain content. No markings.\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, true);
    assert.deepEqual(r.matches, []);
  });

  it('flags S// (SECRET) marking', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'S//NOFORN content\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, false);
    assert.ok(r.matches.some((m) => m.id === 'secret'));
  });

  it('flags multiple markings', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'TS//SI//NOFORN\nHCS-O//NOFORN\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, false);
    assert.ok(r.matches.length >= 2);
  });

  it('does not block by default (severity=block but block_on_match=false)', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'S//NOFORN\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.blocked, false);
  });

  it('blocks when block_on_match=true and a block-severity match found', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'TS//SI//NOFORN\n');
    const r = run({
      tool: 'Write',
      toolInput: { file_path: file },
      config: { hooks: { classified_leak: { block_on_match: true } } },
    });
    assert.equal(r.blocked, true);
  });

  it('does not block on warn-only matches even with block_on_match=true', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'NOFORN\n');
    const r = run({
      tool: 'Write',
      toolInput: { file_path: file },
      config: { hooks: { classified_leak: { block_on_match: true } } },
    });
    assert.equal(r.blocked, false);
  });

  it('respects disabled config', () => {
    const dir = tmp();
    const file = path.join(dir, 'a.md');
    fs.writeFileSync(file, 'TS//SI//NOFORN\n');
    const r = run({
      tool: 'Write',
      toolInput: { file_path: file },
      config: { hooks: { classified_leak: { enabled: false } } },
    });
    assert.equal(r.ok, true);
    assert.equal(r.action, 'disabled');
  });
});
