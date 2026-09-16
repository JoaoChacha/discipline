#!/usr/bin/env bash
# Start this environment so a physical phone can load it in Expo Go.
# Cursor port-forward only reaches your laptop's localhost — the phone needs
# public tunnels for Metro and the Next.js API.
#
# Metro uses Expo's official --tunnel (*.exp.direct). Expo Go on iOS verifies
# the packager hostname and rejects trycloudflare.com with
# "Hostname could not be verified".
# The tRPC API stays on a Cloudflare quick tunnel (EXPO_PUBLIC_API_URL).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="${NVM_DIR:-$HOME/.nvm}/versions/node/$(cat .nvmrc)/bin:${HOME}/.nvm/versions/node/$(cat .nvmrc)/bin:${HOME}/.local/bin:${PATH}"

if [ ! -f .env ]; then
  cp .env.example .env
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "Installing cloudflared…"
  curl -fsSL -o /tmp/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x /tmp/cloudflared
  mkdir -p "$HOME/.local/bin"
  mv /tmp/cloudflared "$HOME/.local/bin/cloudflared"
  export PATH="$HOME/.local/bin:$PATH"
fi

if [ -f /tmp/expo-token ]; then
  EXPO_TOKEN="$(tr -d '[:space:]' </tmp/expo-token)"
  export EXPO_TOKEN
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  pnpm db:up
else
  echo "Docker is not available — using POSTGRES_URL from .env as-is."
fi

if curl -sf "http://127.0.0.1:3000" >/dev/null 2>&1; then
  echo "Next.js already running on :3000"
else
  echo "Starting Next.js API on 0.0.0.0:3000…"
  pnpm --filter @discipline/nextjs dev >/tmp/discipline-next.log 2>&1 &
  NEXT_PID=$!
  disown "$NEXT_PID" 2>/dev/null || true

  for _ in $(seq 1 60); do
    if curl -sf "http://127.0.0.1:3000" >/dev/null 2>&1; then
      break
    fi
    if ! kill -0 "$NEXT_PID" 2>/dev/null; then
      echo "Next.js exited. Last log lines:"
      tail -n 40 /tmp/discipline-next.log
      exit 1
    fi
    sleep 1
  done
fi

cf_url_from_log() {
  grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' "$1" 2>/dev/null | head -n 1 || true
}

start_cf_tunnel() {
  local port="$1"
  local log="$2"
  : >"$log"
  cloudflared tunnel --no-autoupdate --url "http://127.0.0.1:${port}" \
    >"$log" 2>&1 &
  disown $! 2>/dev/null || true

  local url=""
  for _ in $(seq 1 40); do
    url="$(cf_url_from_log "$log")"
    if [ -n "$url" ]; then
      printf '%s\n' "$url"
      return 0
    fi
    sleep 1
  done
  return 1
}

API_URL="$(cf_url_from_log /tmp/discipline-api-tunnel.log)"
if [ -z "$API_URL" ]; then
  echo "Opening a public tunnel to the API…"
  API_URL="$(start_cf_tunnel 3000 /tmp/discipline-api-tunnel.log || true)"
fi

if [ -z "$API_URL" ]; then
  echo "Could not get a Cloudflare quick tunnel URL for the API. Log:"
  tail -n 40 /tmp/discipline-api-tunnel.log
  exit 1
fi

printf '%s\n' "$API_URL" >/tmp/discipline-api-url.txt
echo
echo "API tunnel: $API_URL"

# Expo Go trusts *.exp.direct from --tunnel. A Cloudflare Metro host is rejected.
unset EXPO_PACKAGER_PROXY_URL
unset CI
export EXPO_PUBLIC_API_URL="$API_URL"

echo
echo "Scan the Expo QR with Expo Go (SDK 57). Metro is served on *.exp.direct."
echo "It only works while this environment is running."
echo

pnpm --filter @discipline/expo exec expo start --go --tunnel --port 8081
