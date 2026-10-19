# Palette proposal (Phase 2, needs owner sign-off)

Not part of BR1. Use this once the owner has picked from the Accent Lab.

## 1. Green: one tone, eleven shades

Generated in OKLCH at Core's hue (144.8°) and chroma (0.025), lightness only.
Step 900 is exactly #1F2A1F.

| Step | Hex | Contrast with white | Contrast with Core |
|---|---|---|---|
| 50 | `#EAF8E9` | 1.1 | 13.6 |
| 100 | `#D9E8D9` | 1.3 | 11.7 |
| 200 | `#BFCEBF` | 1.6 | 9.1 |
| 300 | `#A3B1A3` | 2.2 | 6.7 |
| 400 | `#889587` | 3.1 | 4.8 |
| 500 | `#6D7A6D` | 4.5 | 3.3 |
| 600 | `#556255` | 6.4 | 2.3 |
| 700 | `#424E42` | 8.7 | 1.7 |
| 800 | `#303C30` | 11.6 | 1.3 |
| 900 | `#1F2A1F` | 14.9 | 1.0 | Core, source of truth
| 950 | `#0F190F` | 18.0 | 1.2 |

White text is safe (4.5:1 or more) on steps 500 to 950. Core text is safe on
steps 50 to 400.

Proposed `@theme` addition in `app/globals.css` (keeps every existing Palette 05
token; `--color-green` and `--color-brand-green` stay #1f2a1f):

```css
  --color-agl-50: #eaf8e9;
  --color-agl-100: #d9e8d9;
  --color-agl-200: #bfcebf;
  --color-agl-300: #a3b1a3;
  --color-agl-400: #889587;
  --color-agl-500: #6d7a6d;
  --color-agl-600: #556255;
  --color-agl-700: #424e42;
  --color-agl-800: #303c30;
  --color-agl-900: #1f2a1f;
  --color-agl-950: #0f190f;
```

## 2. Accent

One hex, chosen in the lab, added as `--color-agl-accent` plus a matching
`--color-agl-accent-ink` (whichever of #1F2A1F or white the lab shows as
readable on it). Use it for: primary CTA fill, link and label emphasis, small
markers. Never as a page or section ground.

## 3. What has to change, and who approves it

These are rule and gate changes. The repo forbids making them without written
owner approval, so each needs an explicit owner "approved" in DECISIONS.md first.

1. `.cursorrules` Design rules: replace "Palette 05 ... No other colors, no hue
   accent" with the approved scale and accent. (Also update Anton to Exo 2.)
2. `scripts/color.js`: widen `ALLOWED_GREENS` to the approved steps only, for
   example:

   ```js
   const ALLOWED_GREENS = new Set([PALETTE_05.moss, PALETTE_05.green, '#eaf8e9', '#d9e8d9', '#bfcebf', '#a3b1a3', '#889587', '#6d7a6d', '#556255', '#424e42', '#303c30', '#1f2a1f', '#0f190f']);
   ```

   If the chosen accent is itself a green by the gate's channel heuristic, add
   that one hex too. This is a scope change to a gate, so log it as owner-approved.
3. `CLAUDE.md` stack line: Next 16 / Tailwind 4.

## 4. Suggested owner prompt to Claude Code (after picking)

"Task BR2: apply the approved palette from docs/handoff/PALETTE-PROPOSAL.md.
Owner approval: [name], [date], steps [list] and accent [hex]. Update
.cursorrules, globals.css @theme and scripts/color.js allowlist as written
there, log it in DECISIONS.md, and keep npm run color green."
