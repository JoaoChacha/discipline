import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function AuthMessage({ message }: { message: string | null }) {
  const { colors, type } = useTheme();

  if (!message) {
    return null;
  }

  return (
    <View
      accessibilityLiveRegion="polite"
      style={{
        borderRadius: 16,
        backgroundColor: colors.chip,
        paddingHorizontal: 14,
        paddingVertical: 12,
      }}
    >
      <Text style={{ ...type.caption, color: colors.ink }}>{message}</Text>
    </View>
  );
}
