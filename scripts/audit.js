#!/usr/bin/env node
// Harness Phase (BRIEF.md): per page, against the built site —
//   - Lighthouse: mobile Performance >= 95, LCP <= 2.5s, CLS <= 0.05.
//   - Link check: every internal <a href> (and in-page anchor targets used
//     by the footer's #id links) must resolve, no 404s.
//   - axe-core: no serious/critical violations.
// Writes audit-report.json. Exits non-zero if any page fails any check.
// Gates may not be softened without an explicit written operator answer.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.AUDIT_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'audit-report.json');
const AXE_PATH = path.join(ROOT, 'node_modules', 'axe-core', 'axe.min.js');

const THRESHOLDS = { performanceScore: 95, lcpMs: 2500, cls: 0.05 };

function loadPages() {
  const pagesPath = path.join(ROOT, 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found — run Phase 1 capture first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
}

async function runLighthouse(pages) {
  const lighthouse = (await import('lighthouse')).default;
  const chromeLauncher = await import('chrome-launcher');
  const chrome = await chromeLauncher.launch({
    chromePath: chromium.executablePath(),
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
    logLevel: 'error',
  });

  const results = [];
  try {
    for (const p of pages) {
      const url = `${BASE_URL}${p.path}`;
      const { lhr } = await lighthouse(url, {
        port: chrome.port,
        onlyCategories: ['performance'],
        logLevel: 'error',
      });
      const performanceScore = Math.round((lhr.categories.performance.score ?? 0) * 100);
      const lcpMs = lhr.audits['largest-contentful-paint']?.numericValue ?? null;
      const cls = lhr.audits['cumulative-layout-shift']?.numericValue ?? null;
      const pass =
        performanceScore >= THRESHOLDS.performanceScore &&
        lcpMs !== null &&
        lcpMs <= THRESHOLDS.lcpMs &&
        cls !== null &&
        cls <= THRESHOLDS.cls;

      results.push({
        path: p.path,
        performanceScore,
        lcpMs: lcpMs !== null ? Number(lcpMs.toFixed(0)) : null,
        cls: cls !== null ? Number(cls.toFixed(4)) : null,
        pass,
      });
      console.log(
        `  ${pass ? 'PASS' : 'FAIL'} ${p.path}: performance=${performanceScore} lcp=${lcpMs?.toFixed(0)}ms cls=${cls?.toFixed(4)}`
      );
    }
  } finally {
    await chrome.kill();
  }
  return results;
}

// Internal links are hard-failed (they're ours to keep working). External
// links (facebook.com, linkedin.com) are checked and reported but not
// hard-failed — third-party uptime/bot-blocking isn't something a broken
// build should be judged on.
async function runLinkCheck(browser, pages) {
  const origin = new URL(BASE_URL).origin;
  const internalLinks = new Map();
  const externalLinks = new Map();

  const context = await browser.newContext();
  const pageErrors = [];
  for (const p of pages) {
    const page = await context.newPage();
    const url = `${BASE_URL}${p.path}`;
    let response;
    try {
      response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });
    } catch (e) {
      pageErrors.push({ href: url, sources: [p.path], status: 0, ok: false, note: e.message });
      console.log(`  FAIL page ${url} -> ${e.message}`);
      await page.close();
      continue;
    }
    if (!response || response.status() >= 400) {
      const status = response ? response.status() : 0;
      pageErrors.push({ href: url, sources: [p.path], status, ok: false });
      console.log(`  FAIL page ${url} -> status ${status}`);
    }
    const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
    for (const href of hrefs) {
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) continue;
      let resolved;
      try {
        resolved = new URL(href, url);
      } catch {
        continue;
      }
      const bucket = resolved.origin === origin ? internalLinks : externalLinks;
      const key = resolved.toString();
      if (!bucket.has(key)) bucket.set(key, new Set());
      bucket.get(key).add(p.path);
    }
    await page.close();
  }
  await context.close();

  async function checkLinks(map, { hardFail }) {
    const out = [];
    for (const [href, sources] of map) {
      const u = new URL(href);
      const fragment = u.hash ? u.hash.slice(1) : null;
      const pageUrl = u.origin + u.pathname + u.search;
      let status = 0;
      let html = null;
      try {
        const res = await fetch(pageUrl, { redirect: 'follow' });
        status = res.status;
        if (fragment) html = await res.text();
      } catch {
        status = 0;
      }
      const anchorFound = fragment && html !== null ? new RegExp(`id=["']${fragment}["']`).test(html) : true;
      const ok = status >= 200 && status < 400 && anchorFound;
      const entry = { href, sources: [...sources], status, fragment, anchorFound, ok, hardFail };
      out.push(entry);
      if (!ok) {
        console.log(
          `  ${hardFail ? 'FAIL' : 'WARN'} link ${href} (from ${[...sources].join(', ')}) -> status ${status}${
            fragment ? `, anchor #${fragment} found=${anchorFound}` : ''
          }`
        );
      }
    }
    return out;
  }

  const internal = [...pageErrors, ...(await checkLinks(internalLinks, { hardFail: true }))];
  const external = await checkLinks(externalLinks, { hardFail: false });
  return { internal, external };
}

async function runAxe(browser, pages) {
  const axeSource = fs.readFileSync(AXE_PATH, 'utf8');
  const context = await browser.newContext();
  const results = [];
  for (const p of pages) {
    const page = await context.newPage();
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle', timeout: 45_000 });
    await page.addScriptTag({ content: axeSource });
    const axeResults = await page.evaluate(() => window.axe.run(document, { resultTypes: ['violations'] }));
    const serious = axeResults.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    const pass = serious.length === 0;
    results.push({
      path: p.path,
      violationCount: axeResults.violations.length,
      seriousOrCritical: serious.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length })),
      pass,
    });
    console.log(`  ${pass ? 'PASS' : 'FAIL'} ${p.path}: ${axeResults.violations.length} violation(s), ${serious.length} serious/critical`);
    await page.close();
  }
  await context.close();
  return results;
}

async function main() {
  const pages = loadPages();
  console.log(`Auditing ${BASE_URL} ...`);

  console.log('\nLighthouse (mobile performance/LCP/CLS):');
  const lighthouseResults = await runLighthouse(pages);

  const browser = await chromium.launch();
  console.log('\nLink check:');
  const linkResults = await runLinkCheck(browser, pages);
  console.log('\naxe-core (serious/critical violations):');
  const axeResults = await runAxe(browser, pages);
  await browser.close();

  const report = {
    baseUrl: BASE_URL,
    thresholds: THRESHOLDS,
    generatedAt: new Date().toISOString(),
    lighthouse: lighthouseResults,
    links: linkResults,
    axe: axeResults,
  };
  fs.writeFileSync(REPORT_JSON, JSON.stringify(report, null, 2));
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  const lighthouseFail = lighthouseResults.some((r) => !r.pass);
  const linkFail = linkResults.internal.some((l) => !l.ok);
  const axeFail = axeResults.some((r) => !r.pass);

  if (lighthouseFail || linkFail || axeFail) {
    console.error(`\nAUDIT FAILED: lighthouse=${lighthouseFail} links=${linkFail} axe=${axeFail}`);
    process.exit(1);
  }
  console.log('\nAll audits passed.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
