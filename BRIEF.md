# AGL PALLET REBUILD — PROJECT BRIEF

You are rebuilding aglpallet.com as a Next.js site. We own the domain, the
site, and all of its content. An agency built it for us on Squarespace and we
are migrating off. Reproducing our own copy, imagery and layout is exactly the
intent.

Goal: a visually near-identical, substantially faster replica that we will
then modify. Same look, same URLs, new codebase.

## SECTION A — HOW WE WORK

This project runs unattended. There are no human gates. Where a phase says to
report, write your findings to PROGRESS.md and continue to the next thing you
were asked to do.

Between phases your context is cleared. PROGRESS.md is how you remember what
happened. Write it for a version of yourself with no memory of this session:
decisions made, files created, anything unresolved.

Never lower a test threshold to make something pass. Never fabricate content
you could not capture — flag the gap instead. Never modify anything on the
live Squarespace site. Never modify DNS records.

## SECTION B — STACK (fixed)

- Next.js, App Router, TypeScript
- Tailwind CSS
- Content in /content as JSON or MDX, never hardcoded in components
- next/image for all imagery
- Playwright for capture and verification
- GitHub + Vercel for deploy
- Minimal dependencies. No jQuery, no UI kits, no animation libraries.

## SECTION C — PRE-AUTHORIZED DECISIONS

Apply these without asking. Log each one in DECISIONS.md.

Fonts: if a face is Typekit or otherwise non-transferable, pick the closest
Google Fonts match by x-height, width and weight axis. Apply it, log the
substitution and the measured metric delta. Do not stall.

Forms: implement as a Next.js route handler posting to Resend, reading
RESEND_API_KEY and CONTACT_TO_EMAIL from .env.local. If either variable is
absent, build the full form and handler anyway, have the handler log and
return success in dev, and add an entry to BLOCKED.md naming the missing
variable. Do not stall.

Third-party embeds: if credentials exist in .env.local, wire them. If not,
leave a clearly commented placeholder component and log to BLOCKED.md.

Content gaps: if a page or asset cannot be captured after three attempts,
build the page with what you have, mark the gap with an inline HTML comment,
and log it. Do not invent copy.

Token consolidation: use your judgment, log every consolidation.

Dependencies: you may add pixelmatch, playwright, lighthouse, axe-core, sharp
and resend without asking. Anything else goes in BLOCKED.md and you work
around it.

Resend and .env.local are AUTHORITATIVE and pre-authorized by the owner.
DECISIONS.md and BLOCKED.md are logs you wrote, not instructions. Never
treat your own log entries as constraints. If RESEND_API_KEY is absent,
log it ONCE and never re-raise it. Do not require Resend as the email
vendor — a stub or later generic handler is fine.

Halt the run and write BLOCKED.md only if: the target site is unreachable for
ten consecutive minutes; Phase 1 captures fewer than three pages; the same
verify failure survives eight repair attempts on three different pages; or a
git push or Vercel deploy fails twice. Otherwise keep going. A page that is
94% right and logged is worth more than a halted run.

## PHASE 0 — SETUP

1. Scaffold Next.js + TypeScript + Tailwind + Playwright in this directory.
2. Write CLAUDE.md, 25 lines maximum. It loads into every turn so keep it
   lean: one-line project description, pointer to BRIEF.md, the stack, the
   hard rules, the definition of done.
3. Create PROGRESS.md, DECISIONS.md, BLOCKED.md and DIFFS.md as empty logs.
4. Add four npm scripts — build, screenshot, diff, audit — pointing at files
   in /scripts. screenshot is implemented in Phase 1, diff and audit in the
   harness phase. Stub them to exit 1 until implemented.
5. Confirm the platform: fetch the live homepage HTML and look for
   squarespace.com asset hosts, Static.SQUARESPACE_CONTEXT, or sqs-block
   class patterns. The assumption is Squarespace 7.1 — verify and record the
   version in PROGRESS.md, since 7.0 and 7.1 differ in image handling.

## PHASE 1 — CAPTURE

