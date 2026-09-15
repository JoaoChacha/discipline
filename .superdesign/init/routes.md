# Routes

## Expo (file-based via expo-router)

| URL path | File | Layout | Summary |
| --- | --- | --- | --- |
| `/` | `apps/expo/src/app/index.tsx` | `apps/expo/src/app/_layout.tsx` | Current scaffold: “Discipline” title + Discord auth. Target for the new signed-in Today / main page. |

No other Expo routes exist yet. Intended product routes from the design system (not implemented):

| Intended path | Role |
| --- | --- |
| `/` (Today) | Signed-in home: greeting, progress, active commitment, submit proof |
| `/commitments` | Commitment list (not designed in this pass) |
| `/profile` | Profile (not designed in this pass) |
| Welcome + onboarding | Designed and approved in Superdesign; not in the Expo router yet |

## Next.js (tRPC + Better Auth host)

| URL path | File | Layout | Summary |
| --- | --- | --- | --- |
| `/` | `apps/nextjs/src/app/page.tsx` | `apps/nextjs/src/app/layout.tsx` | Web placeholder: “Discipline” + Discord auth showcase |
| `/api/trpc/[trpc]` | `apps/nextjs/src/app/api/trpc/[trpc]/route.ts` | — | tRPC |
| `/api/auth/[...all]` | `apps/nextjs/src/app/api/auth/[...all]/route.ts` | — | Better Auth |

Expo router config is file-based; there is no `router.ts`.
