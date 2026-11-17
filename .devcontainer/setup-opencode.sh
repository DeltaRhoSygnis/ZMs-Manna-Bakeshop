#!/usr/bin/env bash
# Runs once per container create/recreate. Re-syncs the OpenCode config from
# the repository copy so edits under ./opencode do not require an image rebuild.
set -euo pipefail

CONFIG_HOME="${HOME}/.config/opencode"
HOME_OPENCODE="${HOME}/.opencode"
STATE_HOME="${HOME}/.local/share/opencode"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$CONFIG_HOME" "$HOME_OPENCODE" "$STATE_HOME" \
         "${HOME}/.cache/opencode" "${HOME}/.local/state/opencode"

if [ -d "$REPO_ROOT/opencode/config" ]; then
  cp -a "$REPO_ROOT/opencode/config/." "$CONFIG_HOME/"
fi

if [ -d "$REPO_ROOT/opencode/home" ]; then
  cp -a "$REPO_ROOT/opencode/home/." "$HOME_OPENCODE/"
fi

# The repository copy is path-independent, but keep this guard so a config
# exported from a laptop with an absolute skills path still works.
if [ -f "$CONFIG_HOME/opencode.json" ]; then
  sed -i "s#/home/anonymous/.config/opencode#${CONFIG_HOME}#g" "$CONFIG_HOME/opencode.json"
fi

rm -f "$CONFIG_HOME/service.json"
chmod 600 "$CONFIG_HOME/opencode.json" "$CONFIG_HOME/cli.json" 2>/dev/null || true

echo "OpenCode config synced to ${CONFIG_HOME} (no database, no service secret)."
