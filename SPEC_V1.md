# AGL Pallet — Website Build Spec

**Version:** 1.0 · 14 Sep 2026

**Target:** demo site rebuild of aglpallet.com

**Audience for this file:** the implementing agent. Build from this document alone.

**Human-readable twin:** the AGL Site Rebuild Deck artifact. This file is authoritative for implementation.

---

## 0 · READ FIRST — hard rules

These are non-negotiable brand and legal constraints. Violating one is worse than shipping an incomplete page. If a rule blocks you, leave a `{{BLOCKED: reason}}` marker and continue.

| # | Rule |

|---|---|

| 1 | **AGL is a pallet BROKERAGE, never a manufacturer.** Never write "we make," "we produce," "we build," "we manufacture," "our mill," "our plant," or "our factory." AGL sources, specs, qualifies, coordinates, and supplies. |

| 2 | **No warehousing, storage, inventory holding, or VMI language anywhere.** Not in copy, alt text, meta descriptions, or schema. |

| 3 | **Do not brand AGL as a logistics or freight company.** Managed freight on every order is advertisable. A standalone logistics service line is not. No "AGL Logistics," no separate freight brand mark, no freight service-line page. |

| 4 | **No recycled, used, or reconditioned pallets** offered as a product. |

| 5 | **Claim no certifications.** No RPA, MHI, BBB, SmartWay, NWPCA, PDS, ISPM-15, or heat-treat capability claims. No badge images. |

| 6 | **Never "Ohio-only."** Supplier network is growing. Public footprint is MI, IL, IN, PA, OH, WV — "the Midwest and Mid-Atlantic, and growing." Never "national" or "nationwide." |

| 7 | **No customer, supplier, or competitor names or logos.** None. Not in testimonials, not in a logo bar, not in alt text. |

| 8 | **No figures not in this document.** No invented stats, percentages, years in business, customer counts, truckloads shipped, or on-time rates. |

| 9 | **No Mavin or WRL imagery, copy, or creative, ever.** If any exists in the media library, flag it — do not reuse. Never describe AGL's founding as an "acquisition." |

| 10 | **Do not invent copy.** Every word of body copy is in section 4 of this file. If something is missing, use a `{{TBD-*}}` token from section 8. Do not fill gaps with your own marketing prose. |

### Banned words and phrases

Reject these on sight, including in any copy you generate for nav labels, buttons, alt text, or meta:

```

revolutionary · world-class · best-in-class · seamless · game-changing · cutting-edge

industry-leading · one-stop shop · synergy · leverage (as a verb) · unlock · empower

elevate · robust solutions · passionate about · we're excited to · trusted partner (as filler)

"the cheapest pallet is the most expensive one you'll ever buy" or any price-objection cliché

```

No exclamation points. No emoji. Minimal adjectives — a dimension or a standard code beats an adjective.

### Voice

Operator-to-operator. The reader is a purchasing manager, plant manager, or owner who has bought pallets for twenty years. Short sentences. Concrete nouns. Active voice. Confident without swagger. Sections end on the fact, not on a pitch — a CTA is a button, not a closing sentence.

---

## 1 · Routes

Build these twelve routes.

| # | Route | Page | Status |

|---|---|---|---|

| 01 | `/` | Home | Rewrite |

| 02 | `/who-we-are` | Who We Are | New — replaces `/about` |

| 03 | `/partners` | Partners hub | New |

| 04 | `/partners/suppliers` | Supply Pallets to AGL | New |

| 05 | `/partners/carriers` | Haul for AGL | New |

| 06 | `/the-pledge` | The Pledge | New |

| 07 | `/custom-engineered` | Custom & Engineered | New |

| 08 | `/products` | Products | Rewrite |

| 09 | `/industries` | Industries | Rewrite |

| 10 | `/how-we-work` | How We Work | Rename + light edit of `/logistics-process` |

| 11 | `/contact` | Contact | New |

| 12 | `/request-a-quote` | Request a Quote | Keep, restyle |

### Redirects (301)

```

/about              → /who-we-are

/logistics-process  → /how-we-work

/industries-served  → /industries

```

### Navigation

Primary nav, in this order:

```

Products · Industries · How We Work · Who We Are · Partners · Contact

```

- `Products` dropdown: Stock Pallets · Custom & Engineered · Crates · Dunnage · Shipping Blocks · Stakes

- `Partners` dropdown: For Mills & Shops · For Carriers

- Persistent button, right of nav: **Request a Quote**

### Footer

Four columns:

1. **AGL Pallet** — logo, the one-line descriptor (section 4.13), North Canton address `{{TBD-ADDRESS}}`, phone `234-286-0402`, email `sales@aglpallet.com`

2. **Products** — the six product lines

