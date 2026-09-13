// Shared "point at a running built site, or start one" helper for
// structure.js and content.js — same BASE_URL-env-var pattern already used
// by screenshot.js/audit.js, but self-sufficient: if nothing answers at
// BASE_URL yet, spawn `next start` against the existing `.next` build
// (from `npm run build`, which always runs first in the verify chain) and
// stop it again when done, rather than requiring a server to already be
// running in the background.
const { spawn } = require('child_process');

async function isReachable(url) {
  try {
    await fetch(url, { method: 'GET' });
    return true;
  } catch {
    return false;
  }
}

function waitForReachable(url, timeoutMs) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (await isReachable(url)) return resolve();
      if (Date.now() - start > timeoutMs) return reject(new Error(`timed out waiting for ${url}`));
      setTimeout(tick, 400);
    };
    tick();
  });
}

async function ensureServer(baseUrl, cwd) {
  if (await isReachable(baseUrl)) {
    return { stop: async () => {} };
  }
  const port = new URL(baseUrl).port || '3000';
  console.log(`  no server answering at ${baseUrl} — starting \`next start -p ${port}\` ...`);
  const proc = spawn('npx', ['next', 'start', '-p', port], { cwd, stdio: 'ignore' });
  try {
    await waitForReachable(baseUrl, 30_000);
  } catch (e) {
    proc.kill();
    throw new Error(`could not reach built site at ${baseUrl}: ${e.message}. Run \`npm run build\` first.`);
  }
  return {
    stop: async () => {
      proc.kill();
    },
  };
}

module.exports = { ensureServer };
