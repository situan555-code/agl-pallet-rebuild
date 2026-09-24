#!/usr/bin/env node
// H0 gate 3, retargeted 2026-09-24 (Wave B): unresolved {{TBD-*}} content
// is omitted until cutover. The photo, address, carrier blanks, and
// form-destination emails in DOM_PLACEHOLDER_TOKENS must not appear as a
// literal `{{TBD-*}}` string in the page text. The check still runs on
// every listed route and fails if a raw placeholder is visible. It does
// not accept invented address, photo, or carrier commercial terms, and it
// does not require the token to be rendered (placeholder-guard already
// rejects `{{` and `TBD` in HTML).
//
// Section 8 also lists tokens that are build-decision tracking notes, not
// on-page placeholders (FOUNDER-STORY, VALUES, TEAM-LIST, FAITH-PLACEMENT,
// PHARMA, SOCIAL-URLS). Those are reported for visibility but not gated;
// see scripts/lib/spec-manifest.js.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { ensureServer } = require('./lib/devserver');
const { DOM_PLACEHOLDER_TOKENS, CONTENT_DECISION_TOKENS } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.TOKENS_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'tokens-report.json');

async function main() {
  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  const results = [];
  let anyFail = false;

  try {
    // Group by route so we load each page once.
    const routeTokens = new Map();
    for (const [token, routes] of Object.entries(DOM_PLACEHOLDER_TOKENS)) {
      for (const route of routes) {
        if (!routeTokens.has(route)) routeTokens.set(route, []);
        routeTokens.get(route).push(token);
      }
    }

    for (const [route, tokens] of routeTokens) {
      const entry = { path: route, tokens };
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

      const rendered = tokens.filter((t) => bodyText.includes(`{{${t}}}`));
      entry.policy = 'omit-until-cutover';
      entry.omitted = tokens.filter((t) => !rendered.includes(t));
      entry.rendered = rendered;
      entry.status = rendered.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(
        `  ${entry.status.toUpperCase()} ${route}: ${tokens.length} token(s) omitted until cutover, ${rendered.length} still rendered as {{TBD-*}}`
      );
      results.push(entry);
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify(
      {
        baseUrl: BASE_URL,
        generatedAt: new Date().toISOString(),
        policy: 'omit-until-cutover',
        results,
        contentDecisionTokens: CONTENT_DECISION_TOKENS,
      },
      null,
      2
    )
  );
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nTOKENS FAILED: one or more {{TBD-*}} placeholders are still visible. Omit them until cutover (see tokens-report.json).');
    process.exit(1);
  }
  console.log('\nListed {{TBD-*}} placeholders are omitted until cutover. None are visible.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