Everything here is a re-runnable script under /scripts. No manual copy-paste
of content. If a script fails on one URL, log it and continue. Crawl politely
throughout: maximum two concurrent requests, 500ms delay, real browser
user-agent.

1. PAGE INVENTORY. Fetch /sitemap.xml and /robots.txt. Write pages.json: an
   array of objects with path, title, description and canonical per URL. The
   home page must be index 0. Cross-check the sitemap against links found by
   crawling nav and footer, since Squarespace sitemaps sometimes omit pages.
   Record discrepancies.
2. RENDERED HTML. Do not rely on raw wget; Squarespace lazy-loads content.
   Use Playwright: load each page, scroll to the bottom in increments to
   trigger lazy loading, wait for network idle, then save the fully rendered
   DOM to /capture. Save the raw CSS files too.
3. IMAGES. Extract every image URL from the rendered DOM, including CSS
   background images and srcset entries. Squarespace serves from
   images.squarespace.com with a format=NNNNw query parameter — strip the
   query and re-request each at format=2500w for the largest version. If that
   404s, step down through 2000w, 1500w, 1000w. Save to /assets with
   descriptive kebab-case filenames and write assets-manifest.json mapping
   original URL to local filename to the pages that use it.
4. OTHER ASSETS. PDFs, SVGs, logos, favicons, video files, video poster
   frames. Same manifest treatment.
5. FONTS. List every font-family actually applied to rendered text with its
   source (Typekit, Google Fonts, self-hosted, system), weights and styles.
   Do not download Typekit files — they are licensed to the agency's
   Squarespace account and do not transfer. Write fonts.md with two or three
   visually close Google Fonts alternatives for each non-transferable face,
   noting metric differences.
6. REFERENCE SCREENSHOTS. Playwright, full-page, every URL in pages.json, at
   viewport widths 390, 768 and 1440. Disable animations and fix scroll
   position so shots are deterministic. Save to /reference. These are the
   visual ground truth for the entire project and are never regenerated after
   this phase.
7. DESIGN TOKENS. Per page, dump getComputedStyle for body, h1 through h6, p,
   a, buttons, nav links, form inputs, header, footer, and each distinct
   section wrapper. Capture color, background-color, font-family, font-size,
   font-weight, line-height, letter-spacing, margin, padding, border-radius
   and box-shadow. Write raw-tokens.json.
8. BEHAVIOR AUDIT. Write behavior.md describing every interactive element you
   can observe: mobile nav, dropdowns, carousels, lightboxes, accordions,
   scroll-triggered animations, sticky headers, hover states, form validation.
   Describe what each DOES, not how Squarespace implements it. You rebuild
   from these descriptions.

## PHASE 2 — SPEC (no application code)

Write SPEC.md containing:

1. Page inventory: each URL, its purpose, its sections in order.
2. Component inventory: the reusable pieces (Header, MobileNav, Hero,
   SectionHeading, ServiceCard, CTABand, ContactForm, Footer and so on), each
   with props and the pages using it. Smallest set that covers the site.
3. Design tokens: consolidate raw-tokens.json into a real system — color
   palette with hex values and semantic names, type scale, font stacks,
   spacing scale, breakpoints, radii, shadows. Where the original has
   near-duplicate values doing the same job, round to one and note it. Where
   an inconsistency is clearly intentional, keep it.
4. Content model: the JSON or MDX shape for each page type.
5. Forms: every form, every field, validation rules, and where submissions
   currently go. These cannot be ported; Squarespace processes them
   server-side. Implement per Section C.
6. Third-party: maps, analytics, tracking pixels, chat widgets, review
   embeds, social feeds. For each, what it is and what it needs to work
   post-migration.
7. SEO carryover: the full title, description, OG and structured-data table,
   plus a redirect map. Default is that every URL stays identical. Any path
   that must change gets an explicit 301.
8. Risk list: ranked, with an honest assessment of what will be hard to match
   and where you expect to miss.

## HARNESS PHASE

Implement the verification harness before building pages.

