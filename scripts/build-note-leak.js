#!/usr/bin/env node
// Gate: fail if any SPEC route's rendered HTML/body text still contains
// authoring annotations that leaked from SPEC_V1.md into customer copy.
const fs = require('fs');
const path = require('path');
const { ensureServer } = require('./lib/devserver');
const { ROUTES } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.BUILD_NOTE_LEAK_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'build-note-leak-report.json');

const LEAK_STRINGS = [
  'Links to /',
  'New standalone line',
  'New line — missing',
  'currently bundled with',
];

async function main() {
  const server = await ensureServer(BASE_URL, ROOT);
  const results = [];
  let anyFail = false;

  try {
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      let html = '';
      let error = null;
      let status = null;
      try {
        const res = await fetch(url, { redirect: 'follow' });
        status = res.status;
        html = await res.text();
      } catch (e) {
        error = e.message;
      }

      const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
      const bodyText = (bodyMatch ? bodyMatch[1] : html)
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ');

      const haystack = `${html}\n${bodyText}`;
      const hits = LEAK_STRINGS.filter((s) => haystack.includes(s));
      const pass = !error && status && status < 400 && hits.length === 0;
      if (!pass) anyFail = true;

      console.log(`  ${pass ? 'PASS' : 'FAIL'} ${route}${hits.length ? ` — leaked: ${hits.join(' | ')}` : ''}${error ? ` — error: ${error}` : ''}`);
      results.push({ path: route, status, error, hits, pass });
    }
  } finally {
    await server.stop();
  }

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ baseUrl: BASE_URL, generatedAt: new Date().toISOString(), leakStrings: LEAK_STRINGS, results }, null, 2)
  );
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nBUILD-NOTE-LEAK FAILED: one or more routes contain authoring annotation strings (see build-note-leak-report.json).');
    process.exit(1);
  }
  console.log('\nNo build-note leak strings found on any SPEC route.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
