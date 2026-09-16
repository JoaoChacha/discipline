import { Pressable, Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { authClient } from "~/utils/auth";

export function YouScreen({
  bottomInset,
  onReplay,
}: {
  bottomInset: number;
  onReplay: () => void;
}) {
  const { colors, type, spacing } = useTheme();
  const { data: session } = authClient.useSession();
  const name = session?.user.name ?? "Maya";
  const initial = name.trim().slice(0, 1).toUpperCase();

  return (
    <ScreenScroll
      bottomInset={bottomInset}
      contentStyle={{ paddingHorizontal: spacing.screenX }}
    >
      <Text style={type.homeTitle}>You</Text>
      <SurfaceCard style={{ marginTop: 24 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              height: 56,
              width: 56,
              borderRadius: 999,
              backgroundColor: colors.feature,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                ...type.homeTitle,
                color: colors.featureText,
                fontSize: 22,
                lineHeight: 26,
              }}
            >
              {initial}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={type.headline}>{name}</Text>
            <Text style={type.caption}>
              {session ? "Signed in" : "Browsing the designed home"}
            </Text>
          </View>
        </View>
      </SurfaceCard>

      <View style={{ marginTop: 20, gap: 8 }}>
        <CapsuleButton
          label={session ? "Sign out" : "Sign in with Discord"}
          onPress={() => {
            if (session) {
              void authClient.signOut();
              return;
            }
            void authClient.signIn.social({
              provider: "discord",
              callbackURL: "/",
            });
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Replay onboarding"
          onPress={onReplay}
          testID="home-replay-onboarding"
          style={{
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...type.callout, color: colors.link }}>
            Replay onboarding
          </Text>
        </Pressable>
      </View>
    </ScreenScroll>
  );
}
