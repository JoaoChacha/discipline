# Pages

## / (Expo Home — current scaffold)

Entry: `apps/expo/src/app/index.tsx`

Dependencies:
- `apps/expo/src/app/_layout.tsx`
  - `apps/expo/src/utils/api.tsx`
  - `apps/expo/src/styles.css`
    - `tooling/tailwind/theme.css`
- `apps/expo/src/utils/auth.ts`
- react-native: `Pressable`, `Text`, `View`
- `react-native-safe-area-context`: `SafeAreaView`
- `expo-router`: `Stack`

Render branch: always the scaffold — centered “Discipline” title + `MobileAuth` (greeting or “Not logged in”, Discord sign-in / sign-out). No tabs, no commitment card, no KPIs.

## / (Next.js web placeholder)

Entry: `apps/nextjs/src/app/page.tsx`

Dependencies:
- `apps/nextjs/src/app/layout.tsx`
  - `packages/ui/src/index.ts` (`cn`)
  - `packages/ui/src/theme.tsx`
    - `packages/ui/src/button.tsx`
    - `packages/ui/src/dropdown-menu.tsx`
  - `packages/ui/src/toast.tsx`
  - `apps/nextjs/src/app/styles.css`
- `apps/nextjs/src/app/_components/auth-showcase.tsx`
  - `packages/ui/src/button.tsx`
  - `apps/nextjs/src/auth/server.ts`

Not the mobile main page.

## Superdesign onboarding (designed, not in router)

Canonical interactive draft on project `54813c85-ff34-4473-b1f7-549df56b85fd`:
Welcome → 5-step trust-first onboarding. Design language source for the new Today / main page.

## New Today / main (this task)

Signed-in iPhone home that does not exist in code. Reuse onboarding visual language from `.superdesign/design-system-apple-hig.md`. Discard the archived Apple-native Today exploration draft.
