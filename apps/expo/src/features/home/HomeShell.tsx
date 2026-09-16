import { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import type { HomeTab } from "./types";
import { useTheme } from "~/theme/ThemeProvider";
import { PhoneFrame } from "~/ui/PhoneFrame";
import { ScreenWash } from "~/ui/ScreenWash";
import { authClient } from "~/utils/auth";
import { useOnboardingGate } from "../onboarding/useOnboardingGate";
import { BottomNav } from "./BottomNav";
import { CommitmentsScreen } from "./CommitmentsScreen";
import { TodayScreen } from "./TodayScreen";
import { YouScreen } from "./YouScreen";

export function HomeShell() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { spacing } = useTheme();
  const { data: session } = authClient.useSession();
  const { replay } = useOnboardingGate();
  const [tab, setTab] = useState<HomeTab>("today");
  const bottomInset = spacing.navHeight + Math.max(insets.bottom, 12) + 20;

  return (
    <PhoneFrame>
      <ScreenWash spread="70%">
        <View
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
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
              onCreate={() => router.push("/commitment/new")}
            />
          ) : null}
          {tab === "commitments" ? (
            <CommitmentsScreen
              bottomInset={bottomInset}
              onCreate={() => router.push("/commitment/new")}
            />
          ) : null}
          {tab === "you" ? (
            <YouScreen
              bottomInset={bottomInset}
              onReplay={() => {
                void replay().then(() => router.replace("/onboarding"));
              }}
            />
          ) : null}
        </View>
        <BottomNav
          active={tab}
          onChange={(next) => {
            if (next === "new") {
              router.push("/commitment/new");
              return;
            }
            setTab(next);
          }}
        />
      </ScreenWash>
    </PhoneFrame>
  );
}
