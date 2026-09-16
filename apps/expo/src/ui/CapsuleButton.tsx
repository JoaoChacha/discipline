import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function CapsuleButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  showArrow = false,
  icon,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "link" | "ghost";
  showArrow?: boolean;
  icon?: ComponentProps<typeof Ionicons>["name"];
  testID?: string;
}) {
  const { colors, type, spacing } = useTheme();
  const isLink = variant === "link";
  const isGhost = variant === "ghost";
  const withArrow = showArrow && !isLink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: isLink ? 40 : spacing.buttonHeight,
        height: isLink ? 40 : spacing.buttonHeight,
        borderRadius: spacing.buttonRadius,
        backgroundColor: isLink
          ? "transparent"
          : isGhost
            ? colors.surface
            : disabled
              ? colors.hairline
              : colors.cta,
        borderWidth: isGhost ? 1 : 0,
        borderColor: colors.hairline,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: isLink ? 12 : icon ? 20 : 48,
        flexDirection: "row",
        gap: icon ? 10 : 0,
        transform: [{ scale: pressed && !disabled ? 0.99 : 1 }],
        opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
      })}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={isGhost ? colors.ink : colors.ctaText}
        />
      ) : null}
      <Text
        style={
          isLink
            ? type.link
            : {
                ...type.button,
                color: isGhost
                  ? colors.ink
                  : disabled
                    ? colors.muted
                    : colors.ctaText,
              }
        }
      >
        {label}
      </Text>
      {withArrow ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            right: 20,
            height: 17,
            width: 17,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name="arrow-forward"
            size={17}
            color={disabled ? colors.muted : colors.ctaText}
          />
        </View>
      ) : null}
    </Pressable>
  );
}
