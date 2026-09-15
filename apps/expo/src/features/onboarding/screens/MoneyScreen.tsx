import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "~/theme/tokens";
import { OnboardingIcon } from "../components/OnboardingIcon";

function OutcomeRow({
  icon,
  iconColor,
  iconBg,
  title,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  iconColor: string;
  iconBg: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.separator,
      }}
    >
      <View
        style={{
          height: 32,
          width: 32,
          borderRadius: 999,
          backgroundColor: iconBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <OnboardingIcon name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: "600", color: colors.label }}>
          {title}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontSize: 15,
            lineHeight: 20,
            color: colors.secondaryLabel,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}

export function MoneyScreen({ reduceMotion }: { reduceMotion: boolean }) {
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
        CLEAR FROM THE START
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
        Your money follows the outcome.
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
        You choose the stake. We show exactly what happens before you confirm.
      </Animated.Text>

      <Animated.View
        entering={entering(130)}
        accessibilityLabel="Stake example"
        style={{
          marginTop: 28,
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.separator,
            paddingHorizontal: 16,
            paddingVertical: 16,
          }}
        >
          <View>
            <Text style={{ fontSize: 13, color: colors.secondaryLabel }}>
              Example stake
            </Text>
            <Text
              style={{
                marginTop: 2,
                fontSize: 28,
                fontWeight: "700",
                color: colors.label,
                fontVariant: ["tabular-nums"],
              }}
            >
              €25
            </Text>
          </View>
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
            <OnboardingIcon name="lock-closed" size={22} color={colors.tint} />
          </View>
        </View>

        <OutcomeRow
          icon="checkmark"
          iconColor={colors.success}
          iconBg={colors.successContainer}
          title="Complete and verify"
          body="Your full €25 is released back to you."
        />
        <OutcomeRow
          icon="time-outline"
          iconColor={colors.pending}
          iconBg={colors.pendingContainer}
          title="Miss the commitment"
          body="€20 (80%) is donated across your selected charities."
        />
        <OutcomeRow
          icon="phone-portrait-outline"
          iconColor={colors.tint}
          iconBg={colors.tintContainer}
          title="Disclosed platform fee"
          body="€5 (20%) supports the app and its operations."
          last
        />
      </Animated.View>

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          gap: 8,
          paddingHorizontal: 4,
        }}
      >
        <View style={{ marginTop: 2 }}>
          <OnboardingIcon
            name="information-circle-outline"
            size={18}
            color={colors.secondaryLabel}
          />
        </View>
        <Text
          style={{
            flex: 1,
            fontSize: 13,
            lineHeight: 18,
            color: colors.secondaryLabel,
          }}
        >
          You review this exact 80/20 allocation before every commitment is
          confirmed.
        </Text>
      </View>
    </View>
  );
}
