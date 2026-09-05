#!/usr/bin/env bash
# SessionStart hook. Prints the always-on block of the unslop skill so every
# reply and artifact in the session follows the house writing style.
set -euo pipefail

root="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
skill="${UNSLOP_SKILL:-$root/skills/unslop/SKILL.md}"
[ -r "$skill" ] || exit 0

cat <<PREAMBLE
House writing style, from the snotor-commands unslop skill. Apply it to every
reply, commit message, pull request description, ticket, code comment, and
document you write in this session. Pick the register first, then apply the
rules. For an explicit edit pass over existing text the user runs
/snotor-commands:unslop, which adds the editing process from the full skill
file at $skill.

PREAMBLE

awk '/<!-- always-on:start -->/{f=1;next} /<!-- always-on:end -->/{f=0} f' "$skill"
