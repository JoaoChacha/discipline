import type { ComponentProps } from "react";
import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function CapsuleButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "link" | "ghost";
  icon?: ComponentProps<typeof Ionicons>["name"];
  testID?: string;
}) {
  const { colors, type, spacing } = useTheme();
  const isLink = variant === "link";
  const isGhost = variant === "ghost";
  const labelColor = isLink
    ? colors.link
    : isGhost
      ? colors.ink
      : disabled
        ? colors.muted
        : colors.ctaText;

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
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingHorizontal: 20,
        transform: [{ scale: pressed && !disabled ? 0.985 : 1 }],
        opacity: disabled ? 0.55 : pressed ? 0.92 : 1,
      })}
    >
      {icon ? <Ionicons name={icon} size={18} color={labelColor} /> : null}
      <Text
        style={
          isLink
            ? { ...type.callout, color: colors.link }
            : isGhost
              ? { ...type.button, color: colors.ink }
              : {
                  ...type.button,
                  color: labelColor,
                }
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
