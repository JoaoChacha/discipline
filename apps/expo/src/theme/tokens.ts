export const palettes = {
  light: {
    canvas: "#E8E7EF",
    field: "#F7F6FA",
    wash: "#F8ECEC",
    ink: "#0E0C0D",
    muted: "#6F6B76",
    surface: "#FFFFFF",
    hairline: "#E7E5EC",
    feature: "#101010",
    featureText: "#FFFFFF",
    featureMuted: "rgba(255,255,255,0.62)",
    ghost: "rgba(255,255,255,0.12)",
    chip: "#EEEAF8",
    cta: "#0E0C0D",
    ctaText: "#FFFFFF",
    link: "#1D7EFF",
    lime: "#C6D24A",
    positive: "#53B25D",
    nav: "#FFFFFF",
    white: "#FFFFFF",
  },
  dark: {
    canvas: "#050506",
    field: "#0D0D0F",
    wash: "#211719",
    ink: "#F7F6FA",
    muted: "#9C99A3",
    surface: "#19191C",
    hairline: "#2B2A30",
    feature: "#F4F3F7",
    featureText: "#0E0C0D",
    featureMuted: "rgba(14,12,13,0.62)",
    ghost: "rgba(14,12,13,0.12)",
    chip: "#242329",
    cta: "#F4F3F7",
    ctaText: "#0E0C0D",
    link: "#72A7FF",
    lime: "#C6D24A",
    positive: "#74C982",
    nav: "#19191C",
    white: "#FFFFFF",
  },
} as const;

export type ThemeColors = (typeof palettes)[keyof typeof palettes];
export type ColorSchemeName = keyof typeof palettes;

export const fonts = {
  sans: "Plus Jakarta Sans",
} as const;

export const spacing = {
  screenX: 20,
  screenBottom: 24,
  screenTop: 12,
  header: 44,
  progress: 4,
  contentTop: 28,
  cardRadius: 28,
  surfaceRadius: 24,
  buttonRadius: 999,
  buttonHeight: 52,
  navHeight: 64,
  navRadius: 28,
  tile: 40,
} as const;

export const motion = {
  duration: 360,
  reveal: 360,
  pressDuration: 120,
  easing: [0.25, 0.8, 0.25, 1] as const,
} as const;
