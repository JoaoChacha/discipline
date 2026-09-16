# Shared Layouts

The Expo app has a single stack root. There is no tab bar, sidebar, or shared header component yet. The current stack header is the create-t3-turbo magenta placeholder.

## Expo root layout

- Path: `apps/expo/src/app/_layout.tsx`
- Description: Query client provider, Expo Router `Stack`, status bar. Header background `#c03484`. Content background `#09090B` (dark) or `#FFFFFF` (light).

```tsx
import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "~/utils/api";

import "../styles.css";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#c03484",
          },
          contentStyle: {
            backgroundColor: colorScheme == "dark" ? "#09090B" : "#FFFFFF",
          },
        }}
      />
      <StatusBar />
    </QueryClientProvider>
  );
}
```

## Expo home scaffold

- Path: `apps/expo/src/app/index.tsx`
- Description: Safe-area graphite/white page with centered “Discipline” title and Discord auth. This scaffold is being replaced by a designed Today screen and should not be treated as brand.

```tsx
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { authClient } from "~/utils/auth";

function MobileAuth() {
  const { data: session } = authClient.useSession();

  return (
    <>
      <Text className="text-foreground pb-2 text-center text-xl font-semibold">
        {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
      </Text>
      <Pressable
        onPress={() =>
          session
            ? authClient.signOut()
            : authClient.signIn.social({
                provider: "discord",
                callbackURL: "/",
              })
        }
        className="bg-primary flex items-center rounded-sm p-2"
      >
        <Text>{session ? "Sign Out" : "Sign In With Discord"}</Text>
      </Pressable>
    </>
  );
}

export default function Index() {
  return (
    <SafeAreaView className="bg-background">
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Discipline
        </Text>

        <MobileAuth />
      </View>
    </SafeAreaView>
  );
}
```

## Next.js root layout

- Path: `apps/nextjs/src/app/layout.tsx`
- Description: Web-only host layout with Geist fonts, theme toggle, toaster. Not used by the Expo main page.

The designed mobile product shell (from Superdesign, not yet in code) is:

- 390 × 844 graphite screen
- No magenta stack header
- Bottom tabs: Today, Commitments, Profile
- 20pt horizontal padding
- 52pt electric-blue primary CTA
