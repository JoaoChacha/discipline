import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import { colors } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { BrandCard } from "../components/BrandCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

function PrivacyRow({
  icon,
  iconColor,
  body,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  iconColor: string;
  body: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ marginTop: 2 }}>
        <OnboardingIcon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[type.bodyTight, { flex: 1, color: colors.label }]}>
        {body}
      </Text>
    </View>
  );
}

export function PrivacyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <View>
      <Reveal reduceMotion={reduceMotion} style={{ marginBottom: 12 }}>
        <Text style={type.eyebrow}>VERIFIED BY SOMEONE YOU TRUST</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90}>
        <Text style={type.title}>Proof stays focused and private.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Your verifier sees only what they need for a fair decision.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170} style={{ marginTop: 28 }}>
        <BrandCard>
          <View accessibilityLabel="Trusted verifier example">
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingBottom: 16,
                borderBottomWidth: 1,
                borderBottomColor: colors.separator,
              }}
            >
              <View
                style={{
                  height: 44,
                  width: 44,
                  borderRadius: 999,
                  backgroundColor: colors.tintContainer,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ ...type.callout, color: colors.tint }}>AC</Text>
              </View>
              <View style={{ minWidth: 0, flex: 1 }}>
                <Text style={type.headline}>Alex Chen</Text>
                <Text style={type.footnote}>Trusted verifier</Text>
              </View>
              <OnboardingIcon
                name="checkmark-circle"
                size={22}
                color={colors.success}
              />
            </View>

            <View style={{ marginTop: 16, gap: 16 }}>
              <PrivacyRow
                icon="eye-outline"
                iconColor={colors.tint}
                body="Sees your action, deadline, and submitted proof."
              />
              <PrivacyRow
                icon="eye-off-outline"
                iconColor={colors.secondaryLabel}
                body="Never sees payment details or other activity."
              />
              <PrivacyRow
                icon="person-circle-outline"
                iconColor={colors.success}
                body="You choose a verifier for each commitment."
              />
            </View>
          </View>
        </BrandCard>
      </Reveal>
    </View>
  );
}
