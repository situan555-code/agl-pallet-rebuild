# SPEC — AGL Pallet Rebuild

Phase 2 output. Written entirely from Phase 1 capture (`/capture`, `/assets`,
`/reference`, `pages.json`, `assets-manifest.json`, `fonts.md`,
`raw-tokens.json`, `behavior.md`, `DECISIONS.md`) — no live re-fetching, no
invented copy. No application code in this phase; this is the plan Phase 3
builds from.

Source platform (confirmed in PROGRESS.md, overturning BRIEF.md's
Squarespace assumption): **WordPress 7.1 + Divi 4.27.7 + Yoast SEO**, not
Squarespace. That only affects capture mechanics, already handled in Phase
1 — it does not change anything below.

---

## 1. Page inventory

6 pages, from `pages.json` (home is index 0, cross-checked against
sitemap + nav/footer crawl with zero discrepancies — see
`capture/inventory-report.json`).

### `/` — Home

Purpose: primary landing page, establishes the pitch and drives to the quote
form. Sections in order (from `capture/home.html`, section wrapper classes
in brackets):

1. Hero (`home_header`) — eyebrow "Reliable Pallet Sourcing", H1 "For
   Manufacturers Who Can't Afford Disruption", intro paragraph, background
   image (`home_header_image.jpg`), single CTA to `/request-a-quote/`.
2. "What AGL Pallet Does" (plain section) — eyebrow, H2 "A Single Point of
   Contact for Pallet Supply", two paragraphs, side image
   (`home_about_photo.jpg`).
3. Stats band (`home_stats`, dark green bg) — two stat pairs: "99% / On-Time
   Delivery" and "12+ / Years Industry Experience".
4. "Why AGL Exists" (`home_video` section, despite the class name this is
   the stats-adjacent text block, not the video — the actual `<video>` is
   in behavior.md §4) — eyebrow, H2 "Built From Inside the Manufacturing
   World", two paragraphs, side image (`why_agl_exist_sidepic.jpg`).
5. "Who AGL Serves" (`right_edge_shape`) — eyebrow, H2 "Serving
   High-Volume, High-Expectation Operations", two paragraphs, side image
   (`who_agl_is_sidepic.jpg`).
6. "How It Works" (`how_it_works_section`, dark green bg) — eyebrow, H2 "A
   Straightforward, Dependable Process", 4-column icon grid (see Component
   inventory → `ProcessStepGrid`).
7. CTA band (`cta_banner_section`) — eyebrow "Get In Touch", H2 "Let's Talk
   About Your Pallet Needs", paragraph, CTA to `/request-a-quote/`,
   background `get_in_touch_cta_banner_bg-1-scaled.jpg`.
8. Footer (shared, see Component inventory).

### `/about/` — About

Purpose: credibility/story page. Sections:

1. Hero — eyebrow "About", H1 "Experience, Accountability, and Real-World
   Perspective", paragraph. **Correction (repair session, 2026-09-12): this
   hero does have a background video** — the previous note above was wrong.
   `capture/about.html` shows a live `<video autoplay muted loop
   playsinline src=".../agl_home_video.mp4">` rendered inside
   `et_pb_section_0` (the hero section itself), and `reference/about-*.png`
   shows a dark-tinted industrial photo/video treatment behind the hero
   text, matching Home's hero pattern. Rebuilt as a full-bleed
   autoplay/muted/loop background video (same `agl_home_video.mp4` file)
   with a `bg-brand-green/50` overlay, not a plain background — the plain
   version broke header-nav color contrast (axe serious violation) since
   the fixed white nav text had nothing dark to sit on.
2. "Who AGL Serves" — eyebrow, H2 "Fair-Market Sourcing. Realistic
   Expectations. Long-Term Partnerships.", two paragraphs, side image
   (`about_page-single_point_sidepic.jpg`).
3. Ambient video section (`about_video_section`, dark green bg) — the
   `agl_home_video.mp4` file, configured autoplay/muted/loop/no-controls
   per behavior.md §4.
