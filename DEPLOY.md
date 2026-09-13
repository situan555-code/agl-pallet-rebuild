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

## Vercel — deployed (2026-09-13 ~12:24 AM ET)

Authenticated as `situan555-code` (Hobby team `situan555-codes-projects`).
Disabled Vercel Authentication (SSO) on the project so the preview is public.

**Production URLs (public):**
- https://agl-rebuild.vercel.app
- https://agl-rebuild-situan555-codes-projects.vercel.app

**Ready deployment:** https://agl-rebuild-rmj2bq2yo-situan555-codes-projects.vercel.app

DNS was **not** touched — `aglpallet.com` still points at WordPress until you cut over by hand.

GitHub: https://github.com/situan555-code/agl-pallet-rebuild (`main`).


## Performance — before/after

**"Before" (live aglpallet.com, WordPress + Divi): not captured.** Phase 1
never ran Lighthouse against the live site — BRIEF.md's Phase 1 steps don't
call for it (`raw-tokens.json`/`behavior.md` capture styles and behavior,
not performance metrics), so there is no original-site baseline to report.
Flagging this as a gap rather than inventing numbers.

**"After" (this rebuild, local production build via `next start`, most
recent `audit-report.json`, generated 2026-09-12T23:43Z):**

| Page | Performance | LCP | CLS | Gate (≥95 / <1.5s / <0.05) |
|---|---|---|---|---|
| `/` | 98 | 2499ms | 0 | LCP fails |
| `/about/` | 94 | 2567ms | 0 | Perf + LCP fail |
| `/industries-served/` | 98 | 2337ms | 0 | LCP fails |
| `/logistics-process/` | 99 | 2115ms | 0 | LCP fails |
| `/products/` | 99 | 1965ms | 0 | LCP fails |
| `/request-a-quote/` | 98 | 2343ms | 0 | LCP fails |

**This table is stale and should be re-generated, not trusted as current**:
it predates the 2026-09-13 height-repair session (padding/spacing increases
to `CTABand`, `Footer`, `TimelineSection`, `IndustryCardGrid`,
`ContactInfoStrip`), which changed page heights and could shift LCP either
way. Re-run `npm run audit` against a fresh `next build && next start`
before treating these numbers as the rebuild's true current state.

As of the numbers actually on disk: Performance score is at or near the ≥95
gate on 5/6 pages (only `/about/` misses it, at 94), CLS is a clean 0
everywhere, but **LCP fails the <1.5s gate on every page** (1965-2567ms) —
this is the one hard gate in Section E that is not met project-wide right
now, per the most recent measurement. Not investigated or fixed this
session — Phase 5's scope was push + deploy, not verify/repair.

## Summary for whoever picks this up next

- GitHub: done, pushed, nothing further needed.
- Vercel: blocked on human OAuth, cannot proceed unattended. See BLOCKED.md.
- Once Vercel access exists, deploy will use the `next build` output as-is —
  no code changes were made this session.
- LCP is the one open Definition-of-Done gate across all 6 pages per the
  last audit run; re-verify after the recent height-repair changes before
  deciding whether it's still failing.
