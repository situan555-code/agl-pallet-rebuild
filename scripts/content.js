#!/usr/bin/env node
// Section E gate 2: content parity — every text block from the capture
// must still be present somewhere in the built page. Ordering within a
// section and whitespace differences don't matter; only presence.
//
// Prefers capture/*.txt fixtures (one normalized text block per line); if
// one is missing, derives it from capture/*.html (via the same
// Playwright/innerText extraction used by structure.js) and writes the
// fixture so later runs are faster and reviewable/diffable.
// Writes content-report.json. Exits non-zero on any missing block.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { slugFor } = require('./lib/shoot');
const { extractTextBlocks } = require('./lib/parse');
const { ensureServer } = require('./lib/devserver');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.CONTENT_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'content-report.json');

function loadPages() {
  const pagesPath = path.join(ROOT, 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found — run Phase 1 capture first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
}

function normalizeWhitespace(s) {
  return s.replace(/\s+/g, ' ').trim();
}

// Case-insensitive on purpose: innerText reflects rendered CSS
// text-transform (e.g. an uppercase hero heading renders as "FOR
// MANUFACTURERS..." even though the underlying copy is mixed-case), while
// capture/*.txt was extracted without the original stylesheet applied. A
// case-sensitive compare would flag every transformed heading as dropped
// copy when it's actually just a text-transform style choice (License to
// Improve territory, not a content change).
function normalizeForCompare(s) {
  return normalizeWhitespace(s)
    .replace(/[\u00ad\u200b\u200c\u200d\ufeff]/g, '')
    .toLowerCase();
}

// WP/Divi chrome — not site copy. Keep duplicate real card copy (do not Set-dedupe).
const IGNORE_BLOCKS = new Set(['video player']);

async function main() {
  const pages = loadPages();
  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  const results = [];
  let anyFail = false;
  let generatedFixtures = 0;

  try {
    for (const pageInfo of pages) {
      const slug = slugFor(pageInfo.path);
      const captureHtmlFile = path.join(ROOT, 'capture', `${slug}.html`);
      const captureTxtFile = path.join(ROOT, 'capture', `${slug}.txt`);
      const entry = { path: pageInfo.path, captureTxtFile: path.relative(ROOT, captureTxtFile) };

      let captureBlocks;
      if (fs.existsSync(captureTxtFile)) {
        captureBlocks = fs
          .readFileSync(captureTxtFile, 'utf8')
          .split('\n')
          .map(normalizeWhitespace)
          .filter(Boolean);
      } else if (fs.existsSync(captureHtmlFile)) {
        const capturePage = await browser.newPage();
        await capturePage.setContent(fs.readFileSync(captureHtmlFile, 'utf8'), { waitUntil: 'load' });
        captureBlocks = await capturePage.evaluate(extractTextBlocks);
        await capturePage.close();
        fs.writeFileSync(captureTxtFile, captureBlocks.join('\n') + '\n');
        generatedFixtures += 1;
        console.log(`  generated fixture capture/${slug}.txt (${captureBlocks.length} blocks)`);
      } else {
        entry.status = 'error';
        entry.error = `no capture/${slug}.txt or capture/${slug}.html found`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path}: ${entry.error}`);
        continue;
      }

      const builtPage = await browser.newPage();
      let builtText;
      try {
        await builtPage.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 45_000 });
        builtText = await builtPage.evaluate(() => document.body.innerText || '');
      } catch (e) {
        entry.status = 'error';
        entry.error = `failed to load built page: ${e.message}`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path}: ${entry.error}`);
        await builtPage.close();
        continue;
      }
      await builtPage.close();

      const haystack = normalizeForCompare(builtText);
      const missing = captureBlocks.filter((block) => {
        const n = normalizeForCompare(block);
        if (IGNORE_BLOCKS.has(n)) return false;
        return !haystack.includes(n);
      });

      entry.totalBlocks = captureBlocks.length;
      entry.missingCount = missing.length;
      entry.missing = missing;
      entry.status = missing.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(`  ${entry.status.toUpperCase()} ${pageInfo.path}: ${captureBlocks.length} blocks, ${missing.length} missing`);
      results.push(entry);
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ baseUrl: BASE_URL, generatedAt: new Date().toISOString(), results }, null, 2)
  );
  console.log(
    `\nWrote ${path.relative(ROOT, REPORT_JSON)}${generatedFixtures ? ` (generated ${generatedFixtures} capture/*.txt fixture(s))` : ''}`
  );

  if (anyFail) {
    console.error('\nCONTENT FAILED: one or more pages are missing captured text blocks (see content-report.json).');
    process.exit(1);
  }
  console.log('\nAll pages contain their captured text blocks.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
