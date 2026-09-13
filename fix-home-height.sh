#!/usr/bin/env bash
set -uo pipefail
cd ~/agl-rebuild
exec > >(tee -a run.log) 2>&1
echo "=== HOME HEIGHT FIX $(date) ==="
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

ask sonnet "Read BRIEF.md (updated harness gates + Sections C/D), DECISIONS.md, DIFFS.md, PROGRESS.md.
ONE TURN ONLY — fix HOME page HEIGHT DRIFT. Do not start an 8-attempt repair loop.

Measured heights (built vs reference):
- home-390: 0.59% (OK under 2%)
- home-768: 8.36% FAIL (built 7177 vs ref 6623)
- home-1440: 7.17% FAIL (built 4985 vs ref 5370)

Operator diagnosis: Anton heading wrap + spacing is shifting total page height; full-page pixel % is mostly vertical misalignment noise once height drifts. New harness hard gates (already in scripts/diff.js): height Δ ≤2%, above-fold first 1000px ≤5%. Full-page ≤12% is advisory only.

Your job:
1) Adjust HOME (and shared header/hero only if needed) so built screenshot heights match reference within 2% at 768 and 1440 — tighten vertical rhythm/wrap, don't invent content, keep Anton.
2) npm run build, start server the harness way, npm run screenshot, npm run diff.
3) Report for / only: heightΔ, above-fold%, full% at 390/768/1440 from diff-report.json.
4) Append PROGRESS.md. Do not touch other routes. Do not revert harness gates. Do not chase full-page 2%.

Stop after one measured pass."

echo "=== HOME HEIGHT FIX DONE $(date) ==="
