import { ScrollView, Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { Chip } from "~/ui/Chip";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { ACTIVE_COMMITMENT } from "./data";

export function CommitmentsScreen({ bottomInset }: { bottomInset: number }) {
  const { type, spacing } = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.screenX,
        paddingBottom: bottomInset,
      }}
    >
      <Text style={type.homeTitle}>Commitments</Text>
      <Text style={[type.body, { marginTop: 8 }]}>
        One active stake is waiting for proof.
      </Text>

      <SurfaceCard style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Text style={type.headline}>{ACTIVE_COMMITMENT.detail}</Text>
          <Chip label="Proof due" />
        </View>
        <Text style={[type.body, { marginTop: 10 }]}>
          {ACTIVE_COMMITMENT.stake} held · {ACTIVE_COMMITMENT.deadline}
        </Text>
        <Text style={[type.caption, { marginTop: 6 }]}>
          Verifier {ACTIVE_COMMITMENT.verifier}
        </Text>
      </SurfaceCard>
    </ScrollView>
  );
}
