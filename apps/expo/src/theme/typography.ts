import type { TextStyle } from "react-native";
import { Platform } from "react-native";

import type { ThemeColors } from "./tokens";

type Weight = 400 | 500 | 600 | 700 | 800;

const nativeFamilies: Record<Weight, string> = {
  400: "PlusJakartaSans_400Regular",
  500: "PlusJakartaSans_500Medium",
  600: "PlusJakartaSans_600SemiBold",
  700: "PlusJakartaSans_700Bold",
  800: "PlusJakartaSans_800ExtraBold",
};

export function fontFamily(weight: Weight) {
  return Platform.select({
    web: "Plus Jakarta Sans",
    default: nativeFamilies[weight],
  });
}

function tracking(value: number) {
  return Platform.OS === "web" ? Math.max(value, -0.3) : value;
}

export function createType(colors: ThemeColors) {
  return {
    money: {
      fontFamily: fontFamily(800),
      fontSize: 40,
      fontWeight: "800",
      lineHeight: 44,
      letterSpacing: tracking(-2),
      color: colors.featureText,
      fontVariant: ["tabular-nums"],
    } satisfies TextStyle,
    title: {
      fontFamily: fontFamily(800),
      fontSize: 34,
      fontWeight: "800",
      lineHeight: 39,
      letterSpacing: tracking(-1.2),
      color: colors.ink,
    } satisfies TextStyle,
    homeTitle: {
      fontFamily: fontFamily(800),
      fontSize: 28,
      fontWeight: "800",
      lineHeight: 34,
      letterSpacing: tracking(-0.8),
      color: colors.ink,
    } satisfies TextStyle,
    brand: {
      fontFamily: fontFamily(700),
      fontSize: 15,
      fontWeight: "700",
      color: colors.ink,
    } satisfies TextStyle,
    eyebrow: {
      fontFamily: fontFamily(600),
      fontSize: 12,
      fontWeight: "600",
      letterSpacing: 0.8,
      color: colors.muted,
    } satisfies TextStyle,
    headline: {
      fontFamily: fontFamily(700),
      fontSize: 17,
      fontWeight: "700",
      lineHeight: 22,
      color: colors.ink,
    } satisfies TextStyle,
    body: {
      fontFamily: fontFamily(400),
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 22,
      color: colors.muted,
    } satisfies TextStyle,
    bodyInk: {
      fontFamily: fontFamily(400),
      fontSize: 15,
      fontWeight: "400",
      lineHeight: 22,
      color: colors.ink,
    } satisfies TextStyle,
    callout: {
      fontFamily: fontFamily(600),
      fontSize: 15,
      fontWeight: "600",
      color: colors.ink,
    } satisfies TextStyle,
    caption: {
      fontFamily: fontFamily(500),
      fontSize: 12,
      fontWeight: "500",
      lineHeight: 16,
      color: colors.muted,
    } satisfies TextStyle,
    pill: {
      fontFamily: fontFamily(600),
      fontSize: 14,
      fontWeight: "600",
      lineHeight: 18,
      color: colors.ctaText,
    } satisfies TextStyle,
    navLabel: {
      fontFamily: fontFamily(600),
      fontSize: 11,
      fontWeight: "600",
      lineHeight: 13,
    } satisfies TextStyle,
    stepLabel: {
      fontFamily: fontFamily(600),
      fontSize: 13,
      fontWeight: "600",
      color: colors.muted,
    } satisfies TextStyle,
    button: {
      fontFamily: fontFamily(600),
      fontSize: 16,
      fontWeight: "600",
      color: colors.ctaText,
    } satisfies TextStyle,
    kpi: {
      fontFamily: fontFamily(800),
      fontSize: 17,
      fontWeight: "800",
      color: colors.ink,
      fontVariant: ["tabular-nums"],
    } satisfies TextStyle,
  } as const;
}

export type ThemeTypography = ReturnType<typeof createType>;
