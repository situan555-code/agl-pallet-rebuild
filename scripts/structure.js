#!/usr/bin/env node
// Section E gate 1: structure parity — heading/nav/main/footer landmarks +
// per-section imageCount (hard). Divi duplicate <nav> noise collapsed.
// Accepted image gaps: DIFFS.md /products/ Crates & Dunnage, Shipping Blocks.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { slugFor } = require('./lib/shoot');
const { extractLandmarks } = require('./lib/parse');
const { ensureServer } = require('./lib/devserver');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.STRUCTURE_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'structure-report.json');

// Heading text (case-insensitive) whose imageCount may differ from capture.
const ACCEPTED_IMAGE_GAPS = {
  '/products/': [/crates\s*&\s*dunnage/i, /shipping\s*blocks/i],
};

function loadPages() {
  const pagesPath = path.join(ROOT, 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found — run Phase 1 capture first.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
}

function normalizeLandmarks(list) {
  // Collapse consecutive identical nav signatures (Divi often emits 3).
  const out = [];
  for (const lm of list) {
    const prev = out[out.length - 1];
    if (lm.type === 'nav' && prev && prev.type === 'nav') continue;
    out.push(lm);
  }
  return out;
}

function signature(lm) {
  // Ignore whitespace (Divi soft-hyphen capture often collapses to MoreReliable).
  const text = (lm.text || '').toLowerCase().replace(/\s+/g, '');
  return lm.type + (text ? `:${text}` : '');
}

function diffSequences(a, b) {
  const n = a.length;
  const m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  let i = 0;
  let j = 0;
  const missingIdx = [];
  const extraIdx = [];
  const pairs = [];
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      pairs.push([i, j]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      missingIdx.push(i++);
    } else {
      extraIdx.push(j++);
    }
  }
  while (i < n) missingIdx.push(i++);
  while (j < m) extraIdx.push(j++);
  return { missingIdx, extraIdx, pairs };
}

function isAcceptedImageGap(pagePath, headingText) {
  const rules = ACCEPTED_IMAGE_GAPS[pagePath] || [];
  return rules.some((re) => re.test(headingText || ''));
}

async function main() {
  const pages = loadPages();
  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  const results = [];
  let anyFail = false;

  try {
    for (const pageInfo of pages) {
      const slug = slugFor(pageInfo.path);
      const captureFile = path.join(ROOT, 'capture', `${slug}.html`);
      const entry = { path: pageInfo.path, captureFile: path.relative(ROOT, captureFile) };

      if (!fs.existsSync(captureFile)) {
        entry.status = 'error';
        entry.error = `missing capture HTML: capture/${slug}.html`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path}: ${entry.error}`);
        continue;
      }

      const capturePage = await browser.newPage();
      await capturePage.setContent(fs.readFileSync(captureFile, 'utf8'), { waitUntil: 'domcontentloaded' });
      const captureLandmarks = normalizeLandmarks(await capturePage.evaluate(extractLandmarks));
      await capturePage.close();

      const builtPage = await browser.newPage();
      let builtLandmarks;
      try {
        await builtPage.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 45_000 });
        builtLandmarks = normalizeLandmarks(await builtPage.evaluate(extractLandmarks));
      } catch (e) {
        entry.status = 'error';
        entry.error = `failed to load built page: ${e.message}`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path}: ${entry.error}`);
        await builtPage.close();
        continue;
      }
      await builtPage.close();

      const captureSig = captureLandmarks.map(signature);
      const builtSig = builtLandmarks.map(signature);
      const { missingIdx, extraIdx, pairs } = diffSequences(captureSig, builtSig);

      let missing = missingIdx.map((idx) => captureLandmarks[idx]);
      let extraAll = extraIdx.map((idx) => builtLandmarks[idx]);

      // Extra <main> is fine (Next wraps content; Divi often has none).
      extraAll = extraAll.filter((lm) => lm.type !== 'main');
      // Missing extra Divi navs after collapse should be rare; still ignore
      // pure nav-count deficits when built has ≥1 nav.
      const builtHasNav = builtLandmarks.some((lm) => lm.type === 'nav');
      missing = missing.filter((lm) => !(lm.type === 'nav' && builtHasNav));

      const duplicated = extraAll.filter((lm) => captureSig.includes(signature(lm)));
      const extra = extraAll.filter((lm) => !captureSig.includes(signature(lm)));

      // Hard gate: dropped images only (built < capture). Extra imgs in built
      // are advisory (icon/CTA boundary noise, license-to-improve). Accepted
      // gaps (DIFFS.md) skip the check entirely for named product sections.
      const imageMismatches = [];
      for (const [ci, bi] of pairs) {
        const c = captureLandmarks[ci];
        const b = builtLandmarks[bi];
        if (!/^h[1-3]$/.test(c.type)) continue;
        if (c.imageCount === b.imageCount) continue;
        const accepted = isAcceptedImageGap(pageInfo.path, c.text);
        const dropped = b.imageCount < c.imageCount;
        imageMismatches.push({
          text: c.text,
          capture: c.imageCount,
          built: b.imageCount,
          accepted,
          dropped,
        });
      }
      const hardImageFails = imageMismatches.filter((m) => m.dropped && !m.accepted);

      entry.captureLandmarks = captureLandmarks;
      entry.builtLandmarks = builtLandmarks;
      entry.missing = missing;
      entry.duplicated = duplicated;
      entry.extra = extra;
      entry.imageMismatches = imageMismatches;
      entry.status =
        missing.length === 0 && duplicated.length === 0 && hardImageFails.length === 0
          ? 'pass'
          : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(
        `  ${entry.status.toUpperCase()} ${pageInfo.path}: missing=${missing.length} duplicated=${duplicated.length} ` +
          `extra=${extra.length} imageΔ=${hardImageFails.length} (accepted image gaps=${imageMismatches.length - hardImageFails.length})`
      );
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
    console.error('\nSTRUCTURE FAILED: one or more pages have missing or duplicated landmarks (see structure-report.json).');
    process.exit(1);
  }
  console.log('\nAll pages match capture structure.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
