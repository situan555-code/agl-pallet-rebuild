#!/usr/bin/env node
// §2.3 — fail the production build if any rendered page contains the literal
// strings "{{" or "TBD". Also fails if a rendered page still contains an
// absolute *.vercel.app URL (internal links and assets must be root-relative;
// canonical and JSON-LD stay on SITE_URL and must not point at the demo host).
//
// Runs after `next build`. Starts `next start`, requests every App Router
// page (dynamic [slug] guides expanded from hub.json), and scans the HTML.
const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PLACEHOLDER_GUARD_PORT || 3999);
const HOST = "127.0.0.1";
const DEDICATED = new Set(["glossary", "pallet-prices", "pallets-per-truckload", "pallet-calculators"]);
const MUST_404 = ["/resources/sell-recycle-pallets/"];

function collectRoutes() {
  const hub = JSON.parse(fs.readFileSync(path.join(ROOT, "content/resources/hub.json"), "utf8"));
  const appDir = path.join(ROOT, "app");
  const routes = new Set();

  function walk(dir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name === "page.tsx") routesFromPage(full);
    }
  }

  function routesFromPage(file) {
    const rel = path.relative(appDir, file).replace(/\\/g, "/");
    if (rel === "page.tsx") {
      routes.add("/");
      return;
    }
    if (rel.includes("[slug]")) {
      for (const pillar of hub.pillars) {
        if (!DEDICATED.has(pillar.slug)) routes.add(pillar.href);
      }
      return;
    }
    const route = `/${rel.replace(/\/page\.tsx$/, "")}/`;
    routes.add(route);
  }

  walk(appDir);
  return [...routes].sort();
}

function fetchPath(urlPath, hops = 0) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      { hostname: HOST, port: PORT, path: urlPath, headers: { host: `${HOST}:${PORT}`, accept: "text/html" } },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && hops < 5) {
          const next = new URL(res.headers.location, `http://${HOST}:${PORT}`);
          res.resume();
          resolve(fetchPath(`${next.pathname}${next.search}`, hops + 1));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            body: Buffer.concat(chunks).toString("utf8"),
            finalPath: urlPath,
          })
        );
      }
    );
    req.setTimeout(60_000, () => {
      req.destroy(new Error(`timeout fetching ${urlPath}`));
    });
    req.on("error", reject);
  });
}

function waitForServer() {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      const req = http.get({ hostname: HOST, port: PORT, path: "/", headers: { host: `${HOST}:${PORT}` } }, (res) => {
        res.resume();
        resolve();
      });
      req.on("error", () => {
        if (Date.now() - started > 60_000) reject(new Error("next start did not become ready"));
        else setTimeout(tick, 400);
      });
    };
    tick();
  });
}

function snippet(body, index) {
  const start = Math.max(0, index - 80);
  const end = Math.min(body.length, index + 80);
  return body.slice(start, end).replace(/\s+/g, " ");
}

async function main() {
  const routes = collectRoutes();
  const child = spawn("npx", ["next", "start", "-p", String(PORT), "-H", HOST], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let serverLog = "";
  child.stdout.on("data", (c) => {
    serverLog += c.toString();
  });
  child.stderr.on("data", (c) => {
    serverLog += c.toString();
  });

  const stop = () => {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      try {
        child.kill("SIGTERM");
      } catch {
        /* already gone */
      }
    }
  };
  process.on("exit", stop);

  try {
    await waitForServer();
    const failures = [];
    const vercelHits = [];

    async function scan(urlPath, { allow404 = false } = {}) {
      const page = await fetchPath(urlPath);
      if (allow404) {
        if (page.status !== 404) failures.push({ urlPath, reason: `expected 404, got ${page.status}` });
      } else if (page.status !== 200) {
        failures.push({ urlPath, reason: `status ${page.status}` });
      }
      const markers = ["{{", "TBD"];
      for (const marker of markers) {
        const at = page.body.indexOf(marker);
        if (at !== -1) failures.push({ urlPath, reason: `contains ${JSON.stringify(marker)}`, snippet: snippet(page.body, at) });
      }
      const vercel = page.body.match(/https?:\/\/[^"'\\\s>]*vercel\.app[^"'\\\s>]*/g);
      if (vercel) {
        for (const url of [...new Set(vercel)]) vercelHits.push({ urlPath, url });
      }
      return page.status;
    }

    for (const route of routes) {
      await scan(route);
    }
    for (const route of MUST_404) {
      await scan(route, { allow404: true });
    }

    if (vercelHits.length > 0) {
      for (const hit of vercelHits) failures.push({ urlPath: hit.urlPath, reason: `absolute vercel.app URL ${hit.url}` });
    }

    console.log(
      `placeholder-guard: ${routes.length} pages, ${failures.length} failure(s), ${vercelHits.length} vercel.app URL(s)`
    );
    if (failures.length > 0) {
      for (const fail of failures) {
        console.error(`  FAIL ${fail.urlPath}: ${fail.reason}`);
        if (fail.snippet) console.error(`       ${fail.snippet}`);
      }
      stop();
      process.exit(1);
    }
    console.log("placeholder-guard: no {{ , no TBD, no vercel.app URLs in rendered HTML");
    stop();
    process.exit(0);
  } catch (err) {
    console.error(err);
    console.error(serverLog.slice(-4000));
    stop();
    process.exit(1);
  }
}

main();
