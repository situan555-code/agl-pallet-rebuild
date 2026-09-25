# Milestones

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
