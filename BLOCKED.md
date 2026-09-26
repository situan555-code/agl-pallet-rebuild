# BLOCKED

## Home lab gate after the 2800ms exception (2026-09-26)

Owner exception is in `scripts/audit.js`: home LCP must be under 2800ms; every other page stays at 2500ms. Perf ≥ 95 and CLS ≤ 0.05 are unchanged. `@vercel/speed-insights` is on the root layout. Real-visitor target remains p75 LCP under 2500ms.

Content gates passed. Two full mobile audits did not:

1. `/` Perf 98 LCP 2496ms (pass). `/request-a-quote/` Perf 96 LCP 2662ms (fail). About, industries, logistics, and products passed.
2. `/` Perf 95 LCP 2966ms (fail, over 2800ms). `/request-a-quote/` Perf 99 LCP 2262ms (pass). The other four pages passed.

`sms:` link check is a warning, not a fail. Axe passed. Did not merge to `main`. Did not soften any other gate.

## Home LCP after the split (2026-09-26)

Warmed mobile Lighthouse on `/` after removing the duplicate poster, deferring the network diagram, carousel, and parallax band, and taking motion off the hero. The LCP node is the hero poster image, not the description. Four runs: Perf 97 LCP 2644ms, Perf 98 LCP 2493ms, Perf 97 LCP 2641ms, Perf 97 LCP 2669ms, CLS 0. Perf clears 95. LCP does not stay under 2500ms for two runs in a row. Did not merge to `main`. Largest remaining scripts are the shared Next.js runtime, the client router, and the polyfill (see M17).

## UI audit ship after task 13 (2026-09-26)

`npm run verify` on `redesign/main` after tasks 1–13: schema/copy/banned-words/tokens/numbers/color/routes/axe passed. Home mobile Perf 86, LCP 4286ms (gate 2500). In the same run `/about/` LCP was 2734ms and `/request-a-quote/` LCP was 2583ms. Isolated retries: home Perf 85, LCP 4358ms (worse); `/about/` Perf 99, LCP 2266ms; `/request-a-quote/` Perf 98, LCP 2413ms, CLS 0. The only miss that stays outside the gate is home LCP/Perf. Did not merge to `main`. Two attempts.

## UI audit ship after task 10 (2026-09-26)

`npm run verify` on `redesign/main` after tasks 1–10: schema/copy/banned-words/tokens/numbers/color/routes/axe passed. Home mobile Perf 87, LCP 4062ms (gate 2500). Other audited pages passed (LCP ≤2417ms). Isolated Lighthouse retry on `/` was worse (Perf 85, LCP 4359ms). Same home LCP miss as the task 4 and task 7 ships. Did not merge to `main`. Two attempts; not a content-gate miss on the other checks.

## Quote form Resend from-domain (2026-09-26)

Preview POST `/api/forms/` on the task 10 deployment returned 502 `{ ok: false, fallback: true }`. Exact error: `The aglpallet.com domain is not verified. Please, add and verify your domain on https://resend.com/domains`

From stayed `AGL Pallet <sales@aglpallet.com>` (`RESEND_FROM` is not set). FormSubmit stays on the quote form. Supplier and carrier stay not-sending. DNS was not changed.

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
- **`RESEND_API_KEY`** — set in Vercel (Production and Preview) as of 2026-09-26. The quote route calls Resend. `aglpallet.com` is not a verified Resend domain, so the quote form still falls back to FormSubmit. Supplier and carrier forms stay "not sending yet" because those inboxes were not provided.
