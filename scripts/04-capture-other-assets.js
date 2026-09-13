// Phase 1, step 4: other assets.
// Step 3 only caught images referenced via <img>, <source>, srcset, or a
// computed CSS background-image at rest. This step sweeps the raw captured
// HTML for every /wp-content/uploads/ reference of any kind (favicons,
// apple-touch-icon, og:image, hover-state icons swapped by JS, video files,
// PDFs) so nothing that only shows up in a raw href/src attribute or a
// hover/JS-driven swap is missed. Anything already in assets-manifest.json
// is skipped.
const fs = require('fs');
const path = require('path');
const { USER_AGENT, politeMap, MAX_CONCURRENCY, CRAWL_DELAY_MS } = require('./lib/site');

const ROOT = path.join(__dirname, '..');
const ASSETS_DIR = path.join(ROOT, 'assets');
const CAPTURE_DIR = path.join(ROOT, 'capture');

const ASSET_EXT_RE = /\/wp-content\/uploads\/[^\s"'()]+\.(svg|jpe?g|png|gif|webp|mp4|webm|pdf|ico)/gi;

function stripSizeSuffix(pathname) {
  const m = pathname.match(/^(.*)-\d+x\d+(\.\w+)$/);
  return m ? m[1] + m[2] : pathname;
}

function localNameFor(originalUrl) {
  return path
    .basename(new URL(originalUrl).pathname)
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-');
}

async function main() {
  const htmlFiles = fs
    .readdirSync(CAPTURE_DIR)
    .filter((f) => f.endsWith('.html'));

  const existingManifest = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'assets-manifest.json'), 'utf8')
  );
  const knownResolved = new Set(existingManifest.map((m) => m.resolvedUrl));
  const knownLocalFiles = new Set(
    fs.readdirSync(ASSETS_DIR).map((f) => f.toLowerCase())
  );

  const found = new Map(); // resolvedUrl -> Set(pages)
  for (const file of htmlFiles) {
    const html = fs.readFileSync(path.join(CAPTURE_DIR, file), 'utf8');
    const slug = file.replace(/\.html$/, '');
    const matches = html.match(ASSET_EXT_RE) || [];
    for (const m of matches) {
      const full = new URL(m, 'https://aglpallet.com').toString();
      const resolvedPath = stripSizeSuffix(new URL(full).pathname);
      const resolved = `https://aglpallet.com${resolvedPath}`;
      if (!found.has(resolved)) found.set(resolved, new Set());
      found.get(resolved).add(slug);
    }
  }

  const newUrls = [...found.keys()].filter((u) => !knownResolved.has(u));
  console.log(`Found ${found.size} distinct asset URLs, ${newUrls.length} not already captured.`);

  const newEntries = [];
  const failed = [];
  await politeMap(newUrls, MAX_CONCURRENCY, CRAWL_DELAY_MS, async (url) => {
    const localName = localNameFor(url);
    if (knownLocalFiles.has(localName.toLowerCase())) return; // already on disk
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(path.join(ASSETS_DIR, localName), buf);
      newEntries.push({
        originalUrl: url,
        resolvedUrl: url,
        localFile: `assets/${localName}`,
        usedOnPages: [...found.get(url)].sort(),
      });
      console.log(`  OK ${localName} (${buf.length} bytes)`);
    } catch (e) {
      failed.push({ url, error: e.message });
      console.log(`  FAILED ${url}: ${e.message}`);
    }
  });

  const merged = [...existingManifest, ...newEntries].sort((a, b) =>
    a.localFile.localeCompare(b.localFile)
  );
  fs.writeFileSync(
    path.join(ROOT, 'assets-manifest.json'),
    JSON.stringify(merged, null, 2) + '\n'
  );

  console.log(`\nAdded ${newEntries.length} new assets. ${failed.length} failed.`);
  if (failed.length) console.log(JSON.stringify(failed, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
