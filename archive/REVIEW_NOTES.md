EXECUTE THIS. Operator, not engineer. Working dir ~/agl-rebuild.

The owner's spec author reviewed the SPEC_V1 build directly and found real
defects plus one open question. Save the notes below verbatim as
REVIEW_NOTES.md, then append Section I to BRIEF.md and run in order.
Sonnet throughout, except the photo question which halts for a reply.

════════════════════════════════════════════════════════════════
APPEND TO BRIEF.md — SECTION I
════════════════════════════════════════════════════════════════

## SECTION I — SPEC V1 REVIEW FIXES

The build was done against SPEC_V1.md. A v2.1 revision now exists with the
build-note annotations stripped from the copy. This section corrects
defects found in direct review, and requires one answer before continuing.

### I0 — HALT: PHOTO PROVENANCE (answer before touching anything)

Determine where /assets/home_header_image.jpg came from: shot new for AGL,
licensed stock, or carried over from the WordPress capture. Check
assets-manifest.json against the original capture's image list. Report
findings to PROGRESS.md and STOP. This is a real legal-exposure question
(Mavin/WRL rule, Section 0 rule 9) — do not guess, do not proceed past
this item, and do not attempt to source a replacement photo yourself if
the answer is bad. That decision belongs to the owner.

### I1 — BUILD-NOTE LEAK ON /products (blocks launch)

/products is currently rendering spec authoring notes as customer-facing
copy. Five confirmed instances:

  1. Custom & engineered card ends with the sentence "Links to
     /custom-engineered." — an internal cross-reference note, not copy.

  2. Dunnage card ends with "New standalone line — currently bundled with
     crates." — a build-status note.

  3. Stakes card opens with "New line — missing from the live site
     entirely." — a build-status note.

  4-6. Three orphan sentences at the page bottom ("Every shop we source
     from is qualified…", "We spec the pallet to your load…", "we write
     the spec with you") are the REPLACEMENT column of the section 4.8
     before/after table, pulled in as if they were page copy rather than
     a table cell.

ROOT CAUSE: the page was built against SPEC_V1.md, which mixed authoring
annotations into the copy blocks. SPEC_V2_1.md has these annotations
stripped. Do not manually delete the five strings — rebuild /products
entirely from SPEC_V2_1.md's copy so no other v1-only annotation is
missed. Add a gate: scan every page for the literal strings "Links to",
"New standalone line", "New line — missing", "currently bundled with",
and any sentence fragment appearing in a documented before/after table
in the spec. Fail if found on any route, not just /products.

### I2 — MISSING ROUTE: /faq (blocks launch)

/faq currently 404s. It was added in SPEC_V2_1.md (spec revision v1.1) and
never built — the running build is still on v1.0's route list. Build it
from SPEC_V2_1.md section 4's FAQ content in full: two-way vs four-way,
lead times, minimums, second-source. Add it to routes.js as a required
200. Add it to the nav if SPEC_V2_1.md places it there; otherwise footer
only, per whatever the v2.1 nav section specifies.

Before building /faq, diff SPEC_V1.md against SPEC_V2_1.md in full — do
not assume /faq is the only addition. Report every other delta (new
routes, changed copy, changed nav, changed forms) to PROGRESS.md before
starting page work, so nothing else silently ships stale.

### I3 — /custom-engineered NAV VISIBILITY

Page content is correct and complete. It is currently reachable only via
a Products page anchor, not from primary nav. Per SPEC_V2_1.md's current
nav spec, surface it properly — as its own top-level item or as an entry
in the Products dropdown, whichever the v2.1 nav section specifies. This
is the highest-margin line in the book; it should not be two clicks deep.

### I4 — HOME HERO CONTRAST

Hero body copy (the lede) loses legibility against the pallet-stack
photo; the headline is fine. Add or darken a scrim behind the lede only,
matching the treatment already approved for the About/who-we-are hero
under Section G's authorized-deviation rule. Measure contrast; target
4.5:1 minimum on the lede text.

### I5 — DO NOT TOUCH (confirmed correct in review)

These were flagged as landing well. No changes:

  - /partners/carriers: the "still being confirmed" TBD block, visible
    tokens, and the honest note that the form has no live destination yet
    with a phone fallback. This exceeded spec and is correct as built.

  - Faith section on /who-we-are: tone and restraint are correct as
    built. Do not adjust.

  - Mobile nav, stacked hero buttons, 375px readability: confirmed clean.

  - Producer-voice compliance site-wide, absence of PDS/99%/12+ years,
    no CTA band on /the-pledge, named team on /who-we-are: all confirmed
    correct. Do not add a CTA to /the-pledge under any circumstance —
    this has now been confirmed correct twice.

════════════════════════════════════════════════════════════════
RUN SEQUENCE
════════════════════════════════════════════════════════════════

phase i0 sonnet "Read BRIEF.md Section I. Execute I0 only: investigate
  photo provenance. Change nothing. Report to PROGRESS.md and stop."

→ REPORT I0 FINDINGS TO THE OWNER. Do not continue without a reply.
  If the photo is WordPress-sourced, do not proceed past this point
  until the owner tells you how to handle it.

phase i1 sonnet "Read BRIEF.md Section I and SPEC_V2_1.md. Execute I2's
  diff step first: report every v1-to-v2.1 delta to PROGRESS.md. Then
  execute I1 (rebuild /products clean, add the leak-detection gate) and
  I2 (build /faq). Verify."

phase i3 sonnet "Execute I3 (custom-engineered nav visibility) and I4
  (home hero scrim). Verify."

FINAL REPORT: I0 answer and its resolution, full v1→v2.1 diff, gate
status on all routes including the new leak-detection and /faq checks,
DECISIONS.md deltas, BLOCKED.md contents.
