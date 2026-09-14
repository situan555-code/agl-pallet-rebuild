// Generates tiny base64 LQIP placeholders for every photographic (jpg/png)
// image referenced from /content/pages/*.json, keyed by its /assets/... path.
// Re-run after adding or replacing a photo in /content. SVG icons are
// excluded — they're small, vector, and load fast enough that a blur
// placeholder adds nothing.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const CONTENT_DIR = path.join(__dirname, "..", "content", "pages");
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const OUT_FILE = path.join(__dirname, "..", "lib", "blur-placeholders.json");

function collectImagePaths(value, acc) {
  if (typeof value === "string") {
    if (/^\/assets\/.*\.(jpe?g|png)$/i.test(value)) acc.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((v) => collectImagePaths(v, acc));
  } else if (value && typeof value === "object") {
    Object.values(value).forEach((v) => collectImagePaths(v, acc));
  }
}

async function main() {
  const paths = new Set();
  for (const file of fs.readdirSync(CONTENT_DIR)) {
    if (!file.endsWith(".json")) continue;
    const json = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
    collectImagePaths(json, paths);
  }

  const map = {};
  for (const assetPath of paths) {
    const filePath = path.join(PUBLIC_DIR, assetPath);
    if (!fs.existsSync(filePath)) {
      console.warn(`skip (file not found): ${assetPath}`);
      continue;
    }
    const buf = await sharp(filePath).resize(16).jpeg({ quality: 40 }).toBuffer();
    map[assetPath] = `data:image/jpeg;base64,${buf.toString("base64")}`;
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(map, null, 2) + "\n");
  console.log(`Wrote ${Object.keys(map).length} blur placeholders to ${path.relative(process.cwd(), OUT_FILE)}`);
}

main();
