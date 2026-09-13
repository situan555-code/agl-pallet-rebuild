// Ad-hoc helper (Phase 1, step 8 support): exercises the interactive
// elements found in behavior.md (mobile nav toggle, sticky header on
// scroll, contact form validation) and screenshots the before/after states
// so behavior.md can describe real observed behavior instead of guessing
// from static markup.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { BASE_URL, USER_AGENT } = require('./lib/site');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'capture', 'behavior-probes');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  // 1. Mobile nav: closed vs open.
  {
    const page = await browser.newPage({ userAgent: USER_AGENT, viewport: { width: 390, height: 844 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, 'mobile-nav-closed.png') });
    const bar = await page.$('.mobile_menu_bar_toggle, .mobile_menu_bar');
    if (bar) {
      await bar.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: path.join(OUT, 'mobile-nav-open.png') });
      const state = await page.evaluate(() => {
        const nav = document.querySelector('.mobile_nav');
        return { className: nav ? nav.className : null };
      });
      console.log('Mobile nav after click:', state);
    } else {
      console.log('Mobile nav toggle element not found.');
    }
    await page.close();
  }

  // 2. Sticky/transparent header: top of page vs scrolled.
  {
    const page = await browser.newPage({ userAgent: USER_AGENT, viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    const headerAtTop = await page.evaluate(() => {
      const header = document.querySelector('#main-header, header');
      const cs = header ? getComputedStyle(header) : null;
      return cs ? { position: cs.position, backgroundColor: cs.backgroundColor, className: header.className } : null;
    });
    await page.screenshot({ path: path.join(OUT, 'header-top.png'), clip: { x: 0, y: 0, width: 1440, height: 200 } });

    await page.evaluate(() => window.scrollTo(0, 900));
    await page.waitForTimeout(600);
    const headerScrolled = await page.evaluate(() => {
      const header = document.querySelector('#main-header, header');
      const cs = header ? getComputedStyle(header) : null;
      return cs ? { position: cs.position, backgroundColor: cs.backgroundColor, className: header.className } : null;
    });
    await page.screenshot({ path: path.join(OUT, 'header-scrolled.png'), clip: { x: 0, y: 0, width: 1440, height: 200 } });

    console.log('Header at top:', JSON.stringify(headerAtTop));
    console.log('Header scrolled:', JSON.stringify(headerScrolled));
    await page.close();
  }

  // 3. Contact form validation: submit empty.
  {
    const page = await browser.newPage({ userAgent: USER_AGENT, viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/request-a-quote/`, { waitUntil: 'networkidle' });
    await page.screenshot({ path: path.join(OUT, 'form-before-submit.png') });
    const submitBtn = await page.$('.et_pb_contact_submit, button[type="submit"], input[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(OUT, 'form-after-empty-submit.png') });
      const errorText = await page.evaluate(() => {
        const errs = [...document.querySelectorAll('.et-pb-contact-message, .et_pb_contact_form_container .et_error, [class*="error"]')];
        return errs.map((e) => e.outerHTML.slice(0, 300));
      });
      console.log('Validation errors found:', JSON.stringify(errorText, null, 2));
    } else {
      console.log('Submit button not found.');
    }
    await page.close();
  }

  // 4. Video element attributes on home + about.
  for (const p of ['/', '/about/']) {
    const page = await browser.newPage({ userAgent: USER_AGENT, viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}${p}`, { waitUntil: 'networkidle' });
    const videoInfo = await page.evaluate(() => {
      const v = document.querySelector('video');
      if (!v) return null;
      return {
        autoplay: v.autoplay,
        muted: v.muted,
        loop: v.loop,
        controls: v.controls,
        paused: v.paused,
        currentSrc: v.currentSrc,
      };
    });
    console.log(`Video on ${p}:`, JSON.stringify(videoInfo));
    await page.close();
  }

  await browser.close();
  console.log('\nDone. Screenshots in capture/behavior-probes/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