4. "How it Works" / industries grid — eyebrow, H2 "Built for Demanding
   Industrial Environments", 5 industry cards (Building Materials,
   Pharmaceuticals, Plastics, Chemicals, Food & Beverage) each with an icon,
   H3, paragraph — **plus a 6th card, "Build a More Reliable Supply Plan",
   that repeats the Plastics paragraph verbatim.** This is a real content
   bug on the live site (confirmed by reading the captured HTML directly,
   not a capture artifact) — carry the duplicate text over as-is per
   BRIEF.md's copy-preservation rule, do not silently fix it; flagged again
   in the Risk list.
5. "Single Point of Contact" — eyebrow, H2 "One Call. Full Accountability.",
   two paragraphs (same copy as home's "Who AGL Serves" paragraphs — real
   duplication across pages, not an error, carry over both instances).
6. CTA band — identical pattern to home's.
7. Footer.

### `/industries-served/` — Industries Served

Purpose: industry-fit page, largely a subset of About's industries content.
Sections:

1. Hero (`products_header` class — shared hero pattern name across
   Industries/Logistics/Products despite different content) — eyebrow
   "Industries Served", H1 "Serving High-Volume Manufacturing Operations",
   paragraph.
2. Industries grid (`industrial_environments_section`) — eyebrow "How it
   Works", H2 "Built for Demanding Industrial Environments", same 5+1 cards
   as About (including the same duplicated 6th-card copy — see above),
   this time on a light background with dark H3 text (About's version is on
   a dark green background with white H3 text — a real, intentional
   light/dark variant of the same card, not an inconsistency to collapse).
3. CTA band.
4. Footer.

### `/logistics-process/` — Logistics & Process

Purpose: process/trust page. Sections:

1. Hero (`products_header`) — eyebrow "Logistics & Process", H1 "A
   Structured, Reliable Supply Process", paragraph.
2. Vertical timeline (`timeline_section`) — 4 numbered steps (01–04): 
   "Understand Requirements", "Source Through Proven Manufacturers",
   "Coordinate Logistics", "Ongoing Adjustment", each H5 + paragraph +
   numbered icon, alternating left/right of a center line (behavior.md §8).
3. CTA band.
4. Footer.

### `/products/` — Products

Purpose: product catalog. Sections:

1. Hero (`products_header`) — eyebrow "Products", H1 "Pallet & Material
   Handling Solutions", subhead "Designed to match your operational needs —
   not generic assumptions."
