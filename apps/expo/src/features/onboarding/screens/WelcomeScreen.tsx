import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";
import { BrandMark } from "~/ui/BrandMark";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { FeatureCard } from "~/ui/FeatureCard";
import { Notice } from "~/ui/Notice";
import { ScreenWash } from "~/ui/ScreenWash";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";

export function WelcomeScreen({
  reduceMotion,
  onStart,
  onSignIn,
}: {
  reduceMotion: boolean;
  onStart: () => void;
  onSignIn: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, type, spacing, scheme, toggleScheme } = useTheme();

  return (
    <ScreenWash>
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing.screenX,
          paddingTop: Math.max(insets.top, spacing.screenTop),
          paddingBottom: Math.max(insets.bottom, spacing.screenBottom),
        }}
      >
        <View
          style={{
            height: spacing.header,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
            <BrandMark />
            <Text style={type.brand}>Discipline</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              scheme === "light" ? "Theme: light" : "Theme: dark"
            }
            onPress={toggleScheme}
            testID="welcome-theme-toggle"
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={scheme === "light" ? "sunny-outline" : "moon-outline"}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "center", paddingTop: 10 }}>
          <Reveal reduceMotion={reduceMotion}>
            <ScreenCopy
              welcome
              eyebrow="ACCOUNTABILITY, MADE CLEAR"
              title="Turn intention into action."
              description="Make a commitment, choose a stake and a cause, then ask someone you trust to verify the outcome."
            />
          </Reveal>

          <Reveal
            reduceMotion={reduceMotion}
            delay={140}
            style={{ marginTop: 20 }}
          >
            <FeatureCard>
              <Text
                style={{
                  ...type.callout,
                  fontSize: 12,
                  color: colors.featureText,
                }}
              >
                Quit Smoking in 3 months
              </Text>
              <Text style={[type.money, { marginTop: 18 }]}>€250.00</Text>
              <Text
                style={{
                  marginTop: 3,
                  fontFamily: type.caption.fontFamily,
                  fontSize: 12,
                  fontWeight: "500",
                  lineHeight: 17,
                  color: colors.featureMuted,
                }}
              >
                Nothing is held yet
              </Text>
            </FeatureCard>
          </Reveal>

          <Reveal reduceMotion={reduceMotion} delay={180}>
            <Notice
              lime
              icon="lock-closed-outline"
              title="Clear before you commit"
              body="Nothing is held until you review and confirm every term."
            />
          </Reveal>
        </View>

        <View>
          <CapsuleButton
            label="Get started"
            onPress={onStart}
            showArrow
            testID="onboarding-get-started"
          />
          <CapsuleButton
            variant="link"
            label="I already have an account"
            onPress={onSignIn}
            testID="onboarding-sign-in"
          />
        </View>
      </View>
    </ScreenWash>
  );
}