3. **Company** — Who We Are · How We Work · The Pledge · Industries

4. **Partners** — For Mills & Shops · For Carriers · Contact

Footer legal line: `© 2026 AGL Pallet LLC. All rights reserved.`

**Remove the string "This is Bahlr website." — it is agency placeholder text currently live in production.**

Social icons: only render the block if `{{TBD-SOCIAL-URLS}}` is resolved. Do not ship an empty "Follow Us" heading.

---

## 2 · Reusable components

Build these once and reuse. Copy varies by instance; structure does not.

| Component | Structure |

|---|---|

| `Hero` | eyebrow (uppercase, letter-spaced) · h1 · lede paragraph · button row (1 primary + up to 2 ghost) |

| `SectionHeader` | eyebrow · h2 · optional lede |

| `TrioGrid` | 2–4 equal cards; each has optional numeral eyebrow, h3, body. Collapses to one column under 720px. |

| `ProseBlock` | h2 + paragraphs, max 70ch measure |

| `ListBlock` | h3 + bulleted list, bold lead-in per item |

| `CTABand` | h2 · one line · primary button. Used at the foot of customer-facing pages only — **not** on `/the-pledge`. |

| `Form` | see section 5 |

### Global constraints

- Body measure max 70ch. Headings `text-wrap: balance`.

- Minimum 16px side gutter at every viewport. No horizontal page scroll at 375px.

- Every image needs real alt text describing the image, not the page.

- Visible keyboard focus states. Respect `prefers-reduced-motion`.

- Colour: brand green `#162619`. **Do not introduce a second green.** The logo rasters contain `#152619`; that value is not yet reconciled — use `#162619` everywhere and flag any asset that disagrees.

---

## 3 · SEO — title tags and meta descriptions

| Route | Title tag | Meta description |

|---|---|---|

| `/` | AGL Pallet — Pallet Sourcing and Managed Freight for Manufacturers | AGL Pallet sources new, custom, and engineered pallets from family-run mills across the Midwest and Mid-Atlantic, and manages the freight on every order. |

| `/who-we-are` | Who We Are — AGL Pallet | AGL Pallet started on the buying side of the dock. North Canton, Ohio. Here is how the company runs and who answers the phone. |

| `/partners` | Partners — AGL Pallet | AGL works with family-run mills and regional carriers across the Midwest and Mid-Atlantic. Two ways to work with us. |

| `/partners/suppliers` | Supply Pallets to AGL — For Mills and Shops | AGL is a pallet brokerage with no plant of its own. Steady recurring volume, paid on time, and no channel conflict. Tell us what your shop builds. |

| `/partners/carriers` | Haul for AGL — For Carriers | AGL manages freight on every pallet order we sell. Regional lanes across the Midwest and Mid-Atlantic. Get set up as a carrier. |

| `/the-pledge` | The Pledge — AGL Will Never Own Manufacturing | Most large pallet brokers bought factories. AGL did not, and will not. Why that decision is structural rather than a slogan. |

| `/custom-engineered` | Custom and Engineered Pallets, Crates and Skids — AGL Pallet | Odd-size, oversize, and heavy-duty pallet solutions. We spec to the load, then source the shop set up for the job. |

| `/products` | Products — Pallets, Crates, Dunnage, Blocks and Stakes | Stock pallets, custom and engineered solutions, crates, dunnage, shipping blocks, and stakes, sourced through qualified mills. |

| `/industries` | Industries We Serve — AGL Pallet | Construction materials, chemicals, refractories, 3PL and distribution, metal fabrication, energy, plastics, and food and beverage. |

| `/how-we-work` | How We Work — AGL Pallet | Four steps: understand the requirement, align supply and freight, execute and communicate, keep adjusting. |

| `/contact` | Contact AGL Pallet — North Canton, Ohio | Request a quote, supply pallets to AGL, get set up as a carrier, or ask a question. 234-286-0402. |

| `/request-a-quote` | Request a Quote — AGL Pallet | Send a spec and a quantity and we will come back the same day. No minimums. |

### Structured data

Add `Organization` + `LocalBusiness` JSON-LD on `/` only, once `{{TBD-ADDRESS}}` resolves. Fields: name `AGL Pallet LLC`, telephone `234-286-0402`, email `sales@aglpallet.com`, `areaServed` = MI, IL, IN, PA, OH, WV. **Do not add `aggregateRating`, `review`, or any certification property.**

---

## 4 · Page copy

Copy below is final draft, approved for build, pending Brock's sign-off before public launch. **Use it verbatim.** Do not paraphrase, expand, or add transitional sentences.

### 4.1 · `/` Home

**Hero**

