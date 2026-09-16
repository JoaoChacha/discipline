import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { formatEuro } from "../format";

export function HeldScreen({
  first,
  title,
  amountCents,
  verifierName,
  pending,
  onDone,
}: {
  first: boolean;
  title: string;
  amountCents: number;
  verifierName: string;
  pending: boolean;
  onDone: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { colors, type, spacing } = useTheme();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingHorizontal: spacing.screenX,
        paddingTop: Math.max(insets.top, 24),
        paddingBottom: Math.max(insets.bottom, 18),
      }}
    >
      <View style={{ marginTop: 48, alignItems: "center" }}>
        <View
          style={{
            height: 88,
            width: 88,
            borderRadius: 999,
            backgroundColor: colors.lime,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="checkmark" size={40} color={colors.ink} />
        </View>
        <Text style={[type.title, { textAlign: "center", marginTop: 28 }]}>
          {first ? "Your first commitment is live." : "Commitment is live."}
        </Text>
        <Text
          style={[
            type.body,
            { textAlign: "center", marginTop: 12, paddingHorizontal: 12 },
          ]}
        >
          {pending
            ? `${formatEuro(amountCents)} will be held on ${title} once ${verifierName} accepts the invite.`
            : `${formatEuro(amountCents)} is held on ${title}. ${verifierName} will review your proof.`}
        </Text>
      </View>
      <CapsuleButton
        label="Back to Today"
        onPress={onDone}
        testID="held-done"
      />
    </View>
  );
}
