import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { LogoMark } from "../components/LogoMark";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { PrimaryButton } from "../components/PrimaryButton";
import { Reveal } from "../components/Reveal";
import { StakeRing } from "../components/StakeRing";

export function WelcomeScreen({
  reduceMotion,
  signingIn,
  onStart,
  onSignIn,
}: {
  reduceMotion: boolean;
  signingIn: boolean;
  onStart: () => void;
  onSignIn: () => void;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
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
          gap: 8,
        }}
      >
        <LogoMark size={32} />
        <Text style={type.brand}>Disciplined Stake</Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", paddingBottom: 32 }}>
        <Reveal reduceMotion={reduceMotion}>
          <StakeRing size={80} label="80 / 20" />
        </Reveal>
        <Reveal
          reduceMotion={reduceMotion}
          delay={90}
          style={{ marginTop: 32 }}
        >
          <Text style={type.eyebrow}>DISCIPLINE, MADE CONCRETE</Text>
        </Reveal>
        <Reveal
          reduceMotion={reduceMotion}
          delay={90}
          style={{ marginTop: 12 }}
        >
          <Text style={type.welcomeTitle}>Turn intention into action.</Text>
        </Reveal>
        <Reveal
          reduceMotion={reduceMotion}
          delay={170}
          style={{ marginTop: 20 }}
        >
          <Text style={[type.body, { fontSize: 17, lineHeight: 25 }]}>
            Make a commitment, choose a stake and a cause, then ask someone you
            trust to verify the outcome.
          </Text>
        </Reveal>
        <Reveal
          reduceMotion={reduceMotion}
          delay={170}
          style={{ marginTop: 32 }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 12,
              borderRadius: spacing.cardRadius,
              borderWidth: 1,
              borderColor: colors.tintEdge,
              backgroundColor: colors.surface,
              padding: 16,
            }}
          >
            <View style={{ marginTop: 2 }}>
              <OnboardingIcon
                name="lock-closed"
                size={21}
                color={colors.success}
              />
            </View>
            <Text style={[type.bodyTight, { flex: 1 }]}>
              Nothing is charged until you review and confirm every term.
            </Text>
          </View>
        </Reveal>
      </View>

      <View style={{ gap: 8 }}>
        <PrimaryButton
          label="Get started"
          onPress={onStart}
          testID="onboarding-get-started"
        />
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="I already have an account"
          disabled={signingIn}
          onPress={onSignIn}
          testID="onboarding-sign-in"
          style={{
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ ...type.callout, color: colors.tint }}>
            {signingIn ? "Opening sign-in…" : "I already have an account"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
