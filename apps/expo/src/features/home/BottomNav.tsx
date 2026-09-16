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
  { id: "commitments", label: "Commitments", icon: "checkbox-outline" },
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
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: Math.max(insets.bottom, 12),
        pointerEvents: "box-none",
      }}
    >
      <View
        style={{
          height: 64,
          borderRadius: 28,
          backgroundColor: colors.nav,
          borderWidth: 1,
          borderColor: colors.navLine,
          flexDirection: "row",
          paddingHorizontal: 4,
        }}
      >
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const color = isActive ? colors.ink : colors.muted;
          const compact = tab.id === "commitments";
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
                    height: 20,
                    width: 20,
                    borderRadius: 999,
                    borderWidth: 1.5,
                    borderColor: color,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="add" size={15} color={color} />
                </View>
              ) : (
                <Ionicons name={tab.icon} size={20} color={color} />
              )}
              <Text
                style={{
                  ...type.navLabel,
                  height: 16,
                  fontSize: compact && !isActive ? 10 : 11,
                  fontWeight: isActive ? "700" : "500",
                  color,
                }}
              >
                {tab.label}
              </Text>
              {isActive ? (
                <View
                  style={{
                    position: "absolute",
                    bottom: 6,
                    height: 4,
                    width: 4,
                    borderRadius: 999,
                    backgroundColor: colors.lime,
                  }}
                />
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
