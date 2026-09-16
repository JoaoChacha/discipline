import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import type { HomeTab } from "./types";
import { useTheme } from "~/theme/ThemeProvider";
import { ScreenWash } from "~/ui/ScreenWash";
import { authClient } from "~/utils/auth";
import { useOnboardingGate } from "../onboarding/useOnboardingGate";
import { BottomNav } from "./BottomNav";
import { CommitmentsScreen } from "./CommitmentsScreen";
import { NewCommitmentScreen } from "./NewCommitmentScreen";
import { TodayScreen } from "./TodayScreen";
import { YouScreen } from "./YouScreen";

export function HomeShell() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, spacing } = useTheme();
  const { data: session } = authClient.useSession();
  const { replay } = useOnboardingGate();
  const [tab, setTab] = useState<HomeTab>("today");
  const bottomInset = spacing.navHeight + Math.max(insets.bottom, 12) + 20;

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.canvas, alignItems: "center" }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 390,
          backgroundColor: colors.field,
          overflow: "hidden",
        }}
      >
        <ScreenWash>
          <View
            style={{
              flex: 1,
              paddingTop: Math.max(insets.top, 16),
            }}
          >
            {tab === "today" ? (
              <TodayScreen
                userName={session?.user.name}
                bottomInset={bottomInset}
                onSubmitProof={() => setTab("commitments")}
                onDetails={() => setTab("commitments")}
                onYou={() => setTab("you")}
              />
            ) : null}
            {tab === "commitments" ? (
              <CommitmentsScreen bottomInset={bottomInset} />
            ) : null}
            {tab === "new" ? (
              <NewCommitmentScreen bottomInset={bottomInset} />
            ) : null}
            {tab === "you" ? (
              <YouScreen
                bottomInset={bottomInset}
                onSignIn={() => router.push("/login")}
                onReplay={() => {
                  void replay().then(() => router.replace("/onboarding"));
                }}
              />
            ) : null}
          </View>
          <BottomNav active={tab} onChange={setTab} />
        </ScreenWash>
      </View>
    </View>
  );
}
