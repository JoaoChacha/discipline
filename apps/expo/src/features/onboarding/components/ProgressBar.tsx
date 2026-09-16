import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useTheme } from "~/theme/ThemeProvider";

export function ProgressBar({
  step,
  total,
  reduceMotion,
}: {
  step: number;
  total: number;
  reduceMotion: boolean;
}) {
  const { colors, motion } = useTheme();
  const progress = useSharedValue(step / total);

  useEffect(() => {
    progress.value = reduceMotion
      ? step / total
      : withTiming(step / total, {
          duration: motion.duration,
          easing: Easing.bezier(...motion.easing),
        });
  }, [motion.duration, motion.easing, progress, reduceMotion, step, total]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: step }}
      style={{
        marginTop: 10,
        height: 4,
        overflow: "hidden",
        borderRadius: 999,
        backgroundColor: colors.hairline,
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: 999,
            backgroundColor: colors.ink,
            overflow: "hidden",
          },
          fillStyle,
        ]}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: 8,
            borderRadius: 999,
            backgroundColor: colors.lime,
          }}
        />
      </Animated.View>
    </View>
  );
}
