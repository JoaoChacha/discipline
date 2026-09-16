import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function FeatureCard({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        {
          overflow: "hidden",
          borderRadius: spacing.cardRadius,
          backgroundColor: colors.feature,
        },
        padded ? { padding: 20 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