```

EYEBROW: Pallets move the world. We move pallets.

H1: Never one mill between you and your line.

LEDE: AGL Pallet sources new, custom, and engineered pallets from a network of

family-run mills across the Midwest and Mid-Atlantic — and manages the freight on

every order. Same-day quotes. No minimums. More than one qualified source on every

spec we sell.

BUTTONS:

  [primary] Request a quote        → /request-a-quote

  [ghost]   Supply pallets to AGL  → /partners/suppliers

  [ghost]   Haul for AGL           → /partners/carriers

```

The three buttons are the most important element on the site. Do not collapse them into one CTA on mobile — stack them.

**Capability band** — `TrioGrid`, replaces the existing "99%" and "12+" stat callouts

```

CARD 1

  H3: Same-day quotes

  BODY: Send a spec and a quantity before lunch, get a number back the same day.

CARD 2

  H3: No minimums

  BODY: One truckload or forty. Order size doesn't decide whether we pick up the phone.

CARD 3

  H3: Freight on every order

  BODY: We book and track the truck. One number covers the pallets and the delivery.

```

**What AGL does** — `ProseBlock`

```

EYEBROW: What we do

H2: One number for the spec, the pallets, and the truck.

BODY:

AGL is a pallet brokerage. We don't own a mill and we don't own trucks. What we own

is the coordination: we qualify the shops that supply them well, hold more than one source

for every spec we quote, and book the freight so the pallets land when your line

needs them.

When something moves — a spec change, a volume spike, a mill running behind — you

hear it from us before it becomes your problem. That's the job.

```

**The three differentiators** — `TrioGrid` with numeral eyebrows

```

CARD 1 — eyebrow "01"

  H3: You hear it from us first

  BODY: Proactive updates, not status requests. If a load slips, the call comes from

  us with the fix already in motion — not from your receiving dock at 6am.

CARD 2 — eyebrow "02"

  H3: More than one mill per spec

  BODY: Every spec we sell has multiple qualified shops behind it. No single facility,

  no single region, no single point of failure between a lumber market and your line.

CARD 3 — eyebrow "03"

  H3: We've run the floor

  BODY: AGL was started by people who bought pallets for production lines. We

  know which corners cost money later and which specs are overbuilt for the job.

```

**The pledge** — `ProseBlock`

```

EYEBROW: The pledge

H2: We will never own a mill.

BODY:

After the COVID lumber shock, a lot of pallet brokers bought factories. Volume that

had run through family mills for years quietly moved to the broker's own plants. It

left both sides wary — mills don't trust a broker who competes with them, and buyers

don't trust a broker who became a manufacturer.

AGL doesn't own manufacturing and has no intention of ever owning it. We grow by

coordinating more, not by building plants. That's why good mills give us capacity,

and it's why there's always more than one shop that can build your spec.

BUTTON: [ghost] Read the pledge → /the-pledge

```

**Partner split** — `TrioGrid`, two cards

```

CARD 1

  EYEBROW: For mills & shops

  H3: We buy pallets. We'll never build them.

  BODY: Steady recurring volume, paid on time, from a broker with no plant of its own to feed.

  BUTTON: [ghost] Supply pallets to AGL → /partners/suppliers

CARD 2

  EYEBROW: For carriers

  H3: Freight on every order means we always need capacity.

  BODY: Regional lanes across the Midwest and Mid-Atlantic, moving pallets from mill to plant.

  BUTTON: [ghost] Haul for AGL → /partners/carriers

```

**Who we are teaser** — `ProseBlock` with portrait image

```

EYEBROW: Who we are

H2: People who stood on the other side of the dock.

BODY:

AGL started in North Canton, Ohio in January 2026, run by people who spent years

buying pallets for manufacturers — living through capacity crunches, material

shortages, and pricing whiplash from the receiving end. That's why the company is

built the way it is.

BUTTON: [ghost] Meet the team → /who-we-are

IMAGE: {{TBD-PHOTO-BROCK}}

```

**CTA band** — standard, see 4.13

---

### 4.2 · `/who-we-are`

**Hero**

```

EYEBROW: Who we are

H1: We were the ones waiting on the pallets.

LEDE:

AGL Pallet started on the buying side of the dock — by people who spent

years specifying, buying, and waiting on pallets while a production schedule ran

regardless. Capacity crunches. Material shortages. Price moves that arrived with no

warning and no explanation.

That's the experience the company is built out of, and it's why AGL is a brokerage

rather than a plant.

```

**Founder story** — `ProseBlock` with portrait

