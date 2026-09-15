import { Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { colors } from "~/theme/tokens";
import { OnboardingIcon } from "../components/OnboardingIcon";

export function PromiseScreen({ reduceMotion }: { reduceMotion: boolean }) {
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
        ACCOUNTABILITY THAT FEELS FAIR
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          maxWidth: 340,
          fontSize: 34,
          fontWeight: "700",
          lineHeight: 40,
          letterSpacing: -0.8,
          color: colors.label,
        }}
      >
        Your commitment, backed by you.
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          marginTop: 12,
          maxWidth: 340,
          fontSize: 15,
          lineHeight: 22,
          color: colors.secondaryLabel,
        }}
      >
        Choose an action that matters and put money behind it. Follow through
        and keep every euro. Miss it, and most of the stake supports causes you
        chose.
      </Animated.Text>

      <Animated.View
        entering={entering(130)}
        accessibilityLabel="Accountability promise"
        style={{
          marginTop: 28,
          borderRadius: 16,
          backgroundColor: colors.surface,
          padding: 16,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}
        >
          <View style={{ marginTop: 2 }}>
            <OnboardingIcon name="heart" size={23} color={colors.success} />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                lineHeight: 22,
                color: colors.label,
              }}
            >
              A promise, not a punishment
            </Text>
            <Text
              style={{
                marginTop: 4,
                fontSize: 15,
                lineHeight: 20,
                color: colors.secondaryLabel,
              }}
            >
              The goal is to make your intention concrete—not to shame you when
              plans change.
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
