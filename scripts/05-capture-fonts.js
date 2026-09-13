// Phase 1, step 5: fonts.
// For each page, records every distinct font-family actually applied to
// rendered text (via getComputedStyle on real elements, not just what's
// declared in CSS) along with weight/style, and captures every font file
// network request to determine source (Google Fonts, self-hosted, system).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT, CRAWL_DELAY_MS } = require('./lib/site');

const ROOT = path.join(__dirname, '..');

async function inspectPage(browser, urlPath) {
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  const fontRequests = new Set();
  page.on('response', (response) => {
    const url = response.url();
    if (/\.(woff2?|ttf|otf|eot)(\?|$)/i.test(url) || /fonts\.googleapis|fonts\.gstatic|use\.typekit|p\.typekit/i.test(url)) {
      fontRequests.add(url);
    }
  });

  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(500);

  const usage = await page.evaluate(() => {
    const selectors = ['body', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'nav a', 'input', 'textarea', 'label'];
    const results = [];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach((el) => {
        const text = (el.textContent || '').trim();
        if (!text && sel !== 'input' && sel !== 'textarea') return;
        const cs = getComputedStyle(el);
        results.push({
          selector: sel,
          fontFamily: cs.fontFamily,
          fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle,
        });
      });
    }
    return results;
  });

  await context.close();
  return { fontRequests: [...fontRequests], usage };
}

function dedupeCombos(usageEntries) {
  const map = new Map();
  for (const u of usageEntries) {
    const key = `${u.selector}|${u.fontFamily}|${u.fontWeight}|${u.fontStyle}`;
    if (!map.has(key)) map.set(key, u);
  }
  return [...map.values()];
}

async function main() {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  const browser = await chromium.launch();

  const allFontRequests = new Set();
  const bySelector = new Map(); // selector -> Map(family|weight|style -> count)

  for (const p of pages) {
    console.log(`Inspecting fonts on ${p.path} ...`);
    const { fontRequests, usage } = await inspectPage(browser, p.path);
    fontRequests.forEach((u) => allFontRequests.add(u));
    for (const u of dedupeCombos(usage)) {
      if (!bySelector.has(u.selector)) bySelector.set(u.selector, new Map());
      const m = bySelector.get(u.selector);
      const key = `${u.fontFamily}|${u.fontWeight}|${u.fontStyle}`;
      m.set(key, (m.get(key) || 0) + 1);
    }
    await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
  }
  await browser.close();

  const raw = {
    fontFileRequests: [...allFontRequests].sort(),
    usageBySelector: Object.fromEntries(
      [...bySelector.entries()].map(([sel, m]) => [
        sel,
        [...m.entries()].map(([key, count]) => {
          const [fontFamily, fontWeight, fontStyle] = key.split('|');
          return { fontFamily, fontWeight, fontStyle, seenOnPages: count };
        }),
      ])
    ),
  };

  fs.writeFileSync(
    path.join(ROOT, 'capture', 'fonts-raw.json'),
    JSON.stringify(raw, null, 2) + '\n'
  );

  console.log('\nFont file requests observed:');
  console.log(raw.fontFileRequests.join('\n') || '(none)');
  console.log('\nWrote capture/fonts-raw.json — use this to hand-author fonts.md.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
