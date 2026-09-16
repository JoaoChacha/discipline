import { View } from "react-native";
import { Redirect } from "expo-router";

import { CommitmentWizard } from "~/features/commitment/CommitmentWizard";
import { useOnboardingGate } from "~/features/onboarding/useOnboardingGate";
import { useTheme } from "~/theme/ThemeProvider";

export default function NewCommitmentRoute() {
  const { colors } = useTheme();
  const { ready, needsOnboarding } = useOnboardingGate();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.field }} />;
  }

  if (needsOnboarding) {
    return <Redirect href="/" />;
  }

  return <CommitmentWizard />;
}
