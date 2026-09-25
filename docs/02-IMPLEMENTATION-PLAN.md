# AGL Pallet Redesign — Implementation Plan

Companion to `01-TECHNICAL-AUDIT.md`. Owner decisions D1–D6 are approved (audit §8). Each task is sized for **one Cursor chat** on Grok 4.6 High Fast (see model policy). Work top to
bottom; don't start a phase until the previous one's exit check passes.

**Model policy — default Grok 4.6 High Fast, upgrade only on failure**

Every task starts on **Grok 4.6 High Fast**. Only move up when the task fails, one step at a time:

| Step | Model | When |
|---|---|---|
| 1 (default) | Grok 4.6 High Fast | Every task, first attempt |
| 2 | Grok 4.7 High | Step 1 failed |
| 3 | Claude Opus 5.5 Medium | Step 2 failed, or the task needs multi-file reasoning the Grok runs keep missing |

A task has **failed** when any of these is true:
- `npm run build` still fails after the agent's second fix attempt.
- The result doesn't meet the task's "Done when" column after two rounds of feedback.
- It breaks something outside the task (a route, a gate, another component, content JSON).
- It loops, rewrites large unrelated files, or ignores `.cursorrules`.

When you upgrade: start a **new chat** on the stronger model, paste the task ID, what was tried,
and the error or screenshot. Don't continue the failed thread (it carries wasted context). Drop
back to Grok 4.6 High Fast for the next task. Log every upgrade in `PROGRESS.md` as
`R3.1 — upgraded to Grok 4.7 High: <reason>` so the pattern shows which task types need it.

**Task risk markers** (all still start on Grok 4.6 High Fast):
- 🟢 **Routine** — installs, restyling, layouts from existing JSON. Upgrading should be rare.
- 🔴 **Watch** — custom motion, SVG, state logic, the framework upgrade. Most likely to need
  step 2. Review these PRs more carefully and expect to upgrade.

**Every task follows the same loop:** new chat → @-mention only the listed files → do the task →
`npm run build` → quick visual check → commit with the task ID (`R1.2: floating nav`).

---

## Stack (locked)

| Source | Used for |
|---|---|
| shadcn/ui core | All functional primitives |
| Magic UI | Motion + effects: Animated Beam, Number Ticker, Blur Fade, Marquee, Border Beam, Dot/Grid Pattern, Scroll Progress, Bento Grid, (optional) Video Text |
| Aceternity UI | Resizable floating navbar |
| ReUI | Stepper, Scrollspy |
| Motion (`motion/react`) | Custom builds: hero scroll-expand, How We Work timeline, calculator diagram |
| lucide-react | Only icon library |

Do not add other registries without updating this table. One animation engine (Motion) only —
no GSAP, no Lenis.

---

## Palette 05 — Premium Dark (locked)

Replaces Palette 03. Dark-led: the site's default mood is dark and cinematic, with Bone
sections for reading-heavy content.

| Token | Hex | Role |
|---|---|---|
| `moss` (Deep Moss) | `#131913` | Default dark ground, darkest sections, footer, text on light grounds |
| `green` (AGL Green) | `#1F2A1F` | Brand color, inset dark cards, primary buttons on light grounds |
| `smoke` | `#2E342F` | Raised surfaces on dark (cards, menus, inputs on dark), hairlines on dark |
| `gray` (Soft Gray) | `#AEB5AE` | Secondary text on dark, muted UI, borders on light |
| `bone` | `#ECE8DF` | Primary text on dark; light ground for articles, glossary, calculators, forms |
| `ice` | `#DDE9E2` | Emphasis: active states, focus rings on dark, highlights, numerals, Border Beam, Animated Beam lines |

Measured contrast (WCAG): Bone on Moss 14.6, Bone on Green 12.2, Ice on Moss 14.3,
Soft Gray on Moss 8.5, Soft Gray on Smoke 6.1, Moss on Bone 14.6. Every pairing above passes AA
for body text, so there is no "forbidden" text/ground pair in this palette.

Ground rules:
- Marketing pages (home, who we are, how we work, partners, products, industries) lead dark:
  Moss ground, Green inset cards, Smoke raised surfaces, photography carries the color.
- Reading pages (resource articles, glossary, calculators, FAQ answers, forms) use Bone
  grounds with Moss text for long-form comfort, opened by a dark page opener.
- No hue accent. Emphasis comes from Ice, weight, scale, and photography.
- Retired Palette 03 tokens: parchment → `bone`, cream → `bone`, fog/mint/surface → `gray`,
  clay → remove (use `gray` or `smoke`), cocoa/ink → `moss`.
