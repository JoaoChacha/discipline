import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";

function PrivacyRow({
  icon,
  title,
  body,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  title: string;
  body: string;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 17,
        paddingVertical: 13,
        borderTopWidth: 1,
        borderTopColor: "rgba(127,127,127,0.24)",
      }}
    >
      <OnboardingIcon name={icon} size={18} color={colors.featureText} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...type.callout,
            fontSize: 12,
            color: colors.featureText,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontFamily: type.caption.fontFamily,
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 17,
            color: colors.featureMuted,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

export function PrivacyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <ScreenCopy
          eyebrow="VERIFIED BY SOMEONE YOU TRUST"
          title="Proof stays focused and private."
          description="Your verifier sees only what they need to make a fair decision."
        />
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 20 }}>
        <FeatureCard padded={false}>
          <View
            accessibilityLabel="Trusted verifier example"
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 17,
            }}
          >
            <View
              style={{
                height: 42,
                width: 42,
                borderRadius: 999,
                backgroundColor: colors.lime,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: type.brand.fontFamily,
                  fontSize: 13,
                  fontWeight: "800",
                  color: "#0E0C0D",
                }}
              >
                AC
              </Text>
            </View>
            <View style={{ minWidth: 0, flex: 1 }}>
              <Text
                style={{
                  ...type.headline,
                  fontSize: 16,
                  color: colors.featureText,
                }}
              >
                Alex Chen
              </Text>
              <Text
                style={{
                  ...type.caption,
                  color: colors.featureMuted,
                }}
              >
                Trusted verifier
              </Text>
            </View>
            <OnboardingIcon
              name="checkmark-circle"
              size={22}
              color={colors.featureText}
            />
          </View>
          <PrivacyRow
            icon="eye-outline"
            title="Alex can see"
            body="Action, deadline, proof, decision window"
          />
          <PrivacyRow
            icon="eye-off-outline"
            title="Alex cannot see"
            body="Payments, other commitments, activity"
          />
          <PrivacyRow
            icon="person-circle-outline"
            title="You stay in control"
            body="Choose a verifier for every commitment"
          />
        </FeatureCard>
      </Reveal>
    </View>
  );
}
