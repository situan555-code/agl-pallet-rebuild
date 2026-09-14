#!/usr/bin/env node
// H0 gate 4: every numeral rendered on a built page must appear somewhere
// in SPEC_V1.md — phone number, address, dates, and dimensions from the
// spec pass; invented stats (the old "99%"/"12+" stat band, an invented
// year-count, etc.) fail because their digits don't occur anywhere in the
// spec text.
//
// Numerals are compared as bare digit sequences (length >= 2, punctuation
// stripped) rather than whole tokens, since the same figure can be
// rendered with different punctuation in prose vs. spec table markup
// (e.g. a phone number's three digit groups). This is a literal, mechanical
// "does this digit sequence occur in SPEC_V1.md" check, not a semantic one
// — it will not catch an invented number that happens to reuse digits from
// an unrelated real one (e.g. reusing "48" from "48×40" to invent "48%").
// That residual risk is why this stays a gate a human reads, not just a
// pass/fail count.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { ensureServer } = require('./lib/devserver');
const { ROUTES } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.NUMBERS_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const SPEC_PATH = path.join(ROOT, 'SPEC_V1.md');
const REPORT_JSON = path.join(ROOT, 'numbers-report.json');
const MIN_DIGITS = 2;

function extractDigitSequences(text) {
  return (text.match(/\d{2,}/g) || []);
}

async function main() {
  const specText = fs.readFileSync(SPEC_PATH, 'utf8');
  const specDigits = new Set(extractDigitSequences(specText));

  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  const results = [];
  let anyFail = false;

  try {
    for (const route of ROUTES) {
      const entry = { path: route };
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

      const pageDigits = [...new Set(extractDigitSequences(bodyText))];
      const invented = pageDigits.filter((d) => !specDigits.has(d));

      entry.numeralsFound = pageDigits;
      entry.invented = invented;
      entry.status = invented.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(`  ${entry.status.toUpperCase()} ${route}: ${pageDigits.length} numeral(s), ${invented.length} not found in SPEC_V1.md`);
      if (invented.length) console.log(`      invented: ${invented.join(', ')}`);
      results.push(entry);
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ baseUrl: BASE_URL, minDigits: MIN_DIGITS, generatedAt: new Date().toISOString(), results }, null, 2)
  );
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nNUMBERS FAILED: one or more pages render a numeral absent from SPEC_V1.md (see numbers-report.json).');
    process.exit(1);
  }
  console.log('\nAll rendered numerals trace back to SPEC_V1.md.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
