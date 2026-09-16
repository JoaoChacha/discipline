import { Pressable, Text } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function SelectChip({
  label,
  selected,
  onPress,
  testID,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
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
        minHeight: 36,
        justifyContent: "center",
        borderRadius: 999,
        paddingHorizontal: 14,
        backgroundColor: selected ? colors.ink : colors.chip,
      }}
    >
      <Text
        style={{
          ...type.caption,
          fontSize: 13,
          lineHeight: 18,
          fontWeight: "600",
          color: selected ? colors.field : colors.ink,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
