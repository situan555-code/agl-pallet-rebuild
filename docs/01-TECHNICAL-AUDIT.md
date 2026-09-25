# AGL Pallet Rebuild — Technical Audit (Redesign Baseline)

Reviewed: `main` @ `290eeb0` ("Home hero: local Limeplay video"), 45 commits, 2026-09-25.
Purpose: establish where the codebase stands before the visual redesign ("the facelift").

---

## 1. Summary

The site is **technically strong and visually dated**. The engineering underneath (routing,
content model, SEO, schema, performance discipline) is good and should be preserved. The
visual layer is where the work is, and a handful of project rules written for the original
"faithful WordPress port" now actively block the new direction and must be retired or
rewritten before building.

| Area | State | Verdict |
|---|---|---|
| Routing / redirects / trailing slash | Clean, middleware-owned, noindex on `*.vercel.app` | Keep as-is |
| Content model (`content/*.json`) | All copy separated from components | Major asset — redesign is mostly a component job |
| SEO / JSON-LD | 51 sitemap URLs, 0 schema errors, full TechArticle/FAQ/Dataset coverage | Keep, protect |
| Resource library | 11 pillars, glossary, 13 Q&A pages, 4 calculators, 2 PDF downloads, PPI CSV | Keep content, restyle |
| Stack versions | Next 14 / React 18 / Tailwind 3.4 | Behind — upgrade before adding new registries |
| Design system | Radius 0.25rem, 14px body, global uppercase headings | Root cause of the "blocky" feel |
| Hero video | Shaka + two full player systems for a 2.5 MB muted loop | Over-engineered, replace |
| Forms | Quote works (FormSubmit); supplier/carrier don't send | Needs owner decisions |
| Repo hygiene | Dead components, duplicate assets, WP captures, 300 KB of logs | Clean up in Phase 0 |
| Verify harness | Gates built to match the old WordPress site | Rework gates for a redesign |

---

## 2. Stack

From `package.json`:

- **next** `^14.2`, **react** `^18.3`, **tailwindcss** `^3.4`, TypeScript 5.5
- **shadcn** CLI `^4.21`, `components.json` style `radix-nova`, registries: `@shadcnblocks`, `@limeplay`
- UI primitives: `radix-ui`, `@base-ui/react` (both installed), `embla-carousel-react`
- Forms: `react-hook-form`, `zod`, `@hookform/resolvers`
- Icons: `lucide-react`, `@phosphor-icons/react`, `react-icons` (three libraries)
- Video: `shaka-player`, `zustand`, `immer`, `lodash`, `lodash.clamp`
- Marquee: `react-fast-marquee` **and** `components/kibo-ui/marquee`
- Class merging: `cn` npm package + a custom wrapper in `lib/utils.ts`
- Tooling: Playwright, Lighthouse, axe-core, pixelmatch, sharp

### Finding 2.1 — Version gap blocks the planned component stack (HIGH)
The redesign stack (Magic UI, ReUI, Aceternity, current shadcn blocks) is authored primarily for
**React 19 + Tailwind v4** (CSS-first `@theme`, `oklch` tokens, `data-slot` attributes). The
`radix-nova` style in `components.json` is itself a Tailwind-v4-era shadcn style. On Tailwind 3
every install needs hand-translation, which is slow and error-prone for a cheap model.

**Action:** Phase 0 upgrade on a branch: Next (current stable) + React 19 + Tailwind v4, using
the official codemods/upgrade tool. Tokens in `globals.css` convert from RGB channels to
`@theme` variables. Do this *before* installing any new registry component.

### Finding 2.2 — Class-merge utility is split and fragile (MEDIUM)
Components import `cn` from two places: the raw `cn` package (`ui/button`, `ui/carousel`,
`ui/dropdown-menu`, `hero7`, `service2`) and `@/lib/utils` (`ui/accordion`, `ui/toggle`,
`ui/textarea`, `ui/breadcrumb`, `faq3`). `lib/utils.ts` contains a hand-rolled workaround
because the `cn` package drops custom font-size tokens (`text-body`, `text-eyebrow`, etc.).

**Action:** replace with the standard shadcn `cn` (`clsx` + `tailwind-merge`) and register
custom font sizes via `extendTailwindMerge`. Every file imports from `@/lib/utils` only.
Remove the `cn` package.

