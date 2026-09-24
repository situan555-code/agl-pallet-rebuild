// Hand-maintained manifest of SPEC_V1.md section 1 (routes/redirects) and
// section 8 (open tokens). SPEC_V1.md is prose, not data — there is no
// reliable way to derive "which routes get which token" by parsing alone,
// so this file is the single place that encodes that mapping. Update it
// if SPEC_V1.md's routes or open-tokens table change.

const ROUTES = [
  '/',
  '/who-we-are',
  '/partners',
  '/partners/suppliers',
  '/partners/carriers',
  '/the-pledge',
  '/custom-engineered',
  '/products',
  '/industries',
  '/how-we-work',
  '/contact',
  '/request-a-quote',
  '/faq',
];

// SPEC_V1.md section 1 redirects.
const REDIRECTS = [
  { from: '/about', to: '/who-we-are' },
  { from: '/logistics-process', to: '/how-we-work' },
  { from: '/industries-served', to: '/industries' },
];

// Tokens from section 8 that section 4 names inline (photo, address,
// carrier-offer blanks, form-destination emails). Wave B policy
// (2026-09-24, Nautis): omit this content until cutover. Do not invent
// the address, photo, carrier commercial terms, or mailbox. Do not render
// the raw `{{TBD-*}}` string — placeholder-guard fails the build if `{{`
// or `TBD` reaches HTML. tokens.js still visits every route below and
// fails if the literal placeholder is visible.
const DOM_PLACEHOLDER_TOKENS = {
  'TBD-PHOTO-BROCK': ['/', '/who-we-are'],
  'TBD-ADDRESS': ['/who-we-are', '/contact'],
  'TBD-CARRIER-LANES': ['/partners/carriers'],
  'TBD-CARRIER-EQUIPMENT': ['/partners/carriers'],
  'TBD-CARRIER-TERMS': ['/partners/carriers'],
  'TBD-CARRIER-INSURANCE': ['/partners/carriers'],
  'TBD-EMAIL-SUPPLIER': ['/partners/suppliers'],
  'TBD-EMAIL-CARRIER': ['/partners/carriers'],
};

// Tokens from section 8 that are build-decision tracking notes, not on-page
// placeholders — section 4's build notes say to build these WITH the given
// draft copy (or, for PHARMA/SOCIAL-URLS, to omit the content entirely, not
// show a placeholder). Listed here for report completeness; tokens.js does
// not gate on them appearing in the DOM.
const CONTENT_DECISION_TOKENS = {
  'TBD-FOUNDER-STORY': { routes: ['/who-we-are'], note: 'build with draft copy as written (4.2 build note)' },
  'TBD-FAITH-PLACEMENT': { routes: ['/who-we-are'], note: 'placement already decided (built on /who-we-are); do not duplicate on /' },
  'TBD-VALUES': { routes: ['/who-we-are'], note: 'build the four cards as drafted' },
  'TBD-TEAM-LIST': { routes: ['/who-we-are'], note: 'build with first names as written' },
  'TBD-PHARMA': { routes: ['/industries'], note: 'omit item entirely unless Brock confirms — no placeholder' },
  'TBD-SOCIAL-URLS': { routes: ROUTES, note: 'omit the Follow Us block entirely if unresolved — no placeholder, no empty heading' },
};

module.exports = { ROUTES, REDIRECTS, DOM_PLACEHOLDER_TOKENS, CONTENT_DECISION_TOKENS };
