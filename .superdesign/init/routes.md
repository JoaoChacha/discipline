# Routes

## Expo (file-based via expo-router)

| URL path | File | Layout | Summary |
| --- | --- | --- | --- |
| `/` | `apps/expo/src/app/index.tsx` | `apps/expo/src/app/_layout.tsx` | Signed-in home scaffold after onboarding. Designed Today (populated + empty) lives in Superdesign; not yet implemented here. |
| `/onboarding` | `apps/expo/src/app/onboarding.tsx` | `apps/expo/src/app/_layout.tsx` | Welcome + five-step onboarding. Implemented; visual source is Fintech onboarding. |

Intended product routes from the Fintech design system (not all implemented):

| Intended path | Role |
| --- | --- |
| `/` (Today) | Signed-in home: greeting, stake card, proof or empty first-commitment CTA |
| `/commitments` | Commitment list (not designed in this pass) |
| New tab | Create a commitment (verifier chosen in that flow) |
| `/profile` / You | Profile (not designed in this pass) |

## Next.js (tRPC + Better Auth host)

| URL path | File | Layout | Summary |
| --- | --- | --- | --- |
| `/` | `apps/nextjs/src/app/page.tsx` | `apps/nextjs/src/app/layout.tsx` | Web placeholder: “Discipline” + Discord auth showcase |
| `/api/trpc/[trpc]` | `apps/nextjs/src/app/api/trpc/[trpc]/route.ts` | — | tRPC |
| `/api/auth/[...all]` | `apps/nextjs/src/app/api/auth/[...all]/route.ts` | — | Better Auth |

Expo router config is file-based; there is no `router.ts`.