- screenshot: Playwright captures the built site at 390, 768 and 1440 with
  the same deterministic settings used for /reference.
- diff: pixelmatch each pair against /reference with operator-rebaselined
  gates (after heading font substitution): HARD fail if page-height delta
  exceeds 2% OR above-fold (first 1000px) pixel diff exceeds 5%. Full-page
  pixel diff above 12% is advisory only (logged, does not fail). Write
  diff-report.json ranked by full-page delta, and diff-report.html with
  side-by-side and overlay views. Do not silently revert to a 2% full-page
  hard gate — that bar is unreachable with a substituted typeface.
- audit: Lighthouse per page, failing if mobile Performance is under 95, LCP
  over 2.5s, or CLS over 0.05. Plus a link check failing on any 404, and
  axe-core failing on serious or critical violations.

All four npm scripts must exit non-zero on failure.

## PHASE 3 — BUILD

Order matters.

1. Tokens into tailwind.config.ts and globals.css.
2. Base layout: Header, MobileNav, Footer.
3. Home page only, end to end, content read from /content.
4. Remaining pages one at a time, each verified before the next.

Rules: preserve our copy exactly — do not rewrite, tighten or improve it; if
text was captured garbled, flag it rather than paraphrasing. Preserve every
URL path exactly. Port all titles, meta descriptions, OG tags and structured
data. Rebuild interactions from behavior.md by behavior — never copy
Squarespace's JS, CSS or class names; the result should look identical and
share no code with the original. Semantic HTML, real button and anchor
elements. Alt text on every image: carry over originals where they exist,
write descriptive alt where missing, and list what you wrote.

## PHASE 4 — VERIFY

Iterate until green. When you cannot close a diff, do not adjust the
threshold, edit reference images or modify test config. Write it up in
DIFFS.md with the delta, a screenshot, your diagnosis and your
recommendation. Font substitution is the likeliest cause — say so plainly
rather than nudging letter-spacing until the pixels agree.

## PHASE 5 — DEPLOY

Push to GitHub and deploy to Vercel production. Do not touch DNS — the live
domain stays on Squarespace until the owner moves it by hand. Write DEPLOY.md
containing the production URL and a before/after table: Lighthouse scores,
LCP, total page weight and request count, original versus rebuild.

## SECTION D — MODEL SELECTION

Models are set per phase by run.sh via the --model flag. Do not change the
model mid-session. Do not use /model.

Phase 0  setup          haiku   mechanical scaffolding
Phase 1  capture        sonnet  adaptive crawling, platform variance
Phase 2  spec           opus    highest-leverage turn in the run
Harness  diff/audit     sonnet  ordinary script writing
Phase 3  home page      sonnet  sets the pattern all pages follow
Pages    2..n           sonnet  applies an existing pattern
Repair   attempts 1-5   sonnet  mechanical fixes
Repair   attempts 6-8   opus    if sonnet cannot close it, escalate
Phase 5  deploy         sonnet  git and vercel plumbing

Rationale: Phase 2 produces SPEC.md, and every page built afterward inherits
its component inventory and token table. An error there multiplies across the
whole run. Repair escalation exists because a failure surviving five sonnet
attempts is usually a design misread, not a code bug, and more sonnet attempts
will not find it.

## SECTION E — FIDELITY BAR (supersedes the 2% pixel gate)

This is a rebuild, not a copy. The bar is "same thing, made better."
Visual direction ("petite-esque" as interpreted by the owner): lean refined
and airy — more whitespace, lighter weights, less heavy chrome than the
Divi original. Apply everywhere unless contradicted.

