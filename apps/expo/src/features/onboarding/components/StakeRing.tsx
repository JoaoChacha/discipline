import { Platform, Text, View } from "react-native";

import { colors, fonts } from "~/theme/tokens";

export function StakeRing({ size, label }: { size: number; label: string }) {
  const hole = Math.max(6, Math.round(size * 0.125));
  const radius = size * 0.34;

  return (
    <View
      accessibilityLabel="80 / 20 stake mark"
      style={{
        height: size,
        width: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          ...Platform.select({
            web: {
              backgroundImage:
                "conic-gradient(from -90deg, #2F80FF 0 80%, #36C98F 80% 100%)",
            },
            default: {
              backgroundColor: colors.tint,
            },
          }),
          position: "absolute",
          height: size,
          width: size,
          overflow: "hidden",
          borderRadius: radius,
        }}
      >
        {Platform.OS === "web" ? null : (
          <View
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              height: "20%",
              width: "20%",
              backgroundColor: colors.success,
            }}
          />
        )}
      </View>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: hole,
          right: hole,
          bottom: hole,
          left: hole,
          borderRadius: radius * 0.85,
          backgroundColor: colors.tintContainer,
        }}
      />
      <Text
        style={{
          zIndex: 1,
          fontFamily: Platform.select({
            web: `${fonts.display}, system-ui, sans-serif`,
            default: undefined,
          }),
          fontSize: size >= 72 ? 15 : 8,
          fontWeight: "700",
          color: colors.white,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
