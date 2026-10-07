# AGL Pallet — how to build with this design system

AGL Pallet is a pallet **broker** (sourcing + managed freight), never a manufacturer. Copy is plain, direct, buyer-facing.

## Surfaces and setup
- No provider is needed. `styles.css` gives `<body>` the default **dark** ground: moss `#131913` with bone `#ece8df` text, Inter body, Anton display.
- Build every page as stacked full-width surfaces:
  - **Dark (default):** `<div className="bg-moss text-bone">`
  - **Light:** `<div className="surface-light bg-bone text-moss">`. You need `surface-light` as well as the colours, because it flips `Button` primary to moss and remaps the semantic tokens.
  - **Inset panel:** `<div className="px-4 md:px-6"><div className="mx-auto max-w-[1280px] rounded-section bg-green">…</div></div>`
- `Section` does **not** paint a background; its `variant` only tints the dot pattern. Put a surface class on its `className` or on a wrapper.
- `Form`, `Contact2` and `QuoteContacts` (and `ItemDescription`) are **dark-surface only**: their labels and inputs read `text-foreground`/`bg-background`, which don't flip under `surface-light`.
- Overlays (`Sheet`, `Select`, `DropdownMenu`) portal to `<body>` and are always dark.
- `Header` is `position: fixed`; render it once at the top of a page.

## Styling vocabulary (Tailwind v4 utilities, compiled — only these exist)
| Family | Classes |
|---|---|
| Colour | `bg-/text-/border-` + `moss` `green` `smoke` `gray` `bone` `ice`, with `/10 /15 /20 /40 /60 /80`; `text-current/70` for muted text on either surface |
| Type | `text-display-1` (hero), `text-display-2` (section H2), `text-display-kicker`, `text-display-row`, `text-display-numeral`, `text-step-lg`, `text-body`, `text-eyebrow`, `text-link`, `text-button`; `font-display` or `.display` (Anton, uppercase); `font-semibold` |
| Shape | `rounded-input` 10px, `rounded-card` 18px, `rounded-section` 28px, `rounded-full`; `shadow-sm/md/lg` |
| Space and layout | `p-/px-/py-/m-/mt-/mb-/gap-` 0–24 (Tailwind steps 0,1,2,3,4,5,6,8,10,12,16,20,24); `grid-cols-1..4`, `col-span-*`, flex/grid helpers; breakpoints `md:` `lg:` and `nav:` (980px, the site's main desktop switch) |
| Site utilities | `section-y`, `section-rhythm` (vertical section padding), `prose-measure`, `grain`, `hover-lift`, `section-hairline` |

Arbitrary values and classes not listed may not exist in the compiled CSS. Prefer the components, then this table. Read `styles.css` → `_ds_bundle.css` for the full set and `--color-*` / `--text-*` tokens.

## Components
- Page sections come first. `PageOpener`/`Hero3` (page tops), `HeroExpand`/`Hero1` (home heroes), `Feature1/2/3`, `Process1`, `About3`, `ImageBand`, `Gallery4`, `Faq3`, `Cta4`, `Contact2` + `Form`, then `Header`/`Footer` (no props; they carry the real nav and contact).
- `Feature3` `variant`: `numbered | card | divided | ruled`.
- Actions are `Button` with `href` + `label` and `variant` `primary | secondary | ghost`. It always renders a link.
- Icon props (`IconTile`, `Feature3`, `Process1`) take the bundled Lucide set: `Truck` `Factory` `Package` `Boxes` `Layers` `ShieldCheck` `BadgeCheck` `Handshake` `Network` `MapPin` `Clock` `Repeat` `Settings2` `Building2` `UserRound` `Phone` `Mail` `MessageSquare` `ArrowRight` `Check` and others.
- Photos are root-relative `/assets/stock/*.webp` paths (e.g. `/assets/stock/agl-carriers-01_8a45.webp`); image props resolve them. For a media slot, pass `<div className="overflow-hidden rounded-card"><CardMedia src="…" /></div>`.
- Give `Separator` an explicit size (`h-px w-full`).
- Per-component API and examples are in `components/<group>/<Name>/<Name>.prompt.md` and `.d.ts`.

## Example
```jsx
const { Header, Feature3, Footer, Button, Truck, ShieldCheck, Handshake } = window.AGLPallet;
<>
  <Header />
  <div className="bg-moss text-bone">
    <Feature3 variant="divided" columns={3} eyebrow="Why AGL" heading="One call covers the pallet and the truck"
      features={[
        { title: "Managed freight on every order", description: "We book the carrier and own the delivery window.", icon: Truck },
        { title: "ISPM-15 when you need it", description: "Heat-treated, stamped stock for export loads.", icon: ShieldCheck },
        { title: "No minimums", description: "One truckload or forty.", icon: Handshake },
      ]} />
  </div>
  <div className="surface-light bg-bone text-moss py-16">
    <div className="mx-auto max-w-[1280px] px-6 md:px-8 lg:px-12 flex flex-wrap items-center justify-between gap-6">
      <h2 className="text-display-2">Send a spec and a quantity.</h2>
      <Button href="/request-a-quote/" label="Request a quote" />
    </div>
  </div>
  <Footer />
</>
```