```

EYEBROW: From Brock Lundeen, Owner

H2: Why I built it this way

BODY:

I spent years on the buying side, and the pattern never changed: the pallet was the

cheapest thing on the line and the fastest way to stop it. When supply got tight, the

vendors who kept me running weren't the biggest — they were the ones who called me

before I had to call them.

So AGL is organized around two things I couldn't get reliably as a buyer. More than one

qualified shop behind every spec, so a single mill's bad week isn't my problem. And a

person who answers, who knows what's on the truck, and who tells me early when it

isn't going to work.

The other decision was structural. We don't own a mill and we never will. I've watched

what happens to the family shops when a broker buys a plant, and I'd rather have their

capacity and their trust.

IMAGE: {{TBD-PHOTO-BROCK}}

```

> **Build note:** this is a first-pass draft written from the founder narrative already on the live homepage. It is `{{TBD-FOUNDER-STORY}}` pending Brock's markup. Build the section; expect the words to change.

**Team** — `ListBlock`

```

EYEBROW: The people who answer

H2: Seven people, and you'll know which one is yours.

BODY:

AGL runs with a small team on purpose. Sourcing, freight, and the account are three

people who sit near each other, not three queues in three systems.

LIST:

  Brock — Owner. Commercial, supply, and the last call on anything hard.

  Brandon — Logistics. Books the freight and tracks the loads.

  Larry — Supplier Relations. Qualifies the mills and knows their machine constraints.

  Beau — Operations.

  Colton — Finance. Why the mills get paid on time.

  Jeff — IT.

  Nautis — Marketing.

```

> **Build note:** `{{TBD-TEAM-LIST}}` — confirm who consents to be listed, whether last names appear, and whether headshots are in scope. Roles-only is an acceptable fallback. Build with first names as written.

**Values** — `TrioGrid`, four cards

```

EYEBROW: How we operate

CARD 1  H3: Trust

        BODY: We don't compete with our suppliers and we don't surprise our customers.

CARD 2  H3: Responsiveness

        BODY: Same-day quotes, and the bad news travels as fast as the good.

CARD 3  H3: Operational excellence

        BODY: The spec is right, the truck is booked, the paperwork matches.

CARD 4  H3: Accountability

        BODY: One name on your account. When it goes wrong, that's who calls.

```

> **Build note:** `{{TBD-VALUES}}` — these are the four suggested in brand canon out of ten official values. Brock confirms the final set. Swapping one is a one-card change.

**Faith** — `ProseBlock`

```

EYEBROW: What we stand on

H2: AGL is a Christ-centered company.

BODY:

It shapes how we deal with people more than what we sell. Mills get paid when we said

we'd pay them. Customers get told what we can and can't do, including when the honest

answer costs us the order. Nobody gets squeezed because we happen to have the upper hand

that week.

We don't think that makes us a better vendor than anyone else, and we won't ask you to

care about it. It's just who we are, and it's why the company runs the way it does.

```

> **Build note:** `{{TBD-FAITH-PLACEMENT}}` — brand canon settles that this appears openly; it does not settle where. Two options: this section on `/who-we-are` (built as drafted), or an anchored section on the homepage. Build here. Do not duplicate it on both pages.

>

> **Tone rule:** faith is stated plainly and never used as persuasion. Do not add scripture, imagery, iconography, or a fish/cross mark. Do not move this section above the founder story. Do not reference it in meta descriptions or the homepage.

**Where we are** — `ProseBlock`

```

EYEBROW: North Canton, Ohio

BODY:

Our supplier network is centered in Eastern Ohio and Western Pennsylvania and it's

growing. We serve manufacturers across Michigan, Illinois, Indiana, Pennsylvania,

Ohio, and West Virginia — the Midwest and Mid-Atlantic, and expanding as new mills

come on.

ADDRESS: {{TBD-ADDRESS}}

```

---

### 4.3 · `/partners`

```

EYEBROW: Partners

H1: We don't build pallets and we don't drive trucks.

LEDE: Which means AGL only works if the shops that supply them well and the carriers that

run our lanes want to work with us. Two ways in.

```

`TrioGrid`, two cards, each entirely clickable:

```

CARD 1

  H3: Mills & shops

  BODY: You build pallets, crates, or cut stock and want steady volume from a broker

  with no plant of its own.

  LINK: /partners/suppliers

CARD 2

  H3: Carriers

  BODY: You run flatbed or dry van in the Midwest and Mid-Atlantic and want consistent

  regional freight.

  LINK: /partners/carriers

```

No CTA band on this page. The two cards are the CTA.

---

### 4.4 · `/partners/suppliers`

**Build this page first.** It is a contractual deliverable and it unblocks supplier-facing social content that currently has nowhere to land.

**Hero**

```

EYEBROW: For mills and shops

H1: We buy pallets. We'll never build them.

LEDE:

AGL is a brokerage with no plant of its own and no intention of ever having one. When

we bring you volume, we're not building a book to move in-house in three years. We

don't have anywhere to move it to.

BUTTON: [primary] Tell us what you build → #supplier-form

```

