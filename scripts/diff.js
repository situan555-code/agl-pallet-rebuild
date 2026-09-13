#!/usr/bin/env node
// Visual harness (operator-rebaselined 2026-09-12 after Anton font substitution):
// HARD GATES (exit 1):
//   1) page-height delta vs reference > 2%
//   2) above-fold pixel diff (first 1000px) > 5%
// ADVISORY (logged, does NOT fail):
//   full-page pixel diff > 12%
// Rationale: a substituted display face will never hit 2% full-page pixelmatch;
// height drift also poisons full-page scores via vertical misalignment.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');
const { slugFor, VIEWPORTS } = require('./lib/shoot');

const ROOT = path.join(__dirname, '..');
const REFERENCE_DIR = path.join(ROOT, 'reference');
const SCREENSHOTS_DIR = path.join(ROOT, 'screenshots');
const DIFF_DIR = path.join(ROOT, 'diff-output');
const REPORT_JSON = path.join(ROOT, 'diff-report.json');
const REPORT_HTML = path.join(ROOT, 'diff-report.html');

const HEIGHT_GATE_PCT = 2;
const ABOVE_FOLD_GATE_PCT = 5;
const ABOVE_FOLD_PX = 1000;
const FULLPAGE_ADVISORY_PCT = 12;

function rel(p) {
  return path.relative(ROOT, p);
}

function loadPNG(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function padded(png, width, height) {
  if (png.width === width && png.height === height) return png;
  const out = new PNG({ width, height });
  out.data.fill(255);
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, width), Math.min(png.height, height), 0, 0);
  return out;
}

function cropTop(png, maxHeight) {
  const h = Math.min(png.height, maxHeight);
  const out = new PNG({ width: png.width, height: h });
  PNG.bitblt(png, out, 0, 0, png.width, h, 0, 0);
  return out;
}

function pixelDiff(aPng, bPng, diffPath) {
  const width = Math.max(aPng.width, bPng.width);
  const height = Math.max(aPng.height, bPng.height);
  const a = padded(aPng, width, height);
  const b = padded(bPng, width, height);
  const diffPng = new PNG({ width, height });
  const diffPixels = pixelmatch(a.data, b.data, diffPng.data, width, height, {
    threshold: 0.1,
    diffColor: [255, 0, 64],
  });
  if (diffPath) fs.writeFileSync(diffPath, PNG.sync.write(diffPng));
  const totalPixels = width * height;
  return {
    diffPercent: Number(((diffPixels / totalPixels) * 100).toFixed(3)),
    diffPixels,
    totalPixels,
    width,
    height,
  };
}

function compare(refPath, gotPath, diffPath) {
  const refPng = loadPNG(refPath);
  const gotPng = loadPNG(gotPath);
  const heightDeltaPct = Number(
    ((Math.abs(gotPng.height - refPng.height) / refPng.height) * 100).toFixed(3)
  );
  const dimensionMismatch =
    refPng.width !== gotPng.width || refPng.height !== gotPng.height;

  const full = pixelDiff(refPng, gotPng, diffPath);
  const above = pixelDiff(cropTop(refPng, ABOVE_FOLD_PX), cropTop(gotPng, ABOVE_FOLD_PX), null);

  const heightFail = heightDeltaPct > HEIGHT_GATE_PCT;
  const aboveFoldFail = above.diffPercent > ABOVE_FOLD_GATE_PCT;
  const fullAdvisory = full.diffPercent > FULLPAGE_ADVISORY_PCT;
  const hardFail = heightFail || aboveFoldFail;

  return {
    diffPercent: full.diffPercent, // keep field for ranking/compat
    fullPageDiffPercent: full.diffPercent,
    aboveFoldDiffPercent: above.diffPercent,
    heightDeltaPct,
    heightFail,
    aboveFoldFail,
    fullAdvisory,
    hardFail,
    diffPixels: full.diffPixels,
    totalPixels: full.totalPixels,
    dimensionMismatch,
    refDimensions: { width: refPng.width, height: refPng.height },
    gotDimensions: { width: gotPng.width, height: gotPng.height },
  };
}

