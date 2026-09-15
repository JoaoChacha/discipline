import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "~/theme/tokens";
import { OnboardingIcon } from "./OnboardingIcon";
import { PrimaryButton } from "./PrimaryButton";
import { ProgressBar } from "./ProgressBar";

export function OnboardingShell({
  step,
  total,
  reduceMotion,
  onBack,
  onClose,
  onSkip,
  ctaLabel,
  onCta,
  ctaDisabled,
  ctaTestID,
  footerNote,
  children,
}: {
  step: number;
  total: number;
  reduceMotion: boolean;
  onBack?: () => void;
  onClose?: () => void;
  onSkip?: () => void;
  ctaLabel: string;
  onCta: () => void;
  ctaDisabled?: boolean;
  ctaTestID?: string;
  footerNote?: string;
  children: ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
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
        {onClose ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close onboarding"
            onPress={onClose}
            hitSlop={8}
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
          >
            <OnboardingIcon
              name="close"
              size={22}
              color={colors.secondaryLabel}
            />
          </Pressable>
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 999,
            }}
          >
            <OnboardingIcon name="chevron-back" size={26} color={colors.tint} />
          </Pressable>
        )}

        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.secondaryLabel,
          }}
        >
          {step} of {total}
        </Text>

        {onSkip ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip"
            onPress={onSkip}
            hitSlop={8}
            style={{
              minHeight: 44,
              justifyContent: "center",
              paddingHorizontal: 8,
            }}
          >
            <Text style={{ fontSize: 15, color: colors.tint }}>Skip</Text>
          </Pressable>
        ) : (
          <View style={{ height: 44, width: 44 }} />
        )}
      </View>

      <ProgressBar step={step} total={total} reduceMotion={reduceMotion} />

      <View style={{ flex: 1, paddingTop: spacing.contentTop }}>
        {children}
      </View>

      <View>
        <PrimaryButton
          label={ctaLabel}
          onPress={onCta}
          disabled={ctaDisabled}
          testID={ctaTestID}
        />
        {footerNote ? (
          <Text
            style={{
              marginTop: 12,
              textAlign: "center",
              fontSize: 12,
              lineHeight: 16,
              color: colors.secondaryLabel,
            }}
          >
            {footerNote}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
