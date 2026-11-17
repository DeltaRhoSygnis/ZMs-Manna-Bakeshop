#!/usr/bin/env bash
# Starts the OpenCode web server on port 4096 for GitHub Codespaces.
# Idempotent: safe to run from postStartCommand on every container start.
set -euo pipefail

PORT="${OPENCODE_PORT:-4096}"
CONFIG_HOME="${HOME}/.config/opencode"
STATE_HOME="${HOME}/.local/share/opencode"
PASS_FILE="${CONFIG_HOME}/.server-password"
PID_FILE="${STATE_HOME}/serve.pid"
LOG_FILE="${STATE_HOME}/serve.log"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export PATH="${HOME}/.opencode/bin:${PATH}"
mkdir -p "$CONFIG_HOME" "$STATE_HOME" "${HOME}/.cache/opencode"

if [ -n "${OPENCODE_PASSWORD:-}" ]; then
  password="$OPENCODE_PASSWORD"
elif [ -s "$PASS_FILE" ]; then
  password="$(cat "$PASS_FILE")"
else
  password="$(openssl rand -hex 16 2>/dev/null || date +%s%N | sha256sum | cut -c1-32)"
  printf '%s' "$password" > "$PASS_FILE"
  chmod 600 "$PASS_FILE"
fi

if [ -f "$PID_FILE" ]; then
  kill "$(cat "$PID_FILE")" 2>/dev/null || true
  rm -f "$PID_FILE"
fi
if command -v pkill >/dev/null 2>&1; then
  pkill -f "opencode serve --hostname 0.0.0.0 --port ${PORT}" 2>/dev/null || true
fi

cd "$REPO_ROOT"
OPENCODE_PASSWORD="$password" nohup opencode serve \
  --hostname 0.0.0.0 \
  --port "$PORT" \
  >>"$LOG_FILE" 2>&1 &
echo $! > "$PID_FILE"

healthy=0
for _ in $(seq 1 60); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:${PORT}/api/info" || true)"
  if [ "$code" = "200" ] || [ "$code" = "401" ]; then
    healthy=1
    break
  fi
  sleep 1
done

if [ "$healthy" -ne 1 ]; then
  echo "OpenCode server did not become healthy on port ${PORT}."
  tail -n 40 "$LOG_FILE" || true
  exit 1
fi

echo "OpenCode server is listening on port ${PORT}."
echo "  username: opencode"
echo "  password: ${password}   (saved in ${PASS_FILE}; also available as: oc-password)"
echo "  logs:     ${LOG_FILE}"

bash "$(dirname "${BASH_SOURCE[0]}")/pair-opencode.sh" || true
