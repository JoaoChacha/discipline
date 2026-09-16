#!/usr/bin/env bash
# Load the monorepo root `.env` when it exists. On Vercel the platform
# injects env vars, so skip dotenv there.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -n "${VERCEL:-}" ]]; then
  exec "$@"
fi

if [[ -f "${ROOT}/.env" ]]; then
  exec dotenv -e "${ROOT}/.env" -- "$@"
fi

exec "$@"
