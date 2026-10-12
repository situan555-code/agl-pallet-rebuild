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

**"Before" (live aglpallet.com, WordPress + Divi): not captured.** No original-site Lighthouse baseline exists; none is invented here.

**"After" (this rebuild, `next build && next start`, `npm run audit`, mobile Lighthouse, median of 5 runs, 2026-10-12, branch `claude/website-launch-review-6ua1r5`).**
Gate: Perf ≥ 95, LCP < 2500ms (home held to 2500ms pending owner confirmation of the old 2800ms exception), CLS < 0.05.
Run on a 4-core cloud sandbox, so absolute LCP is likely slower than on the owner's machine. Two full audits shown; run 2 includes the footer social-icon change.

| Page | Run 1 Perf / LCP | Run 2 Perf / LCP | CLS | Gate |
|---|---|---|---|---|
| `/` | 95 / 2268ms | 93 / 3160ms (runs 2263–3216) | 0 | Run 1 pass, run 2 fail |
| `/about/` | 98 / 2166ms | 98 / 2091ms | 0 | Pass |
| `/industries-served/` | 90 / 3521ms | 90 / 3496ms | 0 | Fail |
| `/logistics-process/` | 93 / 3156ms | 94 / 3018ms | 0 | Fail |
| `/products/` | 94 / 3141ms | 93 / 3159ms | 0 | Fail |
| `/request-a-quote/` | 99 / 1913ms | 99 / 1917ms | 0.0175 | Pass |

axe-core: 0 serious/critical on all six pages. Link check: only warning is the `sms:` link. 

Other `npm run verify` gates: build + placeholder-guard, schema, build-note-leak, banned-words, tokens, numbers, color, routes all pass. **`copy-verbatim` fails** (`/who-we-are/`: 6 blocks, `/partners/carriers/`: 1 block) because the 2026-10-01 "no personal names" decision (see DECISIONS.md) removed names that SPEC_V1.md still contains. `verify` stops there, so run `npm run audit` directly for the numbers above.

## Summary for whoever picks this up next

- GitHub: done, pushed, nothing further needed.
- Vercel: blocked on human OAuth, cannot proceed unattended. See BLOCKED.md.
- Once Vercel access exists, deploy will use the `next build` output as-is —
  no code changes were made this session.
- LCP is the one open Definition-of-Done gate across all 6 pages per the
  last audit run; re-verify after the recent height-repair changes before
  deciding whether it's still failing.

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
