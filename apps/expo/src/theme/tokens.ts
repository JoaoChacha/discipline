export const colors = {
  background: "#0F1115",
  surface: "#1B1E25",
  surfaceMuted: "#15181E",
  label: "#F5F7FA",
  secondaryLabel: "#A8AFBA",
  separator: "#343943",
  tint: "#2F80FF",
  tintPressed: "#1769E8",
  tintContainer: "#142B4F",
  tintEdge: "rgba(47, 128, 255, 0.16)",
  success: "#36C98F",
  successContainer: "#15372C",
  pending: "#F2A93B",
  pendingContainer: "#332A19",
  charityAccent: "#C68CFF",
  charityAccentContainer: "#2A2033",
  white: "#FFFFFF",
  lime: "#C6D24A",
} as const;

export const fonts = {
  display: "Manrope",
  interface: "Inter",
} as const;

export const spacing = {
  screenX: 20,
  screenBottom: 32,
  screenTop: 20,
  header: 44,
  progress: 4,
  contentTop: 28,
  cardRadius: 20,
  buttonRadius: 12,
  buttonHeight: 52,
} as const;

export const motion = {
  duration: 560,
  reveal: 520,
  pressDuration: 120,
  easing: [0.25, 0.8, 0.25, 1] as const,
} as const;