**The offer** — `ListBlock`

```

H2: What working with AGL looks like

LIST:

  Recurring volume, not spot scraps. — We're placing programs for manufacturers who

  order every week, not chasing one-off loads.

  Paid when we said we'd pay. — Terms are terms. If that's the thing that's burned you

  before, ask us about it directly.

  Zero channel conflict. — We will never own manufacturing and we will never compete

  with you for your own accounts.

  Work that fits your machines. — We ask what your equipment runs well before we send

  you a spec, not after you've quoted it.

  We handle the freight. — You build. We book the truck and deal with the delivery

  window.

```

**What we ask** — `ProseBlock`

```

H2: What we need from you

BODY:

Consistent build quality against the spec, honest lead times — including when they

slip — and a phone call when something changes. That's most of it. We qualify shops

on whether the pallets are right and whether we hear the truth early, not on being

the cheapest quote in the file.

```

**Form** — `#supplier-form`, schema in 5.2

---

### 4.5 · `/partners/carriers`

**Hero**

```

EYEBROW: For carriers

H1: Freight on every order means we always need capacity.

LEDE:

AGL manages the truck on every load we sell. Pallets move from family mills in Eastern

Ohio and Western Pennsylvania out to manufacturing plants across the Midwest and

Mid-Atlantic — regional, repeatable, and mostly the same lanes week to week.

BUTTON: [primary] Get set up as a carrier → #carrier-form

```

**The offer** — `ListBlock`

```

H2: What the freight looks like

LIST:

  Regional and repeatable. — Mill to plant across OH, PA, WV, IN, MI, and IL. Not

  one-off long haul.

  Loads that recur. — Our customers order on a schedule, so the lanes come back.

  One dispatcher. — Brandon books and tracks every load. You get a person, not a portal.

  Paid on agreed terms. — {{TBD-CARRIER-TERMS}}

```

> **Build note — this page has the only genuine content blocker in the spec.** No source document states what AGL offers a carrier. The lanes above are inferred from the supplier and customer footprints and are safe to build. Four answers are outstanding: `{{TBD-CARRIER-LANES}}`, `{{TBD-CARRIER-EQUIPMENT}}`, `{{TBD-CARRIER-TERMS}}`, `{{TBD-CARRIER-INSURANCE}}`. Build the page structure and the form; render TBD tokens as visible placeholders in the demo, never as invented copy.

> **Positioning guardrail — enforce this.** This page is about carriers hauling AGL's freight. It is not a freight service line. Do not add: an "AGL Logistics" name or mark, a services list, freight-brokerage language, a top-level nav entry, or anything implying AGL sells transportation as a product. The page stays under `/partners`.

**Form** — `#carrier-form`, schema in 5.3

---

### 4.6 · `/the-pledge`

```

EYEBROW: The pledge

H1: AGL will never own manufacturing.

BODY:

After the COVID lumber shock, most of the large pallet brokers bought factories. It

made sense on paper — control the supply, capture the margin. What happened next is

that volume which had run through family mills for years quietly moved to the broker's

own plants. The mills that had held those accounts found out they'd been training

their competitor.

So the industry ended up with a trust problem running both directions. Mills are wary

of brokers who might become manufacturers. Buyers are wary of brokers who already did,

because the "multiple sources" on the quote turned out to be one plant with a sales

team.

H2: Our position is structural, not a slogan

BODY:

AGL owns no manufacturing and has no intention of acquiring any, indefinitely. We grow

by coordinating more volume and more lanes — not by buying plants. There is no roadmap

where we compete with the shops that supply us.

That's the reason good mills give us capacity, and it's the reason we can put more

than one qualified source behind every spec we quote. Those two things are the same

fact seen from either side.

```

**No CTA band and no buttons on this page.** The page is the argument. A pledge that ends in "so call us" is not a pledge.

---

### 4.7 · `/custom-engineered`

```

EYEBROW: Custom & engineered

H1: Odd size, oversize, overweight, or nothing standard about it.

BODY:

Most of what we quote isn't a stock 48×40. It's a skid for a forging that runs nine

thousand pounds, a crate for an elevator assembly, cut stock to a rail spec, or a

mixed-spec program where four plants each need something different off the same order.

A single mill will usually quote what its equipment likes to build. We start from what

the load actually does — weight, whether it's racked or floor-stacked, how many times

it gets handled, whether it ships overseas — and then find the shop set up to build it.

H2: Where custom usually pays for itself

LIST:

  Overbuilt standard specs. — Plenty of operations are buying more pallet than the load

  needs because the spec was set years ago for a heavier product.

  Racking versus floor stacking. — Static, dynamic, and racking are three separate load

  ratings, and the racking number is the one that gets missed.

  Mixed programs. — Multiple specs, staggered releases, several ship-to addresses — the

  coordination a single mill struggles with is the part we take on.

```

