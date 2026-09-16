import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function Chip({ label }: { label: string }) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        alignSelf: "flex-start",
        minHeight: 36,
        justifyContent: "center",
        backgroundColor: colors.chip,
        borderRadius: 999,
        paddingHorizontal: 12,
      }}
    >
      <Text
        style={{
          ...type.caption,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "600",
          color: colors.ink,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
