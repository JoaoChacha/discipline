import type { TextStyle } from "react-native";
import { Platform } from "react-native";

import { colors, fonts } from "./tokens";

const displayFamily = Platform.select({
  web: `${fonts.display}, system-ui, sans-serif`,
  default: undefined,
});

const interfaceFamily = Platform.select({
  web: `${fonts.interface}, system-ui, sans-serif`,
  default: undefined,
});

export const type = {
  welcomeTitle: {
    fontFamily: displayFamily,
    fontSize: 42,
    fontWeight: "700",
    lineHeight: 48,
    letterSpacing: -1,
    color: colors.label,
  } satisfies TextStyle,
  title: {
    fontFamily: displayFamily,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 40,
    letterSpacing: -0.8,
    color: colors.label,
  } satisfies TextStyle,
  brand: {
    fontFamily: displayFamily,
    fontSize: 15,
    fontWeight: "700",
    color: colors.label,
  } satisfies TextStyle,
  eyebrow: {
    fontFamily: interfaceFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.tint,
  } satisfies TextStyle,
  headline: {
    fontFamily: interfaceFamily,
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 22,
    color: colors.label,
  } satisfies TextStyle,
  body: {
    fontFamily: interfaceFamily,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  bodyTight: {
    fontFamily: interfaceFamily,
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 20,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  callout: {
    fontFamily: interfaceFamily,
    fontSize: 15,
    fontWeight: "600",
    color: colors.label,
  } satisfies TextStyle,
  footnote: {
    fontFamily: interfaceFamily,
    fontSize: 13,
    fontWeight: "400",
    lineHeight: 18,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  caption: {
    fontFamily: interfaceFamily,
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  stepLabel: {
    fontFamily: interfaceFamily,
    fontSize: 13,
    fontWeight: "600",
    color: colors.secondaryLabel,
  } satisfies TextStyle,
  button: {
    fontFamily: interfaceFamily,
    fontSize: 17,
    fontWeight: "600",
    color: colors.white,
  } satisfies TextStyle,
  kpi: {
    fontFamily: displayFamily,
    fontSize: 17,
    fontWeight: "700",
    color: colors.label,
    fontVariant: ["tabular-nums"],
  } satisfies TextStyle,
} as const;
