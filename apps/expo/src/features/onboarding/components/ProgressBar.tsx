import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, motion } from "~/theme/tokens";

export function ProgressBar({
  step,
  total,
  reduceMotion,
}: {
  step: number;
  total: number;
  reduceMotion: boolean;
}) {
  const progress = useSharedValue(step / total);

  useEffect(() => {
    progress.value = reduceMotion
      ? step / total
      : withTiming(step / total, {
          duration: motion.duration,
          easing: Easing.bezier(...motion.easing),
        });
  }, [progress, reduceMotion, step, total]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: step }}
      style={{
        marginTop: 12,
        height: 4,
        overflow: "hidden",
        borderRadius: 999,
        backgroundColor: colors.separator,
      }}
    >
      <Animated.View
        style={[
          {
            height: "100%",
            borderRadius: 999,
            backgroundColor: colors.tint,
          },
          fillStyle,
        ]}
      />
    </View>
  );
}
