#!/usr/bin/env node
// H0 gate 5: #162619 is the only green allowed anywhere in compiled CSS,
// inline styles, and SVG assets. SPEC_V1.md section 2 calls out #152619
// specifically (present in the logo rasters, "not yet reconciled") as a
// value to flag rather than silently allow.
//
// "Green" is classified by RGB, not by an exact-value allowlist with one
// exception bolted on: a hex color counts as green if the G channel is the
// strict max of the three and beats the runner-up channel by a margin,
// which is what actually distinguishes brand green from near-black/gray/
// other hues in compiled Tailwind CSS. #162619 itself is expected to match
// this and is the only value allowed to.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { ensureServer } = require('./lib/devserver');
const { ROUTES } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.COLOR_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'color-report.json');
const APPROVED_GREEN = '#162619';

const HEX_RE = /#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g;

function expand(hex) {
  if (hex.length === 3) {
    return hex.split('').map((c) => c + c).join('');
  }
  return hex;
}

function isGreen(hex) {
  const full = expand(hex.replace(/^#/, ''));
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const runnerUp = Math.max(r, b);
  return g > 30 && g > runnerUp && g - runnerUp >= 12;
}

function scanForGreens(content, file) {
  const hits = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    let m;
    const re = new RegExp(HEX_RE.source, 'g');
    while ((m = re.exec(line))) {
      const hex = `#${m[1].toLowerCase()}`;
      if (isGreen(hex)) {
        hits.push({ file, line: idx + 1, value: hex, approved: hex === APPROVED_GREEN });
      }
    }
  });
  return hits;
}

function walk(dir, exts) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

async function main() {
  const hits = [];

  // 1. Compiled CSS from the build, plus source CSS/Tailwind config.
  const cssFiles = [
    ...walk(path.join(ROOT, '.next', 'static', 'css'), ['.css']),
    path.join(ROOT, 'app', 'globals.css'),
    path.join(ROOT, 'tailwind.config.ts'),
  ].filter((f) => fs.existsSync(f));
  for (const file of cssFiles) {
    const content = fs.readFileSync(file, 'utf8');
    hits.push(...scanForGreens(content, path.relative(ROOT, file)));
  }

  // 2. SVG assets (spec flags the logo rasters as the known #152619 source).
  const svgFiles = [...walk(path.join(ROOT, 'public'), ['.svg']), ...walk(path.join(ROOT, 'assets'), ['.svg'])];
  for (const file of svgFiles) {
    const content = fs.readFileSync(file, 'utf8');
    hits.push(...scanForGreens(content, path.relative(ROOT, file)));
  }

  // 3. Rendered HTML per route — inline style attributes.
  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  try {
    for (const route of ROUTES) {
      const page = await browser.newPage();
      try {
        const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 45_000 });
        if (resp && resp.status() < 400) {
          const html = await page.content();
          hits.push(...scanForGreens(html, `rendered:${route}`));
        }
      } catch {
        // Route unreachable — routes.js is the gate of record for that; skip here.
      }
      await page.close();
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  const disallowed = hits.filter((h) => !h.approved);
  const report = {
    baseUrl: BASE_URL,
    approvedGreen: APPROVED_GREEN,
    generatedAt: new Date().toISOString(),
    hits,
    disallowed,
  };
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  console.log(`Wrote ${path.relative(ROOT, REPORT_JSON)}`);

  console.log(`\nGreens found: ${hits.length} (approved ${APPROVED_GREEN}: ${hits.length - disallowed.length}, disallowed: ${disallowed.length})`);
  for (const h of disallowed.slice(0, 20)) {
    console.log(`  DISALLOWED ${h.value} — ${h.file}:${h.line}`);
  }

  if (disallowed.length > 0) {
    console.error('\nCOLOR FAILED: a green other than #162619 was found (see color-report.json).');
    process.exit(1);
  }
  console.log('\n#162619 is the only green found.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
