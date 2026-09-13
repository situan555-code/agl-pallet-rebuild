#!/usr/bin/env bash
set -uo pipefail
cd ~/agl-rebuild
exec > >(tee -a run.log) 2>&1
echo "=== RUN START $(date) ==="

export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5-20251001
export CLAUDE_CODE_SUBAGENT_MODEL=sonnet

ask () {
  local model="$1"; shift
  claude-auth -p "$1" \
    --model "$model" \
    --permission-mode acceptEdits \
    --output-format json | jq -r '.result, .total_cost_usd' \
    | tee -a cost.log
}

check () {
  case "$1" in
    0) [[ -f CLAUDE.md && -f PROGRESS.md && -f package.json ]] ;;
    1) [[ -f pages.json ]] \
       && [[ $(jq 'length' pages.json) -ge 3 ]] \
       && [[ $(ls reference/*.png 2>/dev/null | wc -l) -ge 3 ]] \
       && [[ -f raw-tokens.json && -f behavior.md ]] ;;
    2) [[ -f SPEC.md && $(wc -l < SPEC.md) -ge 80 ]] ;;
    h) grep -q '"diff"' package.json && grep -q '"audit"' package.json \
       && grep -q '"structure"' package.json && grep -q '"content"' package.json \
       && grep -q '"height"' package.json \
       && ! grep -q 'not implemented yet' scripts/structure.js \
       && ! grep -q 'not implemented yet' scripts/content.js ;;
    3) npm run build ;;
    5) [[ -f DEPLOY.md ]] && grep -qi "http" DEPLOY.md ;;
  esac
}

page_built () {
  local path="$1"
  if [[ "$path" == "/" ]]; then
    [[ -f app/page.tsx ]]
  else
    local slug="${path#/}"; slug="${slug%/}"
    [[ -f "app/${slug}/page.tsx" ]]
  fi
}

phase () {
  local n="$1" model="$2" prompt="$3"
  if check "$n"; then
    echo "phase $n already satisfied — skipping Claude turn"
    return 0
  fi
  for attempt in 1 2 3; do
    local m="$model"
    if [[ "$n" == "0" && "$model" == "haiku" && "$attempt" -ge 3 ]]; then
      m="sonnet"
    fi
    echo "--- phase $n attempt $attempt [$m] ---"
    ask "$m" "$prompt"
    if check "$n"; then echo "phase $n ok"; return 0; fi
    echo "phase $n check failed"
  done
  echo "PHASE $n FAILED THREE TIMES $(date)" >> BLOCKED.md
  exit 1
}

verify () {
  for i in $(seq 1 3); do
    npm run build && npm run structure && npm run content \
      && npm run height && npm run audit && { npm run diff || true; return 0; }
    echo "--- repair attempt $i [sonnet] ---"
    ask sonnet "Read BRIEF.md Section E, DIFFS.md (accepted gaps), structure-report.json, content-report.json and
      audit-report.json. Fix the failures. Per Section E, ignore
      diff-report.json entirely — pixel deltas are advisory.
      Do NOT chase /products/ Crates & Dunnage or Shipping Blocks missing side images (DIFFS accepted).
      On /about/ and /industries-served/, duplicated card copy is real on the live site — do not treat a known duplicate as missing content.
      Prefer structure/content/height/audit fixes; refined/airy layout OK."
  done
  echo "hard gates unmet after 3 attempts $(date)" >> BLOCKED.md
  return 1
}

phase 0 haiku  "Read BRIEF.md in full, including Sections C, D and E. Execute
  Phase 0. Append a summary to PROGRESS.md."
phase 1 sonnet "Read BRIEF.md and PROGRESS.md. Execute Phase 1 completely.
  Append a summary to PROGRESS.md."
phase 2 opus   "Read BRIEF.md and PROGRESS.md. Execute Phase 2. Write SPEC.md.
  Write no application code."
phase h sonnet "Read BRIEF.md Section E and SPEC.md. Implement harness scripts
  for structure, content, height, audit; keep diff advisory-only (exit 0)."
phase 3 sonnet "Read BRIEF.md Sections C–E, SPEC.md and PROGRESS.md. Execute
  Phase 3 steps 1–3 only: tokens, base layout, home page."

if page_built "/"; then
  echo "home already built — verifying under Section E gates"
fi
verify || echo "home page unresolved, continuing per Section C"

TOTAL=$(jq 'length' pages.json)
for idx in $(seq 1 $((TOTAL-1))); do
  URL=$(jq -r ".[$idx].path" pages.json)
  if page_built "$URL"; then
    echo "=== verifying existing $URL ($idx of $((TOTAL-1))) [sonnet gates] ==="
  else
    echo "=== building $URL ($idx of $((TOTAL-1))) [sonnet] ==="
    ask sonnet "Read BRIEF.md (Sections C–E), SPEC.md and PROGRESS.md. Build ONLY the page at $URL. Then stop."
  fi
  verify || echo "$URL unresolved after 3 hard-gate attempts" >> DIFFS.md
done

verify || true

phase 5 sonnet "Read BRIEF.md (Sections C–E). Execute Phase 5. Push to GitHub, deploy to Vercel
  production, do NOT touch DNS. Write DEPLOY.md with the production URL and
  the before/after performance table."

echo "=== RUN COMPLETE $(date) ==="
echo "--- DEPLOY.md ---";   cat DEPLOY.md   2>/dev/null
echo "--- BLOCKED.md ---";  cat BLOCKED.md  2>/dev/null
echo "--- DIFFS.md ---";    cat DIFFS.md    2>/dev/null
echo "--- DECISIONS.md ---";cat DECISIONS.md 2>/dev/null
echo "--- VISUAL.md ---";   cat VISUAL.md   2>/dev/null
echo "--- cost.log (tail) ---"; tail -n 40 cost.log 2>/dev/null
