import { Pressable, Text } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";

export function CapsuleButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "link" | "ghost";
  testID?: string;
}) {
  const { colors, type, spacing } = useTheme();
  const isLink = variant === "link";
  const isGhost = variant === "ghost";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: isLink ? 44 : spacing.buttonHeight,
        height: isLink ? undefined : spacing.buttonHeight,
        borderRadius: spacing.buttonRadius,
        borderWidth: isGhost ? 1 : 0,
        borderColor: colors.hairline,
        backgroundColor: isLink
          ? "transparent"
          : isGhost
            ? colors.surface
            : disabled
              ? colors.hairline
              : colors.cta,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
      })}
    >
      <Text
        style={
          isLink
            ? { ...type.callout, color: colors.link }
            : isGhost
              ? { ...type.button, color: colors.ink }
              : {
                  ...type.button,
                  color: disabled ? colors.muted : colors.ctaText,
                }
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
