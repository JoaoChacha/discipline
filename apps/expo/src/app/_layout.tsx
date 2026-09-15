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
