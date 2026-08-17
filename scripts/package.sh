#!/usr/bin/env bash
# Builds distributable archives into build/ (git-ignored).
# Run this only when someone needs a file-upload install; the marketplace
# itself serves the plugin straight from this repository, no build required.
set -euo pipefail
cd "$(dirname "$0")/.."
PLUGIN=plugins/snotor-commands
OUT=build
rm -rf "$OUT"
mkdir -p "$OUT/claude-ai-skills"

# One package for Cowork's plugin file-upload option.
(cd "$PLUGIN" && zip -qr "../../$OUT/snotor-commands-plugin.zip" .)

# One archive per skill for claude.ai chat, which cannot use plugins.
# argument-hint is stripped because the skill upload rejects that field.
# disable-model-invocation is stripped because chat has no slash commands, so a
# skill carrying it could never be invoked there at all.
tmp=$(mktemp -d)
strip='/^argument-hint:/d'
strip2='/^disable-model-invocation:/d'
for dir in "$PLUGIN"/skills/*/; do
  name=$(basename "$dir")
  mkdir -p "$tmp/$name"
  cp -R "$dir." "$tmp/$name/"
  sed -i '' -e "$strip" -e "$strip2" "$tmp/$name/SKILL.md" 2>/dev/null || sed -i -e "$strip" -e "$strip2" "$tmp/$name/SKILL.md"
  (cd "$tmp" && zip -qr "$OLDPWD/$OUT/claude-ai-skills/$name.zip" "$name")
done
rm -rf "$tmp"

echo "Built into $OUT:"
find "$OUT" -type f | sort
