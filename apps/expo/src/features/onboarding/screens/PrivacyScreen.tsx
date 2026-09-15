import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "~/theme/tokens";
import { OnboardingIcon } from "../components/OnboardingIcon";

function PrivacyRow({
  icon,
  iconColor,
  title,
  body,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  iconColor: string;
  title: string;
  body: string;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 12 }}>
      <View style={{ marginTop: 2 }}>
        <OnboardingIcon name={icon} size={20} color={iconColor} />
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

export function PrivacyScreen({ reduceMotion }: { reduceMotion: boolean }) {
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
        VERIFIED BY SOMEONE YOU TRUST
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
        Proof stays focused and private.
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
        Your verifier sees only what they need to make a fair decision.
      </Animated.Text>

      <Animated.View
        entering={entering(130)}
        accessibilityLabel="Trusted verifier example"
        style={{
          marginTop: 28,
          borderRadius: 16,
          backgroundColor: colors.surface,
          padding: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 999,
              backgroundColor: colors.tintContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: colors.tint }}
            >
              AC
            </Text>
          </View>
          <View style={{ minWidth: 0, flex: 1 }}>
            <Text
              style={{ fontSize: 17, fontWeight: "600", color: colors.label }}
            >
              Alex Chen
            </Text>
            <Text style={{ fontSize: 13, color: colors.secondaryLabel }}>
              Trusted verifier
            </Text>
          </View>
          <View
            style={{
              height: 32,
              width: 32,
              borderRadius: 999,
              backgroundColor: colors.successContainer,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OnboardingIcon
              name="checkmark-circle"
              size={18}
              color={colors.success}
            />
          </View>
        </View>

        <View
          style={{
            marginVertical: 16,
            height: 1,
            backgroundColor: colors.separator,
          }}
        />

        <View style={{ gap: 16 }}>
          <PrivacyRow
            icon="eye-outline"
            iconColor={colors.tint}
            title="Alex can see"
            body="Your action, deadline, submitted proof, and decision window."
          />
          <PrivacyRow
            icon="eye-off-outline"
            iconColor={colors.secondaryLabel}
            title="Alex cannot see"
            body="Payment details, other commitments, or account activity."
          />
          <PrivacyRow
            icon="person-circle-outline"
            iconColor={colors.success}
            title="You stay in control"
            body="You choose the verifier separately for every commitment."
          />
        </View>
      </Animated.View>
    </View>
  );
}
