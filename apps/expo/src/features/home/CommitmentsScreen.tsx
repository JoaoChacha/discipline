import { Text, View } from "react-native";

import { formatDeadline, formatEuro } from "~/features/commitment/format";
import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { Chip } from "~/ui/Chip";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { useCommitments } from "./useCommitments";

export function CommitmentsScreen({
  bottomInset,
  onCreate,
}: {
  bottomInset: number;
  onCreate: () => void;
}) {
  const { type, spacing } = useTheme();
  const { owned } = useCommitments();

  return (
    <ScreenScroll
      bottomInset={bottomInset}
      contentStyle={{ paddingHorizontal: spacing.screenX }}
    >
      <Text style={type.homeTitle}>Commitments</Text>
      <Text style={[type.body, { marginTop: 8 }]}>
        {owned.length === 0
          ? "Create a commitment to put a stake on an action."
          : owned.length === 1
            ? "One stake is live."
            : `${owned.length} stakes are live.`}
      </Text>

      {owned.length === 0 ? (
        <View style={{ marginTop: 24 }}>
          <CapsuleButton
            label="Create a commitment"
            onPress={onCreate}
            testID="commitments-create"
          />
        </View>
      ) : (
        owned.map((row) => {
          const pending = row.status === "awaiting_verifier";
          return (
            <SurfaceCard key={row.id} style={{ marginTop: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <Text style={[type.headline, { flex: 1 }]}>{row.title}</Text>
                <Chip label={pending ? "Waiting" : "Proof due"} />
              </View>
              <Text style={[type.body, { marginTop: 10 }]}>
                {formatEuro(row.amountCents, row.currency)}{" "}
                {row.stakeStatus === "held" ? "held" : "unheld"} ·{" "}
                {formatDeadline(new Date(row.dueAt))}
              </Text>
              <Text style={[type.caption, { marginTop: 6 }]}>
                Verifier{" "}
                {row.verifier?.name ??
                  row.pendingInvite?.displayName ??
                  "pending"}
              </Text>
            </SurfaceCard>
          );
        })
      )}
    </ScreenScroll>
  );
}
