import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

import type { CharityIcon } from "../charities";

type IconName = ComponentProps<typeof Ionicons>["name"];

const CHARITY_ICONS: Record<CharityIcon, IconName> = {
  droplets: "water-outline",
  code: "code-slash-outline",
  heart: "heart-outline",
  bug: "bug-outline",
  book: "book-outline",
};

export function OnboardingIcon({
  name,
  size,
  color,
}: {
  name: IconName;
  size: number;
  color: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}

export function CharityGlyph({
  icon,
  size,
  color,
}: {
  icon: CharityIcon;
  size: number;
  color: string;
}) {
  return <Ionicons name={CHARITY_ICONS[icon]} size={size} color={color} />;
}
