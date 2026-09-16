# Shared Layouts

The Expo app has a single stack root. There is no tab bar, sidebar, or shared header component yet.

## Expo root layout

- Path: `apps/expo/src/app/_layout.tsx`
- Description: Query client provider, Expo Router `Stack` with header hidden, status bar. Content background still uses leftover graphite `#0F1115` from `apps/expo/src/theme/tokens.ts`. That is not the Fintech brand.

```tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { colors } from "~/theme/tokens";
import { queryClient } from "~/utils/api";

import "../styles.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: "fade",
        }}
      />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
```

## Expo home scaffold

- Path: `apps/expo/src/app/index.tsx`
- Description: After onboarding, a placeholder home: title, “Commitment creation is next,” Discord auth, replay. Designed Today (Fintech populated + empty) is not in code yet.

## Next.js root layout

- Path: `apps/nextjs/src/app/layout.tsx`
- Description: Web-only host layout with Geist fonts, theme toggle, toaster. Not used by the Expo main page.

The designed mobile product shell (from Superdesign, not yet in code) is:

- 390 × 844 Fintech screen (light `#F7F6FA` or dark `#0D0D0F`)
- No magenta stack header, no graphite field, no electric-blue CTA
- Compact capsule bottom nav, 64pt, four equal tabs: Today, Commitments, New, You
- Active tab: ink icon, bold 11pt label, lime 4pt dot
- 20pt horizontal padding
- One feature stake card (black in light / ivory in dark), capsule pills
