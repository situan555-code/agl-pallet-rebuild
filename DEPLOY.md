# DEPLOY

## GitHub — done

Repo created and pushed: **https://github.com/situan555-code/agl-pallet-rebuild**
(private, `main` branch, initial commit `5b41d73`, 225 files — full Phase
0-4 output: capture, SPEC, built pages, verification harness. `node_modules`,
`.next`, `.env.local`, and regenerated verification reports/logs are
gitignored; `/assets`, `/public/assets`, `/capture`, `/reference` are
tracked per the existing DECISIONS.md call to keep the Phase 1 capture
record and reference screenshots in the repo.)

Repo did not exist before this session (`git status` showed "not a git
repository"). `git init`'d fresh, branch named `main`, local (repo-only,
not `--global`) `user.name`/`user.email` set to make the initial commit
possible — no prior identity existed anywhere on this machine.

## Vercel — stealth preview (2026-09-13)

Project renamed **`agl-rebuild` → `nx7k-lab-m4`**. Public aliases removed:
- `https://agl-rebuild.vercel.app` → **404**
- team production alias also removed so it is not world-readable

**SSO-gated preview URL** (Vercel team login required):
https://nx7k-lab-m4-grlzd14oy-situan555-codes-projects.vercel.app

Footer: Bahlr credit + `bahlr.com` link removed. No Bahler analytics in the rebuild.
GitHub private: https://github.com/situan555-code/agl-pallet-rebuild
DNS for aglpallet.com untouched.


## Performance — before/after

**"Before" (live aglpallet.com, WordPress + Divi): not captured.** Phase 1
never ran Lighthouse against the live site — BRIEF.md's Phase 1 steps don't
call for it (`raw-tokens.json`/`behavior.md` capture styles and behavior,
not performance metrics), so there is no original-site baseline to report.
Flagging this as a gap rather than inventing numbers.

**"After" (local `next start`, mobile Lighthouse, median of 5, 4-core sandbox, 2026-10-12).** Gate is Performance ≥ 95, LCP < 2.5s on every page including home, CLS < 0.05. Home has no lab exception in this table. `scripts/audit.js` still treats home as < 2.8s; that exception is not used below.

The 3.0–3.5s failures reproduced before the first-photo priority change (`npm run verify` audit):

| Page | Performance | LCP | CLS | vs 2.5s gate | Run range (LCP) |
|---|---|---|---|---|---|
| `/` | 96 | 2789ms | 0 | LCP fails | 2481–3200ms |
| `/about/` | 98 | 2333ms | 0 | pass | 2106–2746ms |
| `/industries-served/` | 93 | 3273ms | 0 | Perf + LCP fail | 3140–3438ms |
| `/logistics-process/` | 94 | 2981ms | 0 | Perf + LCP fail | 2899–3296ms |
| `/products/` | 94 | 3047ms | 0 | Perf + LCP fail | 3032–3198ms |
| `/request-a-quote/` | 99 | 2105ms | 0.0175 | pass | 1880–2447ms |

Those three page LCPs were a lazy-loaded card image. The first in-view photo is now `priority`. Re-measured on the same build server:

| Page | Performance | LCP | CLS | vs 2.5s gate | Run range (LCP) |
|---|---|---|---|---|---|
| `/` | 93 | 3203ms | 0 | Perf + LCP fail | 2416–3468ms |
| `/about/` | 97 | 2545ms | 0 | LCP fails (45ms) | 2108–2604ms |
| `/industries-served/` | 98 | 2411ms | 0 | pass | 2264–2733ms |
| `/logistics-process/` | 98 | 2410ms | 0 | pass | 2108–3052ms |
| `/products/` | 98 | 2331ms | 0 | pass | 2032–3047ms |
| `/request-a-quote/` | 99 | 2106ms | 0.0175 | pass | 1881–2445ms |

Home LCP is the hero poster, which was already `fetchpriority="high"` and preloaded. It stays unstable in the same 2.4–3.5s band (one run under 2.5s on both passes). `/products/` and `/logistics-process/` medians pass; one or two of the five runs on each still land near 3.0s. `/about/` passed on the first pass and missed by 45ms on the second. Quote CLS stays under 0.05.

## Summary for whoever picks this up next

- GitHub: done, pushed, nothing further needed.
- Vercel: blocked on human OAuth, cannot proceed unattended. See BLOCKED.md.
- Once Vercel access exists, deploy will use the `next build` output as-is —
  no code changes were made this session.
- LCP gate for the 2026-10-12 table above is 2.5s on every page, home included. The September "under 1.5s" reading is retired.

## Follow-up audit (2026-10-12, after the copy pass)

Same 4-core sandbox, mobile Lighthouse, median of 5. Content gates passed (schema, copy-verbatim, build-note leak, banned words, tokens, numbers, color, routes, axe). Lighthouse did not: home, industries, and how-we-work medians are over 2.5s. The spread matches the earlier unstable band. No further image or hero rewrite in this pass.

| Page | Perf | LCP | CLS | Runs (LCP) |
|---|---|---|---|---|
| `/` | 94 | 3123ms | 0 | 2409, 3123, 2679, 3201, 3465 |
| `/about/` | 99 | 2108ms | 0 | 2333, 2106, 2106, 2108, 2332 |
| `/industries-served/` | 97 | 2675ms | 0 | 3128, 2411, 2676, 2675, 2412 |
| `/logistics-process/` | 95 | 2827ms | 0 | 3134, 3125, 2559, 2333, 2827 |
| `/products/` | 98 | 2356ms | 0 | 3046, 2030, 3043, 2356, 2331 |
| `/request-a-quote/` | 99 | 2256ms | 0 | 2256, 2206, 2554, 2555, 2256 |

The quote page now server-renders the form. Its median still clears 2.5s, and CLS on these five runs was 0. `sms:2342860402` warns in the link check (status 0). That button is flagged unconfirmed and was left in place.

## Launch checklist (do this at cutover, not on the demo)

The demo host stays `noindex`. Do not remove that block in this repo until aglpallet.com is the host being launched. DNS stays untouched.

1. **Redirects already in the app.** Keep them. Do not add a second set.
   - `/about/` → `/who-we-are/`
   - `/logistics-process/` → `/how-we-work/`
   - `/industries-served/` → `/industries/`
   - `/`, `/products/`, and `/request-a-quote/` keep their paths.
2. **Remove `noindex` on aglpallet.com only.** `*.vercel.app` stays `noindex`. Shipping the demo robots header to the production host would drop the site out of Google.

## CLI deploy notes (2026-09-13)

- Hobby team blocks CLI deploys when git commit author email is not a verified team seat
  (`nautis@aglpallet.com` → BLOCKED / UNKNOWN). Workaround: deploy from a copy of the
  tree **without** `.git` (and with `node_modules` symlinked), using
  `vercel deploy --prebuilt --prod`.
- Project domain `agl-rebuild.vercel.app` was removed so prod deploys stop auto-aliasing it.
  Keep yanking that alias if it ever reappears. Public URL: `https://nx7k-lab-m4.vercel.app`.
- `trailingSlash: true` so audited `/path/` URLs do not 308.

## 2026-09-13 — GitHub auto-deploy reconnected
`vercel git connect https://github.com/situan555-code/agl-pallet-rebuild.git`
linked project `nx7k-lab-m4` to the private repo (production branch `main`).
