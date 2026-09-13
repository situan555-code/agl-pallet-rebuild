# Fonts

Captured by inspecting `getComputedStyle().fontFamily` on every rendered
text-bearing element across all 6 pages (`scripts/05-capture-fonts.js`,
raw output in `capture/fonts-raw.json`), cross-referenced with the actual
font file network requests each page made.

## 1. Body copy, links, buttons, nav, form fields — Inter

- **Declared stack:** `Inter, Helvetica, Arial, Lucida, sans-serif`
- **Source:** Google Fonts (`fonts.gstatic.com/s/inter/...woff2`) — already
  a Google Font, no substitution needed.
- **Weights observed in use:** 400, 500, 600, 700 (regular, medium,
  semibold, bold). No italic observed anywhere.
- **Where:** `body`, `p`, `a`, `nav a`, `button`, `input`, `textarea`,
  `label`.
- **Action:** use `next/font/google` with `Inter`, weights `[400, 500, 600, 700]`.
  No metric delta — it's the same font, self-hosted by us instead of
  Google's CDN, which is a straight win for LCP/CLS.

## 2. Headings (h1–h5) — "CoFo Peshka" (non-transferable, substitution required)

- **Declared family:** `cofopeshka550` (h1/h2/h3/h4/h5; h6 not observed
  in use on any captured page).
- **Source:** self-hosted via the WordPress "Use Any Font" plugin at
  `/wp-content/uploads/useanyfont/1865CoFoPeshka550.woff2` — not Typekit,
  but this is a single-weight instance of **CoFo Peshka**, a commercial
  display face from Contrast Foundry. There is no license documentation in
  this repo confirming redistribution rights for the raw font file beyond
  the agency's original Squarespace/WordPress purchase, so per BRIEF.md
  Section C ("Typekit or otherwise non-transferable") this is treated as
  non-transferable. **The .woff2 file was not copied into the rebuild.**
  (It was fetched once to a scratch temp path for pixel measurement only,
  then left out of `/assets` — see decision log.)
- **Rendered characteristics:** bold, condensed, geometric display face,
  uppercase-only glyph set (renders caps regardless of source case —
  `text-transform: none` in CSS, the font file itself has no lowercase),
  with visibly rounded corners on strokes and counters (see
  `capture/heading-sample.png` — screenshot of the live h1). Used at
  `font-weight: 400` in the stylesheet (the file only exposes one weight
  instance, "550", roughly a semibold).
- **Measured comparison** (`capture/font-metric-comparison.json` —
  canvas `measureText` on the string `"FOR MANUFACTURERS"` at 48px,
  original file vs. Google Fonts candidates loaded via `document.fonts.load`):

  | Candidate | Width Δ | Cap-height Δ | Visual notes |
  |---|---|---|---|
  | **Bungee** (700/900 — single real weight) | **-2.1%** | **-3.0%** | Closest metric match *and* closest visual match: rounded rectangular terminals, bold signage/poster character, matches the screenshot well. **Recommended.** |
  | Anton (700/900) | -2.1% | -3.0% | Metrically identical to Bungee for this sample, but visually sharp-cornered/no rounding — doesn't match the original's rounded terminals. Second choice if Bungee's weight reads too heavy in context. |
  | Fredoka (700/900) | -10.5% | +3.0% | Rounder, friendlier, wider letterforms — noticeably wider-set than the original. Third choice. |
  | Big Shoulders (700/900) | -27.7% to -31.6% | +18.2% | Too condensed/tall relative to the original; rejected. |

- **Decision:** substitute **Bungee** (Google Fonts) for all heading
  levels, weight 700. Logged in DECISIONS.md.

## 3. Icon fonts (not body copy, informational)

- **Font Awesome** (`use.fontawesome.com/releases/v7.2.0/webfonts/fa-*.woff2`)
  — third-party icon font kit, loaded via a Fontawesome "kit" script tag.
  Only used for iconography, not text. The rebuild does not need to carry
  this over as a webfont at all — behavior.md documents which icons appear
  and they should be rebuilt as inline SVG, not an icon font (avoids an
  extra dependency and matches BRIEF.md's "no UI kits" rule).
- **Divi theme module font** (`/wp-content/themes/Divi/core/admin/fonts/modules/all/modules.woff`)
  — the Divi page-builder's own internal icon glyphs (arrows, toggles,
  etc. used by its modules). Not applicable to the rebuild at all; we are
  not using Divi. Noted only so nobody mistakes it for site content later.

## Summary for SPEC / Tailwind config

- `font-sans` → Inter (Google, self-hosted via next/font)
- `font-display` (headings) → Bungee (Google, substitution for CoFo Peshka,
  logged above and in DECISIONS.md)
