import { View } from "react-native";
import { Redirect } from "expo-router";

import { HomeShell } from "~/features/home/HomeShell";
import { useOnboardingGate } from "~/features/onboarding/useOnboardingGate";
import { useTheme } from "~/theme/ThemeProvider";

export default function Index() {
  const { colors } = useTheme();
  const { ready, needsOnboarding } = useOnboardingGate();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.field }} />;
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return <HomeShell />;
}
