#!/usr/bin/env node
// UI audit screenshots (`npm run shots`).
// Full-page shots of a fixed page set at five widths, plus home hero
// samples at 0/25/50/100% of the hero section's sticky scroll range.
// Reuses scripts/lib/shoot.js (same Playwright settings as `npm run
// screenshot`). Writes qa/shots/latest/ only. Does not touch app code,
// /screenshots, or /reference.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { USER_AGENT } = require('./lib/site');
const { slugFor, shootPage } = require('./lib/shoot');
const { ensureServer } = require('./lib/devserver');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'qa', 'shots', 'latest');
const BASE_URL = process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';

const PAGES = [
  '/',
  '/who-we-are/',
  '/how-we-work/',
  '/partners/suppliers/',
  '/request-a-quote/',
  '/faq/',
  '/resources/gma-pallets-and-grades/',
  '/resources/pallet-calculators/boxes-per-pallet/',
];

const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

const HERO_VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 },
];

const HERO_PCTS = [0, 25, 50, 100];

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
`;

// Sticky scroll distance of the hero track: from the track top aligned to
// the viewport top, until the track bottom aligns with the viewport bottom
// (the moment the sticky panel releases). 100% is still on screen.
async function heroScrollY(page, pct) {
  return page.evaluate((percent) => {
    const h1 = document.querySelector('h1');
    if (!h1) return { error: 'home h1 not found' };
    let el = h1.parentElement;
    let track = null;
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.offsetHeight > window.innerHeight + 8) {
        track = el;
        break;
      }
      el = el.parentElement;
    }
    if (!track) return { error: 'hero track taller than the viewport was not found' };
    const top = track.getBoundingClientRect().top + window.scrollY;
    const range = Math.max(0, track.offsetHeight - window.innerHeight);
    return {
      y: Math.round(top + (percent / 100) * range),
      top: Math.round(top),
      range: Math.round(range),
      trackHeight: track.offsetHeight,
    };
  }, pct);
}

async function shootHero(browser, viewport, pct, outPath) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.fonts.ready);
  const target = await heroScrollY(page, pct);
  if (target.error) throw new Error(target.error);
  await page.evaluate((y) => window.scrollTo(0, y), target.y);
  await page.waitForTimeout(400);
  await page.screenshot({ path: outPath, fullPage: false, timeout: 60_000 });
  await context.close();
  return target;
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await ensureServer(BASE_URL, ROOT);
  const browser = await chromium.launch();
  let failures = 0;
  const expected = [];

  try {
    for (const urlPath of PAGES) {
      for (const viewport of VIEWPORTS) {
        const outPath = path.join(OUT_DIR, `${slugFor(urlPath)}-${viewport.name}.png`);
        expected.push(outPath);
        try {
          await shootPage(browser, BASE_URL, urlPath, viewport, outPath);
          console.log(`  OK ${urlPath} @ ${viewport.name}`);
        } catch (e) {
          failures += 1;
          console.error(`  FAILED ${urlPath} @ ${viewport.name}: ${e.message}`);
        }
      }
    }

    for (const viewport of HERO_VIEWPORTS) {
      for (const pct of HERO_PCTS) {
        const outPath = path.join(OUT_DIR, `hero-${viewport.name}-${pct}.png`);
        expected.push(outPath);
        try {
          const target = await shootHero(browser, viewport, pct, outPath);
          console.log(
            `  OK hero @ ${viewport.name} ${pct}% (scroll ${target.y}px, range ${target.range}px)`
          );
        } catch (e) {
          failures += 1;
          console.error(`  FAILED hero @ ${viewport.name} ${pct}%: ${e.message}`);
        }
      }
    }
  } finally {
    await browser.close();
    await server.stop();
  }

  const missing = expected.filter((file) => !fs.existsSync(file) || fs.statSync(file).size < 1000);
  if (missing.length > 0) {
    failures += missing.length;
    for (const file of missing) console.error(`  MISSING ${path.relative(ROOT, file)}`);
  }

  if (failures > 0) {
    console.error(`\n${failures} screenshot(s) failed.`);
    process.exit(1);
  }
  console.log(`\nWrote ${expected.length} screenshots to qa/shots/latest/.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
