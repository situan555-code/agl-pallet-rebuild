# HANDOFF — AGL verify-green Waves A and B

**Date:** 2026-09-24
**Repo:** situan555-code/agl-pallet-rebuild
**Branch:** `cursor/wave-a-verify-green-a578`
**Implementation SHA:** `06ef497bc0b7dc11aed96f805ff9c19cd8e71648`
**Base:** `e3fb32f` (main, resource library §§1–6)
**PR:** https://github.com/situan555-code/agl-pallet-rebuild/pull/8 (draft). Do not merge.

## Waves

- **Wave A landed.** Color `#162619`, banned-words (brokerage rephrases plus the DOCTYPE scanner fix), and the mobile audit. Thresholds were not changed. `{{TBD-*}}` was not rendered back into HTML.
- **Wave B landed.** Nautis locked omit-until-cutover. `tokens.js` and `copy-verbatim.js` now expect that omission and still fail if a raw placeholder is visible. `reference/` and `pages.json` baselines are the current redesign. Height limit stays 15%. Layout was not crushed back to the WordPress captures.

## Verify result

`npm run verify` exited 0 on the production build.

| Check | Result |
| --- | --- |
| build + placeholder-guard | PASS. 49 pages, no `{{`, `TBD`, or `vercel.app`. |
| schema | PASS. 51 URLs, 0 schema errors. |
| copy-verbatim | PASS. Carriers list item requires `Paid on agreed terms.` The `{{TBD-CARRIER-TERMS}}` suffix is omitted until cutover. |
| build-note-leak | PASS. |
| banned-words | PASS. 13 SPEC routes, 0 hits. |
| tokens | PASS. Listed tokens omitted. None visible. |
| numbers | PASS. |
| color | PASS. 100 greens, all `#162619`, 0 disallowed. |
| routes | PASS. |
| height | PASS. 18 pairs, 0% vs the new redesign baselines. Limit 15%. |
| audit | PASS. Perf 98–100, LCP 1880–2404 ms, CLS 0, axe serious/critical 0. |

Audit routes: `/` 98 / 2404 ms, `/about/` 98 / 2322 ms, `/industries-served/` 98 / 2397 ms, `/logistics-process/` 98 / 2398 ms, `/products/` 100 / 1880 ms, `/request-a-quote/` 98 / 2325 ms.

`sms:2342860402` is a link-check warning only. Sell/recycle stays 404. No HowTo. No `llms.txt`.

`screenshots/` is gitignored. Height passed because this workspace had just shot the same build. A tree with no `screenshots/` still reports a missing pair. That is the existing harness.
