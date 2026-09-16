import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { OnboardingIcon } from "~/features/onboarding/components/OnboardingIcon";
import { useTheme } from "~/theme/ThemeProvider";

export function AuthField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  autoComplete,
  keyboardType,
  textContentType,
  returnKeyType,
  testID,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  autoComplete?: "email" | "name" | "password" | "off";
  keyboardType?: "email-address" | "default";
  textContentType?: "emailAddress" | "name" | "password" | "newPassword";
  returnKeyType?: "next" | "done";
  testID?: string;
  onSubmitEditing?: () => void;
}) {
  const { colors, type, spacing } = useTheme();
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const hidden = secureTextEntry && !revealed;

  return (
    <View>
      <Text style={type.caption}>{label}</Text>
      <View
        style={{
          marginTop: 8,
          height: spacing.buttonHeight,
          borderRadius: spacing.surfaceRadius,
          borderWidth: 1,
          borderColor: focused ? colors.ink : colors.hairline,
          backgroundColor: colors.surface,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={hidden}
          autoCapitalize={keyboardType === "email-address" ? "none" : "words"}
          autoCorrect={false}
          autoComplete={autoComplete}
          keyboardType={keyboardType}
          textContentType={textContentType}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          testID={testID}
          style={{
            ...type.bodyInk,
            flex: 1,
            height: "100%",
            paddingVertical: 0,
          }}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={revealed ? "Hide password" : "Show password"}
            hitSlop={8}
            onPress={() => setRevealed((current) => !current)}
            testID={testID ? `${testID}-reveal` : undefined}
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <OnboardingIcon
              name={revealed ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
