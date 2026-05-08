// ic_pack: true
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { run } = require('../../hooks/gsd-classification-banner.js');

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'banner-')); }

describe('gsd-classification-banner', () => {
  it('passes when frontmatter has classification: UNCLASSIFIED', () => {
    const dir = tmp();
    const file = path.join(dir, 'doc.md');
    fs.writeFileSync(file, '---\nclassification: UNCLASSIFIED\n---\n# Doc\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, true);
    assert.equal(r.action, 'noop');
  });

  it('passes when first-line HTML comment declares UNCLASSIFIED', () => {
    const dir = tmp();
    const file = path.join(dir, 'doc.md');
    fs.writeFileSync(file, '<!-- CLASSIFICATION: UNCLASSIFIED -->\n# Doc\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, true);
  });

  it('passes when source-comment declares UNCLASSIFIED', () => {
    const dir = tmp();
    const file = path.join(dir, 'mod.py');
    fs.writeFileSync(file, '# CLASSIFICATION: UNCLASSIFIED\nprint("hi")\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, true);
  });

  it('flags ADVISORY when no declaration found', () => {
    const dir = tmp();
    const file = path.join(dir, 'doc.md');
    fs.writeFileSync(file, '# Plain doc\nNo classification.\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, false);
    assert.match(r.advisory, /no classification declaration/i);
  });

  it('flags ADVISORY when declared classification is not UNCLASSIFIED', () => {
    const dir = tmp();
    const file = path.join(dir, 'doc.md');
    fs.writeFileSync(file, '---\nclassification: CUI//SP-PRVCY\n---\n# Doc\n');
    const r = run({ tool: 'Write', toolInput: { file_path: file } });
    assert.equal(r.ok, false);
    assert.match(r.advisory, /CUI/);
  });

  it('skips on tools other than Write|Edit', () => {
    const r = run({ tool: 'Read', toolInput: { file_path: '/nonexistent' } });
    assert.equal(r.ok, true);
    assert.equal(r.action, 'skipped');
  });

  it('respects disabled config', () => {
    const dir = tmp();
    const file = path.join(dir, 'doc.md');
    fs.writeFileSync(file, 'No declaration\n');
    const r = run({
      tool: 'Write',
      toolInput: { file_path: file },
      config: { hooks: { classification_banner: { enabled: false } } },
    });
    assert.equal(r.ok, true);
    assert.equal(r.action, 'disabled');
  });
});