> **Build note:** do not add PDS, Pallet Design System, engineering-certification, or load-testing claims to this page. Rule 5.

---

### 4.8 · `/products`

Six product lines. The live site has four.

```

EYEBROW: Products

H1: Pallet and material handling solutions

LEDE: Specced to your load, sourced through mills qualified to build it.

```

| Line | Anchor | Copy |

|---|---|---|

| Stock pallets | `#stock-pallets` | Standard footprints for recurring volume, with multiple qualified sources behind each spec so a single mill's backlog doesn't become your shortage. |

| Custom & engineered | `#custom-engineered` | Odd-size, oversize, heavy-duty, and mixed-spec solutions. We spec the pallet to your load, then source the shop set up to build it. **Links to `/custom-engineered`.** |

| Crates | `#crates` | Custom and stock crating for equipment, components, and high-value goods that need containment beyond palletization. |

| Dunnage | `#dunnage` | Blocking, bracing, and fill to keep a load from moving in transit. **New standalone line — currently bundled with crates.** |

| Shipping blocks | `#shipping-blocks` | Supplemental components that raise, space, and stabilize palletized and irregular loads. |

| Stakes | `#stakes` | **New line — missing from the live site entirely.** Stakes for loads that need vertical containment on a flat deck. |

**Producer-voice replacements — apply these exactly.** These strings are live on the current site and violate Rule 1.

| Remove | Replace with |

|---|---|

| "Every pallet is produced under strict quality controls" | "Every shop we source from is qualified on build consistency before we place volume with them" |

| "AGL designs pallets precisely tailored to your load requirements" | "We spec the pallet to your load, then source the shop set up to build it" |

| "we develop pallet specifications" | "we write the spec with you" |

| "Using Pallet Design System (PDS) methodology…" | **Delete. No replacement.** |

---

### 4.9 · `/industries`

Order matters — it is set by validated win-rate data. Do not re-sort alphabetically.

```

EYEBROW: Industries

H1: Where AGL works

LEDE: Operations where the pallet is load-bearing infrastructure, not a line item.

```

| # | Industry | Copy |

|---|---|---|

| 1 | Building materials | Lumber, stone, roofing, and construction components. Heavy, dense, often irregular, and frequently stored outdoors. |

| 2 | Chemicals & coatings | Drums, totes, and bulk containers where load stability isn't optional. |

| 3 | Refractories, foundry, glass & clay | Extreme point loads and weights most standard specs aren't rated for. |

| 4 | Shipping, distribution & 3PL | High throughput, multiple ship-to points, and mixed specs across sites. |

| 5 | Metal fabrication & forging | Engineered skids and crates for parts that outweigh the pallet several times over. |

| 6 | Energy & industrial | Oil, gas, and electrical equipment, including export crating. |

| 7 | Plastics & packaging | High volume, fast cycles, and automated handling. |

| 8 | Food & beverage | Throughput operations where a late load stops a line. |

> **Build note:** `{{TBD-PHARMA}}` — "Pharmaceutical" is currently the second industry listed on the live site and appears in no tier of the validated ICP. It is omitted here pending Brock's answer. If he confirms it, insert as item 8 with copy: *"Regulated environments where pallet integrity, cleanliness, and traceability carry compliance weight."* Do not restore it without that answer.

---

### 4.10 · `/how-we-work`

Renamed from "Logistics & Process" — that title reads as a service line and brushes Rule 3.

```

EYEBROW: How we work

H1: Four steps, and you know who owns each one.

LIST:

  Understand your requirements. — Volume, specs, load behavior, delivery cadence —

  plus the handling conditions that decide whether a spec survives contact

  with your floor.

  Align supply and freight. — We match the spec to qualified shops — more than one —

  and plan the lanes at the same time, so sourcing and delivery aren't two separate

  problems.

  Execute and communicate. — We book, track, and tell you early. Proactive updates,

  not status requests.

  Keep adjusting. — Volumes move, specs change, plants open. We re-source and re-route

  rather than restating the original quote.

```

---

### 4.11 · `/contact`

```

EYEBROW: Contact

H1: Tell us which one you are.

LEDE: Four ways in, so you don't have to fill in pallet dimensions to ask a question.

LIST (each item is a card linking to its form):

  I need a quote — specs and quantity, and we'll come back the same day.

    → /request-a-quote

  I build pallets — tell us what your shop runs.

    → /partners/suppliers#supplier-form

  I haul freight — get set up as a carrier.

    → /partners/carriers#carrier-form

  Something else — an existing order, a spec question, or anything that isn't the above.

    → #general-form

BODY: Or just call. 234-286-0402 — North Canton, Ohio.

ADDRESS: {{TBD-ADDRESS}}

```

