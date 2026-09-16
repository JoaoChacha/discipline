# Pages

## / (Expo Home — current scaffold)

Entry: `apps/expo/src/app/index.tsx`

Dependencies:
- `apps/expo/src/app/_layout.tsx`
  - `apps/expo/src/utils/api.tsx`
  - `apps/expo/src/styles.css`
    - `tooling/tailwind/theme.css`
- `apps/expo/src/utils/auth.ts`
- `apps/expo/src/features/onboarding/useOnboardingGate.ts`
- react-native: `Pressable`, `Text`, `View`
- `react-native-safe-area-context`: `SafeAreaView`
- `expo-router`: `Redirect`, `useRouter`

Render branch: if onboarding is needed, redirect to `/onboarding`. Otherwise a
placeholder: “Discipline”, “Onboarding is complete. Commitment creation is
next.”, Discord auth, replay onboarding. No tabs, no stake card, no KPIs.

## /onboarding (Expo — implemented)

Entry: `apps/expo/src/app/onboarding.tsx` → `apps/expo/src/features/onboarding/OnboardingFlow.tsx`

Welcome plus five steps. Code still uses leftover graphite tokens; the approved
visual language is Fintech onboarding
(`.superdesign/design-system-fintech-onboarding.md`).

## / (Next.js web placeholder)

Entry: `apps/nextjs/src/app/page.tsx`

Not the mobile main page.

## Superdesign — Fintech onboarding (approved)

Project `54813c85-ff34-4473-b1f7-549df56b85fd`:

- `onboarding:fintech-light` — Light · Interactive Onboarding
- `onboarding:fintech-dark` — Dark · Interactive Onboarding

`onboarding:trust-first` (graphite) is archived. Do not resume it.

## Superdesign — Today (designed, not in Expo)

Signed-in iPhone home. Language:
`.superdesign/design-system-fintech.md`.

- `today` — populated light
- `today:dark` — populated dark
- `today:empty` / `today:empty-dark` — new-user empty states
