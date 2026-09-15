# Discipline

Native Expo app with a type-safe backend. Scaffolded from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo): React Native + Expo, tRPC, and Drizzle against Postgres.

```text
apps
  ├─ expo      Expo SDK 57 / React Native — iOS + Android
  └─ nextjs    Next.js 16 — tRPC + Better Auth host
packages
  ├─ api       Shared tRPC v11 router
  ├─ auth      Better Auth (web + Expo)
  ├─ db        Drizzle ORM + Postgres
  ├─ ui        Shared web UI (shadcn)
  └─ validators
```

## Prerequisites

- Node.js `22.21.0` (`nvm use` reads `.nvmrc`)
- pnpm `^10.19.0`
- Docker, for the local Postgres database

## Quick start

```bash
nvm use
pnpm install

cp .env.example .env
# Optional: set AUTH_DISCORD_ID / AUTH_DISCORD_SECRET for sign-in

pnpm db:up
pnpm db:push

pnpm dev
```

That starts the Next.js API on `http://localhost:3000` and Expo. Open the Expo app with Expo Go, or run `pnpm --filter @discipline/expo dev:ios` / `dev:android` if you have a simulator.

## Test on your phone

Cursor Cloud Agent port-forward only reaches **your laptop** (`localhost`). A phone cannot use that. Each environment needs its own public tunnels.

```bash
pnpm dev:phone
```

That starts:

1. Next.js on port 3000
2. A Cloudflare quick tunnel for the tRPC API (`EXPO_PUBLIC_API_URL`)
3. A Cloudflare quick tunnel for Metro (`EXPO_PACKAGER_PROXY_URL`) so Expo Go can load the bundle off the LAN

Scan the QR with [Expo Go](https://expo.dev/go) **SDK 57**. The JS bundle and API calls both go to that environment's `trycloudflare.com` URLs.

On your own Wi‑Fi (not a Cloud Agent), you can instead run `pnpm dev:next` plus `pnpm --filter @discipline/expo exec expo start --go --lan` and stay on the LAN.

## Database

Postgres is defined in `docker-compose.yml`. Drizzle lives in `packages/db`:

| Command            | What it does                            |
| ------------------ | --------------------------------------- |
| `pnpm db:up`       | Start local Postgres                    |
| `pnpm db:push`     | Push the Drizzle schema to the database |
| `pnpm db:generate` | Generate a SQL migration                |
| `pnpm db:studio`   | Open Drizzle Studio                     |

`POSTGRES_URL` can also point at Supabase, Neon, or any other Postgres host.

## Money rules

A forfeited stake is split **80% to the selected charities** and **20% Discipline tax**. The tax covers Stripe and Goodstack fees, so charities receive the full 80%. The minimum stake is 500 cents (€5) so that tax still covers typical processing. Shared copy and split math live in `@discipline/validators`.

## Why this starter

[create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) is the most maintained Expo + tRPC + Drizzle monorepo (6k+ stars, MIT). TanStack Start was removed so the repo stays native-first; Next.js stays as the type-safe backend the Expo app calls.

## Scripts

| Command          | What it does                   |
| ---------------- | ------------------------------ |
| `pnpm dev`       | Expo + Next.js together        |
| `pnpm dev:expo`  | Expo only                      |
| `pnpm dev:next`  | Next.js / tRPC only            |
| `pnpm typecheck` | TypeScript across the monorepo |
| `pnpm lint`      | ESLint                         |
| `pnpm format`    | Prettier check                 |

## Production

Deploy `apps/nextjs` (the tRPC + auth server) to Vercel or any Node host, set `POSTGRES_URL` and Better Auth secrets, then point Expo `getBaseUrl()` at that URL before shipping with EAS.
