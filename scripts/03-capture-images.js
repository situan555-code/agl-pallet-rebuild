// Phase 1, step 3: images.
// Extracts every image URL from the rendered DOM (img[src], img[srcset],
// source[srcset], CSS background-image on every element), resolves each to
// its largest available WordPress size variant, downloads to /assets with a
// descriptive kebab-case name, and writes assets-manifest.json mapping
// original URL -> local filename -> pages that use it.
//
// WordPress serves responsive images as sibling files named
// `basename-WIDTHxHEIGHT.ext` alongside the full-resolution original at
// `basename.ext` (no Squarespace-style format=NNNNw query-param step-down).
// So "largest version" here means: strip any `-WIDTHxHEIGHT` size suffix
// WordPress added and request the bare original filename directly.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT, politeMap, MAX_CONCURRENCY, CRAWL_DELAY_MS } = require('./lib/site');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets');

function stripSizeSuffix(urlStr) {
  const u = new URL(urlStr);
  const m = u.pathname.match(/^(.*)-\d+x\d+(\.\w+)$/);
  if (m) {
    u.pathname = m[1] + m[2];
    return u.toString();
  }
  return urlStr;
}

async function extractImageUrls(browser, urlPath) {
  const context = await browser.newContext({ userAgent: USER_AGENT });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}${urlPath}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const timer = setInterval(() => {
        window.scrollBy(0, 400);
        total += 400;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
  await page.waitForLoadState('networkidle');

  const urls = await page.evaluate(() => {
    const set = new Set();
    const addFromSrcset = (srcset) => {
      if (!srcset) return;
      srcset.split(',').forEach((entry) => {
        const url = entry.trim().split(/\s+/)[0];
        if (url) set.add(url);
      });
    };

    document.querySelectorAll('img').forEach((img) => {
      if (img.src) set.add(img.src);
      addFromSrcset(img.getAttribute('srcset'));
      addFromSrcset(img.getAttribute('data-srcset'));
      if (img.dataset && img.dataset.src) set.add(img.dataset.src);
    });
    document.querySelectorAll('source').forEach((source) => {
      addFromSrcset(source.getAttribute('srcset'));
    });

    // CSS background-image, on every element actually in the DOM.
    document.querySelectorAll('*').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        const matches = [...bg.matchAll(/url\((['"]?)(.*?)\1\)/g)];
        matches.forEach((m) => set.add(m[2]));
      }
    });

    return [...set];
  });

  await context.close();
  return urls
    .filter((u) => u && !u.startsWith('data:'))
    .map((u) => new URL(u, BASE_URL).toString());
}

function localNameFor(originalUrl) {
  const u = new URL(originalUrl);
  const base = path.basename(u.pathname);
  return base
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-');
}

async function downloadLargest(originalUrl) {
  const candidate = stripSizeSuffix(originalUrl);
  const attempts = candidate === originalUrl ? [originalUrl] : [candidate, originalUrl];
  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt, { headers: { 'User-Agent': USER_AGENT } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        return { url: attempt, buf };
      }
    } catch {
      // try next candidate
    }
  }
  return null;
}

async function main() {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  fs.mkdirSync(ASSETS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const usageByUrl = new Map(); // resolvedUrl -> Set(pagePaths)

  for (const p of pages) {
    console.log(`Extracting image URLs from ${p.path} ...`);
    const urls = await extractImageUrls(browser, p.path);
    for (const u of urls) {
      const resolved = stripSizeSuffix(u);
      if (!usageByUrl.has(resolved)) usageByUrl.set(resolved, new Set());
      usageByUrl.get(resolved).add(p.path);
    }
    await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
  }
  await browser.close();

  console.log(`Found ${usageByUrl.size} distinct images. Downloading...`);
  const manifest = [];
  const failed = [];
  const allUrls = [...usageByUrl.keys()];

  await politeMap(allUrls, MAX_CONCURRENCY, CRAWL_DELAY_MS, async (originalUrl) => {
    const result = await downloadLargest(originalUrl);
    if (!result) {
      failed.push(originalUrl);
      console.log(`  FAILED ${originalUrl}`);
      return;
    }
    const localName = localNameFor(result.url);
    fs.writeFileSync(path.join(ASSETS_DIR, localName), result.buf);
    manifest.push({
      originalUrl,
      resolvedUrl: result.url,
      localFile: `assets/${localName}`,
      usedOnPages: [...usageByUrl.get(originalUrl)].sort(),
    });
    console.log(`  OK ${localName} (${result.buf.length} bytes)`);
  });

  fs.writeFileSync(
    path.join(ROOT, 'assets-manifest.json'),
    JSON.stringify(manifest.sort((a, b) => a.localFile.localeCompare(b.localFile)), null, 2) + '\n'
  );

  console.log(`\nDownloaded ${manifest.length}/${allUrls.length} images. ${failed.length} failed.`);
  if (failed.length) {
    console.log('Failed URLs:', JSON.stringify(failed, null, 2));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