- Design-board taglines ("Sustainable pallet solutions", "People / Planet / Possibility",
  "Built around what keeps you moving") are mood only. Site copy still comes from
  content JSON / SPEC_V1. Concept-board photos are not site assets unless the owner supplies them.

---

## Phase 0 — Foundation cleanup (branch: `redesign/phase-0`)

| ID | Task | Tier | Done when |
|---|---|---|---|
| R0.1 | Archive process files: move `DECISIONS.md`, `PROGRESS.md`, `STATUS.md`, `REVIEW_*`, `DIFFS.md`, `delegation-system/`, `reference/`, `raw-tokens.json`, `capture/` to `archive/`. Delete root `assets/` (duplicate of `public/assets`). Move root `.sh` scripts to `scripts/harness/`. Add `archive/` to `.cursorignore` and `.claudeignore`. | 🟢 | Build passes; repo root has only app code, config, and live docs |
| R0.2 | Replace `.cursorrules` and the design section of `CLAUDE.md` with `03-cursorrules`. Start fresh `DECISIONS.md` / `PROGRESS.md` for the redesign. | 🟢 | Rules match the new direction |
| R0.3 | Delete dead components: the 8 excluded in `tsconfig.json`, unused `ui/*`, legacy AGL sections listed as negations in `tailwind.config.ts`, `components/kibo-ui`. Remove the exclusions/negations. | 🟢 | Build passes, no negated content paths left |
| R0.4 | Remove both video players: `components/video-player`, `components/limeplay`, `hooks/limeplay`, `@limeplay` registry entry. Temporarily render the hero poster only. Uninstall `shaka-player`, `zustand`, `immer`, `lodash`, `lodash.clamp`, `@phosphor-icons/react`, `react-icons`, `react-fast-marquee` (check `lib/time.ts` first). | 🟢 | Build passes, deps gone |
| R0.5 | Upgrade: Next (current stable), React 19, Tailwind v4 via official upgrade tools. Convert `tailwind.config.ts` theme to `@theme` in `globals.css`. | 🔴 | Build passes, every route renders, no visual regressions beyond expected |
| R0.6 | Replace class merging: standard `lib/utils.ts` `cn` (`clsx` + `tailwind-merge`, custom font sizes registered via `extendTailwindMerge`). Update every import to `@/lib/utils`. Uninstall `cn`. | 🟢 | `grep -r 'from "cn"'` returns nothing |
| R0.7 | Update verify: remove `height` and `diff` from `verify`; fix `banned-words` false positive on `<!DOCTYPE`/`<!-- -->`; delete legacy SVGs with off-brand greens. Update the `color` gate's allowed list to Palette 05. | 🟢 | `npm run verify` passes or fails only on known open items |

**Exit check:** `npm run verify` green (minus documented open items), merged to `main`.

---

## Phase 1 — Design tokens (branch: `redesign/phase-1`)

| ID | Task | Tier | Done when |
|---|---|---|---|
| R1.1 | Tokens in `globals.css` `@theme`: radius scale (`--radius-input: 10px`, `--radius-card: 18px`, `--radius-section: 28px`, buttons full pill); soft shadow scale (`sm`, `md`, `lg`, low-opacity, warm-tinted); Palette 05 tokens per the table above, mapped onto shadcn semantic vars (dark `:root` default: background `moss`, foreground `bone`, card `smoke`, primary `bone` on `green`, muted-foreground `gray`, ring `ice`; `.surface-light` scope: background `bone`, foreground `moss`, primary `green`). Remove Palette 03 tokens. Update the `color` and `tokens` verify scripts to the new palette. | 🟢 | Tokens exist and are used by shadcn semantic vars |
| R1.2 | Type: remove global `uppercase` from `h1–h6`. Anton (`font-display`) only for hero H1s and a `.display` utility. H2–H6 in Inter, sentence case, semibold, tighter tracking. Body size to 16px/1.6. Add a type scale doc comment. | 🟢 | No all-caps outside hero H1s and eyebrows |
| R1.3 | Buttons: exactly two variants in `ui/button.tsx` — `primary` (dark pill) and `secondary` (outline pill) — plus an `arrow` modifier (circle arrow). Replace every ad-hoc button (`pill-light`, `ghost-light`, "Send the spec" etc.) with these. | 🟢 | One button component sitewide |
| R1.4 | Surfaces: `Section` wrapper with variants `dark` (moss), `inset-green` (rounded green card with margin), `light` (bone, for reading pages), `inset-light` (rounded bone card on dark). Faint grain texture utility + Magic UI Dot Pattern for select backgrounds. | 🟢 | Wrapper exists, used by at least the CTA band |
| R1.5 | Motion primitives: install Magic UI Blur Fade; create `<Reveal>` wrapper that no-ops under `prefers-reduced-motion`. Hover-lift utility for cards. | 🟢 | Reveal used in one section as proof |

