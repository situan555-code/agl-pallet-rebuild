// Copy source for the gates. While lib/launch-lite.json is enabled the launch
// build copies the live aglpallet.com pages, so the copy and numbers gates
// read SPEC_LITE.md. With the flag off they read SPEC_V1.md as before.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');

function liteEnabled() {
  const flag = JSON.parse(fs.readFileSync(path.join(ROOT, 'lib', 'launch-lite.json'), 'utf8'));
  return flag.enabled === true;
}

function specPath() {
  return path.join(ROOT, liteEnabled() ? 'SPEC_LITE.md' : 'SPEC_V1.md');
}

module.exports = { specPath, liteEnabled };
