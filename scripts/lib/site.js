// Shared constants for Phase 1 capture scripts.
const BASE_URL = 'https://aglpallet.com';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

// Crawl politely: max 2 concurrent requests, 500ms delay between requests.
const CRAWL_DELAY_MS = 500;
const MAX_CONCURRENCY = 2;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple concurrency-limited mapper with a fixed delay between task starts,
// so we never have more than `limit` in flight and never fire faster than
// one per `delayMs` overall.
async function politeMap(items, limit, delayMs, fn) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let lastStart = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      const wait = Math.max(0, lastStart + delayMs - Date.now());
      if (wait > 0) await sleep(wait);
      lastStart = Date.now();
      results[i] = await fn(items[i], i);
    }
  }

  const workers = Array.from({ length: Math.min(limit, items.length) }, worker);
  await Promise.all(workers);
  return results;
}

module.exports = { BASE_URL, USER_AGENT, CRAWL_DELAY_MS, MAX_CONCURRENCY, sleep, politeMap };
