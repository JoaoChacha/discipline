import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function RadioRow({
  selected,
  onPress,
  title,
  caption,
  leading,
  testID,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  caption?: string;
  leading: ReactNode;
  testID?: string;
}) {
  const { colors, type } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      testID={testID}
      style={{
        minHeight: 64,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 10,
      }}
    >
      {leading}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={type.callout}>{title}</Text>
        {caption ? <Text style={type.caption}>{caption}</Text> : null}
      </View>
      <View
        style={{
          height: 24,
          width: 24,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: selected ? colors.ink : "transparent",
          borderWidth: selected ? 0 : 1.5,
          borderColor: colors.hairline,
        }}
      >
        {selected ? (
          <Ionicons name="checkmark" size={14} color={colors.lime} />
        ) : null}
      </View>
    </Pressable>
  );
}
