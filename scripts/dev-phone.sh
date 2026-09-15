#!/usr/bin/env bash
# Start this environment so a physical phone can load it in Expo Go.
# Cursor port-forward only reaches your laptop's localhost — the phone needs
# public tunnels for Metro (Expo --tunnel) and the Next.js API (cloudflared).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="${NVM_DIR:-$HOME/.nvm}/versions/node/$(cat .nvmrc)/bin:$HOME/.nvm/versions/node/$(cat .nvmrc)/bin:$PATH"

if [ ! -f .env ]; then
  cp .env.example .env
fi

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "Installing cloudflared…"
  curl -fsSL -o /tmp/cloudflared \
    https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
  chmod +x /tmp/cloudflared
  if mkdir -p "$HOME/.local/bin" 2>/dev/null; then
    mv /tmp/cloudflared "$HOME/.local/bin/cloudflared"
    export PATH="$HOME/.local/bin:$PATH"
  else
    export PATH="/tmp:$PATH"
  fi
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  pnpm db:up
else
  echo "Docker is not available — using POSTGRES_URL from .env as-is."
fi

echo "Starting Next.js API on 0.0.0.0:3000…"
pnpm --filter @discipline/nextjs dev > /tmp/discipline-next.log 2>&1 &
NEXT_PID=$!
trap 'kill "$NEXT_PID" "$CF_PID" 2>/dev/null || true' EXIT

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

echo "Opening a public tunnel to the API…"
cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000 \
  > /tmp/discipline-api-tunnel.log 2>&1 &
CF_PID=$!

API_URL=""
for _ in $(seq 1 40); do
  API_URL="$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/discipline-api-tunnel.log | head -n 1 || true)"
  if [ -n "$API_URL" ]; then
    break
  fi
  sleep 1
done

if [ -z "$API_URL" ]; then
  echo "Could not get a Cloudflare quick tunnel URL. Log:"
  tail -n 40 /tmp/discipline-api-tunnel.log
  exit 1
fi

echo
echo "API tunnel: $API_URL"
echo "Scan the Expo QR with Expo Go. Each environment gets its own tunnels."
echo

export EXPO_PUBLIC_API_URL="$API_URL"
export CI=1
exec pnpm --filter @discipline/expo exec expo start --go --tunnel --port 8081 --non-interactive