2. Four product blocks, each H2 + short paragraph + long paragraph, each
   with an `id` anchor the footer's "Services" column links to directly
   (confirmed present in `products.html`): Stock Pallets (`#stock-pallet`),
   Engineered Pallet Solutions (`#eng-pallet-solutions`), Crates & Dunnage
   (`#crates-dunnage`), Shipping Blocks (`#shipping-blocks`). Preserve these
   exact anchor IDs — they're load-bearing for the footer links on every
   page, not just decorative. **Correction (Phase 3, products repair
   session): all 4 blocks do have a side image in the captured DOM** —
   the earlier claim that Crates & Dunnage and Shipping Blocks have no
   image was wrong; re-checked `capture/products.html` directly (same
   practice the About-hero correction established) and both `<img>` tags
   are present. The source itself reuses the Stock Pallets photography for
   these two blocks (`product_page-stock_pallets_sidepic.jpg` and
   `product_page-stock_pallets_sidepic-1.jpg`, the latter byte-identical to
   the Stock Pallets block's own `-1-1.jpg`) rather than shipping unique
   photos — a real content bug on the source site, not a capture gap.
   Carried over per the no-rewrite rule; flagged in Risk list for the owner
   to supply real photography post-migration.
3. CTA band.
4. Footer.

### `/request-a-quote/` — Request a Quote

Purpose: contact/lead form. Sections:

1. Hero (`contact_page_section`, dark green bg) — H1 "Contact AGL Pallet",
   paragraph, the 7-field form (see Forms section).
2. Contact info strip (`contact_info_items`) — three cards: Phone Number
   (`234-286-0402`), Email Address (`sales@aglpallet.com`), Text
   (`234-286-0402`), each with an icon that swaps on hover (behavior.md
   §6). No CTA band on this page — it *is* the CTA.
3. Footer.

### Shared chrome (every page)

- **Header**: fixed, transparent → dark green on scroll (behavior.md §1),
  logo linking to `/`, 6-item flat nav, pill "Contact Us" button.
- **Mobile nav**: hamburger → full-width dropdown panel (behavior.md §2).
- **Footer**: 4 columns — brand blurb (repeats the home hero's intro
  paragraph verbatim), "Navigation" (repeats main nav), "Services" (4
  anchor links to `/products/` sections: Stock Pallets
  `#stock-pallet`, Engineered Pallet Solutions `#eng-pallet-solutions`,
  Crates & Dunnage `#crates-dunnage`, Shipping Blocks `#shipping-blocks` —
  confirmed by reading `home.html`'s footer markup directly and
  cross-checking the matching `id` attributes exist on the 4 product
  blocks in `products.html`), "Get in Touch" (phone/email), "Follow Us"
  (Facebook + LinkedIn icon links). Copyright line: "Copyright © 2026 AGL
  Pallet. All
  Rights Reserved. This is Bahlr website." — carry over verbatim including
  the "This is Bahlr website" agency credit line; do not remove or "clean
  up" per the no-rewrite rule, though flag it for the owner as something
  they likely want removed post-migration (a business decision, not ours to
  make silently).

---

## 2. Component inventory

Smallest set covering all 6 pages. Props are illustrative, not final TS
signatures.

| Component | Props | Used on |
|---|---|---|
| `Header` | `logoSrc`, `navItems[]`, `ctaHref`, `ctaLabel` | all |
| `MobileNav` | `navItems[]`, `ctaHref`, `ctaLabel`, `isOpen` | all |
| `Hero` | `eyebrow`, `heading`, `body?`, `backgroundImage?`, `cta?`, `variant: 'image' \| 'dark' \| 'form'` | all (variant differs: image hero on Home/About/Industries/Logistics/Products, dark form hero on Request-a-Quote) |
| `SectionHeading` | `eyebrow?`, `heading`, `align?` | most content sections |
| `TextWithSideImage` | `eyebrow`, `heading`, `paragraphs[]`, `image`, `imageSide: 'left' \| 'right'` | Home (×3), About (×2) |
| `StatBand` | `stats: {value, label}[]` | Home |
| `ProcessStepGrid` | `steps: {icon, heading, body}[]` (4 items) | Home ("How It Works") |
| `Timeline` | `steps: {number, heading, body}[]` (4 items) | Logistics & Process |
| `IndustryCardGrid` | `cards: {icon, heading, body}[]`, `theme: 'light' \| 'dark'` | About (dark), Industries Served (light) |
| `ProductBlock` | `id` (anchor target), `heading`, `tagline`, `body`, `image?` | Products (×4) |
| `CTABand` | `eyebrow`, `heading`, `body`, `cta`, `backgroundImage` | Home, About, Industries Served, Logistics & Process, Products |
| `ContactForm` | `fields[]`, `action` | Request a Quote |
| `ContactInfoStrip` | `items: {icon, hoverIcon, label, value, href}[]` (3 items) | Request a Quote |
| `Footer` | `navItems[]`, `serviceItems[]`, `contact: {phone, email}`, `social: {facebook, linkedin}`, `blurb`, `copyright` | all |
| `Button` | `href`, `label`, `variant: 'pill-light' \| 'pill-dark'` | throughout |

Note: `IndustryCardGrid`'s 6th "Build a More Reliable Supply Plan" card
(duplicate Plastics copy, see Page inventory) is data, not a component
difference — the grid component takes whatever card array the content file
gives it, including the duplicate.

---

## 3. Design tokens

Consolidated from `raw-tokens.json`. One caveat that shapes this whole
section: Phase 1's token capture took the **first DOM match** per CSS
selector per page, not every match — so e.g. the `p` sample on every page is
actually the small eyebrow label above each H1 (it happens to be the first
`<p>` in the DOM), not a generic body paragraph. Cross-referenced against
`body`'s own computed style (which most true paragraphs inherit) to recover
the real body-copy token. Noted inline below and again in the Risk list.

### Color palette

| Token | Hex | Source | Usage |
|---|---|---|---|
| `ink` | `#002920` | `body` color, rgb(0,41,32) | primary text on light backgrounds |
| `brand-green` | `#1C391F` | rgb(28,57,31) | H2 color, header-on-scroll bg, dark section backgrounds, CTA button text |
| `surface` | `#ECFBF6` | `body` background, rgb(236,251,246) | page background |
| `surface-alt` | `#F4F5F4` | rgb(244,245,244) | alternating light section background |
| `white` | `#FFFFFF` | rgb(255,255,255) | text on dark sections, button backgrounds, some section backgrounds |
| `eyebrow-ink` | `#423A2F` | `.subheading p` color, found in home.html's inline `<style>` (missed by `raw-tokens.json`'s selector list — Risk #2) | eyebrow label text on light backgrounds (white on dark, per `.subheading.light p`) |

No other distinct colors appeared in the sampled elements (no accents, no
error/success colors observed — the form's error state is a class-based
outline per behavior.md, exact color not captured in static computed-style
dumps; use `ink`/a standard red for the error outline and flag as
unverified — see Risk list).

### Type scale

Font stacks: `font-sans` = Inter (Google, unchanged), `font-display` =
Bungee (Google, substitutes CoFo Peshka — see `fonts.md`/`DECISIONS.md`).

| Token | Size / line-height | Weight | Family | Notes |
|---|---|---|---|---|
| `display-1` (H1) | 48px / 57.6px (1.2) | 700 | display | page hero heading, one per page |
| `display-2` (H2) | 41px / 49.2px (1.2) | 700 | display | section heading |
| `display-3` (H3) | 20px / 20px (1.0) | 700 | display | industry card heading |
| `display-4` (H4) | 14px / 14px (1.0) | 700 | display | contact-info micro-labels (Request a Quote only) |
| `step-heading-sm` (H5) | 16px / 20.8px (1.3) | 700 | display | `ProcessStepGrid` step heading (Home) |
| `step-heading-lg` (H5) | 25px / 25px (1.0) | 700 | display | `Timeline` step heading (Logistics) — kept distinct from `step-heading-sm`, real difference between the icon-grid and timeline components, not consolidated |
| `body` | 14px / 23.8px (1.7) | 400 | sans | default paragraph copy, recovered from `body`'s own computed style, not the mis-captured `p` sample |
| `eyebrow` | 11px / 23.8px | 600 | sans | small label above each heading; 1px letter-spacing; color follows section theme (white on dark, `ink`/`brand-green` on light) |
| `link` | 14px / 23px | 500 | sans | inline text links |
| `nav-link` | 14px / 14px | 600 | sans | header/footer nav items, always white regardless of header state |
| `button` | 14px / 23.8px | 700 | sans | CTA button label |

Original single-weight `cofopeshka550` was used at CSS `font-weight: 400`
but the file itself is a semibold-equivalent instance — Bungee is applied
at weight 700 to match the visual heft (see `DECISIONS.md`), not 400.

### Spacing scale

Section vertical padding values observed: `10, 15, 16, 18, 25, 35, 50,
51.1875, 75, 85, 100, 119, 144, 152` (px). Consolidation:

- `51.1875px` → rounded to **`50px`**. This is Divi's own percentage-derived
  default section padding recomputed at the 1440 capture width, not a
  deliberate design choice — safe to round, logged here as the one token
  consolidation this phase makes.
- `75px`, `85px`, `100px` kept distinct — these differentiate CTA bands
  (100px) from standard content sections (75px) from the home stats/video
  bands (85px); a real, deliberate rhythm, not noise.
- Hero top-padding varies by page (`119` on About, `144` on Home/Industries/
  Products, `152` on Logistics) because each hero's background image has a
  different natural height and the fixed header still needs to clear it —
  this is layout-driven, not a token to unify. Build each hero with its own
  measured top offset rather than forcing one shared value.
- Base scale for everything else (component-level spacing, gaps, icon
  margins): `4, 8, 16, 18, 24, 32, 50` px — a conventional 8px-ish scale
  that covers the remaining observed values (16px form-field padding, 18px
  button icon gap).

### Breakpoints

Capture/reference viewports: **390 / 768 / 1440** (BRIEF.md's fixed set,
used for screenshots and diffing). Separately, behavior.md documents Divi's
own mobile-nav collapse point at **~980px** — that's a real functional
breakpoint (nav behavior changes there), distinct from the visual-diff
viewports. Tailwind config needs a custom `nav: '980px'` screen in addition
to the standard scale; don't conflate it with `lg` (1024px default).

### Radii & shadows

- `radius-none`: `0px` — default for sections, cards, images.
- `radius-input`: `4px` — form fields.
- `radius-pill`: `400px` literal value, effectively a full pill at any
  realistic button height → map to Tailwind `rounded-full`.
- Shadows: every sampled element captured `box-shadow: none`. No shadow
  token needed. (Doesn't rule out a shadow existing on an unsampled hover/
  focus state — flagged in Risk list, not assumed.)

---

## 4. Content model

All content lives under `/content`, JSON for structured page data. Shapes:

```
content/
  site.json            — nav items, footer nav/services/social/contact, brand blurb, copyright
  pages/
    home.json
    about.json
    industries-served.json
    logistics-process.json
    products.json
    request-a-quote.json
```

`site.json`:
```ts
{
  nav: { label: string; href: string }[];       // 6 items, Home..Contact Us
  footer: {
    servicesNav: { label: string; href: string }[]; // 4 items, anchor links into /products/ — see §1 Products
    social: { facebook: string; linkedin: string };
    contact: { phone: string; email: string };
    blurb: string;   // reused verbatim from home hero intro
    copyright: string;
  };
}
```

Each page JSON is an ordered array of typed section blocks matching the
Component inventory, e.g.:

```ts
// pages/home.json (shape, not full content)
{
  hero: { eyebrow, heading, body, image, cta: { label, href } },
  sections: (
    | { type: 'textWithImage'; eyebrow; heading; paragraphs: string[]; image; imageSide }
    | { type: 'statBand'; stats: { value: string; label: string }[] }
    | { type: 'processSteps'; eyebrow; heading; steps: { icon; heading; body }[] }
    | { type: 'ctaBand'; eyebrow; heading; body; cta; backgroundImage }
  )[];
}
```

`industries-served.json` and the industries block inside `about.json` share
a `cards: { icon; heading; body }[]` shape (6 items, including the
duplicate-copy 6th card — see Page inventory) — either factor into one
shared `content/shared/industry-cards.json` imported by both pages, or
duplicate the array in both page files. Recommend the shared file since the
duplication in the source is a bug, not a feature, and a single source
avoids drifting the two copies further apart during future edits.

`request-a-quote.json` holds hero copy + the `ContactInfoStrip` items; the
form's field list/labels/validation rules live in code (`ContactForm`
component config), not content JSON, since they're structural, not
editorial.

