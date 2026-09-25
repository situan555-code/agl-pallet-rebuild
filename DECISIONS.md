# DECISIONS (redesign)

Owner decisions D1–D6 in docs/01-TECHNICAL-AUDIT.md §8 are approved (2026-09-25) and override older BRIEF.md / PROJECT.md design and form-service rules where they conflict.

## R0.1 / R0.2 (2026-09-25)

- Replaced root `.cursorrules` with the redesign rules (Palette 05, D1–D6).
- Archived pre-redesign process logs and artifacts to `archive/` (see that folder; do not read unless asked).
- Deleted root `assets/` after confirming every file also exists in `public/assets/`.
- Moved `run.sh`, `fix-home-height.sh`, `restart-home.sh`, `scaffold-gates.sh` to `scripts/harness/`. No `package.json` or `scripts/` path references needed updating.
- Copied `docs/01-TECHNICAL-AUDIT.md` and `docs/02-IMPLEMENTATION-PLAN.md` into the repo so rules files can reference them in-tree.
