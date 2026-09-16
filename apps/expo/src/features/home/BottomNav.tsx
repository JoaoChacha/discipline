import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import type { HomeTab } from "./types";
import { useTheme } from "~/theme/ThemeProvider";

const TABS: {
  id: HomeTab;
  label: string;
  icon: ComponentProps<typeof Ionicons>["name"];
}[] = [
  { id: "today", label: "Today", icon: "home-outline" },
  { id: "commitments", label: "Commitments", icon: "list-outline" },
  { id: "new", label: "New", icon: "add" },
  { id: "you", label: "You", icon: "person-outline" },
];

export function BottomNav({
  active,
  onChange,
}: {
  active: HomeTab;
  onChange: (tab: HomeTab) => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, type, spacing } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        left: spacing.screenX,
        right: spacing.screenX,
        bottom: Math.max(insets.bottom, 12),
        pointerEvents: "box-none",
      }}
    >
      <View
        style={{
          height: spacing.navHeight,
          borderRadius: spacing.navRadius,
          backgroundColor: colors.nav,
          borderWidth: 1,
          borderColor: colors.hairline,
          flexDirection: "row",
          paddingHorizontal: 6,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const color = isActive ? colors.ink : colors.muted;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={tab.label}
              onPress={() => onChange(tab.id)}
              testID={`home-tab-${tab.id}`}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              {tab.id === "new" ? (
                <View
                  style={{
                    height: 28,
                    width: 28,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={16} color={color} />
                </View>
              ) : (
                <Ionicons name={tab.icon} size={20} color={color} />
              )}
              <Text
                style={{
                  ...type.navLabel,
                  color,
                  fontWeight: isActive ? "700" : "600",
                }}
              >
                {tab.label}
              </Text>
              <View
                style={{
                  height: 4,
                  width: 4,
                  borderRadius: 999,
                  backgroundColor: isActive ? colors.lime : "transparent",
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
