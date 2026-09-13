#!/usr/bin/env node
// Section E gate 3: page height within 15% of reference.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const { slugFor, VIEWPORTS } = require('./lib/shoot');

const ROOT = path.join(__dirname, '..');
const LIMIT = 15;
const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
const results = [];
let fail = false;

for (const page of pages) {
  const slug = slugFor(page.path);
  for (const vp of VIEWPORTS) {
    const refPath = path.join(ROOT, 'reference', `${slug}-${vp.name}.png`);
    const gotPath = path.join(ROOT, 'screenshots', `${slug}-${vp.name}.png`);
    const entry = { path: page.path, viewport: vp.name };
    if (!fs.existsSync(refPath) || !fs.existsSync(gotPath)) {
      entry.status = 'error';
      entry.error = 'missing screenshot pair';
      fail = true;
      results.push(entry);
      console.error(`ERROR ${page.path} @ ${vp.name}: missing pair`);
      continue;
    }
    const rh = PNG.sync.read(fs.readFileSync(refPath)).height;
    const bh = PNG.sync.read(fs.readFileSync(gotPath)).height;
    const delta = Number(((Math.abs(bh - rh) / rh) * 100).toFixed(3));
    entry.refHeight = rh;
    entry.builtHeight = bh;
    entry.heightDeltaPct = delta;
    entry.status = delta > LIMIT ? 'fail' : 'pass';
    if (entry.status === 'fail') fail = true;
    console.log(`${entry.status.toUpperCase()} ${page.path} @ ${vp.name}: ${delta}% (ref ${rh}, built ${bh})`);
    results.push(entry);
  }
}

fs.writeFileSync(path.join(ROOT, 'height-report.json'), JSON.stringify({ limitPct: LIMIT, results }, null, 2));
if (fail) {
  console.error(`\nHEIGHT FAILED: one or more pages exceed ${LIMIT}% height delta.`);
  process.exit(1);
}
console.log(`\nAll pages within ${LIMIT}% height.`);
