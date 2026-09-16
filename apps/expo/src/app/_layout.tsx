import { useEffect } from "react";
import { Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider, useTheme } from "~/theme/ThemeProvider";
import { queryClient } from "~/utils/api";

import "../styles.css";

function ThemedStack() {
  const params = useGlobalSearchParams<{ theme?: string | string[] }>();
  const { colors, scheme, setForcedScheme } = useTheme();
  const themeParam = Array.isArray(params.theme)
    ? params.theme[0]
    : params.theme;

  useEffect(() => {
    if (themeParam === "light" || themeParam === "dark") {
      setForcedScheme(themeParam);
    }
  }, [setForcedScheme, themeParam]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.field,
          },
          animation: "fade",
        }}
      />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ThemedStack />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