MDX is not needed anywhere — every page is structured section data, no
freeform long-form copy that benefits from MDX's prose-with-embedded-
components model. Keep JSON-only per BRIEF's "JSON or MDX" allowance.

---

## 5. Forms

One form, on `/request-a-quote/`.

| Field | Original name attr | Type (rebuild) | Required |
|---|---|---|---|
| Full Name | `et_pb_contact_name_0` | text | yes |
| Company Name | `et_pb_contact_company_0` | text | yes |
| Email Address | `et_pb_contact_email_0` | **email** (original was plain text; behavior.md's sanctioned deviation, native format check, "rebuilding behavior not markup") | yes |
| Phone Number | `et_pb_contact_phone_0` | text (`tel` inputmode) | yes |
| Pallet Dimensions | `et_pb_contact_pallet_dimensions_0` | text | yes |
| Estimated Pallet Quantity | `et_pb_contact_pallet_0` | text | yes |
| Message | `et_pb_contact_message_0` | textarea | yes |

Validation (behavior.md §5): all 7 required, client-side only, no native
browser validation UI. On empty submit: each invalid field gets an error
class (red outline — exact hex not captured, see Risk list), plus a summary
block above the form: "Please, fill in the following fields:" + bulleted
labels. Rebuild this exact UX with React state, not HTML5 `required` alone
(which would show native browser bubbles the original doesn't have).

Submission: original posts back to the same WordPress page via Divi's own
AJAX handler — cannot be ported (server-side, WordPress-specific). Per
BRIEF.md Section C: implement as a Next.js route handler (`app/api/quote/
route.ts` or similar) posting through Resend, reading `RESEND_API_KEY` and
`CONTACT_TO_EMAIL` from `.env.local`. **Neither variable exists yet** — no
`.env.local` file is present in this repo as of this phase. Per Section C,
build the full form and handler anyway in Phase 3; the handler should log
and return success in dev when the vars are absent, and Phase 3 must add
the missing-variable entry to `BLOCKED.md` at that point (not now — this is
a Phase 3 build-time action, noted here so it isn't missed).

Server-side email format/validation rule on the original is not observable
from static capture (behavior.md's own open question) — not fabricated,
just not portable 1:1; the rebuild's `type="email"` gives an equivalent
client-side floor.

---

## 6. Third-party

Checked for and confirmed **absent** across all 6 pages (behavior.md §10,
re-confirmed here via direct grep of `/capture/*.html` for iframes and
`maps.google`/`google.com/maps` strings — zero matches):

- No analytics or tag manager (GA/GTM), no ad pixels (Meta/etc.), no
  session-replay tools (Hotjar/Clarity).
- No chat widget.
- No review embeds.
- No map embed (no address is even published — only phone/email).
- No social feed embed.

Present, and simple:

- **Facebook**: `https://www.facebook.com/profile.php?id=61584727225727`
  — plain external link in footer, icon only, no SDK/embed.
- **LinkedIn**: `https://www.linkedin.com/company/aglpallet/` — same,
  plain link.

Nothing here needs credentials or a `.env.local` entry — both are just
`<a href>`s. If the owner later wants real analytics on the new site,
that's a net-new decision post-migration, not a carryover.

---

## 7. SEO carryover

Default: every URL stays byte-identical, no redirects needed (BRIEF.md
default). Confirmed no path needs to change — cross-check in Page inventory
above found no naming conflicts.

| Path | Title | Meta description | OG type | OG image | Structured data |
|---|---|---|---|---|---|
| `/` | AGL Pallet - For Manufacturers Who Can't Afford Disruption | AGL Pallet sources and delivers truckload pallet orders through trusted manufacturers with end-to-end logistics support. | website | `agl_social_share.jpg` (1200×675) | Yoast `@graph`: WebPage + BreadcrumbList + WebSite (w/ SearchAction) |
| `/about/` | About - AGL Pallet | **absent on source** — no `<meta name="description">` at all | article | same | same graph shape, page-scoped |
| `/industries-served/` | Industries Served - AGL Pallet | **absent on source** | article | same | same |
| `/logistics-process/` | Logistics & Process - AGL Pallet | **absent on source** | article | same | same |
| `/products/` | Products - AGL Pallet | **absent on source** | article | same | same |
| `/request-a-quote/` | Request a Quote - AGL Pallet | **absent on source** | article | same | same, plus Twitter `label1`/`data1` reading-time meta ("9 minutes") |

Notes:

- The 5 missing meta descriptions are a real gap in the source (confirmed
  absent, not empty-string) — per BRIEF.md, do not invent copy to fill
  them. Carry the gap forward (omit the tag) unless the site owner supplies
  real copy before launch; this is worth flagging to them directly since
  it's an easy, free SEO win they're currently leaving on the table.
- `og:type` is `website` on home and `article` on every inner page — that's
  the original's actual (slightly odd, Yoast-default) behavior, carried
  over as-is rather than "fixed," per the preserve-exactly rule.
- Structured data is Yoast's generic `@graph` (WebPage/BreadcrumbList/
  WebSite), not an Organization or LocalBusiness schema — there's no
  address/geo data anywhere on the site to build one from, so nothing richer
  is being left behind.
- Favicon: `cropped-agl_favicon.jpg` (32/180/192/270px variants captured)
  carries over directly.
- `og:site_name` "AGL Pallet", `og:locale` "en_US" on every page — carry
  over as global defaults in the root layout's metadata.

---

## 8. Risk list

Ranked by expected difficulty closing the gap in Phase 4 verification.

1. **Font substitution (CoFo Peshka → Bungee).** Highest-confidence source
   of visible diff-percentage failures. Bungee is the closest available
   Google Font by measured metrics, but it's still a different typeface —
   expect every heading to show some diff-tool delta. Per BRIEF.md Phase 4:
   when this shows up, log it in `DIFFS.md` with the diagnosis, don't chase
   it by nudging spacing.
2. **Design-token capture blind spots.** `raw-tokens.json`'s schema
   (BRIEF.md Phase 1 §7) never captured `border`/`border-color`, hover/
   focus states, or `text-transform`. This SPEC's `eyebrow` token's actual
   casing, the form's error-outline color, and any focus rings are
   consequently best-effort inferred from screenshots, not measured. Verify
   each against `/reference` screenshots during Phase 3 build, not assumed
   from this document alone.
3. **Two H2 color/theme instances per page weren't independently
   verified.** The token capture takes the first DOM match per selector, so
   e.g. a page with both a light-background H2 and a dark-CTA-band H2 only
   has the first one's color confirmed mechanically. Cross-check each H2 instance
   against its section's reference screenshot before hardcoding color, don't
   assume every H2 on a page is the same color.
4. **Products page reuses Stock Pallets photography for 2 of 4 categories**
   (Crates & Dunnage, Shipping Blocks — confirmed present but duplicated in
   source, corrected from an earlier SPEC draft that wrongly called these
   images absent). Likely unintentional on the client's part; flagged for
   the owner to supply real photography post-migration, not ours to invent.
5. **About/Industries-Served industries grid has a real content bug**
   (6th card repeats the Plastics paragraph under a different heading,
   "Build a More Reliable Supply Plan"). Carrying it over per the
   no-rewrite rule, but this is the single most likely candidate for the
   site owner to ask "was that a mistake?" — worth surfacing outside this
   doc, not just leaving buried in a content JSON file.
6. **Mobile nav breakpoint (~980px) is approximate**, read off behavior.md's
   description of Divi's default, not a hard-measured value from this
   site's own CSS. Confirm the exact pixel value against the captured CSS
   in `/capture/css` before hardcoding the `nav` Tailwind screen, rather
   than trusting the "~980px" default assumption.
7. **`npm audit` (23 vulnerabilities: 16 moderate / 6 high / 1 critical)**
   is still unreviewed as of this phase (noted in PROGRESS.md) — not a
   spec-content risk, but should be resolved before Phase 5 deploy, not
   left for the last minute.
8. **Contact form's server-side validation rule is unobservable** (both
   behavior.md and this SPEC's Forms section note this) — the rebuild's
   floor is "required, non-empty, native email format," which may be looser
   or stricter than the original in ways nobody can currently verify.