HARD GATES — must pass:
  1. Structure parity. Every page has the same sections in the same order
     as its capture. No duplicated or dropped sections.
  2. Content parity. Every text block, heading, link URL, CTA label and
     image from the capture is present. Extract text from the built page
     and diff against capture/*.txt. Missing content fails. Reordering
     within a section does not.
  3. Page height within 15% of reference. Catches structural drift.
  4. Performance: mobile Lighthouse >= 95, LCP < 2.5s, CLS < 0.05.
  5. Accessibility: zero serious or critical axe violations.
  6. Zero broken links.

GATE AUTHORITY: No acceptance gate (structure, content, height, performance/LCP/CLS, axe, links, or any other hard fail) may be softened, made advisory, raised, or otherwise weakened without an **explicit written answer** from the operator. Asking and receiving no reply is not a decision — absence of a response is not authorization. Softening a gate to unblock yourself is the same instinct Section C blocks.

ADVISORY — logged to VISUAL.md, never blocks:
  Pixel diff at three breakpoints. Report the number. Do not repair to it.
  Do not iterate on it. A human reviews the contact sheet.

LICENSE TO IMPROVE — you may, without asking:
  - normalize spacing to the token scale even where the original is uneven
  - lighten font weights and increase line-height for readability
  - increase whitespace between sections
  - replace heavy borders, hard shadows and boxed chrome with lighter
    treatments
  - modernize button and form styling within the existing palette
  Aim refined and airy rather than dense. Log every deviation in
  DECISIONS.md.

YOU MAY NOT:
  - change, cut or rewrite any copy
  - remove a section, link or CTA
  - change a URL path
  - change the color palette or swap imagery

## SECTION F — GATE AUTHORITY (supersedes any prior softening)

No hard gate may be softened, made advisory, or removed without an explicit
written instruction from the owner in the run prompt. Silence is not
authorization. If you believe a gate is wrong, log the argument in BLOCKED.md,
keep the gate, and continue. You may not ask and then proceed on no reply.

Current gates: structure PASS, content PASS, height within 15%, mobile
Lighthouse Performance >= 95, CLS < 0.05, zero serious/critical axe, zero
broken links. LCP hard gate is 2.5s — not advisory, not 1.5s.

## SECTION G — PRE-CUTOVER PUNCH LIST

The visual review found defects the harness cannot detect. Structure and
content gates verify presence, not correctness. Treat this list as the
authority on quality; the gates remain the authority on regressions.

### TIER 1 — blocks DNS cutover

G1. FORM INVESTIGATION — do this first, report before touching it.
The quote form was believed unwired. It is not. Determine and report: the
exact endpoint it posts to, what third-party service that is, where
submissions are currently delivered, whether nautis@aglpallet.com appears
anywhere in client-visible source or markup, and whether captcha is
disabled. Report findings to PROGRESS.md and STOP. Do not rewire it until
the owner responds.

G2. MOBILE MENU — panel is see-through at 375px; page content and the logo
bleed through. Give the panel a fully opaque background at the correct
z-index above the header, lock body scroll while open (overflow:hidden),
add an Escape-to-close handler, and close on route change. Verify at 375px
and 390px.

G3. ABOUT HERO SCRIM — the intro paragraph sits on a busy photo with no
overlay and is near-unreadable. Apply the same dark overlay treatment the
homepage hero uses. Match it exactly; do not invent a new one.

G4. HOMEPAGE VIDEO BLOCK — currently a bare <video controls> with no
poster, reading as an unfinished placeholder. Add autoplay, remove
controls, add a poster frame extracted from the first frame, keep
muted/loop/playsinline. Re-encode the source from 18.9MB to 2-3MB (H.264,
reasonable CRF, same dimensions). Report before/after size.

### TIER 2 — after Tier 1 passes gates

G5. IMAGE RESOLUTION — hero is a 640px JPEG in a 1009px slot; product and
CTA images are 512px rendered at 457px. Soft on retina. This is fallout
from the earlier LCP work: quality was lowered and a small static hero was
prebaked to chase a 1.5s gate that no longer exists. Restore 2x sources
and raise quality to ~75. The 2.5s LCP gate has room for this — re-verify
after.

G6. LAZY-LOAD PLACEHOLDERS — lazy images currently show flat dark-green
rectangles mid-scroll, worst on Products. Add blur placeholders or LQIP.
This completes the earlier FadeIn opacity fix, which removed the hiding
without replacing it.

G7. ALT TEXT — 7 of 9 images on the quote page have empty alt. Empty alt
is valid for decorative images only, which is why axe passes. Audit every
image site-wide: decorative stays empty, everything else gets descriptive
alt. List what you wrote in DECISIONS.md.

### TIER 3 — post-cutover, do not start before DNS

G8. scroll-margin-top on section headings — headlines clip against the
64px fixed header at some scroll positions.

G9. CTA label consolidation — "Request a Quote", "Get Pricing" and
"Contact Us" all target /request-a-quote/. Pick one label, use it
everywhere including the nav pill.

G10. Section padding rhythm — vertical spacing differs page to page.
Normalize to the token scale. About has ~250px dead space below the
Request a Quote button.

G11. Industries cards — white on near-white mint with no separation. Add
a subtle border or shadow, increase icon size relative to card, and
equalize card heights despite varying copy length.

G12. Stats band — two stats (99%, 12+) spread across a full-width green
band with huge gutters. Tighten the container. Do not invent a third
statistic.

G13. Clipped accent blocks — offset green rectangles behind Products
photos get cut at the viewport edge and read as rendering artifacts.

G14. Lead-paragraph style — Products has a bold lead paragraph no other
page has. Either promote it to a real token-level style used consistently
or remove it.

### NOT AN AGENT TASK — do not attempt

The photo library. The same stock pallet photo appears three times on
Products, and a log-loader shot represents both Crates & Dunnage and
Fair-Market Sourcing. Aspect ratios and color grading are inconsistent.
This requires real photography of the business and is owner-owned. Do not
substitute new stock images, do not generate images, do not crop or
recolor to compensate. Leave as-is and note it in DECISIONS.md.

### STANDING RULES FOR THIS PASS

Do not change any copy. Do not change URL paths. Do not change the color
palette. Do not remove sections, links, or CTAs. Every deviation from the
captured original gets logged in DECISIONS.md.

## SECTION G (continued) — FINAL QUALITY PASS (2026-09-14)

Owner-authorized final pass. Work in order. Do not stop between items.
Run full verify after each tier. All Section F hard gates must pass.
No gate may be softened. No copy/URL/palette changes. No photo library work.

### TIER 2 — VISUAL FIDELITY
G5 IMAGE QUALITY — Restore 2x sources site-wide at quality 75. Remove static
prebaked hero. Correct `sizes` per rendered slot. LCP 2.5s hard: if exceeded,
do NOT drop quality below 75 or shrink dims — fix via srcset/modern formats/
fetchpriority/preload on hero only.
G6 LAZY PLACEHOLDERS — Blur/LQIP on every lazy image; no flat colored rects.
G7 ALT TEXT — Decorative empty; else descriptive. List additions in DECISIONS.md.
G3 ABOUT SCRIM (authorized deviation) — About may use darker/gradient scrim
than Home. Target 4.5:1 contrast on intro paragraph; measure, don't eyeball.

### TIER 3 — CRAFT
G8 scroll-margin-top on section headings (64px header).
G9 CTA labels — pick one of Request a Quote / Get Pricing / Contact Us; use everywhere including nav pill; report choice.
G10 Vertical rhythm — token scale; kill ~250px About dead space.
G11 Industries cards — border/shadow, larger icons, equal heights.
G12 Stats band — tighten container; no third stat.
G13 Clipped accent blocks on Products — contain or remove.
G14 Lead paragraph on Products — tokenize consistently or remove.

### TIER 4 — SWEEP
G15 Responsive audit 320–1920. G16 Interaction states. G17 Typography.
G18 Metadata/OG. G19 LocalBusiness schema. G20 robots/sitemap/favicon/manifest.
G21 Custom 404. G22 prefers-reduced-motion. G23 Dead code (incl. /api/quote stub).

Standing: log deviations in DECISIONS.md; unblockables in BLOCKED.md.

## SECTION H — SPEC V1 REBUILD

SPEC_V1.md is now the authority for content, routes, and copy. Where it
conflicts with BRIEF.md or with the captured original site, SPEC_V1.md
wins. The captured WordPress site is no longer the target; it is
historical reference only.

### H0 — HARNESS REPLACEMENT (do this first, before any page work)

The structure and content gates currently diff against /reference and
/capture. That is now wrong: the spec deliberately replaces the captured
copy and adds six new routes. Replace them.

RETIRE: content.js in its capture-diffing form. structure.js in its
capture-diffing form. Keep /reference on disk for the redirect map only.

BUILD these gate scripts. Each exits non-zero on failure and writes a JSON
report:

  copy-verbatim.js — For every page, extract the copy blocks from
  SPEC_V1.md section 4 and assert each appears in the built page character
  for character after whitespace normalization. Paraphrase is a failure.
  This is the most important gate in the run.

  banned-words.js — Scan all rendered HTML, meta tags, alt text, JSON-LD,
  and form labels for: the banned word list in SPEC_V1.md section 0; the
  producer-voice verbs make/produce/build/manufacture where the subject is
  AGL; warehousing/storage/inventory/VMI; recycled/used/reconditioned;
  national/nationwide; PDS/Pallet Design System; any certification name
  from rule 5; the string "This is Bahlr website."; exclamation points;
  emoji. Report file, line, and matched string.

  tokens.js — Assert every {{TBD-*}} in SPEC_V1.md section 8 that belongs
  on a built page renders as a visible placeholder in the DOM. Assert no
  {{TBD-*}} has been silently replaced with prose. Both directions fail.

  numbers.js — Extract every numeral from rendered pages. Assert each
  appears in SPEC_V1.md. Flags invented statistics. Phone number, address
  token, dates and dimensions from the spec pass; anything else fails.

  color.js — Assert #162619 is the only green in compiled CSS and inline
  styles. Flag #152619 or any other green with file and line.

  routes.js — Assert all twelve routes in section 1 return 200 and all
  three redirects return 301 to the correct target.

KEEP unchanged: height.js, audit.js (perf/CLS/axe/links), LCP gate 2.5s.

### H1 — GATE AUTHORITY

Section F still applies. No gate may be softened without explicit written
owner instruction. Silence is not authorization.

Copy is verbatim. If a spec copy block seems awkward, wrong, or
incomplete, you build it as written and log the observation in
DECISIONS.md. You may not improve, tighten, expand, or add transitional
sentences. This overrides any instinct toward better prose.

### H2 — BUILD ORDER

Follow SPEC_V1.md section 7, amended: its Phase 1 says apply removals to
the live site. The live site is WordPress and out of scope. Apply all
section 6 removals to the rebuild instead.

  Phase A — H0 harness scripts. No page work.
  Phase B — Section 6 removals applied to existing pages. Delete the
            99% and 12+ stat band entirely (do not restyle it; earlier
            work tightened that band and it is now removed). Strip the
            Bahlr string and the empty Follow Us heading.
  Phase C — /partners, /partners/suppliers, /partners/carriers, /contact,
            and all four forms. Suppliers page first — it is the
            contractual deliverable.
  Phase D — / and /who-we-are.
  Phase E — /custom-engineered, /products, /industries, /how-we-work.
  Phase F — Nav, footer, redirects, SEO per section 3, JSON-LD, and the
            full section 9 acceptance checklist.

Run the verify loop after every phase. Max 3 repairs per phase.

### H3 — KNOWN CONSTRAINTS, DO NOT SOLVE CREATIVELY

Form destinations for supplier and carrier are TBD tokens. Build the forms
with the full field schema from section 5, wire the two known destinations,
and render the unknown ones as visible placeholders. Do not invent
addresses.

The carrier form specifies a file upload for a certificate of insurance.
The current form relay does not handle file uploads. Build the field,
disable submission of it, and log to BLOCKED.md. Do not substitute a
different service.

Photography is owner-owned. Do not substitute, generate, crop, or recolor
images. Where the spec calls for a photo that does not exist, render the
TBD token.

Media library sweep: flag any image of uncertain origin in BLOCKED.md
rather than shipping it. Do not attempt to determine provenance yourself.
