import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { Chip } from "~/ui/Chip";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { ACTIVE_COMMITMENT } from "./data";

export function CommitmentsScreen({ bottomInset }: { bottomInset: number }) {
  const { type, spacing } = useTheme();

  return (
    <ScreenScroll
      bottomInset={bottomInset}
      contentStyle={{ paddingHorizontal: spacing.screenX }}
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
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <Text style={[type.headline, { flex: 1 }]}>
            {ACTIVE_COMMITMENT.detail}
          </Text>
          <Chip label="Proof due" />
        </View>
        <Text style={[type.body, { marginTop: 10 }]}>
          {ACTIVE_COMMITMENT.stake} held · {ACTIVE_COMMITMENT.deadline}
        </Text>
        <Text style={[type.caption, { marginTop: 6 }]}>
          Verifier {ACTIVE_COMMITMENT.verifier}
        </Text>
      </SurfaceCard>
    </ScreenScroll>
  );
}
