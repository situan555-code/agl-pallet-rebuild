# Milestones

## M1 — Phase 0 (not shipped to main)

- **Date:** 2026-09-25
- **Tasks:** R0.1 (already on `redesign/main`), R0.3, R0.4, R0.5, R0.6, R0.7
- **Pages to look at:** `/` (hero is poster-only until R3.1), any interior page for the same Palette 03 look on Next 16 / Tailwind 4
- **Skipped / blocked:** Full `npm run verify` failed the home Lighthouse LCP/Perf gate on the long run (3166ms / 93). Isolated audit passed. See `BLOCKED.md`.
- **Rough edges:** `middleware.ts` is now `proxy.ts`. Palette 05 tokens are not applied yet (Phase 1). Color gate currently sees 0 hex greens in compiled CSS (oklch/rgb).
- **Branch:** `redesign/main` — **not merged to `main`**