**Form** — `#general-form`, schema in 5.4

---

### 4.12 · `/request-a-quote`

Keep existing intent, restyle to the new system.

```

EYEBROW: Request a quote

H1: Send us a spec and a quantity.

LEDE: We'll come back the same day. No minimums, and more than one qualified source

behind whatever you're buying.

```

**Form** — `#quote-form`, schema in 5.1

---

### 4.13 · Shared blocks

**CTA band** — foot of `/`, `/products`, `/industries`, `/custom-engineered`, `/how-we-work`. **Not** on `/the-pledge`, `/partners`, or either partner page.

```

H2: Let's talk about your pallet supply.

BODY: Send a spec and a quantity, or just call and describe the problem.

BUTTON: [primary] Request a quote → /request-a-quote

```

**One-line descriptor** — footer column 1, and the `og:description` fallback

```

AGL Pallet sources new, custom, and engineered pallets from family-run mills across

the Midwest and Mid-Atlantic, and manages the freight on every order.

```

---

## 5 · Forms

Four intakes. Each needs: a hidden `source` field recording the originating route, an autoresponder, spam protection that is **not** a CAPTCHA-gated wall on the partner forms, and a distinct destination.

### 5.1 · `#quote-form` → `sales@aglpallet.com`

| Field | Type | Required |

|---|---|---|

| Name | text | yes |

| Company | text | yes |

| Email | email | yes |

| Phone | tel | no |

| Pallet size or spec | text | yes |

| Quantity and frequency | text | yes |

| Ship-to city and state | text | yes |

| Target date | date | no |

| Notes | textarea | no |

Submit label: `Send the spec` · Success: *"Got it. We'll come back to you the same day."*

### 5.2 · `#supplier-form` → Larry (Supplier Relations) · `{{TBD-EMAIL-SUPPLIER}}`

| Field | Type | Required |

|---|---|---|

| Shop name | text | yes |

| City and state | text | yes |

| Contact name | text | yes |

| Email | email | yes |

| Phone | tel | no |

| What your equipment runs well | textarea | yes |

| Approximate weekly capacity | text | no |

| Specs you build | textarea | no |

| Typical lead time | text | no |

| Heat treat on site | select — Yes / No / Not sure | no |

Submit label: `Send it over` · Success: *"Thanks. Larry handles supplier relationships and will follow up."*

> The heat-treat field is deliberate: it is how AGL finds out whether ISPM-15 is genuinely available through the network. This is an open question in brand canon. **Do not surface aggregate answers as a public capability claim** — it is internal intelligence only.

### 5.3 · `#carrier-form` → Brandon (Logistics) · `{{TBD-EMAIL-CARRIER}}`

| Field | Type | Required |

|---|---|---|

| Carrier name | text | yes |

| MC number | text | yes |

| DOT number | text | yes |

| Contact name | text | yes |

| Email | email | yes |

| Phone | tel | yes |

| Equipment type | select — Dry van / Flatbed / Both / Other | yes |

| Lanes you run | textarea | yes |

| Number of trucks | number | no |

| Certificate of insurance | file upload, PDF/JPG/PNG, max 10MB | no |

Submit label: `Get set up` · Success: *"Thanks. Brandon books our freight and will be in touch."*

### 5.4 · `#general-form` → `sales@aglpallet.com`

Name · Company · Email · Phone · Message. All required except phone.

Submit label: `Send` · Success: *"Thanks — we'll get back to you."*

---

## 6 · Removals from the current site

Apply these regardless of which new pages ship. Several are live compliance problems.

| Item | Location | Action |

|---|---|---|

| "99% On-Time Delivery" | homepage stat band | Delete. No source, period, or sample; company founded Jan 2026. |

| "12+ Years Industry Experience" | homepage stat band | Delete from company context. May only reappear attributed to Brock in his bio. |

| "Using Pallet Design System (PDS) methodology" | `/products` | Delete. Unconfirmed for AGL. |

| "Every pallet is produced under strict quality controls" | `/products` | Replace per 4.8. |

| "AGL designs pallets…" / "we develop pallet specifications" | `/products` | Replace per 4.8. |

| Duplicated Plastics paragraph | `/about` "Build a More Reliable Supply Plan" block | Page is replaced; do not carry over. |

| Mismatched eyebrows "WHO AGL SERVES" / "HOW IT WORKS" | `/about` | Page is replaced; do not carry over. |

| "This is Bahlr website." | footer, all pages | Delete. |

| Empty "Follow Us" heading | footer | Remove unless `{{TBD-SOCIAL-URLS}}` resolves. |

