#!/usr/bin/env node
// H0 gate 3: every {{TBD-*}} token that SPEC_V1.md section 4 embeds inline
// on a page (photo, address, carrier-offer blanks, form-destination
// emails) must render as a literal, visible `{{TBD-*}}` string in that
// page's DOM. Fails in both directions: token absent entirely (never
// built) and token silently replaced with invented prose both show up as
// "the literal string is not in the rendered text" — there's no ground
// truth to diff against for the second case beyond that.
//
// Section 8 also lists tokens that are build-decision tracking notes, not
// on-page placeholders (FOUNDER-STORY, VALUES, TEAM-LIST, FAITH-PLACEMENT,
// PHARMA, SOCIAL-URLS) — SPEC_V1.md's own build notes say to build those
// WITH the given draft copy, or to omit the content/block entirely rather
// than show a placeholder. Those are reported for visibility but not
// gated on DOM presence; see scripts/lib/spec-manifest.js.
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

      const missing = tokens.filter((t) => !bodyText.includes(`{{${t}}}`));
      entry.missing = missing;
      entry.status = missing.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(`  ${entry.status.toUpperCase()} ${route}: ${tokens.length} token(s) expected, ${missing.length} not rendered as visible placeholders`);
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
        results,
        contentDecisionTokens: CONTENT_DECISION_TOKENS,
      },
      null,
      2
    )
  );
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nTOKENS FAILED: one or more expected {{TBD-*}} placeholders are not visibly rendered (see tokens-report.json).');
    process.exit(1);
  }
  console.log('\nAll expected {{TBD-*}} placeholders render visibly.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
