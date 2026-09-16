import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { fontFamily } from "~/theme/typography";

export function BrandMark({ size = 34 }: { size?: number }) {
  const { colors } = useTheme();

  return (
    <View
      accessibilityLabel="Discipline"
      style={{
        height: size,
        width: size,
        borderRadius: size / 2,
        backgroundColor: colors.ink,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily(800),
          fontSize: size * 0.38,
          fontWeight: "800",
          color: colors.field,
          marginTop: -1,
        }}
      >
        D
      </Text>
    </View>
  );
}
