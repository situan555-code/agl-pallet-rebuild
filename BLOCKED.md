# BLOCKED

## M1 verify (2026-09-25)

`npm run verify` on `redesign/main` after Phase 0: schema/copy/banned-words/tokens/numbers/color/routes passed. Isolated `npm run audit` then passed (home LCP 2187ms, Perf 99). Full-suite `verify` failed again on `/` (LCP 3166ms, Perf 93) — looks like harness contention after a long run, not a content change. Quote CLS 0.40 was fixed. Two LCP attempts: reserved form height, preloaded home poster. Did not merge M1 to `main`. Retry at M2.

Open items (owner-supplied; not engineering work):

- **`{{TBD-ADDRESS}}`** — real address required before LocalBusiness JSON-LD can emit.
- **`{{TBD-SOCIAL-URLS}}`** — Follow Us / social links omitted until resolved.
- **Supplier inbox** — `{{TBD-EMAIL-SUPPLIER}}`; supplier form stays "not sending yet".
- **Carrier inbox** — `{{TBD-EMAIL-CARRIER}}`; carrier form stays "not sending yet".
- **`RESEND_API_KEY`** — required in Vercel env for D4 (Resend route handler, task R7.3). Until then, keep the visible "not sending yet" state on supplier/carrier and the working FormSubmit quote form.
