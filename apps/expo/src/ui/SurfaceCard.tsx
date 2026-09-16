import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function SurfaceCard({
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
          borderRadius: spacing.surfaceRadius,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
        },
        padded ? { padding: 16 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
