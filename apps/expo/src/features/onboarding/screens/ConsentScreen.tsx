import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { colors } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { BrandCard } from "../components/BrandCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";
import { useOnboarding } from "../OnboardingProvider";

function SummaryRow({
  icon,
  iconColor,
  title,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  iconColor: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.separator,
      }}
    >
      <View style={{ marginTop: 2 }}>
        <OnboardingIcon name={icon} size={21} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={type.callout}>{title}</Text>
        <Text style={[type.footnote, { marginTop: 2 }]}>{body}</Text>
      </View>
    </View>
  );
}

export function ConsentScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { consented, setConsented } = useOnboarding();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion} style={{ marginBottom: 12 }}>
        <Text style={type.eyebrow}>YOU SET THE TERMS</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90}>
        <Text style={type.title}>Ready to make it real?</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Every commitment starts with rules you understand and approve.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170} style={{ marginTop: 28 }}>
        <BrandCard padded={false}>
          <View accessibilityLabel="Commitment agreement summary">
            <SummaryRow
              icon="checkbox-outline"
              iconColor={colors.tint}
              title="Action and deadline"
              body="You define success before starting."
            />
            <SummaryRow
              icon="cash-outline"
              iconColor={colors.tint}
              title="Transparent 80/20 outcome"
              body="Charity donation and platform fee disclosed."
            />
            <SummaryRow
              icon="person-circle-outline"
              iconColor={colors.success}
              title="A cause and verifier each time"
              body="Every commitment gets its own charity or group and allocation."
              last
            />
          </View>
        </BrandCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consented }}
          onPress={() => setConsented(!consented)}
          testID="onboarding-consent"
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 12,
            borderRadius: 12,
            backgroundColor: colors.surfaceMuted,
            padding: 16,
          }}
        >
          <View
            style={{
              marginTop: 2,
              height: 20,
              width: 20,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: consented ? colors.tint : colors.separator,
              backgroundColor: consented ? colors.tint : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {consented ? (
              <OnboardingIcon name="checkmark" size={14} color={colors.white} />
            ) : null}
          </View>
          <Text style={[type.footnote, { flex: 1 }]}>
            I understand the stake, 80/20 allocation, per-commitment charity
            choice, and verification rules.
          </Text>
        </Pressable>
      </Reveal>
    </View>
  );
}
