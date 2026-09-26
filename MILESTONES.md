# Milestones

## M21 — Remaining UI review Medium and Low fixes (shipped to main)

- **Date:** 2026-09-26
- **Verify:** passed on the second median-of-5 run. Content gates and axe passed. CLS 0. Home median Perf **96**, LCP **2713ms**. Other medians: about 98/2361, industries 99/2262, logistics 99/2265, products 99/2265, quote 99/2263. First suite missed `/products/` (91 / 3485ms) after the card grid; product photos now idle-load except the first.
- **Mediums:**
  1. M1 — Footer 72/112 top margin. Who We Are uses the shared quote card.
  2. M2 — Supplier and carrier form left columns hold the not-sending notice and quote contact cards.
  3. M3 — Products is a 3/2/1 card grid of the home product-line treatment. Only Custom & engineered links.
  4. M4 — Closing CTA and Calculate use the primary pill.
  5. M5 — Process bodies hide the leading em dash; sr-only joiner stays.
  6. M6 — Three-column cards start at 1024.
  7. M7 — Two-column tables drop min-width. Three-plus columns get fade, zebra, sticky headers.
  8. M8 — Openers assigned in page components (no JSON/H1/JSON-LD change): light-image, light-text, inset-dark.
- **Lows:**
  1. L1 — Hero description `text-pretty` and `max-w-[46rem]`.
  2. L2 — Opener bottom padding 0; next section 112px sets the gap.
  3. L3 — Multi-column titles reserve `min-h-[2lh]`.
  4. L4 — Partner and article eyebrows use the shared slash.
  5. L5 — Carousel `lg:basis-[31%]` so three cards show with a peek.
  6. L6 — Supplier benefits are a 3-column grid (3+2).
  7. L7 — How We Work steps are a 2×2 card grid from 980px.
- **Branch:** `redesign/main` merged to `main`
