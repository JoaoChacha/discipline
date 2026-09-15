import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { colors, spacing } from "~/theme/tokens";

export function BrandCard({
  padded = true,
  style,
  children,
}: {
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        {
          overflow: "hidden",
          borderRadius: spacing.cardRadius,
          borderWidth: 1,
          borderColor: colors.tintEdge,
          backgroundColor: colors.surface,
        },
        padded ? { padding: 16 } : null,
        style,
      ]}
    >
      {children}
    </View>
  );
}
