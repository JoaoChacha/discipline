import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { ScreenWash } from "~/ui/ScreenWash";
import { OnboardingIcon } from "./OnboardingIcon";
import { ProgressBar } from "./ProgressBar";

export function OnboardingShell({
  step,
  total,
  reduceMotion,
  leading = "back",
  onLeading,
  onSkip,
  ctaLabel,
  onCta,
  ctaDisabled,
  ctaTestID,
  footer,
  children,
}: {
  step: number;
  total: number;
  reduceMotion: boolean;
  leading?: "back" | "close";
  onLeading: () => void;
  onSkip?: () => void;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  ctaTestID?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const { colors, type, spacing } = useTheme();
  const padded = String(total).padStart(2, "0");

  return (
    <ScreenWash>
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
            accessibilityLabel={
              leading === "close" ? "Close onboarding" : "Back"
            }
            onPress={onLeading}
            hitSlop={8}
            testID="onboarding-back"
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
          >
            <OnboardingIcon
              name={leading === "close" ? "close" : "chevron-back"}
              size={leading === "close" ? 22 : 26}
              color={colors.ink}
            />
          </Pressable>

          <Text style={type.stepLabel}>
            {step} / {padded}
          </Text>

          {onSkip ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Skip"
              onPress={onSkip}
              hitSlop={8}
              testID="onboarding-skip"
              style={{
                minHeight: 44,
                justifyContent: "center",
                paddingHorizontal: 8,
              }}
            >
              <Text style={{ ...type.callout, color: colors.muted }}>Skip</Text>
            </Pressable>
          ) : (
            <View style={{ height: 44, width: 44 }} />
          )}
        </View>

        <ProgressBar step={step} total={total} reduceMotion={reduceMotion} />

        <View style={{ flex: 1, minHeight: 0, paddingTop: spacing.contentTop }}>
          {children}
        </View>

        <View>
          <CapsuleButton
            label={ctaLabel}
            onPress={onCta}
            disabled={ctaDisabled}
            testID={ctaTestID}
          />
          {footer}
        </View>
      </View>
    </ScreenWash>
  );
}
