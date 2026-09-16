import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function Chip({ label }: { label: string }) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        alignSelf: "flex-start",
        backgroundColor: colors.chip,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Text style={{ ...type.caption, color: colors.ink, fontWeight: "600" }}>
        {label}
      </Text>
    </View>
  );
}
