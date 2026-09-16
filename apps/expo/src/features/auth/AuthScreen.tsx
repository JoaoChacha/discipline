import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { OnboardingIcon } from "~/features/onboarding/components/OnboardingIcon";
import { Reveal } from "~/features/onboarding/components/Reveal";
import { useTheme } from "~/theme/ThemeProvider";
import { BrandMark } from "~/ui/BrandMark";
import { PhoneFrame } from "~/ui/PhoneFrame";
import { ScreenWash } from "~/ui/ScreenWash";

export function AuthScreen({
  eyebrow,
  title,
  body,
  onBack,
  children,
  actions,
  footer,
}: {
  eyebrow: string;
  title: string;
  body: string;
  onBack: () => void;
  children: ReactNode;
  actions: ReactNode;
  footer?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { colors, type, spacing } = useTheme();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  return (
    <PhoneFrame>
      <ScreenWash>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: spacing.screenX,
              paddingTop: Math.max(insets.top, spacing.screenTop),
              paddingBottom: Math.max(insets.bottom, spacing.screenBottom),
            }}
          >
            <View
              style={{
                height: spacing.header,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Back"
                onPress={onBack}
                hitSlop={8}
                testID="auth-back"
                style={{
                  height: 44,
                  width: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                }}
              >
                <OnboardingIcon
                  name="chevron-back"
                  size={26}
                  color={colors.ink}
                />
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <BrandMark size={28} />
                <Text style={type.brand}>Discipline</Text>
              </View>
              <View style={{ height: 44, width: 44 }} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingTop: 20 }}
            >
              <Reveal reduceMotion={reduceMotion}>
                <Text style={type.eyebrow}>{eyebrow}</Text>
              </Reveal>
              <Reveal
                reduceMotion={reduceMotion}
                delay={80}
                style={{ marginTop: 10 }}
              >
                <Text style={type.title}>{title}</Text>
              </Reveal>
              <Reveal
                reduceMotion={reduceMotion}
                delay={120}
                style={{ marginTop: 12 }}
              >
                <Text style={type.body}>{body}</Text>
              </Reveal>
              <Reveal
                reduceMotion={reduceMotion}
                delay={160}
                style={{ marginTop: 28 }}
              >
                {children}
              </Reveal>
            </ScrollView>

            <View style={{ gap: 4, paddingTop: 12 }}>
              {actions}
              {footer}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScreenWash>
    </PhoneFrame>
  );
}
