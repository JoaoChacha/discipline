import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

import { SurfaceCard } from "~/ui/SurfaceCard";

export function BrandCard({
  padded = true,
  style,
  children,
}: {
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return (
    <SurfaceCard padded={padded} style={style}>
      {children}
    </SurfaceCard>
  );
}
