// Phase 1, step 2: rendered HTML + raw CSS capture.
// Loads each page in a real browser, scrolls in increments to trigger lazy
// loading, waits for network idle, then saves the fully rendered DOM and
// every stylesheet the page actually loaded.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT, politeMap, MAX_CONCURRENCY, CRAWL_DELAY_MS } = require('./lib/site');

const ROOT = path.join(__dirname, '..');
const CAPTURE_DIR = path.join(ROOT, 'capture');
const CSS_DIR = path.join(CAPTURE_DIR, 'css');

function slugFor(urlPath) {
  if (urlPath === '/') return 'home';
  return urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

async function scrollToBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 150);
    });
  });
}

async function capturePage(browser, pageInfo) {
  const slug = slugFor(pageInfo.path);
  const url = `${BASE_URL}${pageInfo.path}`;
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();

  const cssUrls = new Set();
  page.on('response', async (response) => {
    const ct = response.headers()['content-type'] || '';
    if (ct.includes('text/css')) cssUrls.add(response.url());
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
  await scrollToBottom(page);
  await page.waitForLoadState('networkidle');
  // Small settle time after lazy-load triggers before snapshotting the DOM.
  await page.waitForTimeout(500);

  const html = await page.content();
  fs.writeFileSync(path.join(CAPTURE_DIR, `${slug}.html`), html);

  await context.close();
  return { path: pageInfo.path, slug, cssUrls: [...cssUrls] };
}

async function saveCss(cssUrls) {
  fs.mkdirSync(CSS_DIR, { recursive: true });
  const seen = new Map();
  await politeMap([...cssUrls], MAX_CONCURRENCY, CRAWL_DELAY_MS, async (url) => {
    if (seen.has(url)) return;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const name = path
        .basename(new URL(url).pathname)
        .replace(/\.css.*$/, '.css') || `stylesheet-${seen.size}.css`;
      fs.writeFileSync(path.join(CSS_DIR, name), text);
      seen.set(url, name);
    } catch (e) {
      console.log(`  CSS FAILED ${url}: ${e.message}`);
      seen.set(url, null);
    }
  });
  return seen;
}

async function main() {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  fs.mkdirSync(CAPTURE_DIR, { recursive: true });

  const browser = await chromium.launch();
  const allCssUrls = new Set();
  const results = [];

  // Politely: capture pages one at a time (single browser, sequential nav),
  // 500ms delay between page loads.
  for (const pageInfo of pages) {
    console.log(`Capturing ${pageInfo.path} ...`);
    const result = await capturePage(browser, pageInfo);
    result.cssUrls.forEach((u) => allCssUrls.add(u));
    results.push(result);
    await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
  }
  await browser.close();

  console.log(`Fetching ${allCssUrls.size} distinct stylesheets...`);
  const cssMap = await saveCss(allCssUrls);

  const manifest = results.map((r) => ({
    path: r.path,
    slug: r.slug,
    html: `capture/${r.slug}.html`,
    css: r.cssUrls.map((u) => ({ url: u, local: cssMap.get(u) })),
  }));
  fs.writeFileSync(
    path.join(CAPTURE_DIR, 'html-manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n'
  );

  console.log(`\nSaved ${results.length} HTML captures and ${cssMap.size} stylesheets.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
