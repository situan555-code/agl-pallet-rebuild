#!/usr/bin/env node
// Captures the built site at 390/768/1440 with the same deterministic
// settings used for /reference (animations disabled, fixed scroll
// position). Output goes to /screenshots, which `npm run height` and
// `npm run diff` compare against /reference. This script does not write
// /reference. The PNGs in /reference were refreshed 2026-09-24 (Wave B)
// to the current redesign baselines. A routine screenshot run must not
// overwrite them.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { CRAWL_DELAY_MS } = require('./lib/site');
const { VIEWPORTS, slugFor, shootPage } = require('./lib/shoot');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'screenshots');
const BASE_URL = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';

async function main() {
  const pagesPath = path.join(ROOT, 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found — run Phase 1 capture first.');
    process.exit(1);
  }
  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Shooting built site at ${BASE_URL} ...`);
  const browser = await chromium.launch();
  let failures = 0;

  for (const pageInfo of pages) {
    for (const viewport of VIEWPORTS) {
      const slug = slugFor(pageInfo.path);
      const outPath = path.join(OUT_DIR, `${slug}-${viewport.name}.png`);
      try {
        await shootPage(browser, BASE_URL, pageInfo.path, viewport, outPath);
        console.log(`  OK ${pageInfo.path} @ ${viewport.name}px`);
      } catch (e) {
        failures += 1;
        console.error(`  FAILED ${pageInfo.path} @ ${viewport.name}px: ${e.message}`);
      }
      await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
    }
  }
  await browser.close();

  if (failures > 0) {
    console.error(`\n${failures} screenshot(s) failed.`);
    process.exit(1);
  }
  console.log(`\nWrote ${pages.length * VIEWPORTS.length} screenshots to /screenshots.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