### Finding 2.3 — Video player is heavier than the job (MEDIUM, easy win)
The home hero is a muted background loop (`public/assets/agl_home_video.mp4`, 2.5 MB, poster
exists). It is rendered through `HeroVideo` → `components/video-player` (Shaka-based) and a
second full player system in `components/limeplay` + `hooks/limeplay`. That's ~45 files,
plus `shaka-player`, `zustand`, `immer`, `lodash`, `@phosphor-icons/react`, and `react-icons`
— all of which are only used by the players.

The blank beige frame visible in the current hero screenshot is consistent with the poster
being deferred (`DeferredFillImage`) and the player mounting late.

**Action:** replace both players with a native `<video autoPlay muted loop playsInline
poster preload="metadata">` inside the new scroll-expand hero. Poster renders immediately via
`next/image` with `priority`. Delete `components/video-player`, `components/limeplay`,
`hooks/limeplay`, and the dependencies above. Remove the mute button (no audio needed).
Strip the audio track from the MP4 and add a WebM.

### Finding 2.4 — Dead code shipped in the tree (LOW)
- 8 components excluded in `tsconfig.json` (`navbar1`, `navbar5`, `banner2`, `gallery6`,
  `hero7`, `service2`, `team2`, `timeline3`).
- `tailwind.config.ts` negates ~30 component paths from content scanning because they're
  installed but unused (legacy AGL sections, demo shadcnblocks, unused `ui/*`).
- Two marquee implementations, three icon libraries.

**Action:** delete unused files rather than excluding them. Standardize on `lucide-react`.

---

## 3. Design system (the "blocky" root causes)

All in `app/globals.css` and `tailwind.config.ts`:

| Setting | Current | Effect |
|---|---|---|
| `--radius` | `0.25rem`; `borderRadius.input: 4px` | Everything reads as a hard rectangle |
| `h1–h6` base style | `@apply font-display uppercase` | Every heading, card title, FAQ question is all-caps Anton |
| `fontSize.body` | `14px / 23.8px` | Small body text; reads as dense and dated |
| Palette | Palette 03: `#1F2A1F` green, `#F2EBDD` parchment, `#C4CCC0` fog, `#B9A78F` clay, `#3B342E` cocoa | Coherent but no accent; nothing pops |
| Sections | Full-bleed green bands for hero/CTA/footer on most pages | Stacked slabs, repetitive openers |

### Finding 3.1 — Rules files are stale and contradict the tokens
`.cursorrules` says "one green only: `#162619`" and "paper `#F7F6F2`", but the live tokens
are Palette 03 (`#1F2A1F`, `#F2EBDD`). Agents following the rules file will fight the code.

### Finding 3.2 — Project design rules conflict with the redesign
`.cursorrules` / `PROJECT.md` / `BRIEF.md` include:
- "Bordered/rounded cards are ONLY for discrete clickable choices."
- "Three grounds only … mint never a section background."
- "Do not alternate section backgrounds."

These encoded the old site's look. The redesign needs rounded inset sections, feature
cards, and bento layouts. **These rules must be rewritten** (see `03-cursorrules`), otherwise
every Cursor/Claude Code session will refuse or undo the redesign.

---

## 4. Verification harness

`npm run verify` chains: build → schema → copy-verbatim → build-note-leak → banned-words →
tokens → numbers → color → routes → height → audit (Lighthouse + axe).

| Gate | Keep for redesign? | Notes |
|---|---|---|
| build, schema, routes, build-note-leak | Keep | Protects SEO and deploy safety |
| banned-words, numbers | Keep | Compliance (brokerage language, no invented numbers). Fix known false positive: `!` regex matching `<!DOCTYPE>` |
| copy-verbatim | Keep for body copy; decide on headings | See decision D2 |
| tokens | Update | Must accept the new token set |
| color | Update | New palette + accent; delete legacy SVGs with off-brand greens |
| audit (LCP < 2.5s, CLS < 0.05, mobile Perf ≥ 95, zero serious/critical axe) | Keep | Motion and video must fit inside these |
| height (±15% vs WordPress captures) | **Retire** | Already failing on 4 of 6 pages after the shadcnblocks pass; a redesign will never match old page heights |
| pixel diff vs WordPress (`npm run diff`) | **Retire** | Same reason |

