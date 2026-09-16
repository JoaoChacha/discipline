import type { ReactNode } from "react";
import { Platform, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

const WEB_FRAME_WIDTH = 390;

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { colors } = useTheme();
  const framed = Platform.OS === "web";

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: framed ? colors.canvas : colors.field,
        alignItems: framed ? "center" : undefined,
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: framed ? WEB_FRAME_WIDTH : undefined,
          minHeight: 0,
          backgroundColor: colors.field,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}
