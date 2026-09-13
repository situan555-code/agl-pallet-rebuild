# AGL Pallet Rebuild

Rebuilding aglpallet.com (currently Squarespace) as a visually identical,
faster Next.js site. Full spec: see BRIEF.md — read it before any phase.

## Stack
Next.js (App Router) + TypeScript + Tailwind. Content in /content (JSON/MDX),
never hardcoded in components. next/image for all imagery. Playwright for
capture and verification. GitHub + Vercel for deploy. Minimal deps.

## Hard rules
- Never modify the live Squarespace site or DNS.
- Never lower a test threshold, edit reference images, or modify test config
  to make something pass. Log unresolved diffs in DIFFS.md instead.
- Never fabricate captured content; flag gaps with inline HTML comments.
- Preserve copy and URL paths exactly. Rebuild behavior, never copy
  Squarespace's JS/CSS/class names.
- Pre-authorized decisions: BRIEF.md Section C. Apply without asking, log
  each to DECISIONS.md. Unattended run: log to PROGRESS.md/BLOCKED.md and
  keep going.

## Definition of done
All four npm scripts (build, screenshot, diff, audit) exit zero: diff <2%
per page, mobile Lighthouse Performance ≥95, LCP <1.5s, CLS <0.05, no 404s,
no serious/critical axe violations.
