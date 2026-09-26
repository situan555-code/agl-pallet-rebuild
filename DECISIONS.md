# DECISIONS (redesign)

## UI audit task 12 (2026-09-26)

The network diagram labels stay the short lines already passed into `NetworkBeam` from `app/page.tsx` ("Family-run mills", "Qualified shops", "More than one source", "AGL Pallet", "Your line"). They are not separate fields in `content/pages/home.json`, so they were not copied into content JSON and no new eyebrow was added.

## UI audit task 8 (2026-09-26)

Leading em dashes are not shown. A screen-reader-only " — " still joins each title to its body so the spec sentence stays intact for the copy gate. These remain in content JSON and were left for the owner:

- `content/pages/how-we-work.json` timeline bodies all start with "— ".
- `content/pages/contact.json` route bodies all start with "— ".

Owner decisions D1–D6 in docs/01-TECHNICAL-AUDIT.md §8 are approved (2026-09-25) and override older BRIEF.md / PROJECT.md design and form-service rules where they conflict.

## R0.1 / R0.2 (2026-09-25)

- Replaced root `.cursorrules` with the redesign rules (Palette 05, D1–D6).
- Archived pre-redesign process logs and artifacts to `archive/` (see that folder; do not read unless asked).
- Deleted root `assets/` after confirming every file also exists in `public/assets/`.
- Moved `run.sh`, `fix-home-height.sh`, `restart-home.sh`, `scaffold-gates.sh` to `scripts/harness/`. No `package.json` or `scripts/` path references needed updating.
- Copied `docs/01-TECHNICAL-AUDIT.md` and `docs/02-IMPLEMENTATION-PLAN.md` into the repo so rules files can reference them in-tree.

## R0.5 (2026-09-25)

- Upgraded to Next 16.3.6 (security patch), React 19.3, Tailwind CSS 4.3 via official codemods/`@tailwindcss/upgrade`.
- Next 16 renamed `middleware.ts` → `proxy.ts` (`export function proxy`). Redirect map and host noindex are unchanged.
- Removed the upgrade-inserted `export const instant = false` on every route (requires `cacheComponents`, which we did not enable).
- Restored `next/image` `placeholder="blur"` after the Tailwind tool rewrote those to `blur-sm`.

## R0.7 (2026-09-25)

- Removed `height` (and the unused `diff` script is no longer in `verify`) per D3.
- Color gate allowlist is Palette 05 moss `#131913` and green `#1F2A1F`.
- Recolored live `public/assets/*.svg` fills from retired `#162619` to `#1F2A1F` instead of deleting icons the site still serves.
- Deleted unused WordPress leftover `public/assets/mejs-controls.svg`.
- Banned-words: also strip `!` inside HTML tags so Tailwind important / markup cannot trip the exclamation rule.
