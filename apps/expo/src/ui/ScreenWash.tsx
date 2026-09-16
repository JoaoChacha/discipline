import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function ScreenWash({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { colors } = useTheme();

  return (
    <View style={[{ flex: 1, backgroundColor: colors.field }, style]}>
      <View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          height: 240,
          backgroundColor: colors.wash,
          pointerEvents: "none",
        }}
      />
      {children}
    </View>
  );
}
