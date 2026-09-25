#!/usr/bin/env bash
set -uo pipefail
cd ~/agl-rebuild
exec > >(tee -a run.log) 2>&1
echo "=== SCAFFOLD STRUCTURE/CONTENT $(date) ==="
export ANTHROPIC_DEFAULT_HAIKU_MODEL=claude-haiku-4-5-20251001
export CLAUDE_CODE_SUBAGENT_MODEL=sonnet

claude -p "Read BRIEF.md Section E. Add two npm scripts (real implementations, replace stubs):

structure — parse each built page and its capture/*.html counterpart into
an ordered list of section landmarks (h1-h3 text, nav/main/footer, image
count per section). Compare sequences. Fail on a missing or duplicated
landmark. Write structure-report.json. For the built site, start next and
fetch HTML from localhost (same pattern as screenshot/audit harness) OR
parse the React server render / use Playwright — pick the reliable approach
already used in this repo. Capture HTML is in /capture.

content — extract visible text from built and captured page, normalize
whitespace, and assert every captured text block appears in the built
page. Prefer capture/*.txt if present; otherwise derive text from
capture/*.html. Fail on missing blocks. Ignore ordering within a section
and ignore extra whitespace. Write content-report.json.
Also ensure capture text fixtures exist (generate capture/*.txt from capture HTML if missing).

Do not modify diff.js except to confirm its exit code is always 0.
Confirm package.json has structure and content scripts.
Run both scripts once and show whether they pass/fail (failures OK — we need working detectors).
Append PROGRESS.md and log any judgments in DECISIONS.md.
Obey Section E / Resend rules. ONE TURN." \
  --model sonnet \
  --permission-mode acceptEdits \
  --output-format json | jq -r '.result, .total_cost_usd' | tee -a cost.log

echo "=== SCAFFOLD DONE $(date) ==="
