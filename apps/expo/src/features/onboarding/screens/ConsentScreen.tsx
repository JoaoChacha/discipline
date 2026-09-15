import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "~/theme/tokens";
import { charitySummaryLabel } from "../charities";
import { OnboardingIcon } from "../components/OnboardingIcon";
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
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.label }}>
          {title}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontSize: 13,
            lineHeight: 18,
            color: colors.secondaryLabel,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

export function ConsentScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { allocations, consented, setConsented } = useOnboarding();
  const entering = (delay: number) =>
    reduceMotion ? undefined : FadeInDown.duration(420).delay(delay);

  return (
    <View>
      <Animated.Text
        entering={entering(0)}
        style={{
          marginBottom: 12,
          fontSize: 15,
          fontWeight: "600",
          color: colors.tint,
        }}
      >
        YOU SET THE TERMS
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          fontSize: 34,
          fontWeight: "700",
          lineHeight: 40,
          letterSpacing: -0.8,
          color: colors.label,
        }}
      >
        Ready to make it real?
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          marginTop: 12,
          fontSize: 15,
          lineHeight: 22,
          color: colors.secondaryLabel,
        }}
      >
        Every commitment starts with rules you understand and approve.
      </Animated.Text>

      <Animated.View
        entering={entering(130)}
        accessibilityLabel="Commitment agreement summary"
        style={{
          marginTop: 28,
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: colors.surface,
        }}
      >
        <SummaryRow
          icon="checkbox-outline"
          iconColor={colors.tint}
          title="A specific action and deadline"
          body="You decide what success means before starting."
        />
        <SummaryRow
          icon="cash-outline"
          iconColor={colors.tint}
          title="A transparent 80/20 outcome"
          body="If missed, 80% goes to your charities and 20% is the platform fee."
        />
        <SummaryRow
          icon="person-circle-outline"
          iconColor={colors.success}
          title="Your charities and verifier"
          body={`${charitySummaryLabel(allocations)} receive your chosen split; a verifier confirms the outcome.`}
          last
        />
      </Animated.View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consented }}
        onPress={() => setConsented(!consented)}
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
        <Text
          style={{
            flex: 1,
            fontSize: 13,
            lineHeight: 18,
            color: colors.secondaryLabel,
          }}
        >
          I understand the stake, 80/20 allocation, charity split, and
          verification rules. I’ll review exact terms before confirming.
        </Text>
      </Pressable>
    </View>
  );
}
