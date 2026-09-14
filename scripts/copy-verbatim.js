#!/usr/bin/env node
// H0 gate 1 (BRIEF.md Section H0 / SPEC_V1.md is authoritative): for every
// SPEC_V1.md section-4 route, assert every extracted copy block appears in
// the built page after whitespace normalization. Paraphrase = failure.
// This is the most important gate in the run — it replaces content.js's
// old capture-diffing role, which asserted parity against the WordPress
// capture. SPEC_V1.md, not the capture, is now the source of truth.
//
// Comparison is whitespace-normalized AND case-folded, matching the
// case-insensitive precedent already established by content.js: an
// all-caps eyebrow is a CSS text-transform rendering choice, not a copy
// change, and a naive case-sensitive compare would flag every such
// heading as "paraphrased" when the underlying words are identical. Real
// wording changes (added/dropped/reordered words) still fail — case
// folding does not hide those.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { ensureServer } = require('./lib/devserver');
const { parseSpecCopy } = require('./lib/spec-copy');
const { ROUTES } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.COPY_VERBATIM_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const SPEC_PATH = path.join(ROOT, 'SPEC_V1.md');
const REPORT_JSON = path.join(ROOT, 'copy-verbatim-report.json');

function normalize(s) {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

async function main() {
  const { byRoute, shared } = parseSpecCopy(SPEC_PATH);
  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  const results = [];
  let anyFail = false;

  try {
    for (const route of ROUTES) {
      const items = [...(byRoute.get(route) || [])];
      if (shared.ctaRoutes.includes(route)) items.push(...shared.ctaBand);
      if (shared.oneLineDescriptor) items.push({ label: 'FOOTER-DESCRIPTOR', text: shared.oneLineDescriptor });

      const entry = { path: route, totalBlocks: items.length };

      const page = await browser.newPage();
      let bodyText;
      try {
        const resp = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 45_000 });
        if (!resp || resp.status() >= 400) {
          entry.status = 'error';
          entry.error = `page returned status ${resp ? resp.status() : 'no response'}`;
          anyFail = true;
          results.push(entry);
          console.error(`  ERROR ${route}: ${entry.error}`);
          await page.close();
          continue;
        }
        bodyText = (await page.evaluate(() => document.body.innerText)) || '';
      } catch (e) {
        entry.status = 'error';
        entry.error = `failed to load page: ${e.message}`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${route}: ${entry.error}`);
        await page.close();
        continue;
      }
      await page.close();

      const haystack = normalize(bodyText);
      const missing = items
        .filter((item) => !haystack.includes(normalize(item.text)))
        .map((item) => ({ label: item.label, text: item.text }));

      entry.missingCount = missing.length;
      entry.missing = missing;
      entry.status = missing.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(`  ${entry.status.toUpperCase()} ${route}: ${items.length} copy block(s), ${missing.length} missing/paraphrased`);
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
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nCOPY-VERBATIM FAILED: one or more pages are missing spec copy blocks (see copy-verbatim-report.json).');
    process.exit(1);
  }
  console.log('\nAll pages contain their SPEC_V1.md section-4 copy blocks verbatim.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
