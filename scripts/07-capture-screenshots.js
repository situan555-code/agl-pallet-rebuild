// Phase 1, step 6: reference screenshots.
// One-time capture of every page in pages.json against the LIVE site at
// 390/768/1440, deterministic settings (see scripts/lib/shoot.js). These
// are the visual ground truth for the whole project — /reference is never
// regenerated after Phase 1 sign-off. Do not rerun this casually; the
// repeatable screenshot pass used during verification is `npm run
// screenshot` (scripts/screenshot.js), which shoots the *built* site into
// /screenshots and leaves /reference untouched.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, CRAWL_DELAY_MS } = require('./lib/site');
const { VIEWPORTS, slugFor, shootPage } = require('./lib/shoot');

const ROOT = path.join(__dirname, '..');
const REFERENCE_DIR = path.join(ROOT, 'reference');

async function main() {
  const pages = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
  fs.mkdirSync(REFERENCE_DIR, { recursive: true });

  const browser = await chromium.launch();
  const shots = [];
  for (const pageInfo of pages) {
    for (const viewport of VIEWPORTS) {
      console.log(`Shooting ${pageInfo.path} @ ${viewport.name}px ...`);
      const slug = slugFor(pageInfo.path);
      const outPath = path.join(REFERENCE_DIR, `${slug}-${viewport.name}.png`);
      await shootPage(browser, BASE_URL, pageInfo.path, viewport, outPath);
      shots.push(outPath);
      await new Promise((r) => setTimeout(r, CRAWL_DELAY_MS));
    }
  }
  await browser.close();

  console.log(`\nWrote ${shots.length} reference screenshots to /reference.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
