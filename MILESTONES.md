# Milestones

## M14 — UI audit tasks 5–7 (not shipped)

- **Date:** 2026-09-26
- **Tasks:** 5 hero scroll, 6 home spacing, 7 inset panels and text/image
- **Verify:** failed. Home LCP **3984ms** / Perf **88** (isolated retry **4286ms** / **86**). Other audited pages passed (LCP ≤2190ms). See `BLOCKED.md`. Not merged to `main`.
- **What changed:**
  1. Desktop hero video scales from about 56% of the container to full content width over one viewport, then releases. Capability cards stay in flow. Mobile stays a static 4:5 card.
  2. Home sections use 112px desktop / 72px mobile top padding. Eyebrow to heading 12px, heading to body 20px, body to CTA 32px.
  3. Bone and full-bleed green slabs are rounded container panels on moss. Text-and-image rows are 4:3 and vertically centered. The home who-we-are teaser puts the image on the left.
- **Pages to look at:** `/` (hero scroll, who-we-are panel), `/request-a-quote/`, `/resources/gma-pallets-and-grades/`, `/who-we-are/`
- **Branch:** `redesign/main` — **not merged to `main`**

## M13 — UI audit tasks 1–4 (not shipped)

- **Date:** 2026-09-26
- **Tasks:** 1 screenshot tool, 2 home container, 3 site-wide container, 4 nav
- **Verify:** failed. Home LCP **3834ms** / Perf **89** (isolated retry **4360ms** / **85**). Other audited pages passed. See `BLOCKED.md`. Not merged to `main`.
- **What changed:**
  1. `npm run shots` writes full-page captures and hero scroll samples to `qa/shots/latest/` (gitignored).
  2. One content column: max-width 1280px, padding 24 / 32 / 48px. Home, interior pages, articles, and the footer use it. Nav logo and headings share a left edge at 1440 and 1920.
  3. Header logo is 29px tall, with no box except a keyboard ice ring. The bar is clear at the top and a moss pill (85%, 16px blur, smoke border, soft shadow) after 8px of scroll.
- **Pages to look at:** `/` (logo and headings), `/who-we-are/`, `/faq/`, `/request-a-quote/`, then scroll any page for the pill.
- **Branch:** `redesign/main` — **not merged to `main`**

## M12 — Owner home review (ship to main)

- **Date:** 2026-09-25
- **Tasks:** Owner-review items 1–8 on `redesign/main`, then `npm run verify` (home LCP **2336ms** / Perf **98** / CLS 0)
- **What changed:**
  1. Headings inherit the surface (`text-current`): bone on moss, moss on bone. `SectionHeading` no longer defaults to a light/green theme. Product card titles inherit. Interior section headings (FAQ, process, about, resources, rule lists) updated the same way. `text-white` replaced with bone tokens on dark chrome.
  2. `hero115` removed. `HeroExpand` is a sticky scroll-expand video card (Motion `useScroll`, no wheel hijack). Poster is the LCP `next/image`. Native video loads after `window` `load` + `requestIdleCallback`, `muted` then `play()`, fades in on `playing`. Reduced motion = poster only.
  3. Primary = bone fill / moss text. Used on hero “Request a quote” and nav “Request a Quote”. Other CTAs outline.
  4. Nav: smaller logo, `xl` desktop links (hamburger earlier), `whitespace-nowrap`, no scrolled logo box, `bg-moss/85` + `backdrop-blur-xl`.
  5. Network: Magic UI `AnimatedBeam`, three existing labels → AGL Pallet → Your line. Ice glow. Lucide cards. No slider dots. No 500px empty well.
  6. Capability dashes off; 01/02/03 ice; coordination band is a rounded inset with a lighter overlay and parallax; carousel clips to card radius with ice arrows; pledge heading is large bone; mills/carriers cards stretch equal height; `section-y` tightened; Who We Are sits on bone mid-page.
  7. Footer is one desktop row (brand/contact/CTA left, three columns right).
  8. Remaining `clay` / `rounded-sm` / `ring-clay` classes removed from app TSX.
- **Pages to look at:** `/` first, then `/how-we-work/`, `/who-we-are/`, `/the-pledge/`, `/products/`, `/faq/`
- **Could not finish / caveats:**
  - R3.1 WebM encode from the implementation plan was **not** added. The existing MP4 is what verify used. LCP passed, so the video was left in.
  - Video autoplay and nav wrap were not walked in a real browser this pass — only `npm run verify` (Lighthouse mobile) and TypeScript/build.
  - Some resource **body** links still use `text-brand-green` / `text-ink` (not section headings). Not part of the six-file Palette 03 class sweep.
- **Branch:** `redesign/main` merged to `main`

## M11 — Phase 8 / R8.4 (ship to main)

- **Date:** 2026-09-25
- **Tasks:** R1.2–R8.4 on `redesign/main`; R8.4 `npm run verify` green (home LCP 2408ms / Perf 98)
- **Pages to look at:** `/`, `/faq/`, `/resources/`, `/request-a-quote/`
- **Skipped / blocked:** Owner TBDs and Resend key still in `BLOCKED.md`. Hero remains poster-only for LCP. DOMAIN-SWITCH-RUNBOOK not run.
- **Branch:** `redesign/main` merged to `main`

## M2 — Phase 1 (not shipped to main)

- **Date:** 2026-09-25
- **Tasks:** R1.1 tokens, R1.2 type, R1.3 buttons, R1.4 Section/grain/dots, R1.5 Reveal
- **Pages to look at:** `/` (Palette 05, Inter headings, pill buttons, inset-green CTA), `/faq/` (Reveal)
- **Skipped / blocked:** Home LCP 2563ms (Perf 97). See `BLOCKED.md`. Not merged to `main`.
- **Branch:** `redesign/main` — **not merged to `main`**

## M1 — Phase 0 (not shipped to main)

- **Date:** 2026-09-25
- **Tasks:** R0.1 (already on `redesign/main`), R0.3, R0.4, R0.5, R0.6, R0.7
- **Pages to look at:** `/` (hero is poster-only until R3.1), any interior page for the same Palette 03 look on Next 16 / Tailwind 4
- **Skipped / blocked:** Full `npm run verify` failed the home Lighthouse LCP/Perf gate on the long run (3166ms / 93). Isolated audit passed. See `BLOCKED.md`.
- **Rough edges:** `middleware.ts` is now `proxy.ts`. Palette 05 tokens are not applied yet (Phase 1). Color gate currently sees 0 hex greens in compiled CSS (oklch/rgb).
- **Branch:** `redesign/main` — **not merged to `main`**