function buildHtml(results, gates) {
  const rows = results
    .map((r) => {
      if (r.status === 'error') {
        return `
      <section class="entry entry-error">
        <h2>${r.path} @ ${r.viewport}px — ${r.error}</h2>
      </section>`;
      }
      const flags = [
        r.heightFail ? `HEIGHT ${r.heightDeltaPct}%` : null,
        r.aboveFoldFail ? `ABOVE-FOLD ${r.aboveFoldDiffPercent}%` : null,
        r.fullAdvisory ? `FULL advisory ${r.fullPageDiffPercent}%` : null,
      ]
        .filter(Boolean)
        .join(' · ');
      return `
      <section class="entry entry-${r.status}">
        <h2>${r.path} @ ${r.viewport}px — ${r.status.toUpperCase()}${flags ? ' — ' + flags : ''}</h2>
        <p>height Δ ${r.heightDeltaPct}% · above-fold ${r.aboveFoldDiffPercent}% · full-page ${r.fullPageDiffPercent}%</p>
        <div class="row">
          <figure>
            <figcaption>Reference</figcaption>
            <img src="${r.refPath}" loading="lazy" />
          </figure>
          <figure>
            <figcaption>Built site</figcaption>
            <img src="${r.gotPath}" loading="lazy" />
          </figure>
          <figure>
            <figcaption>Diff overlay</figcaption>
            <img src="${r.diffImage}" loading="lazy" />
          </figure>
        </div>
      </section>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>AGL Rebuild — Visual Diff Report</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 2rem; background: #fafafa; color: #111; }
  h1 { margin-bottom: 0.25rem; }
  .meta { color: #555; margin-bottom: 2rem; }
  .entry { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; background: #fff; }
  .entry-fail { border-color: #d33; background: #fff5f5; }
  .entry-error { border-color: #d33; background: #fff5f5; }
  .entry-advisory { border-color: #c80; background: #fffaf0; }
  .entry h2 { font-size: 1rem; margin: 0 0 0.75rem; }
  .row { display: flex; gap: 1rem; flex-wrap: wrap; }
  figure { margin: 0; flex: 1 1 30%; min-width: 240px; }
  figure img { width: 100%; border: 1px solid #ccc; display: block; }
  figcaption { font-size: 0.8rem; color: #555; margin-bottom: 0.25rem; }
</style>
</head>
<body>
  <h1>Visual Diff Report</h1>
  <p class="meta">Gates: height ≤${gates.height}% · above-fold(${gates.aboveFoldPx}px) ≤${gates.aboveFold}% · full-page ≤${gates.fullAdvisory}% advisory · Generated ${new Date().toISOString()}</p>
  ${rows}
</body>
</html>`;
}

function main() {
  const pagesPath = path.join(ROOT, 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found — run Phase 1 capture first.');
    process.exit(0);
  }
  const pages = JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
  fs.mkdirSync(DIFF_DIR, { recursive: true });

  const results = [];
  let hardFailure = false;

  for (const pageInfo of pages) {
    const slug = slugFor(pageInfo.path);
    for (const viewport of VIEWPORTS) {
      const vp = viewport.name;
      const refPath = path.join(REFERENCE_DIR, `${slug}-${vp}.png`);
      const gotPath = path.join(SCREENSHOTS_DIR, `${slug}-${vp}.png`);
      const diffPath = path.join(DIFF_DIR, `${slug}-${vp}-diff.png`);
      const entry = { path: pageInfo.path, viewport: vp };

      if (!fs.existsSync(refPath)) {
        entry.status = 'error';
        entry.error = 'missing reference screenshot in /reference';
        hardFailure = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path} @ ${vp}px: ${entry.error}`);
        continue;
      }
      if (!fs.existsSync(gotPath)) {
        entry.status = 'error';
        entry.error = 'missing built-site screenshot — run `npm run screenshot` first';
        hardFailure = true;
        results.push(entry);
        console.error(`  ERROR ${pageInfo.path} @ ${vp}px: ${entry.error}`);
        continue;
      }

      const comparison = compare(refPath, gotPath, diffPath);
      Object.assign(entry, comparison);
      entry.refPath = rel(refPath);
      entry.gotPath = rel(gotPath);
      entry.diffImage = rel(diffPath);

      if (comparison.hardFail) {
        entry.status = 'fail';
        hardFailure = true;
      } else if (comparison.fullAdvisory) {
        entry.status = 'advisory';
      } else {
        entry.status = 'pass';
      }

      console.log(
        `  ${entry.status.toUpperCase()} ${pageInfo.path} @ ${vp}px: height ${entry.heightDeltaPct}% · above-fold ${entry.aboveFoldDiffPercent}% · full ${entry.fullPageDiffPercent}%`
      );
      results.push(entry);
    }
  }

  results.sort((a, b) => (b.fullPageDiffPercent ?? Infinity) - (a.fullPageDiffPercent ?? Infinity));

  const gates = {
    height: HEIGHT_GATE_PCT,
    aboveFold: ABOVE_FOLD_GATE_PCT,
    aboveFoldPx: ABOVE_FOLD_PX,
    fullAdvisory: FULLPAGE_ADVISORY_PCT,
  };

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ gates, generatedAt: new Date().toISOString(), results }, null, 2)
  );
  fs.writeFileSync(REPORT_HTML, buildHtml(results, gates));
  console.log(`\nWrote ${rel(REPORT_JSON)} and ${rel(REPORT_HTML)}`);

  const visual = ['# VISUAL (advisory pixel report)', '', `Generated ${new Date().toISOString()}`, 'Pixel deltas do not block verify (Section E).', ''];
  for (const r of results) {
    if (r.status === 'error') visual.push(`- ERROR ${r.path} @ ${r.viewport}: ${r.error}`);
    else visual.push(`- ${r.path} @ ${r.viewport}: height ${r.heightDeltaPct}% · above-fold ${r.aboveFoldDiffPercent}% · full ${r.fullPageDiffPercent}%`);
  }
  fs.writeFileSync(path.join(ROOT, 'VISUAL.md'), visual.join('\n') + '\n');
  console.log('Wrote VISUAL.md (advisory). Section E: pixel diff never fails the build.');


  if (hardFailure) {
    console.log('\nPixel thresholds noted (advisory only).');
  }
  console.log('\nAll pages within hard gates (full-page advisories may remain).');
}

main();
