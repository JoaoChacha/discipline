import type { ReactNode } from "react";
import { View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function PhoneFrame({ children }: { children: ReactNode }) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.canvas,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 390,
          backgroundColor: colors.field,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}
