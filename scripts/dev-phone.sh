#!/usr/bin/env bash
# Start this environment so a physical phone can load it in Expo Go.
# Cursor port-forward only reaches your laptop's localhost — the phone needs
# public tunnels for Metro and the Next.js API.
#
# Metro is published on *.exp.direct via Expo's bundled ngrok binary.
# Expo Go verifies the packager hostname and rejects trycloudflare.com with
# "Hostname could not be verified". `expo start --tunnel` uses the same
# ngrok account but its JS wrapper currently crashes, so this script starts
# ngrok directly and points Metro at it with EXPO_PACKAGER_PROXY_URL.
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

resolve_expo_ngrok() {
  node <<'NODE'
const { createRequire } = require("module");
const fs = require("fs");
const path = require("path");
const expoRoot = path.join(process.cwd(), "apps/expo");
const expoReq = createRequire(path.join(expoRoot, "package.json"));
const ngrokReq = createRequire(expoReq.resolve("@expo/ngrok/package.json"));
const bin = ngrokReq("@expo/ngrok-bin");
if (!bin) {
  console.error("Could not resolve @expo/ngrok-bin for this platform.");
  process.exit(1);
}
const expoPkgReq = createRequire(expoReq.resolve("expo/package.json"));
const cliRoot = path.dirname(expoPkgReq.resolve("@expo/cli/package.json"));
const src = fs.readFileSync(
  path.join(cliRoot, "build/src/start/server/AsyncNgrok.js"),
  "utf8",
);
const token = src.match(/authToken:\s*'([^']+)'/);
if (!token) {
  console.error("Could not read Expo's ngrok auth token from @expo/cli.");
  process.exit(1);
}
process.stdout.write(`${bin}\n${token[1]}\n`);
NODE
}

exp_direct_from_log() {
  grep -oE 'https://[a-zA-Z0-9.-]+\.exp\.direct' "$1" 2>/dev/null | head -n 1 || true
}

start_exp_direct_tunnel() {
  local log="$1"
  local ngrok_bin="$2"
  local ngrok_token="$3"
  local host="d$(openssl rand -hex 3)-joaochacha-8081.exp.direct"

  : >"$log"
  "$ngrok_bin" http -authtoken "$ngrok_token" -hostname="$host" 8081 \
    --log stdout >"$log" 2>&1 &
  disown $! 2>/dev/null || true

  local url=""
  for _ in $(seq 1 40); do
    if grep -qE 'failed to start tunnel|ERR_NGROK' "$log" 2>/dev/null; then
      return 1
    fi
    url="$(exp_direct_from_log "$log")"
    if [ -n "$url" ]; then
      printf '%s\n' "$url"
      return 0
    fi
    sleep 1
  done
  return 1
}

METRO_URL="$(exp_direct_from_log /tmp/discipline-metro-ngrok.log)"
if [ -z "$METRO_URL" ]; then
  echo "Opening an Expo-trusted *.exp.direct tunnel to Metro…"
  NGROK_INFO="$(resolve_expo_ngrok)"
  NGROK_BIN="$(printf '%s\n' "$NGROK_INFO" | sed -n '1p')"
  NGROK_TOKEN="$(printf '%s\n' "$NGROK_INFO" | sed -n '2p')"
  METRO_URL="$(start_exp_direct_tunnel /tmp/discipline-metro-ngrok.log "$NGROK_BIN" "$NGROK_TOKEN" || true)"
fi

if [ -z "$METRO_URL" ]; then
  echo "Could not get an *.exp.direct Metro URL. Log:"
  tail -n 40 /tmp/discipline-metro-ngrok.log
  exit 1
fi

printf '%s\n' "$METRO_URL" >/tmp/discipline-metro-url.txt
EXPO_HOST="${METRO_URL#https://}"
EXPO_URL="exps://${EXPO_HOST}"
printf '%s\n' "$EXPO_URL" >/tmp/discipline-expo-url.txt

echo "Metro tunnel: $METRO_URL"
echo
echo "Scan the Expo QR with Expo Go (SDK 57). Metro is on *.exp.direct."
echo "Expo Go URL: $EXPO_URL"
echo "It only works while this environment is running."
echo

unset CI
export EXPO_PUBLIC_API_URL="$API_URL"
export EXPO_PACKAGER_PROXY_URL="$METRO_URL"

if curl -sf "http://127.0.0.1:8081/status" >/dev/null 2>&1; then
  echo "Metro already running on :8081 — reuse it (restart if the public host changed)."
  sleep infinity
fi

pnpm --filter @discipline/expo exec expo start --go --port 8081
