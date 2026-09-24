#!/usr/bin/env node
// H0 gate 2: scan rendered HTML (visible text, meta tags, alt text,
// JSON-LD, form labels) for SPEC_V1.md's banned language.
//
// Scans raw HTML source per route so meta/alt/JSON-LD are covered, not just
// visible text. Framework/bundle <script> noise is stripped first (kept:
// application/ld+json scripts, since that's exactly what rule 5 needs
// checked) so words like "build" appearing constantly in Next's own JS
// bundle don't drown out real hits.
//
// The producer-voice check (rule 1: make/produce/build/manufacture with
// AGL as subject) is inherently a subject-attribution judgment call, which
// regex can't fully make. It's narrowed by requiring AGL/we/our within ~60
// chars of the verb, and by skipping matches preceded by an in-clause
// negation (spec copy itself says "We'll never build them," which is the
// compliant negation the rule intends, not a violation). Matches are still
// reported for human confirmation — this is a scanner, not a verdict.
const fs = require('fs');
const path = require('path');
const { ensureServer } = require('./lib/devserver');
const { ROUTES } = require('./lib/spec-manifest');

const ROOT = path.join(__dirname, '..');
const BASE_URL = process.env.BANNED_WORDS_BASE_URL || process.env.SCREENSHOT_BASE_URL || 'http://localhost:3000';
const REPORT_JSON = path.join(ROOT, 'banned-words-report.json');

// SPEC_V1.md section 0 — exact banned phrases.
const BANNED_PHRASES = [
  'revolutionary',
  'world-class',
  'best-in-class',
  'seamless',
  'game-changing',
  'cutting-edge',
  'industry-leading',
  'one-stop shop',
  'synergy',
  'unlock',
  'empower',
  'elevate',
  'robust solutions',
  'passionate about',
  "we're excited to",
  'trusted partner',
];

// SPEC_V1.md section 0, section 6, and rule 5 — pattern-based bans.
const BANNED_PATTERNS = [
  { name: 'leverage-as-verb', re: /\bleverages?\b|\bleveraged\b|\bleveraging\b/i },
  { name: 'price-objection-cliche', re: /cheapest[^.?!]{0,20}(pallet|thing)[^.?!]{0,40}most expensive/i },
  { name: 'national-nationwide', re: /\bnational(ly)?\b|\bnationwide\b/i },
  { name: 'pds-pallet-design-system', re: /\bPDS\b|\bPallet Design System\b/i },
  { name: 'certification-claim', re: /\bRPA\b|\bMHI\b|\bBBB\b|\bSmartWay\b|\bNWPCA\b|\bISPM-15\b/ },
  { name: 'bahlr-placeholder', re: /This is Bahlr website\./i },
  { name: 'warehousing-storage-inventory', re: /\bwarehousing\b|\bwarehouses?\b|\bstorage\b|\binventory\b|\bVMI\b/i },
  { name: 'recycled-used-reconditioned-pallet', re: /\b(recycled|reconditioned|used)\b[^.?!]{0,30}\bpallets?\b/i },
  { name: 'legacy-copy-produced-quality-controls', re: /every pallet is produced under strict quality controls/i },
  { name: 'legacy-copy-designs-pallets', re: /AGL designs pallets precisely tailored/i },
  { name: 'legacy-copy-develop-specifications', re: /we develop pallet specifications/i },
  // Editorial exclamation points. A following letter is Tailwind's
  // important modifier (`!hidden`), not a bang in copy.
  { name: 'exclamation-point', re: /!(?![a-zA-Z])/ },
  { name: 'emoji', re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u },
];

const NEGATION_RE = /\b(never|won't|will never|don't|doesn't|can't|cannot|no|not)\b/i;
const PRODUCER_VERB_RE =
  /\b(AGL|we|our)\b([^.?!]{0,60}?)\b(make|makes|made|making|produce|produces|produced|producing|build|builds|built|building|manufacture|manufactures|manufactured|manufacturing)\b/gi;

function stripNoise(html) {
  return html
    // <!DOCTYPE html> is markup, not an exclamation point in copy. Leaving it
    // in made every route fail the exclamation-point rule.
    .replace(/<!DOCTYPE[^>]*>/gi, '')
    .replace(/<script(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    // React emits <!-- -->, <!--$-->, and <!--/$--> between nodes. Those
    // are markup, not an exclamation point in copy.
    .replace(/<!--[\s\S]*?-->/g, '')
    // React escapes apostrophes to &#x27; in HTML. The negation check looks
    // for "don't" / "doesn't" as written; decode those entities (and the
    // curly apostrophe) so a real negation is still a negation.
    .replace(/&#x27;|&#39;|&apos;/gi, "'")
    .replace(/\u2019/g, "'");
}

function scanText(text, lineOffsetLines) {
  const hits = [];
  lineOffsetLines.forEach((line, idx) => {
    for (const phrase of BANNED_PHRASES) {
      if (line.toLowerCase().includes(phrase.toLowerCase())) {
        hits.push({ rule: `banned-phrase:${phrase}`, line: idx + 1, matched: phrase });
      }
    }
    for (const { name, re } of BANNED_PATTERNS) {
      const m = line.match(re);
      if (m) hits.push({ rule: name, line: idx + 1, matched: m[0] });
    }
    let pm;
    const re = new RegExp(PRODUCER_VERB_RE.source, 'gi');
    while ((pm = re.exec(line))) {
      const clause = pm[0];
      const beforeVerb = clause.slice(0, clause.length - pm[3].length);
      if (NEGATION_RE.test(beforeVerb)) continue; // "We'll never build them" — compliant negation
      hits.push({ rule: 'producer-voice-verb', line: idx + 1, matched: clause.trim() });
    }
  });
  return hits;
}

async function main() {
  const server = await ensureServer(BASE_URL, ROOT);
  const results = [];
  let anyFail = false;

  try {
    for (const route of ROUTES) {
      const url = `${BASE_URL}${route}`;
      const entry = { path: route };
      let html;
      try {
        const res = await fetch(url);
        if (!res.ok) {
          entry.status = 'error';
          entry.error = `page returned status ${res.status}`;
          anyFail = true;
          results.push(entry);
          console.error(`  ERROR ${route}: ${entry.error}`);
          continue;
        }
        html = await res.text();
      } catch (e) {
        entry.status = 'error';
        entry.error = `failed to fetch page: ${e.message}`;
        anyFail = true;
        results.push(entry);
        console.error(`  ERROR ${route}: ${entry.error}`);
        continue;
      }

      const cleaned = stripNoise(html);
      const lines = cleaned.split('\n');
      const hits = scanText(cleaned, lines);

      entry.hitCount = hits.length;
      entry.hits = hits;
      entry.status = hits.length === 0 ? 'pass' : 'fail';
      if (entry.status === 'fail') anyFail = true;

      console.log(`  ${entry.status.toUpperCase()} ${route}: ${hits.length} hit(s)`);
      for (const h of hits.slice(0, 10)) {
        console.log(`      [${h.rule}] line ${h.line}: "${h.matched}"`);
      }
      results.push(entry);
    }
  } finally {
    await server.stop();
  }

  fs.writeFileSync(
    REPORT_JSON,
    JSON.stringify({ baseUrl: BASE_URL, generatedAt: new Date().toISOString(), results }, null, 2)
  );
  console.log(`\nWrote ${path.relative(ROOT, REPORT_JSON)}`);

  if (anyFail) {
    console.error('\nBANNED-WORDS FAILED: one or more pages contain banned language (see banned-words-report.json).');
    process.exit(1);
  }
  console.log('\nNo banned language found.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
