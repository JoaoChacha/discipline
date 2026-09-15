#!/usr/bin/env bash
# Start this environment so a physical phone can load it in Expo Go.
# Cursor port-forward only reaches your laptop's localhost — the phone needs
# public tunnels for Metro (Expo --tunnel) and the Next.js API (cloudflared).

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

API_URL="$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/discipline-api-tunnel.log 2>/dev/null | head -n 1 || true)"
if [ -z "$API_URL" ]; then
  echo "Opening a public tunnel to the API…"
  : >/tmp/discipline-api-tunnel.log
  cloudflared tunnel --no-autoupdate --url http://127.0.0.1:3000 \
    >/tmp/discipline-api-tunnel.log 2>&1 &
  disown $! 2>/dev/null || true

  for _ in $(seq 1 40); do
    API_URL="$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' /tmp/discipline-api-tunnel.log | head -n 1 || true)"
    if [ -n "$API_URL" ]; then
      break
    fi
    sleep 1
  done
fi

if [ -z "$API_URL" ]; then
  echo "Could not get a Cloudflare quick tunnel URL. Log:"
  tail -n 40 /tmp/discipline-api-tunnel.log
  exit 1
fi

printf '%s\n' "$API_URL" >/tmp/discipline-api-url.txt

echo
echo "API tunnel: $API_URL"
echo "Scan the Expo QR with Expo Go. Each environment gets its own tunnels."
echo

export EXPO_PUBLIC_API_URL="$API_URL"
export CI=1
pnpm --filter @discipline/expo exec expo start --go --tunnel --port 8081 --non-interactive &
EXPO_PID=$!

EXPO_HOST=""
for _ in $(seq 1 60); do
  EXPO_HOST="$(
    curl -sf http://127.0.0.1:4040/api/tunnels 2>/dev/null \
      | grep -oE '[a-zA-Z0-9.-]+-anonymous-8081\.exp\.direct' \
      | head -n 1 || true
  )"
  if [ -n "$EXPO_HOST" ]; then
    break
  fi
  if ! kill -0 "$EXPO_PID" 2>/dev/null; then
    echo "Expo exited before the tunnel was ready."
    exit 1
  fi
  sleep 1
done

if [ -z "$EXPO_HOST" ]; then
  echo "Expo tunnel started, but the public exp.direct host was not found."
  wait "$EXPO_PID"
  exit 1
fi

EXPO_URL="exp://${EXPO_HOST}:80"
printf '%s\n' "$EXPO_URL" >/tmp/discipline-expo-url.txt
echo
echo "Expo Go URL: $EXPO_URL"
echo "Open Expo Go and scan that URL. It only works while this environment is running."
echo

wait "$EXPO_PID"
