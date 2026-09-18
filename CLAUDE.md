# AGL Pallet Rebuild

Rebuild of aglpallet.com (WordPress/Divi → Next.js). Demo: nx7k-lab-m4.vercel.app.
Authority: PROJECT.md + BRIEF.md + SPEC_V1.md + .cursorrules. Read PROJECT.md
before large changes.

## Stack
Next.js 14 App Router + TypeScript + Tailwind 3.4. Content in /content JSON,
never hardcoded in components. next/image (WebP-only). Package name nx7k-lab-m4.
trailingSlash: true — link with trailing slashes.

## Hard rules
- Never modify live WordPress/DNS. Never soften verify gates without written
  human instruction. LCP gate is 2.5s (not 1.5s).
- Copy verbatim from SPEC_V1.md. AGL is a brokerage, never a manufacturer.
- One green #162619; grounds paper/green/mint per PROJECT.md. Cards only for
  clickable choices.
- Log deviations → DECISIONS.md; blocks → BLOCKED.md; durable state → PROGRESS.md.
- Driver discipline: one of Cursor / Claude Code at a time on this tree.

## Definition of done
npm run verify exits zero (structure/content, height ±15%, CLS <0.05,
LCP <2.5s, mobile LH Perf ≥95, zero serious/critical axe, zero broken links).
