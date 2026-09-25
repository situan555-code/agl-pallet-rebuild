AGL Pallet Rebuild — Review Findings

Reviewer: Spec author (direct site review against SPEC_V1.md / SPEC_V2_1.md)
Status: documentation only — no fixes actioned yet

Fix before anyone sees it

1. /products is publishing spec build-notes as customer copy

Five confirmed instances of internal authoring annotations leaking into live page copy:

# Location Leaked text What it actually was 1 Custom & engineered card, end "Links to /custom-engineered." Internal cross-reference note 2 Dunnage card, end "New standalone line — currently bundled with crates." Build-status note 3 Stakes card, start "New line — missing from the live site entirely." Build-status note 4–6 Page bottom, three orphan sentences "Every shop we source from is qualified…", "We spec the pallet to your load…", "we write the spec with you" The replacement column of a before/after producer-voice table — pulled in as page copy, not rendered as a table

Root cause: the page was built against SPEC_V1.md, which mixed authoring annotations directly into copy blocks. SPEC_V2_1.md has all of these stripped. A rebuild of /products from the current spec file resolves all five instances.

2. /faq is a 404

Added in spec v1.1, never built — the live build is still running off v1.0's route list. This page carries the questions buyers actually open with: two-way vs four-way pallets, lead times, minimums, second-source availability.

3. Hero photo provenance — open question

/assets/home_header_image.jpg — origin unconfirmed at time of writing. If it's stock or shot for AGL, no issue. If it was carried over from the old site, it's Mavin/WRL and that's a legal exposure question, not a style one. Flagged as the one item on this list worth an answer today.

Worth fixing

/custom-engineered nav visibility. Page content is correct and complete, but it's currently reachable only via a Products page anchor — not in primary nav. This is the highest-margin work in the book, buried two clicks deep.

Home hero contrast. Headline holds up against the photo; the lede loses legibility against the pallet stacks behind it. Needs a darker scrim behind the lede.

What landed well

/partners/carriers exceeds spec. The "still being confirmed" block, the visible TBD tokens, and the honest note that the form has no live destination yet with a phone-call fallback — none of that was requested, and it's the right call.

Faith section on /who-we-are reads correctly. Not preachy; "we won't ask you to care about it" is doing the work as intended.

Mobile is clean: hamburger menu, stacked hero buttons, readable at 375px.

Producer voice is correct site-wide except for the five leaked strings above — no PDS references, no 99% or 12+ years claims. /the-pledge correctly has no CTA. Team page correctly lists names.
