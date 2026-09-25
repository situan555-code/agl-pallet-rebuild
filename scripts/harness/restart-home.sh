#!/usr/bin/env bash
set -uo pipefail
cd ~/agl-rebuild
exec > >(tee -a run.log) 2>&1
echo "=== HOME RESTART $(date) ==="
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5-20251001
export CLAUDE_CODE_SUBAGENT_MODEL=sonnet

ask () {
  local model="$1"; shift
  claude -p "$1" \
    --model "$model" \
    --permission-mode acceptEdits \
    --output-format json | jq -r '.result, .total_cost_usd' \
    | tee -a cost.log
}

ask sonnet "Read BRIEF.md (Sections C and D), SPEC.md, PROGRESS.md, DECISIONS.md, and the latest operator notes.
CRITICAL: The unattended verify loop was killed because diffs were not converging.
Evidence: diff-report shows dimension mismatches; /products/ is still missing as a real page (404); home screenshot content/structure drifted from reference/home-*.png (not just glyph width).
Heading font has already been switched from Bungee to Anton in lib/fonts.ts and layout — keep Anton.
Your job THIS TURN ONLY:
1) Rebuild the HOME page end-to-end so it visually matches reference/home-390.png, home-768.png, home-1440.png as closely as practical: same section order, copy from capture/content (do not invent), layout rhythm, imagery from /public/assets via assets-manifest.
2) Do not build other routes in this turn except fixing shared Header/Footer if required for home fidelity.
3) Ensure npm run build succeeds.
4) Start the site the same way the harness expects (so screenshots can hit localhost), run npm run screenshot and npm run diff, then report home's three viewport diffPercents from diff-report.json.
5) Append PROGRESS.md. Do not change thresholds, reference images, or test config.
6) Obey Section C Resend rule: if no RESEND_API_KEY, mention once at most — never re-raise.
Stop after home is rebuilt and measured."

echo "=== HOME RESTART DONE $(date) ==="
