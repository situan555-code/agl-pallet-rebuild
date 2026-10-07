# design-sync notes — AGL Pallet

## How this repo syncs
- The repo is a Next.js app (`nx7k-lab-m4`), not a published library. `.design-sync/pkg/` is a
  sync-only wrapper package (`agl-pallet`): `index.ts` re-exports the real components from
  `components/`; `tsconfig.json` maps `@/*` to the repo root and `next/link|image|navigation|dynamic`
  to `pkg/shims/`. Nothing is reimplemented.
- `cfg.buildCmd` = `node .design-sync/pkg/build.mjs` (run from repo root) MUST run before
  `package-build.mjs`: it regenerates `pkg/types/` (tsc d.ts, flattened, `@/` rewritten) and
  `pkg/agl.css` (app/globals.css compiled by @tailwindcss/postcss). Both are gitignored.
- Tailwind v4 only emits classes it finds in source. `pkg/tailwind.css` scans components/, app/,
  .design-sync/previews/ and a safelist (`@source inline`). A class used only in a preview needs a
  buildCmd rerun to exist. Prefer classes already in `ds-bundle/_ds_bundle.css`.
- Fonts: Inter (variable 400–700) + Anton 400, latin subset, Google Fonts (OFL), committed in
  `pkg/fonts/`, wired via `cfg.extraFonts`. `--font-inter/--font-anton` defined in tailwind.css.
- Images: next/image shim prefixes root-relative `/assets/...` with https://nx7k-lab-m4.vercel.app.
- Groups come from frontmatter-only stubs in `.design-sync/groups/*.md` via `cfg.docsMap`
  (empty body => the converter still synthesizes the .prompt.md).
- shadcn sub-parts (DropdownMenuItem, SheetContent, ...) and the 29 re-exported Lucide icons are
  in the bundle but excluded from cards via `componentSrcMap: null`.
- playwright 1.63.0 (repo pin) matches cached chromium-1243; installed into `.ds-sync/`.

## Preview authoring
- Card harness body is white; the site's ground is moss. Wrap every story in a surface:
  dark `<div className="bg-moss text-bone p-8">`, light `<div className="surface-light bg-bone text-moss p-8">`.
  `.surface-light` is what flips Button primary and tokens to the light theme.
- Content: port real copy from `content/pages/*.json` / `content/site.json` and photos from
  `lib/demo-*-photos.ts` (`/assets/stock/*.webp`). AGL is a pallet *broker*, never a manufacturer.
- `Reveal`/`BlurFade(inView)` fade in over ~0.44s; package-capture screenshots before that, so
  Reveal-wrapped headings look missing on review sheets. Verify with
  `node .design-sync/tools/probe-card.mjs ds-bundle "components/<group>/<Name>/<Name>.html?story=<Export>" 2000`
  (prints headings + parent opacity after 2s). It's a capture artifact, not a bug.
- Page sections render at 1280x900 (`cardMode: column`) so lg/nav breakpoints apply.

## Known render warns
- Header/Footer: the site always sets `<html data-field>` and hides the unused logo from it. Sync-side
  fallback rules in `pkg/tailwind.css` (`html:not([data-field]) .logo-on-light {display:none}` + a
  `.surface-light` swap) — outside the site only.
- next/image shim loads eagerly: a lazy `display:none` image (the hidden logo variant) never loads, so
  package-capture's `img.decode()` settle hangs forever (looked like a stuck capture on Footer).
- Plain `<img>`/`<video>` with root-relative paths are NOT rewritten (only next/image is). HeroExpand's
  mp4 404s in cards/designs; the poster still renders. Use absolute https://nx7k-lab-m4.vercel.app URLs.
- Review cells are viewport-only (1280x900): HeroExpand's lede and Hero1's capability cards sit below
  a 100svh stage, so they're off-sheet. Verified full-page with probe-card. A taller viewport doesn't
  help (svh scales with it).
- Fixed-position chrome (Header, NavFrame): wrap stories in `relative min-h-32 transform-gpu`.
- Radix overlays portal to <body> and take :root dark tokens; keep overlay stories on moss.
  Open them with defaultOpen / defaultValue (DropdownMenu also `modal={false}`, Select `position="popper"`).
- `section-y` / `section-rhythm` set padding-bottom 0; add `pb-12` on preview wrappers.
- Media ReactNode props (Hero3 `image`, Feature1 `media`, Gallery4 `visual`): pass
  `<div className="overflow-hidden rounded-card"><CardMedia src="/assets/stock/..." /></div>`.
- Missing utilities (not in compiled CSS): most fixed heights (h-24..h-64), max-w-lg/xs, w-48..56,
  size-6, text-ice/25|30|50. Check `_ds_bundle.css` before using a class; add to the safelist if needed.
- Scratchpad dir is shared between parallel authors — unique script names.

## Component findings (real bugs in the site code — reported to the owner, not patched)
- `.surface-light` doesn't reach `text-foreground`/`bg-background`/`text-muted-foreground`/`text-ice`/
  `text-gray`: app/globals.css declares `--color-foreground: var(--foreground)` etc. in plain `@theme`
  (not `@theme inline`), so they resolve once at :root (dark). Works on the site only because the light
  theme sets vars on <html>. Consequence: Form, Contact2's form, QuoteContacts, ItemDescription are
  dark-surface-only components; their light stories were dropped.
- Separator renders 0x0 by default (`data-horizontal:`/`data-vertical:` variants vs radix's
  `data-orientation`); pass explicit `h-px w-full` / `h-5 w-px`.
- Section `variant` doesn't paint a background (only the DotPattern tint); the wrapper supplies it.
- Toggle `glass` pressed: near-invisible text on bone; poor on moss too.
- DropdownMenuSeparator invisible in dark tokens (`bg-border` == popover).
- ThemeToggle icon keys on `html[data-field=light]`; shows Moon outside the site.

## Known render warns
- Reveal, BlurFade (and Faq3/sections that wrap headings in Reveal): sheets show content missing —
  capture fires before the ~0.44s fade. Verified at 2000ms with `.design-sync/tools/probe-card.mjs`.

## Re-sync risks (what can go stale silently)
- `pkg/index.ts` is a hand-kept export list. New components in `components/` are NOT picked up until
  added there (and grouped via `config.docsMap` + a `groups/*.md` stub). Renamed/removed components
  break the tsc step in build.mjs (loud, good).
- The Lucide re-export list in `pkg/index.ts` mirrors the icons the site imported on 2026-10-06.
- Images resolve against https://nx7k-lab-m4.vercel.app (pkg/shims/asset-origin.ts). When the site
  moves to aglpallet.com, or the lab deployment is removed, every photo/logo in cards and designs
  breaks — update ASSET_ORIGIN and re-sync.
- Previews hard-code `/assets/stock/*.webp` filenames and copy ported from content/*.json; renamed
  photos 404 silently (cards still render, minus the photo).
- Fonts are a committed Google Fonts snapshot (Inter v20, Anton v27), not the next/font build.
- Sync-side CSS in `pkg/tailwind.css` (font vars, logo fallback, safelist) is not the app's CSS; if
  globals.css changes the logo/theming mechanism, revisit it.
- If the owner fixes the `@theme inline` / `.surface-light` bug, the dark-only note in
  conventions.md becomes wrong — re-add light stories for Form/Contact2/QuoteContacts and update it.
- Toolchain: playwright 1.63.0 ↔ chromium-1243 cache; @tailwindcss/postcss from the repo.
