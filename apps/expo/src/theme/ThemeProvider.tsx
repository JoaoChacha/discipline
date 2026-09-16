import type { ReactNode } from "react";
import { createContext, use, useCallback, useMemo, useState } from "react";
import { useColorScheme, View } from "react-native";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";

import type { ColorSchemeName, ThemeColors } from "./tokens";
import type { ThemeTypography } from "./typography";
import { motion, palettes, spacing } from "./tokens";
import { createType } from "./typography";

interface ThemeValue {
  scheme: ColorSchemeName;
  colors: ThemeColors;
  type: ThemeTypography;
  spacing: typeof spacing;
  motion: typeof motion;
  fontsReady: boolean;
  setForcedScheme: (scheme: ColorSchemeName | null) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const [forcedScheme, setForcedSchemeState] = useState<ColorSchemeName | null>(
    null,
  );
  const setForcedScheme = useCallback((next: ColorSchemeName | null) => {
    setForcedSchemeState(next);
  }, []);
  const scheme: ColorSchemeName =
    forcedScheme ?? (colorScheme === "dark" ? "dark" : "light");
  const colors = palettes[scheme];
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const fontsReady = fontsLoaded || Boolean(fontError);
  const type = useMemo(() => createType(colors), [colors]);

  const value = useMemo(
    () => ({
      scheme,
      colors,
      type,
      spacing,
      motion,
      fontsReady,
      setForcedScheme,
    }),
    [colors, fontsReady, scheme, setForcedScheme, type],
  );

  return (
    <ThemeContext value={value}>
      {fontsReady ? (
        children
      ) : (
        <View style={{ flex: 1, backgroundColor: colors.field }} />
      )}
    </ThemeContext>
  );
}

export function useTheme() {
  const context = use(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