**Media library sweep.** Audit every image for Mavin or WRL origin. Mavin retained that IP; reuse is legal exposure, not a style issue. Flag anything uncertain rather than shipping it.

---

## 7 · Build order

| Phase | Scope | Blocked by |

|---|---|---|

| 1 | Section 6 removals, applied to the live site | nothing |

| 2 | `/partners`, `/partners/suppliers`, `/partners/carriers`, `/contact`, all four forms and routing | carrier copy only — build structure now |

| 3 | `/`, `/who-we-are` | Brock session: founder story, values, photo |

| 4 | `/custom-engineered`, `/products`, `/industries`, `/how-we-work` | pharma answer for `/industries` only |

| 5 | `/resources` — evergreen education | not specced here |

Phase 5 is out of scope for this spec. When it comes: start with why the 48×40 footprint exists, how to read an ISPM-15 mark, and the three load ratings. It is the organic-search engine and it gives the social content a destination.

---

## 8 · Open tokens

Every `{{TBD-*}}` in this document. Render them as visible placeholders in the demo build. **Never** replace one with invented content.

| Token | Needs | From |

|---|---|---|

| `{{TBD-CARRIER-LANES}}` | Which lanes actually run, and how often | Brock + Brandon |

| `{{TBD-CARRIER-EQUIPMENT}}` | Flatbed, dry van, or both; special handling | Brock + Brandon |

| `{{TBD-CARRIER-TERMS}}` | Payment terms; whether quick-pay exists | Brock + Brandon |

| `{{TBD-CARRIER-INSURANCE}}` | Insurance minimums and setup requirements | Brock + Brandon |

| `{{TBD-FOUNDER-STORY}}` | Brock's markup and real specifics | Brock |

| `{{TBD-FAITH-PLACEMENT}}` | Anchor section on `/` vs. `/who-we-are` thread | Brock |

| `{{TBD-VALUES}}` | Final four or five of the ten official values | Brock |

| `{{TBD-TEAM-LIST}}` | Who is listed, last names, headshots | Brock |

| `{{TBD-PHARMA}}` | Is pharmaceutical a real target segment | Brock |

| `{{TBD-ADDRESS}}` | North Canton street address for footer, contact, JSON-LD | Brock |

| `{{TBD-PHOTO-BROCK}}` | Founder portrait. Must be new — no Mavin/WRL imagery | Nautis + Brock |

| `{{TBD-EMAIL-SUPPLIER}}` | Destination address for the supplier form | Jeff / Brock |

| `{{TBD-EMAIL-CARRIER}}` | Destination address for the carrier form | Jeff / Brock |

| `{{TBD-SOCIAL-URLS}}` | LinkedIn and Facebook page URLs, once confirmed live | Nautis |

---

## 9 · Acceptance checklist

Run before calling the build done.

**Compliance**

- [ ] No instance of make / produce / build / manufacture / our mill / our plant describing AGL

- [ ] No warehousing, storage, inventory, or VMI language anywhere including meta and alt text

- [ ] No certification claims and no badge images

- [ ] No PDS or Pallet Design System reference

- [ ] No recycled or reconditioned pallet offer

- [ ] No customer, supplier, or competitor names or logos

- [ ] No numbers absent from this document

- [ ] No "national" or "nationwide"; footprint reads MI, IL, IN, PA, OH, WV

- [ ] No banned words from section 0

- [ ] No Mavin or WRL imagery; no "acquisition" framing

- [ ] String "This is Bahlr website." does not appear

**Function**

- [ ] All four forms submit and route to distinct destinations

- [ ] Every form carries a hidden `source` field

- [ ] Every form fires an autoresponder

- [ ] All three redirects return 301

- [ ] Three hero buttons present on `/` and stacked, not collapsed, at 375px

- [ ] Every `{{TBD-*}}` renders as a visible placeholder, none silently filled

**Quality**

- [ ] No horizontal scroll at 375px

- [ ] Both light and dark rendering legible if the build supports themes

- [ ] Every image has descriptive alt text

- [ ] Visible keyboard focus states throughout

- [ ] Title tag and meta description set per section 3 on all twelve routes

- [ ] `#162619` is the only green in the build

---

## 10 · Sources

Brand canon and claim registry: `knowledge/01-brand-canon.md`, `knowledge/02-approved-facts.md`, `knowledge/03-content-voice.md`, `knowledge/05-audience-brief.md`, `knowledge/07-website-audit.md`. Strategy: AGL 10-Year Sales, Marketing & Growth Plan (Nautis Edition) 6 Jul 2026; AGL ICP & Buyer Personas v3, 10 Jul 2026. Live crawl of aglpallet.com, 13 Sep 2026.

All copy in section 4 is a draft for approval. Nothing here is cleared for public launch until Brock signs off on the exact wording.