The mobile Perf ≥ 95 gate is strict. Motion libraries, the video hero, and Animated Beam all
need to be client-only, lazy, and reduced-motion aware to stay under it. Budget this into
every task.

---

## 5. Forms

- **Quote form** — posts to FormSubmit at a configured address. Works.
- **Supplier + carrier forms** — built, validated, but destination tokens
  (`TBD-EMAIL-SUPPLIER`, `TBD-EMAIL-CARRIER`) are unresolved, so they show "not sending yet."
- **Carrier COI upload** — field exists but has no `name`; FormSubmit's setup here can't
  carry attachments.
- `BRIEF.md §H3` forbids switching form services without owner sign-off, and an earlier
  `RESEND_API_KEY` attempt was blocked.

These are owner decisions, not engineering problems (see D4).

---

## 6. Content and SEO (protect)

- Copy lives in `content/pages/*.json` and `content/resources/**`. Components never hardcode
  copy. **The redesign should only touch components and tokens, not JSON**, unless decision
  D2 changes that.
- 51 sitemap URLs, 0 schema errors (`STATUS.md`). Canonicals point at `aglpallet.com`.
- Calculators are server-rendered GET forms (work without JS). Keep that as the fallback and
  layer live client calculation on top (progressive enhancement).
- Open placeholders: `{{TBD-ADDRESS}}` (blocks LocalBusiness JSON-LD), `{{TBD-SOCIAL-URLS}}`.

---

## 7. Repo hygiene

| Item | Size / count | Action |
|---|---|---|
| `assets/` (root) | 22 MB, 42 files, duplicates `public/assets` | Delete or move out of repo |
| `capture/` | WordPress HTML/CSS captures | Archive branch or delete once height/diff gates retire |
| `DECISIONS.md`, `PROGRESS.md` | ~150 KB each | Freeze as `archive/`, start fresh logs for the redesign |
| `SPEC.md`, `SPEC_V1.md`, `BRIEF.md` | Spec authority | Keep; add a redesign addendum instead of editing |
| Root shell scripts (`run.sh`, `fix-home-height.sh`, `restart-home.sh`, `scaffold-gates.sh`) | Harness for the unattended loop | Move to `scripts/harness/` |
| `delegation-system/`, `reference/`, `raw-tokens.json` | Process artifacts | Archive |

Large logs also cost AI credits: agents that read `PROGRESS.md`/`DECISIONS.md` for context
pull 300 KB into every session. Archiving them is a direct Cursor saving.

---

## 8. Owner decisions (APPROVED 2026-09-25)

All six recommendations were approved by the owner. Agents: treat these as settled.

| # | Decision | Status |
|---|---|---|
| D1 | Upgrade to React 19 + Tailwind v4 + current stable Next before the redesign | Approved. Phase 0, task R0.5, on a branch |
| D2 | Copy stays verbatim from SPEC_V1; heading case may change (uppercase → sentence case); heading words may not | Approved |
| D3 | Retire the `height` and pixel-diff gates; keep every other gate | Approved. Task R0.7 |
| D4 | Move all three forms to Resend via a Next route handler, including carrier COI upload. This supersedes the "do not substitute a different service" rule in BRIEF.md §H3 | Approved. Task R7.3. Owner still supplies: supplier inbox, carrier inbox, and `RESEND_API_KEY` in Vercel env. Until then, keep the visible "not sending yet" state and the working FormSubmit quote form |
| D5 | Color scheme: **Palette 05 "Premium Dark"** replaces Palette 03. No orange or other accent hue; Ice and Soft Gray carry emphasis. See `02-IMPLEMENTATION-PLAN.md` → Palette 05 | Approved (revised 2026-09-25) |
| D6 | Replace the old design rules in `.cursorrules`, `CLAUDE.md`, `PROJECT.md` | Approved. Task R0.2 |

---

## 9. Model policy

Default model for all work: **Grok 4.6 High Fast**. Upgrade only when a task fails
(Grok 4.7 High next, then Claude Opus 5.5 Medium), per the policy at the top of
`02-IMPLEMENTATION-PLAN.md`. The archived process logs and the one-task-per-chat structure
exist partly to keep context small enough for the fast model to succeed.
