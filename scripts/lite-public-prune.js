#!/usr/bin/env node
// Launch build only. Writes .vercelignore entries for public images the six
// launch pages do not reference. Files stay in git so the demo tree is intact.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const flag = require("../lib/launch-lite.json");
const PUBLIC = path.join(ROOT, "public");
const IMAGE_RE = /\.(?:webp|jpe?g|png|gif|svg|mp4)$/i;
const ASSET_RE = /\/(?:assets\/[A-Za-z0-9_./-]+\.(?:webp|jpe?g|png|gif|svg|mp4)|favicon\.ico|favicon\.png|icon-192\.png|icon-512\.png|apple-touch-icon\.png|site\.webmanifest)/g;

const ENTRIES = [
  "app/page.tsx",
  "app/layout.tsx",
  "app/who-we-are/page.tsx",
  "app/how-we-work/page.tsx",
  "app/industries/page.tsx",
  "app/products/page.tsx",
  "app/request-a-quote/page.tsx",
  "app/sitemap.ts",
  "app/robots.ts",
  "proxy.ts",
];

const SKIP_DIR = [
  `${path.sep}content${path.sep}resources${path.sep}`,
  `${path.sep}app${path.sep}resources${path.sep}`,
  `${path.sep}app${path.sep}partners${path.sep}`,
  `${path.sep}app${path.sep}faq${path.sep}`,
  `${path.sep}app${path.sep}services${path.sep}`,
  `${path.sep}app${path.sep}the-pledge${path.sep}`,
  `${path.sep}app${path.sep}custom-engineered${path.sep}`,
  `${path.sep}app${path.sep}case-studies${path.sep}`,
  `${path.sep}app${path.sep}contact${path.sep}`,
];

const SKIP_FILE = new Set(
  [
    "components/SearchTrigger.tsx",
    "components/SearchDialog.tsx",
    "lib/search-index.ts",
    "lib/authors.ts",
    "lib/ppi-dataset.ts",
    "lib/blur-placeholders.json",
  ].map((rel) => path.join(ROOT, rel)),
);

function walkPublic(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkPublic(full, out);
    else out.push(full);
  }
  return out;
}

function resolveImport(fromFile, spec) {
  let base;
  if (spec.startsWith("@/")) base = path.join(ROOT, spec.slice(2));
  else if (spec.startsWith(".")) base = path.resolve(path.dirname(fromFile), spec);
  else return null;
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.json`, path.join(base, "index.ts"), path.join(base, "index.tsx")];
  return candidates.find((c) => fs.existsSync(c) && fs.statSync(c).isFile()) || null;
}

function skipped(file) {
  if (SKIP_FILE.has(file)) return true;
  return SKIP_DIR.some((part) => file.includes(part));
}

function collectUsed() {
  const used = new Set([
    "favicon.ico",
    "favicon.png",
    "icon-192.png",
    "icon-512.png",
    "apple-touch-icon.png",
    "site.webmanifest",
  ]);
  const seen = new Set();
  const queue = ENTRIES.map((rel) => path.join(ROOT, rel));
  while (queue.length) {
    const file = queue.pop();
    if (!file || seen.has(file) || skipped(file) || !fs.existsSync(file)) continue;
    seen.add(file);
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(ASSET_RE)) {
      used.add(match[0].replace(/^\//, ""));
    }
    for (const spec of text.matchAll(/from\s+["']([^"']+)["']/g)) {
      const next = resolveImport(file, spec[1]);
      if (next) queue.push(next);
    }
    for (const spec of text.matchAll(/import\(\s*["']([^"']+)["']\s*\)/g)) {
      const next = resolveImport(file, spec[1]);
      if (next) queue.push(next);
    }
  }
  return used;
}

function main() {
  if (!flag.enabled) {
    console.log("lite-public-prune: launch flag is off, leaving .vercelignore unchanged");
    return;
  }
  const used = collectUsed();
  const unused = walkPublic(PUBLIC)
    .map((full) => path.relative(PUBLIC, full).split(path.sep).join("/"))
    .filter((rel) => IMAGE_RE.test(rel) && !used.has(rel))
    .sort();
  const body = [
    "# Launch-lite build. Unused public images are not uploaded.",
    "# Source files stay in git. Regenerate with: node scripts/lite-public-prune.js",
    ...unused.map((rel) => `public/${rel}`),
    "",
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, ".vercelignore"), body);
  console.log(`lite-public-prune: kept ${used.size} referenced public paths, ignored ${unused.length} unused images`);
  for (const rel of unused) console.log(`  public/${rel}`);
}

main();
