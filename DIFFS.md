# DIFFS

## Accepted gaps (do not burn repair attempts)

### /products/ — missing category side images (source)
Confirmed in Phase 1/SPEC: **Crates & Dunnage** and **Shipping Blocks** have
no side images on the live WordPress source (not a capture failure). These
will read as large block diffs forever. Treat as accepted visual gaps —
log only; do not chase with repair attempts.

**Structure gate:** when `structure.js` hard-fails on per-section `imageCount`,
these two categories are accepted gaps — do not burn repairs hunting for
images that were never captured. One-line allowlist / DIFFS entry is enough.
Pixel diffs for the same blocks stay advisory under Section E.

### /about/ + /industries-served/ — duplicated card copy (source)
Live site really duplicates card copy (e.g. “Build a More Reliable Supply
Plan”). Content parity is presence, not uniqueness — do **not** dedupe
capture text blocks before asserting. A “missing” block that is only the
second copy of a known duplicate is a check bug, not a page bug.

### Full-page pixel % with substituted Anton headings
Operator rebaselined harness 2026-09-12: height ≤2% and above-fold ≤5% are
hard gates; full-page ≤12% is advisory. A 2% full-page bar is unreachable
with a replaced display face.

## Open structural (pre-rebaseline measurement)
Home heights vs reference (Pillow): 390 0.59%, **768 8.36%**, **1440 7.17%**.
768/1440 exceed the 2% height gate — fix height drift before trusting pixel %.
/about/ unresolved after 3 hard-gate attempts
/industries-served/ unresolved after 3 hard-gate attempts
/logistics-process/ unresolved after 3 hard-gate attempts
/products/ unresolved after 3 hard-gate attempts
/request-a-quote/ unresolved after 3 hard-gate attempts

**Update, 2026-09-13 (Section E gate 3, ≤15% height, current rule):** the
three named remaining height fails as of this session's `height-report.json`
— `/industries-served/` @1440 (21.538%), `/logistics-process/` @1440
(15.356%), `/request-a-quote/` @768 (21.477%) — are now **resolved**
(2.906% / 2.131% / 0.879% respectively) via spacing/breakpoint fixes to
`CTABand`, `TimelineSection`, `Footer`, `IndustryCardGrid`, and
`ContactInfoStrip`. Full diagnosis and fix detail in PROGRESS.md and
DECISIONS.md, both dated 2026-09-13. All 18 page/viewport height checks
pass as of this update. The above list of pages "unresolved after 3
hard-gate attempts" predates the Section E rebaseline (2% full-page pixel
→ advisory, height gate → 15%) and should not be read as still-open height
failures — pixel-diff status for these pages is untouched by this session
and still advisory-only per Section E.
