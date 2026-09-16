import type { ComponentProps } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";
import { LimeTile } from "./LimeTile";
import { RowIcon } from "./RowIcon";

export function Notice({
  icon,
  title,
  body,
  lime = false,
  subtle = false,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
  lime?: boolean;
  subtle?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginTop: 12,
        padding: 14,
        borderRadius: 22,
        backgroundColor: subtle ? "transparent" : colors.surface,
        borderWidth: 1,
        borderColor: colors.hairline,
      }}
    >
      {lime ? <LimeTile name={icon} /> : <RowIcon name={icon} />}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            ...type.callout,
            fontSize: 13,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontFamily: type.caption.fontFamily,
            fontSize: 11,
            fontWeight: "500",
            lineHeight: 16,
            color: colors.muted,
          }}
        >
          {body}
        </Text>
      </View>
    </View>
  );
}
