import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";

export function CapsuleButton({
  label,
  onPress,
  disabled = false,
  variant = "primary",
  showArrow = false,
  testID,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "link";
  showArrow?: boolean;
  testID?: string;
}) {
  const { colors, type, spacing } = useTheme();
  const isLink = variant === "link";
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
          : disabled
            ? colors.hairline
            : colors.cta,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: isLink ? 12 : 48,
        transform: [{ scale: pressed && !disabled ? 0.99 : 1 }],
        opacity: disabled ? 0.55 : pressed ? 0.9 : 1,
      })}
    >
      <Text
        style={
          isLink
            ? type.link
            : {
                ...type.button,
                color: disabled ? colors.muted : colors.ctaText,
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
