import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import Animated, { Easing, FadeInDown } from "react-native-reanimated";

import { useTheme } from "~/theme/ThemeProvider";

export function Reveal({
  delay = 0,
  reduceMotion,
  style,
  children,
}: {
  delay?: number;
  reduceMotion: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  const { motion } = useTheme();

  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.duration(motion.reveal)
              .delay(delay)
              .easing(Easing.bezier(...motion.easing))
      }
      style={style}
    >
      {children}
    </Animated.View>
  );
}