**Exit check:** screenshot home + one resource page; nothing reads as square or all-caps.

---

## Phase 2 — Global shell

| ID | Task | Tier | Done when |
|---|---|---|---|
| R2.1 | Floating nav: Aceternity Resizable Navbar adapted — inset pill, backdrop blur, soft border/shadow, shrinks on scroll, `Request a Quote` primary button. Replace `Header.tsx`. Keep trailing-slash links. | 🔴 | Nav floats on every page, no layout shift (CLS gate) |
| R2.2 | Mega-menu: shadcn NavigationMenu inside the new nav. Resources panel grouped into Guides / Tools / Reference with icon + one-line description per link, plus featured tile for the Truckload Calculator. Panel is rounded, shadowed, above content (z-index fixed). Data from `content/site.json`. | 🟢 | Panel never overlaps page text; keyboard navigable |
| R2.3 | Mobile: shadcn Sheet from the right, grouped links, primary CTA pinned at bottom. Replace `MobileNav*` and `HeaderSheet`. | 🟢 | Works at 375px, focus trapped, closes on route change |
| R2.4 | ⌘K search: shadcn Command dialog. Index built at build time from resource pillars, glossary terms, questions, products (`lib/resources.ts`, `lib/questions.ts`). Trigger in nav + ⌘K / Ctrl-K. | 🔴 | Finds any guide or glossary term by title |
| R2.5 | CTA card + footer: `CTABand` becomes `inset-dark` rounded card. Footer gets rounded top edge or inset treatment; fix clipped last link in Company column. | 🟢 | Same component on every page |

---

## Phase 3 — Home page

| ID | Task | Tier | Done when |
|---|---|---|---|
| R3.1 | Video hero: scroll-expand hero based on the MIT "Scroll Media Expansion Hero" pattern, rebuilt on Motion `useScroll` + sticky container (no wheel hijacking). Rounded video card under the H1 scales to full-bleed. Native `<video autoPlay muted loop playsInline>`, poster via `next/image priority`. Reduced motion = static poster card. Encode MP4 (H.264, no audio, ~1.5–3 Mbps) + WebM. | 🔴 | LCP < 2.5s mobile, no blank frame, reduced motion respected |
| R3.2 | Capability cards: three separated rounded cards with icon, hover lift, gaps (replace the joined white strip). | 🟢 | |
| R3.3 | Network diagram: Magic UI Animated Beam — mills (left) → AGL (center) → your dock (right). Lazy-mounted when in view. Copy from existing JSON only. | 🔴 | Animates once in view, static under reduced motion |
| R3.4 | Differentiators (01/02/03): drop thick top borders; rounded cards or hairline list with Number Ticker/large numerals in Ice. | 🟢 | |
| R3.5 | "Coordination is the product" band: rounded inset image card, lighter overlay, subtle parallax (Motion). | 🟢 | |
| R3.6 | Products: shadcn Carousel (Embla), rounded images, label chip over image, arrows beside the track, drag on mobile. | 🟢 | |

---

## Phase 4 — Interior pages

| ID | Task | Tier | Done when |
|---|---|---|---|
| R4.1 | Page opener component with three variants (light with image, light text-only, inset-dark card) to replace the repeated full-bleed green hero. Assign a variant per route in page JSON. | 🟢 | No two adjacent pages feel identical |
| R4.2 | How We Work: scroll-driven vertical timeline — progress line fills with scroll, step reveals, sticky image column on the right swapping per step. Motion `useScroll`. | 🔴 | Works at 375px (stacked), reduced motion = static list |
| R4.3 | FAQ: shadcn Accordion + Tabs (Buyers / Suppliers / Carriers if content exists; otherwise single group) + client filter input. Sentence-case questions. Keep FAQPage JSON-LD unchanged. | 🟢 | Schema gate passes |
| R4.4 | Who We Are, Partners, Suppliers, Carriers, The Pledge, Services, Products, Industries, Custom-Engineered, Case Studies, Contact: restyle with the new Section, cards, and openers. One page per chat. | 🟢 | Each page passes axe + Lighthouse |

