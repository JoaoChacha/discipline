import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { ScrollView } from "react-native";

export function ScreenScroll({
  children,
  contentStyle,
  bottomInset = 16,
}: {
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  bottomInset?: number;
}) {
  return (
    <ScrollView
      style={{ flex: 1, minHeight: 0 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        { flexGrow: 1, paddingBottom: bottomInset },
        contentStyle,
      ]}
    >
      {children}
    </ScrollView>
  );
}
