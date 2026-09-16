import type { ComponentProps } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function RowIcon({
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
        borderRadius: size / 2,
        backgroundColor: colors.chip,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={name} size={Math.round(size * 0.42)} color={colors.ink} />
    </View>
  );
}
