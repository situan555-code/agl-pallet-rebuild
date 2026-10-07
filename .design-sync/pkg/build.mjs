// design-sync wrapper build (cfg.buildCmd). Run from the repo root:
//   node .design-sync/pkg/build.mjs
// 1. types/  - .d.ts tree for the entry (tsc), flattened so it has no dot-dirs
//              and no @/ aliases (the converter's ts-morph pass has no paths).
// 2. agl.css - app/globals.css compiled with @tailwindcss/postcss (cfg.cssEntry).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, relative, resolve } from "node:path";

const repo = process.cwd();
const pkg = resolve(repo, ".design-sync/pkg");
const require = createRequire(join(repo, "package.json"));

// -- 1. types
const types = join(pkg, "types");
rmSync(types, { recursive: true, force: true });
execFileSync(join(repo, "node_modules/.bin/tsc"), [
  "-p", join(pkg, "tsconfig.json"),
  "--declaration", "--emitDeclarationOnly", "--noEmit", "false",
  "--rootDir", repo, "--outDir", types,
], { stdio: "inherit" });
const emittedEntry = join(types, ".design-sync/pkg/index.d.ts");
writeFileSync(join(types, "index.d.ts"),
  readFileSync(emittedEntry, "utf8").replaceAll('"../../', '"./'));
rmSync(join(types, ".design-sync"), { recursive: true, force: true });
const walk = (d) => readdirSync(d).flatMap((f) => {
  const p = join(d, f);
  return statSync(p).isDirectory() ? walk(p) : p.endsWith(".d.ts") ? [p] : [];
});
for (const f of walk(types)) {
  const src = readFileSync(f, "utf8");
  const out = src.replace(/(["'])@\/([^"']+)\1/g, (_, q, p) => {
    let rel = relative(dirname(f), join(types, p));
    if (!rel.startsWith(".")) rel = "./" + rel;
    return q + rel + q;
  });
  if (out !== src) writeFileSync(f, out);
}
console.error(`types: ${walk(types).length} .d.ts files`);

// -- 2. css
const postcss = require("postcss");
const tailwind = require("@tailwindcss/postcss");
const input = join(pkg, "tailwind.css");
const result = await postcss([tailwind({ base: repo })]).process(readFileSync(input, "utf8"), { from: input, to: join(pkg, "agl.css") });
writeFileSync(join(pkg, "agl.css"), result.css);
console.error(`css: agl.css ${(result.css.length / 1024).toFixed(0)} KB`);
