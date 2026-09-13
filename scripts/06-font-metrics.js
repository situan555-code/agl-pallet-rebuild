// Ad-hoc helper (Phase 1, step 5 support): measures the self-hosted
// "CoFo Peshka" display face against candidate Google Fonts substitutes at
// the same pixel size, using canvas TextMetrics for width and cap-height
// (actualBoundingBoxAscent of an all-caps string sits at the cap-height for
// a font with no descenders in the sample). Used to pick + justify the
// fonts.md substitution recommendation with real numbers instead of eyeballing.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const FONT_FILE = path.join(ROOT, 'capture', 'fonts-tmp', '1865cofopeshka550.woff2');
const SAMPLE = 'FOR MANUFACTURERS';
const PX = 48;

const CANDIDATES = ['Bungee', 'Anton', 'Fredoka', 'Big Shoulders'];

async function main() {
  const fontBuf = fs.readFileSync(FONT_FILE);
  const fontBase64 = fontBuf.toString('base64');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const googleFontsCss = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${CANDIDATES.map((c) =>
        c.replace(/ /g, '+') + ':wght@700;900'
      ).join('&family=')}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
  ).text();

  await page.setContent(`
    <html><head><style>
      @font-face {
        font-family: 'CoFoPeshkaOriginal';
        src: url(data:font/woff2;base64,${fontBase64}) format('woff2');
      }
      ${googleFontsCss}
    </style></head><body></body></html>
  `);
  const results = await page.evaluate(
    async ({ sample, px, candidates }) => {
      async function measure(family, weight) {
        await document.fonts.load(`${weight} ${px}px "${family}"`, sample);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = `${weight} ${px}px "${family}"`;
        const m = ctx.measureText(sample);
        return {
          width: m.width,
          capHeight: (m.actualBoundingBoxAscent || 0),
        };
      }
      const out = { original: await measure('CoFoPeshkaOriginal', 400) };
      for (const c of candidates) {
        out[`${c} 700`] = await measure(c, 700);
        out[`${c} 900`] = await measure(c, 900);
      }
      return out;
    },
    { sample: SAMPLE, px: PX, candidates: CANDIDATES }
  );

  await browser.close();

  const origWidth = results.original.width;
  const origCap = results.original.capHeight;
  const report = { sample: SAMPLE, px: PX, original: results.original, candidates: {} };
  for (const key of Object.keys(results)) {
    if (key === 'original') continue;
    const r = results[key];
    report.candidates[key] = {
      ...r,
      widthDeltaPct: (((r.width - origWidth) / origWidth) * 100).toFixed(1),
      capHeightDeltaPct: origCap ? (((r.capHeight - origCap) / origCap) * 100).toFixed(1) : null,
    };
  }

  fs.writeFileSync(
    path.join(ROOT, 'capture', 'font-metric-comparison.json'),
    JSON.stringify(report, null, 2) + '\n'
  );
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
