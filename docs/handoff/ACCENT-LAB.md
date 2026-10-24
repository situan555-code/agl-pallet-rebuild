# BR1 — Internal Accent Lab (/accent-lab/)

Task for Claude Code. One task ID, one driver. Stay inside the files listed here.

## Why

The owner is choosing an accent color and lighter shades of the core green.
The Accent Lab lets people test candidates on the real AGL hero before anything
changes in the production palette. It is a testing tool, not a marketing page.

A standalone version of the same tool is in
`docs/handoff/reference/accent-lab.html` (open it in a browser). Match its
behavior; the React version below already does.

## Owner decisions this task reflects (2026-10-19)

- Display type: Exo 2 Black Italic. Body: Inter. (Already live.)
- The 10° slant concept from the brand exploration is dropped. No slanted
  shapes, cuts, or buttons anywhere.
- Green: one tone in eleven shades (same OKLCH hue 144.8° and chroma 0.025 as
  #1F2A1F, lightness only). Core #1F2A1F is step 900.
- The nav bar and logo always sit on #1F2A1F, the source-of-truth green.
- Accent: not chosen yet. That is what the lab is for.

## Files (already written, typecheck and lint clean against this repo)

| Path | What it is |
|---|---|
| `content/brand/accent-lab.json` | All lab copy, the green scale, the five ground steps, and 88 accents in 11 families. Copy lives here per the content rule. |
| `lib/color-science.ts` | WCAG contrast ratio, best-ink pick, OKLCH readout. No dependencies. |
| `components/accent-lab/AccentLab.tsx` | The tool (client component). Preview copy comes from `content/pages/home.json`, not hardcoded. |
| `components/accent-lab/AccentLabLoader.tsx` | Client-only wrapper (`ssr: false`), because saved picks come from localStorage. |
| `app/accent-lab/page.tsx` | Route with `robots: noindex, nofollow` on every host. |

## Steps

1. Confirm the five files above are in place at those paths. Do not edit
   `content/pages/home.json`.
2. `npm run build`. Fix only errors in the files above.
3. Run the site and open `/accent-lab/`. Check:
   - Clicking a swatch recolors the preview's primary button, card dots, card
     links, and the label slash.
   - The five ground buttons change the preview background; cards sit one
     shade lighter.
   - The nav strip in the preview stays #1F2A1F on every ground.
   - Reload keeps the last picks (localStorage key `agl-accent-lab-v1`).
   - Keyboard: every swatch, ground button and control is reachable with Tab
     and shows a focus ring.
   - No horizontal scroll at 375px.
4. View source on `/accent-lab/`: the robots meta is `noindex, nofollow`.
5. `npm run color` still passes (see the guardrail below).
6. Append the DECISIONS.md entry and the PROGRESS.md line below. Commit with
   message `BR1 Add internal Accent Lab`.

## Guardrails

- **Color gate.** `scripts/color.js` fails on any green other than #131913 and
  #1F2A1F in built CSS, `app/globals.css`, `public/*.svg`, or the rendered HTML
  of the routes in `scripts/lib/spec-manifest.js`. The lab passes because every
  exploratory color is an inline `style` value read from JSON. **Never** turn
  those into Tailwind arbitrary classes (`bg-[#...]`) or CSS, and never add the
  scale to `globals.css` in this task. Do not edit `scripts/color.js`.
- **Keep the route unlisted.** Do not add `/accent-lab/` to the nav,
  `app/sitemap.ts`, `lib/search-index.ts`, or `scripts/lib/spec-manifest.js`.
  Adding it to the manifest would put 88 non-palette colors in front of the
  color, numbers and banned-words gates, which is the wrong test for a lab.
- **Pre-existing red gates.** Per DECISIONS.md (2026-10-19), `npm run verify`
  was already red on `copy-verbatim` and audit LCP before this task. Report
  whether those are unchanged; do not try to fix them here.
- Stop after two failed build-fix attempts and report, per `.cursorrules`.

## DECISIONS.md entry to append

```
## BR1 Accent Lab (2026-10-19)

Added internal /accent-lab/ to test accent candidates and shades of #1F2A1F on
the home hero. Owner decisions: Exo 2 + Inter stay; the 10° slant concept is
dropped; green becomes one tone in eleven OKLCH shades (Core = 900); nav and
logo stay on #1F2A1F. The lab is noindex on every host and is not in the nav,
sitemap, search index or spec manifest. Its colors are inline styles from
content/brand/accent-lab.json, so the Palette 05 color gate is untouched and
was not changed. Production palette is unchanged until the owner picks; see
docs/handoff/PALETTE-PROPOSAL.md.
```

## PROGRESS.md line

`BR1 done: /accent-lab/ live (internal, noindex). Palette change pending owner pick.`

## Flag, do not fix in this task

`CLAUDE.md` still says "Next.js 14 + Tailwind 3.4"; `package.json` is Next 16.3.6
and Tailwind 4.3. `.cursorrules` still names Anton as the display face; the site
uses Exo 2. Mention both in your report so the owner can approve doc updates.
