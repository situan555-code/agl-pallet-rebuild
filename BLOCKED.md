# BLOCKED

## UI audit ship after task 7 (2026-09-26)

`npm run verify` on `redesign/main` after tasks 1–7: schema/copy/banned-words/tokens/numbers/color/routes/axe passed. Home mobile Perf 88, LCP 3984ms (gate 2500). Other audited pages passed (LCP ≤2190ms). Isolated Lighthouse retry on `/` was worse (Perf 86, LCP 4286ms). Same home LCP miss as the task 4 ship. Did not merge to `main`. Two attempts; not a content-gate miss on the other checks.

## UI audit ship after task 4 (2026-09-26)

`npm run verify` on `redesign/main` after tasks 1–4: schema/copy/banned-words/tokens/numbers/color/routes/axe passed. Home mobile Perf 89, LCP 3834ms (gate 2500). Other audited pages passed (LCP ≤2413ms). Isolated Lighthouse retry on `/` was worse (Perf 85, LCP 4360ms). LCP node is the hero description paragraph, about 89% render delay. Did not merge to `main`. Two attempts; not a content-gate miss on the other checks.

## M2 verify (2026-09-25)

`npm run verify` after Phase 1 (two attempts): schema/copy/banned-words/tokens/numbers/color/routes/axe passed. Home mobile Perf 97 but LCP 2563ms (gate 2500). First attempt was 3079ms / 94 with Reveal on the home Feature1 tree; Reveal moved to FAQ. Other audited pages LCP ≤2187ms. Did not merge M2 to `main`. Retry at M3 (after shell / R2) or R8.2.

## M1 verify (2026-09-25)

`npm run verify` on `redesign/main` after Phase 0: schema/copy/banned-words/tokens/numbers/color/routes passed. Isolated `npm run audit` then passed (home LCP 2187ms, Perf 99). Full-suite `verify` failed again on `/` (LCP 3166ms, Perf 93) — looks like harness contention after a long run, not a content change. Quote CLS 0.40 was fixed. Two LCP attempts: reserved form height, preloaded home poster. Did not merge M1 to `main`. Retry at M2.

Open items (owner-supplied; not engineering work):

- **`{{TBD-ADDRESS}}`** — still open. Real address required before LocalBusiness JSON-LD can emit.
- **`{{TBD-SOCIAL-URLS}}`** — still open. Follow Us / social links omitted until resolved.
- **Supplier inbox** — not provided. Supplier form stays "not sending yet".
- **Carrier inbox** — not provided. Carrier form stays "not sending yet".
- **`RESEND_API_KEY`** — set in Vercel (Production and Preview) as of 2026-09-26. D4 is unblocked for the quote form. Supplier and carrier forms stay "not sending yet" because those inboxes were not provided.
