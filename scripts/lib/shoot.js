// Shared deterministic full-page screenshot logic, used both for the
// one-time /reference capture (Phase 1) and for the repeatable `screenshot`
// npm script that shoots the built site for later diffing against
// /reference (harness phase). Same settings both times so the pixels are
// comparable: animations/transitions disabled, scroll forced to bottom and
// back to trigger lazy content, then reset to top before the shot.
const { USER_AGENT } = require('./site');

const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1440', width: 1440, height: 900 },
];

const DISABLE_ANIMATIONS_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    scroll-behavior: auto !important;
  }
`;

function slugFor(urlPath) {
  if (urlPath === '/') return 'home';
  return urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

async function scrollToBottomAndBack(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0;
      const step = 400;
      const timer = setInterval(() => {
        window.scrollBy(0, step);
        total += step;
        if (total >= document.body.scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 150);
    });
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => window.scrollTo(0, 0));
}

async function shootPage(browser, baseUrl, urlPath, viewport, outPath) {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    viewport: { width: viewport.width, height: viewport.height },
  });
  const page = await context.newPage();
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await page.goto(`${baseUrl}${urlPath}`, { waitUntil: 'networkidle', timeout: 45_000 });
  await page.addStyleTag({ content: DISABLE_ANIMATIONS_CSS });
  await scrollToBottomAndBack(page);
  await page.waitForTimeout(300);
  await page.screenshot({ path: outPath, fullPage: true });
  await context.close();
}

module.exports = { VIEWPORTS, slugFor, shootPage };
