import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

function PrivacyRow({
  icon,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  body: string;
  last?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      }}
    >
      <OnboardingIcon name={icon} size={20} color={colors.ink} />
      <Text style={[type.bodyInk, { flex: 1 }]}>{body}</Text>
    </View>
  );
}

export function PrivacyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <Text style={type.title}>Proof stays focused and private.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={80} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Your verifier sees only what they need for a fair decision.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 24 }}>
        <FeatureCard>
          <View
            accessibilityLabel="Trusted verifier example"
            style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
          >
            <View
              style={{
                height: 48,
                width: 48,
                borderRadius: 999,
                backgroundColor: colors.ghost,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  ...type.callout,
                  color: colors.featureText,
                }}
              >
                AC
              </Text>
            </View>
            <View style={{ minWidth: 0, flex: 1 }}>
              <Text style={{ ...type.headline, color: colors.featureText }}>
                Alex Chen
              </Text>
              <Text style={{ ...type.caption, color: colors.featureMuted }}>
                Trusted verifier
              </Text>
            </View>
            <OnboardingIcon
              name="checkmark-circle"
              size={22}
              color={colors.lime}
            />
          </View>
        </FeatureCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <SurfaceCard padded={false}>
          <PrivacyRow
            icon="eye-outline"
            body="Sees your action, deadline, and submitted proof."
          />
          <PrivacyRow
            icon="eye-off-outline"
            body="Never sees payment details or other activity."
          />
          <PrivacyRow
            icon="person-circle-outline"
            body="You choose a verifier for each commitment."
            last
          />
        </SurfaceCard>
      </Reveal>
    </View>
  );
}
