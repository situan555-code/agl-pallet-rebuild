# DECISIONS (redesign)

## No personal names on public pages (2026-10-01)

Owner: remove every AGL person's first and last name from customer-facing pages. Team cards on `/who-we-are/` are roles only (Owner, Logistics, Supplier Relations, Operations, IT). Founder story stays first person; the eyebrow is "From the owner". Carrier offer and form success lines no longer name a dispatcher or supplier-relations contact. The dispatcher portrait is removed; that offer card uses the same empty Photo placeholder as the other freight cards. `{{TBD-PHOTO-BROCK}}` stays an unresolved token and is not rendered. SPEC_V1.md still has the named draft; this page copy is the approved public version.

## Pharmaceuticals and PDS methodology (2026-10-01)

Live `/industries-served/` includes Pharmaceuticals. It is item 8 on `/industries`, after plastics and before food and beverage. The other verticals stay. Copy is brokerage voice: regulated environments, pallet integrity, cleanliness, consistency, and traceability.

Live engineered-pallet copy names Pallet Design System (PDS) methodology. That name is now on `/products/` (custom and engineered) and `/custom-engineered/`, and on the home product strip because it reuses the product line. Scope stays what the live page states: load requirements, weight capacities, operational conditions, and an analysis of product weight, stacking, handling, and environment, for strength without overbuilding. No PDS certification claim. The banned-words scan now flags certification framing only.

## Card numerals (2026-09-29)

Capability cards and Feature3 numbered cards no longer stamp moss numerals on the photo. Differentiator and service eyebrows stay in the card body. Process step numbers on other pages are unchanged.

## Mill demo stills (2026-09-29)

Product cards for stock, custom, and dunnage, plus all eight home cream Photo cards, now use mill catalog stills. Paths live in `lib/demo-product-photos.ts` and `lib/demo-home-photos.ts`. Crates, shipping blocks, and stakes stay on the warm-wood demos. Who We Are, the stamp decoder, founder TBD, the hero video, and marketing copy are unchanged. DEMO-ONLY. Replace before go-live.

## Demo home Photo cards (2026-09-29)

Eight cream Photo cards on the home page use DEMO-ONLY industry photos: capability ×3, differentiators ×3, partner split ×2. Paths live in `lib/demo-home-photos.ts`. Replace before go-live. Who We Are, founder portraits, and the Feature1 side images stay as they were.

## Centered video hero (2026-09-29)

Owner rejected the sticky-story opener (text stack, then video pinned beside scrolling beats). Home opens on a centered 16:9 video again: headline and the three CTAs share one viewport with the frame; the spec lede sits under that stage. Desktop scroll scales the frame from `--hero-start: 0.8` to 1 across `48svh`, matching the spacer so the stage releases when the grow finishes. The start value stays a unitless number (length/length calc is invalid in `scale()`). Mobile stays a static in-flow 16:9 card. The hero inherits the active field (no locked moss slab).

Owner removed the home eyebrow "Pallets move the world. We move pallets." and the public roster entries for Nautis (Marketing) and Colton (Finance). No replacements. The who-we-are H2 is "Five people, and you'll know which one is yours." Roster: Brock, Brandon, Larry, Beau, Jeff.

## Demo product photos, Batch B (2026-09-29)

Crates, dunnage, and shipping blocks now use the same demo map as Batch A. All six product-line cards on `/products/` and the home strip have warm natural-wood JPGs. Paths stay in `lib/demo-product-photos.ts`.

## Demo product photos, Batch A (2026-09-29)

Three warm natural-wood JPGs are demo stand-ins only, on the stock pallets, custom & engineered, and stakes cards (`/products/` and the home product-lines strip). Paths live in `lib/demo-product-photos.ts`. Crates, dunnage, and shipping blocks were Photo placeholders until Batch B.

## Sticky story (2026-09-29)

Replaced the scroll-grow hero video with a two-column sticky story. Hero copy stays above it. Beats reuse existing home.json lines (differentiators plus the same-day quote card). Media sticks at `top-24` from the `nav` breakpoint (980px). Each beat is `65vh`. Mobile stacks the video once, then the beats.

## Homepage light field (2026-09-29)

Home hero had `bg-moss` / `text-bone` locked on the track, so light mode left a moss slab: moss-on-moss primary CTA, moss eyebrow, bone H1. The hero now inherits the active field. Ghost toggle uses a current-color hairline so it reads on bone and moss.

## Hero video scroll runway (2026-09-28)

Grow finishes at 70% of a 52svh range (was linear 0–70svh). Spacer 12svh (was 16svh). Cards sit ~60px under the frame (`md:pb-12` + 12px). Start/end scale unchanged (0.55 → 1).

## Theme toggle (2026-09-28)

Owner replaced the sell-dark / read-light split. One user-controlled theme for every route. Default is dark (moss field). Light is one bone field. Choice persists in `localStorage` key `agl-theme` and `html` `data-field` plus `dark`/`light` class. Blocking boot script prevents a flash. Ghost sun/moon control in the header (shadcnblocks icon toggle 8, adapted). Ghost is for this control only; page CTAs stay primary/secondary.

## One field (2026-09-27)

Sell pages are one moss field. Reading pages (resources, FAQ, forms, pledge, contact) are one bone field. Header and footer follow the page. Green `#1F2A1F` is no longer a section fill. Cards match the field (hairline, not a second slab). Accents flip: ice on moss, green/moss on bone. Primary button is bone-on-moss and moss-on-bone. `--card` token is moss, not smoke. Home video stays full-bleed. Superseded for routing by Theme toggle (2026-09-28): pages no longer hard-code a field.

## LCP headroom / static HTML (2026-09-26)

Tried dropping `headers()` from root `generateMetadata` so routes could prerender. The schema gate requires a `robots` meta noindex on `*.vercel.app` and forbids it on aglpallet.com, so the host read stayed. `proxy.ts` still sets `X-Robots-Tag`. `/request-a-quote/` no longer uses `force-dynamic`; `CONTACT_TO_EMAIL` is read at build time with the same content/sales fallbacks.

Anton is `preload: false` because home LCP is the poster image and about/quote LCP is Inter text. The header logo is not `priority` so the home poster is the only `fetchpriority="high"` image.

## Lighthouse median (2026-09-26)

Owner-approved, 2026-09-26: Lighthouse gate uses the median of 5 sequential runs per page, per Lighthouse CI guidance. Thresholds unchanged.

## Home lab LCP (2026-09-26)

Owner-approved exception, 2026-09-26: home lab LCP gate 2800ms, pending real-user data.

The home page lab gate is LCP < 2800ms, Perf ≥ 95, and CLS < 0.05. Every other page stays at LCP < 2500ms. `@vercel/speed-insights` is on the root layout so real-visitor LCP is measured after launch. The target for real visitors is p75 LCP < 2500ms.

## UI audit task 13 (2026-09-26)

Owner-approved rewrite in `content/pages/faq.json`: "Two-way vs four-way pallets" is now "Do I need a two-way or four-way pallet?" The answer is unchanged. FAQPage JSON-LD uses the same lead and body.

These other FAQ leads are still topics, not buyer questions. Left for the owner:

- Lead times
- Minimums
- Second-source availability

The FAQ meta description still lists "Two-way vs four-way pallets" as a topic. That sentence was not the question, so it was left as written.

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