---

## Phase 5 — Resource library

| ID | Task | Tier | Done when |
|---|---|---|---|
| R5.1 | Hub: Magic UI Bento Grid of rounded cards with lucide icon, type tag (Guide / Calculator / Download / Question), featured calculator tile. | 🟢 | |
| R5.2 | Article template (`ResourceArticle.tsx`): ReUI Scrollspy for the "On this page" TOC with an animated sliding marker; Magic UI Scroll Progress bar under the nav; tables in rounded scroll containers with sticky header and zebra rows. | 🔴 | Active section highlights while scrolling |
| R5.3 | Glossary: sticky A–Z bar with active letter, disabled letters without terms, live filter input; remove the giant empty letter column (letter becomes a small sticky label). | 🟢 | |
| R5.4 | Glossary hover cards: in article RichText, wrap known glossary terms (first occurrence per page) in shadcn HoverCard with the definition + link. Build-time term map from `glossary.json`. | 🔴 | No layout shift, keyboard-focusable |
| R5.5 | Downloads + Size Chart: card grid with file preview thumbnails; small to-scale pallet footprint SVGs per size row (generated from the dimensions already in content, no new numbers). | 🔴 | Numbers gate passes |

---

## Phase 6 — Calculators

| ID | Task | Tier | Done when |
|---|---|---|---|
| R6.1 | Truckload calculator: keep the server GET form as no-JS fallback. Add client enhancement: live recalculation on change (no Calculate button when JS is on), shadcn Toggle Group for trailer/container preset, Slider + Input pairs, Number Ticker results. Reuse existing math in `lib/calculators.ts` — do not rewrite formulas. | 🔴 | Results match server output for the same inputs |
| R6.2 | Trailer diagram: top-down SVG that draws the floor pattern (straight vs turned, rows × across) from the calculator's computed layout, animating on change. | 🔴 | Matches "Floor pattern" row exactly |
| R6.3 | Apply the same enhanced pattern to Boxes per Pallet, Pallet Weight Estimator, Cost per Trip. | 🟢 | |

---

## Phase 7 — Forms

| ID | Task | Tier | Done when |
|---|---|---|---|
| R7.1 | Quote form: ReUI Stepper, three steps (Contact → Pallet spec → Delivery), Zod validation per step gating Next, shadcn Field components, Calendar + Popover date picker, styled Select, Sonner toast on success. Keep the working FormSubmit destination until R7.3 lands. Fields from `content/forms.json` only. | 🔴 | Submits successfully to the existing destination |
| R7.2 | Supplier + carrier forms: same stepper pattern. Keep the visible "not sending yet" state until D4 inboxes are supplied. | 🟢 | |
| R7.3 | Resend route handler (D4 approved; needs owner inboxes + `RESEND_API_KEY` in Vercel env — if missing, build it behind the env check and log to BLOCKED.md) for all three forms, including carrier COI upload with size/type limits. | 🔴 | File arrives as attachment |
| R7.4 | Contact cards: sentence case, click-to-copy phone/email with Tooltip "Copied", `tel:`/`mailto:` still work. | 🟢 | |

---

## Phase 8 — Polish and launch QA

| ID | Task | Tier | Done when |
|---|---|---|---|
| R8.1 | Motion pass: Blur Fade reveals applied consistently (sections, not every element); Border Beam (Ice) on the primary hero CTA only; hover states on all cards/links. | 🟢 | |
| R8.2 | Performance pass: every motion component client-only and lazy below the fold; check bundle with `next build` output; video weight check. | 🔴 | Mobile Perf ≥ 95 on home, a guide, a calculator |
| R8.3 | Accessibility pass: focus states on new components, reduced motion everywhere, contrast of Ice/Soft Gray states, focus rings visible on both dark and Bone grounds. | 🟢 | Zero serious/critical axe |
| R8.4 | Full `npm run verify`, then follow `DOMAIN-SWITCH-RUNBOOK.md` unchanged. | 🟢 | Green |

---

## Guardrails (apply to every task)

- Never edit `content/**` JSON as part of a design task. Copy changes are separate, owner-approved commits.
- Never change routes, H1 text, canonical URLs, or JSON-LD output.
- Every animated component: client-only, respects `prefers-reduced-motion`, no CLS.
- Install components with the shadcn CLI yourself in the terminal; ask the agent to adapt, not to write from scratch.
- One driver at a time (Cursor or Claude Code), commit before switching.
