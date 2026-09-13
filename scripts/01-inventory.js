// Phase 1, step 1: page inventory.
// Fetches robots.txt + the WordPress/Yoast sitemap chain, then cross-checks
// against nav/footer links found by rendering the homepage, and writes
// pages.json (home page is always index 0).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT } = require('./lib/site');

const ROOT = path.join(__dirname, '..');

async function fetchText(url) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.text();
}

function extractLocs(xml) {
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)];
  return matches.map((m) => m[1].trim());
}

async function getSitemapUrls() {
  const robots = await fetchText(`${BASE_URL}/robots.txt`);
  const sitemapLine = robots
    .split('\n')
    .find((l) => l.toLowerCase().startsWith('sitemap:'));
  const sitemapIndexUrl = sitemapLine
    ? sitemapLine.split(':').slice(1).join(':').trim()
    : `${BASE_URL}/sitemap_index.xml`;

  const indexXml = await fetchText(sitemapIndexUrl);
  const childSitemaps = extractLocs(indexXml);

  const pageUrls = new Set();
  for (const sm of childSitemaps) {
    // Only page sitemaps matter for site content; post/category/author
    // sitemaps (if any existed) would need separate handling, but this
    // site's index only lists page-sitemap.xml as of capture time.
    const xml = await fetchText(sm);
    for (const loc of extractLocs(xml)) pageUrls.add(loc);
  }
  return { robots, sitemapIndexUrl, childSitemaps, pageUrls: [...pageUrls] };
}

function toPath(urlStr) {
  const u = new URL(urlStr);
  return u.pathname;
}

async function crawlNavFooterLinks(browser) {
  const page = await browser.newPage({ userAgent: USER_AGENT });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  const links = await page.evaluate(() => {
    const anchors = [
      ...document.querySelectorAll('header a[href], nav a[href], footer a[href]'),
    ];
    return anchors.map((a) => a.getAttribute('href')).filter(Boolean);
  });
  await page.close();

  const sameSite = new Set();
  for (const href of links) {
    try {
      const abs = new URL(href, BASE_URL);
      if (abs.hostname === new URL(BASE_URL).hostname) {
        sameSite.add(abs.pathname);
      }
    } catch {
      // ignore mailto:, tel:, javascript:, etc.
    }
  }
  return [...sameSite];
}

async function getPageMeta(browser, urlPath) {
  const page = await browser.newPage({ userAgent: USER_AGENT });
  const url = `${BASE_URL}${urlPath}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  const meta = await page.evaluate(() => {
    const get = (sel, attr) => document.querySelector(sel)?.getAttribute(attr) || null;
    return {
      title: document.title || null,
      description: get('meta[name="description"]', 'content'),
      canonical: get('link[rel="canonical"]', 'href'),
    };
  });
  await page.close();
  return meta;
}

async function main() {
  console.log('Fetching robots.txt + sitemap chain...');
  const { robots, sitemapIndexUrl, childSitemaps, pageUrls } = await getSitemapUrls();

  const browser = await chromium.launch();

  console.log('Crawling homepage nav/footer for cross-check...');
  const navFooterPaths = await crawlNavFooterLinks(browser);

  const sitemapPaths = new Set(pageUrls.map(toPath));
  const navFooterSet = new Set(navFooterPaths);

  const discrepancies = {
    inNavFooterNotInSitemap: [...navFooterSet].filter((p) => !sitemapPaths.has(p)),
    inSitemapNotInNavFooter: [...sitemapPaths].filter((p) => !navFooterSet.has(p)),
  };

  // Union of both sources becomes the crawl set, home forced to index 0.
  const allPaths = new Set([...sitemapPaths, ...navFooterSet]);
  allPaths.delete('/'); // handled explicitly as index 0
  const orderedPaths = ['/', ...[...allPaths].sort()];

  console.log(`Fetching per-page meta for ${orderedPaths.length} paths...`);
  const pages = [];
  for (const p of orderedPaths) {
    try {
      const meta = await getPageMeta(browser, p);
      pages.push({ path: p, ...meta });
      console.log(`  ${p} -> "${meta.title}"`);
    } catch (e) {
      console.log(`  ${p} -> FAILED: ${e.message}`);
    }
  }

  await browser.close();

  fs.writeFileSync(
    path.join(ROOT, 'pages.json'),
    JSON.stringify(pages, null, 2) + '\n'
  );

  const report = {
    sitemapIndexUrl,
    childSitemaps,
    sitemapPageCount: sitemapPaths.size,
    navFooterLinkCount: navFooterSet.size,
    discrepancies,
    robotsTxt: robots,
  };
  fs.writeFileSync(
    path.join(ROOT, 'capture', 'inventory-report.json'),
    JSON.stringify(report, null, 2) + '\n'
  );

  console.log(`\nWrote pages.json (${pages.length} pages) and capture/inventory-report.json`);
  if (discrepancies.inNavFooterNotInSitemap.length || discrepancies.inSitemapNotInNavFooter.length) {
    console.log('Discrepancies found:', JSON.stringify(discrepancies, null, 2));
  } else {
    console.log('No discrepancies between sitemap and nav/footer links.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
