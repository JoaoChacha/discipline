import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function LimeTile({
  name,
  size = 40,
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height: size,
        width: size,
        borderRadius: 12,
        backgroundColor: colors.lime,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={name} size={Math.round(size * 0.48)} color="#0E0C0D" />
    </View>
  );
}
