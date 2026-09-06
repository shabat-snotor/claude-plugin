#!/usr/bin/env bash
set -euo pipefail

root="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
skill="${UNSLOP_SKILL:-$root/skills/unslop/SKILL.md}"
[ -r "$skill" ] || exit 0

block=$(awk '/<!-- always-on:start -->/{f=1;next} /<!-- always-on:end -->/{f=0} f' "$skill")
[ -n "$block" ] || exit 0

context="House writing style, from the snotor-commands unslop skill. Apply it to every
reply, commit message, pull request description, ticket, code comment, and
document you write in this session. Pick the register first, then apply the
rules. For an explicit edit pass over existing text the user runs
/snotor-commands:unslop, which adds the editing process and the rules in full
from $skill.

$block"

filter='{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:.}}'
encoder='import json,os
print(json.dumps({"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":os.environ["UNSLOP_CONTEXT"]}}))'

out=""
if command -v jq >/dev/null 2>&1; then
  out=$(printf '%s' "$context" | jq -Rs "$filter" 2>/dev/null) || out=""
fi
if [ -z "$out" ] && command -v python3 >/dev/null 2>&1; then
  out=$(UNSLOP_CONTEXT="$context" python3 -c "$encoder" 2>/dev/null) || out=""
fi
if [ -n "$out" ]; then
  printf '%s\n' "$out"
else
  printf '%s\n' "$context"
fi
