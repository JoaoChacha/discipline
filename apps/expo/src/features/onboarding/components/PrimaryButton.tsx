import { Pressable, Text } from "react-native";

import { colors, spacing } from "~/theme/tokens";
import { OnboardingIcon } from "./OnboardingIcon";

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => ({
        height: spacing.buttonHeight,
        borderRadius: spacing.buttonRadius,
        backgroundColor: disabled
          ? colors.separator
          : pressed
            ? colors.tintPressed
            : colors.tint,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}
    >
      <Text
        style={{
          color: colors.white,
          fontSize: 17,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
      <OnboardingIcon name="arrow-forward" size={20} color={colors.white} />
    </Pressable>
  );
}
