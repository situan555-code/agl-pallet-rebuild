// Phase 1, step 7: design tokens.
// Per page, dumps getComputedStyle for body, h1-h6, p, a, buttons, nav
// links, form inputs, header, footer, and each distinct section wrapper —
// color, background-color, font-family, font-size, font-weight,
// line-height, letter-spacing, margin, padding, border-radius, box-shadow.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT, CRAWL_DELAY_MS } = require('./lib/site');

const ROOT = path.join(__dirname, '..');

const PROPS = [
  'color',
  'backgroundColor',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'lineHeight',
  'letterSpacing',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'borderRadius',
  'boxShadow',
];

const FIXED_SELECTORS = [
  'body',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'a',
  'button',
  'nav a',
  'input',
  'textarea',
  'header',
  'footer',
];

async function dumpPage(browser, urlPath) {
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.waitForTimeout(300);

  const data = await page.evaluate(
    ({ props, fixedSelectors }) => {
      function snapshot(el) {
        const cs = getComputedStyle(el);
        const out = {};
        for (const p of props) out[p] = cs[p];
        return out;
      }

      const result = { fixed: {}, sections: [] };

      for (const sel of fixedSelectors) {
        const els = [...document.querySelectorAll(sel)];
        if (!els.length) continue;
        // First instance is representative; note count for context.
        result.fixed[sel] = { count: els.length, style: snapshot(els[0]) };
      }

      // "Each distinct section wrapper": Divi renders top-level page
      // sections as .et_pb_section — walk those as the section wrappers.
      const sectionEls = [...document.querySelectorAll('.et_pb_section')];
      sectionEls.forEach((el, i) => {
        result.sections.push({
          index: i,
          className: el.className,
          style: snapshot(el),
        });
      });

      return result;
    },
    { props: PROPS, fixedSelectors: FIXED_SELECTORS }
  );

  await context.close();
  return data;
}

async function main() {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  const browser = await chromium.launch();

  const tokens = {};
  for (const p of pages) {
    console.log(`Dumping computed styles on ${p.path} ...`);
    tokens[p.path] = await dumpPage(browser, p.path);
    await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
  }
  await browser.close();

  fs.writeFileSync(
    path.join(ROOT, 'raw-tokens.json'),
    JSON.stringify(tokens, null, 2) + '\n'
  );
  console.log('\nWrote raw-tokens.json');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
