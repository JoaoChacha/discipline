import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Platform, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

const FADE_STEPS = 14;

export function ScreenWash({
  children,
  style,
  spread = "60%",
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  spread?: "60%" | "70%";
}) {
  const { colors } = useTheme();
  const nativeHeight = spread === "70%" ? 420 : 360;

  return (
    <View
      style={[
        {
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          backgroundColor: colors.field,
        },
        Platform.OS === "web"
          ? ({
              backgroundImage: `radial-gradient(120% ${spread} at 50% 0%, ${colors.wash} 0%, transparent 55%)`,
            } as ViewStyle)
          : null,
        style,
      ]}
    >
      {Platform.OS === "web" ? null : (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            left: 0,
            height: nativeHeight,
          }}
        >
          {Array.from({ length: FADE_STEPS }, (_, index) => (
            <View
              key={index}
              style={{
                flex: 1,
                backgroundColor: colors.wash,
                opacity: 1 - index / (FADE_STEPS - 1),
              }}
            />
          ))}
        </View>
      )}
      {children}
    </View>
  );
}
