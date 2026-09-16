import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "~/theme/ThemeProvider";
import { BrandMark } from "~/ui/BrandMark";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { ScreenWash } from "~/ui/ScreenWash";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { Reveal } from "../components/Reveal";

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
  const { colors, type, spacing } = useTheme();

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
            gap: 10,
          }}
        >
          <BrandMark size={32} />
          <Text style={type.brand}>Discipline</Text>
        </View>

        <View style={{ flex: 1, justifyContent: "center", paddingBottom: 20 }}>
          <Reveal reduceMotion={reduceMotion}>
            <Text style={type.eyebrow}>ACCOUNTABILITY, MADE CLEAR</Text>
          </Reveal>
          <Reveal
            reduceMotion={reduceMotion}
            delay={80}
            style={{ marginTop: 10 }}
          >
            <Text style={type.title}>Turn intention into action.</Text>
          </Reveal>

          <Reveal
            reduceMotion={reduceMotion}
            delay={140}
            style={{ marginTop: 28 }}
          >
            <FeatureCard>
              <Text
                style={{
                  ...type.caption,
                  color: colors.featureMuted,
                  textTransform: "uppercase",
                  letterSpacing: 0.6,
                }}
              >
                Example commitment
              </Text>
              <Text
                style={{
                  ...type.callout,
                  color: colors.featureText,
                  marginTop: 8,
                }}
              >
                Quit Smoking in 3 months
              </Text>
              <Text style={[type.money, { marginTop: 16 }]}>€250.00</Text>
            </FeatureCard>
          </Reveal>

          <Reveal
            reduceMotion={reduceMotion}
            delay={180}
            style={{ marginTop: 12 }}
          >
            <SurfaceCard>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <LimeTile name="lock-closed-outline" />
                <Text style={[type.bodyInk, { flex: 1 }]}>
                  Nothing is held until you confirm.
                </Text>
              </View>
            </SurfaceCard>
          </Reveal>
        </View>

        <View style={{ gap: 4 }}>
          <CapsuleButton
            label="Get started"
            onPress={onStart}
            testID="onboarding-get-started"
          />
          <CapsuleButton
            variant="link"
            label={signingIn ? "Opening sign-in…" : "I already have an account"}
            onPress={onSignIn}
            disabled={signingIn}
            testID="onboarding-sign-in"
          />
        </View>
      </View>
    </ScreenWash>
  );
}
