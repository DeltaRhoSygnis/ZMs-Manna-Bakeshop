#!/usr/bin/env bash
# Prints a fresh one-time OpenCode pairing link for the forwarded Codespaces
# port. Pairing links are single use and expire after five minutes, which is
# why this runs again on every terminal attach.
set -euo pipefail

PORT="${OPENCODE_PORT:-4096}"
CONFIG_HOME="${HOME}/.config/opencode"
PAIR_FILE="${CONFIG_HOME}/pair-url.txt"

export PATH="${HOME}/.opencode/bin:${PATH}"
mkdir -p "$CONFIG_HOME"

code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/api/info" || true)"
case "$code" in
  200|401) ;;
  *)
    echo "OpenCode is not running on port ${PORT} yet. Start it with: bash .devcontainer/start-opencode.sh"
    exit 0
    ;;
esac

if [ -n "${CODESPACE_NAME:-}" ] && [ -n "${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN:-}" ]; then
  public_url="https://${CODESPACE_NAME}-${PORT}.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
else
  public_url="http://localhost:${PORT}"
fi

pair_output="$(opencode pair --url "$public_url" 2>&1 || true)"
pair_url="$(printf '%s\n' "$pair_output" | grep -Eo 'https?://[^[:space:]]+' | head -n 1 || true)"

if [ -n "$pair_url" ]; then
  printf '%s\n' "$pair_url" > "$PAIR_FILE"
  chmod 600 "$PAIR_FILE"
  echo "OpenCode pairing link (single use, expires in 5 minutes):"
  echo "  ${pair_url}"
  echo "Password login: username opencode, password: $(oc-password 2>/dev/null || true)"
else
  echo "Could not create a pairing link. Open port ${PORT} from the Ports tab and use the password login."
  echo "Password: $(oc-password 2>/dev/null || true)"
fi
