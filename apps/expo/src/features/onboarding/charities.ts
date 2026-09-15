export type CharityIcon = "droplets" | "code";

export const EXAMPLE_CHARITY_GROUP = [
  {
    id: "water-org",
    name: "Water.org",
    mission: "Clean water access",
    icon: "droplets" as const,
    accent: "blue" as const,
    percent: 60,
  },
  {
    id: "girls-who-code",
    name: "Girls Who Code",
    mission: "Education",
    icon: "code" as const,
    accent: "purple" as const,
    percent: 40,
  },
];
