# Behavior audit

Observed by driving the live site with Playwright (`scripts/09-behavior-probe.js`,
screenshots in `capture/behavior-probes/`) plus reading the rendered DOM/CSS
in `/capture`. Describes what each element **does**, not how Divi/WordPress
implements it — rebuild from these descriptions, not from the original
markup or class names.

## 1. Header

- Fixed to the top of the viewport at all scroll positions on every page
  (`position: fixed`).
- **At the top of the page:** transparent background
  (`rgba(255,255,255,0)`), so the hero image/video shows through behind it.
- **After scrolling down (~1 viewport height):** background fades to a
  solid dark green (`rgb(28, 57, 31)`, ≈ `#1C391F`) so nav text stays
  legible over whatever content has scrolled underneath. Confirmed via
  `capture/behavior-probes/header-top.png` vs `header-scrolled.png` — the
  transition is a simple background-color change, no size/height change
  observed.
- Nav is a flat single level, 6 items, no dropdowns/submenus (confirmed: no
  nested `<ul>` under any top-level item in the captured markup): Home,
  About, Logistics & Process, Industries Served, Products, then a
  visually-distinct pill-style "Contact Us" button linking to
  `/request-a-quote/`.
- Logo links to `/`.

## 2. Mobile navigation (< ~980px, Divi's default breakpoint)

- Header collapses to: logo (left) + a hamburger icon (right). The 6 nav
  items are hidden.
- Clicking the hamburger reveals a **full-width dropdown panel** directly
  under the header, listing all 6 nav items (including "Contact Us" as a
  plain list item here, not a pill button) stacked vertically, each a
  full-width tappable row with a divider line. Page content is not dimmed
  or scroll-locked behind it — confirmed in
  `capture/behavior-probes/mobile-nav-open.png`.
  the toggle is a simple open/closed state flip (no animation observed
  beyond the panel appearing).
- Clicking the hamburger again (or presumably a nav link) closes it back to
  the icon-only state.

## 3. Hero (home page)

- Full-bleed background image, headline, subhead, single "Request a Quote"
  CTA button linking to `/request-a-quote/`.
- No carousel/slider — static single hero image on every page that has one.

## 4. Embedded video (home page + About page — same file, two different configs)

Both pages embed the same file
(`/wp-content/uploads/2026/02/agl_home_video.mp4`) but configured
differently — this is a real difference between the two placements, not a
capture artifact:

- **Home page:** `controls=true`, `autoplay=false`, `muted=true`,
  `loop=true`, starts **paused** with a visible custom player control bar
  (play/pause, scrubber, current time "0:00 / 0:15", volume, fullscreen —
  skinned via `mejs-controls.svg`, see `capture/heading-sample.png`-style
  crop in the home reference screenshot). User must click play.
- **About page:** `controls=false`, `autoplay=true`, `muted=true`,
  `loop=true` — plays automatically and silently on load, loops
  continuously, no visible controls at all (ambient background-video
  treatment).
- Rebuild each placement independently with these exact attributes; do not
  assume they should match each other.

## 5. Contact form validation (`/request-a-quote/`)

- Client-side, no page reload / no native browser validation UI. Confirmed
  by submitting the form empty (`capture/behavior-probes/form-after-empty-submit.png`):
  - Every required field (all 7: Full Name, Company Name, Email Address,
    Phone Number, Pallet Dimensions, Estimated Pallet Quantity, Message)
    gets an error class applied directly to the input/textarea (visually:
    red outline in the live screenshot).
  - A single summary block appears above the form listing which fields are
    missing: "Please, fill in the following fields:" followed by a
    bulleted list of the human-readable field labels.
  - All 7 fields are required — none are optional.
  - Email field is a plain text input, not `type="email"` — presumably
    validated by pattern JS rather than the browser, so format validation
    (if any) is invisible to static inspection; assume "required,
    non-empty" as the only confirmed rule and use `type="email"` in the
    rebuild for the free native format check, since we're rebuilding
    behavior, not markup.
- Submission target: this is the origin site's own form handler
  (WordPress/Divi contact form, AJAX-submitted back to the same page) — it
  cannot be ported. Implemented per BRIEF.md Section C (Resend route
  handler) in the SPEC/build phases.

## 6. Contact icons hover state (footer contact strip, seen on Products/Logistics/etc. pages)

- Three icon tiles (phone / email / text-message) in a row. On hovering the
  parent column, the icon image swaps to a filled/alternate variant
  (`phone_icon.svg` → `phone_icon_hover.svg`, and the same pattern for
  email and message) with a 0.3s transition. No color/background change
  observed beyond the icon swap itself.
- Note: the live site's CSS hardcodes the hover-variant image URLs against
  a different hostname (`agl.bahlr.com`, an agency/staging alias that
  currently resolves to the same WordPress install) rather than
  `aglpallet.com`. Both hosts served identical files at capture time, so
  the assets themselves are captured correctly in `/assets`, but this is a
  latent bug in the original site (a dead link if that alias domain is ever
  retired) — worth noting, not worth reproducing.

## 7. "How It Works" 4-step section (home page)

- Static 4-column grid (icon + numbered circle + heading + short
  paragraph). No carousel, no click-to-expand, no animation beyond
  whatever scroll-in fade Divi applies globally (see §9). Purely
  informational.

## 8. Vertical timeline (Logistics & Process page)

- 4 numbered steps (01–04) alternating left/right of a center vertical
  line, each with a heading and paragraph. Confirmed via
  `reference/logistics-process-1440.png`. Static — no scroll-driven
  progress indicator or animation beyond global scroll-in fades observed.

## 9. Scroll-triggered fade-ins

- Section content (headings, paragraphs, images) uses Divi's default
  "fade in on scroll" treatment sitewide — elements are invisible/offset
  until they enter the viewport, then animate to their resting state.
  Rebuild as a simple CSS/IntersectionObserver fade-in-on-scroll, not
  Divi's JS.

## 10. Elements checked and confirmed absent (do not build)

- **No accordion/toggle module anywhere** — `.et_pb_toggle_title` only
  appears in Divi's boilerplate framework CSS (defines styles in case the
  module is used); zero actual toggle instances exist in any captured page
  body. Confirmed by searching for the class inside `<body>` specifically.
- **No nav dropdowns/submenus** — flat 6-item nav on every page.
- **No image carousel/slider** anywhere in the captured pages.
- **No lightbox** — no gallery/lightbox markup found.
- **No chat widget, review embed, or social feed** on any captured page.

## Open questions / gaps

- Contact form's actual server-side email validation rule (regex, if any)
  is not observable from the client — flagged rather than guessed, per
  BRIEF.md's "never fabricate" rule.
