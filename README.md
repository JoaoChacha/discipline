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
# Optional: set AUTH_GOOGLE_* / AUTH_APPLE_* for social sign-in.
# Email and password work with AUTH_SECRET alone.

pnpm db:up
pnpm db:push

pnpm dev
```

That starts the Next.js API on `http://localhost:3000`, a tRPC WebSocket server on `ws://localhost:3001`, and Expo. Sign in with email (or optional Apple/Google), claim a unique handle, then create a commitment. Stake holds use Stripe (`STRIPE_SECRET_KEY` + webhook). Open the Expo app with Expo Go, or run `pnpm --filter @discipline/expo dev:ios` / `dev:android` if you have a simulator.

## Test on your phone

Cursor Cloud Agent port-forward only reaches **your laptop** (`localhost`). A phone cannot use that. Each environment needs its own public tunnels.

```bash
pnpm dev:phone
```

That starts:

1. Next.js on port 3000
2. A Cloudflare quick tunnel for the tRPC API (`EXPO_PUBLIC_API_URL`)
3. An `*.exp.direct` Metro tunnel (Expo's bundled ngrok, started directly)

Scan the QR with [Expo Go](https://expo.dev/go) **SDK 57**. Expo Go verifies the packager hostname and rejects `trycloudflare.com` with "Hostname could not be verified". `expo start --tunnel` hits the same ngrok account through a wrapper that currently crashes, so `dev:phone` starts ngrok itself and sets `EXPO_PACKAGER_PROXY_URL` to the `exp.direct` host.

On your own Wi‑Fi (not a Cloud Agent), you can instead run `pnpm dev:next` plus `pnpm --filter @discipline/expo exec expo start --go --lan` and stay on the LAN.

## Database

Postgres is defined in `docker-compose.yml`. Drizzle lives in `packages/db`:

| Command            | What it does                            |
| ------------------ | --------------------------------------- |
| `pnpm db:up`       | Start local Postgres                    |
| `pnpm db:push`     | Push the Drizzle schema to the database |
| `pnpm db:migrate`  | Apply SQL migrations (hosted + local)   |
| `pnpm db:generate` | Generate a SQL migration                |
| `pnpm db:studio`   | Open Drizzle Studio                     |

`POSTGRES_URL` can also point at Supabase, Neon, or any other Postgres host.

## Why this starter

[create-t3-turbo](https://github.com/t3-oss/create-t3-turbo) is the most maintained Expo + tRPC + Drizzle monorepo (6k+ stars, MIT). TanStack Start was removed so the repo stays native-first; Next.js stays as the type-safe backend the Expo app calls.

## Scripts

| Command          | What it does                         |
| ---------------- | ------------------------------------ |
| `pnpm dev`       | Expo + Next.js together              |
| `pnpm dev:expo`  | Expo only                            |
| `pnpm dev:next`  | Next.js / tRPC only                  |
| `pnpm typecheck` | TypeScript across the monorepo       |
| `pnpm lint`      | ESLint                               |
| `pnpm format`    | Prettier check                       |
| `pnpm test`      | Vitest for API, auth, and onboarding |

## Environments

Local Docker is not an environment. Hosted stacks:

|          | Pre-prod                                                     | Production                                              |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| API      | Vercel project `discipline`, git branch `preprod`            | Vercel project `discipline`, git branch `main`          |
| Database | Supabase `discipline-preprod` (`fwqqohaqmixgaqplumra`)       | Supabase `discipline` (`bxaxnycbgrbhrdvkcuav`)          |
| Native   | `eas build --profile preprod` (`com.discipline.app.preprod`) | `eas build --profile production` (`com.discipline.app`) |

Vercel team: `joo-chchs-projects`. Project id: `prj_ur89Bv2yVbj0AIG3AEtoXQludVKz`.

After merge to `main`, create a long-lived `preprod` branch and push it so Vercel issues a stable preview URL (`https://discipline-git-preprod-joo-chchs-projects.vercel.app`). Point EAS `preprod` at that URL.

Set these on Vercel → Project Settings → Environment Variables.
Use **Production** for `main` and **Preview** for every other branch (including `preprod`):

- `POSTGRES_URL` — Supabase **transaction pooler** URI (`:6543`) from Project Settings → Database. Production gets `discipline` (`bxaxnycbgrbhrdvkcuav`); Preview gets `discipline-preprod` (`fwqqohaqmixgaqplumra`). Do not reuse the same database across envs.
- `AUTH_SECRET` — `openssl rand -base64 32` (different per env)
- `APP_URL` — `https://discipline-joo-chchs-projects.vercel.app` for Production, `https://discipline-git-preprod-joo-chchs-projects.vercel.app` for Preview
- Optional Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test keys on Preview, live keys on Production)
- Optional Apple / Google OAuth. Register callbacks at `{APP_URL}/api/auth/callback/google` and `/apple`. For the pre-prod app use bundle id `com.discipline.app.preprod`.

The first successful API deploy only needs `POSTGRES_URL`, `AUTH_SECRET`, and `APP_URL`. Copy each pooler URI from Supabase (the database password is only in the dashboard). After those are set, Redeploy on Vercel or push a commit.

Leave `NEXT_PUBLIC_WS_URL` unset on Vercel. The hosted API uses HTTP tRPC at `/api/trpc`. The local WebSocket server still starts with `pnpm dev`.

The Expo app does not talk to Supabase directly. Release builds read `EXPO_PUBLIC_API_URL` from [`apps/expo/eas.json`](apps/expo/eas.json).

```bash
# After setting POSTGRES_URL in your shell
pnpm db:migrate

# Native
cd apps/expo
eas build --profile preprod --platform all
eas build --profile production --platform all
```

The app connects to Postgres as a server-side Drizzle client. Public tables have RLS enabled and `anon` / `authenticated` revoked so the Supabase Data API cannot read them. Copy the database password from the Supabase dashboard — it is not stored in this repo.
