import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { ScreenCopy } from "~/features/onboarding/components/ScreenCopy";
import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { trpc } from "~/utils/api";
import { useCommitment, useStakeMath } from "../CommitmentProvider";
import { formatDeadline, formatEuro } from "../format";

export function ReviewScreen() {
  const { colors, type } = useTheme();
  const {
    title,
    dueAt,
    amountCents,
    causes,
    friend,
    pendingInvite,
    paymentKind,
    setPaymentKind,
    consented,
    setConsented,
  } = useCommitment();
  const outcome = useStakeMath();
  const charities = useQuery(trpc.charity.list.queryOptions());
  const catalog = charities.data ?? [];
  const causeLines = causes.map((cause) => {
    const name =
      catalog.find((item) => item.id === cause.charityId)?.name ??
      cause.charityId;
    return `${name} ${cause.percent}%`;
  });

  return (
    <View>
      <ScreenCopy
        eyebrow="YOU SET THE TERMS"
        title="Ready to make it real?"
        description="Review the stake, the cause, and who verifies your proof."
      />

      <FeatureCard style={{ marginTop: 22 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <Text
            style={{
              ...type.callout,
              color: colors.featureText,
              flex: 1,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              ...type.caption,
              color: colors.featureMuted,
              textAlign: "right",
            }}
          >
            Due {formatDeadline(dueAt)}
          </Text>
        </View>
        <Text style={[type.money, { marginTop: 16 }]}>
          {formatEuro(amountCents)}
        </Text>
        <Text
          style={{
            marginTop: 4,
            fontFamily: type.caption.fontFamily,
            fontSize: 13,
            color: colors.featureMuted,
          }}
        >
          Held once you confirm
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 18 }}>
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: colors.ghost,
              padding: 12,
            }}
          >
            <Text style={{ ...type.caption, color: colors.featureMuted }}>
              COMPLETE
            </Text>
            <Text
              style={{
                marginTop: 6,
                fontFamily: type.kpi.fontFamily,
                fontSize: 17,
                fontWeight: "800",
                color: colors.lime,
                fontVariant: ["tabular-nums"],
              }}
            >
              +{formatEuro(outcome.returnedCents)}
            </Text>
            <Text style={{ ...type.caption, color: colors.featureMuted }}>
              Returned to you
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: colors.ghost,
              padding: 12,
            }}
          >
            <Text style={{ ...type.caption, color: colors.featureMuted }}>
              MISS
            </Text>
            <Text
              style={{
                marginTop: 6,
                fontFamily: type.kpi.fontFamily,
                fontSize: 17,
                fontWeight: "800",
                color: colors.featureText,
                fontVariant: ["tabular-nums"],
              }}
            >
              {formatEuro(outcome.causeCents)}
            </Text>
            <Text style={{ ...type.caption, color: colors.featureMuted }}>
              To your cause · {formatEuro(outcome.feeCents)} fee
            </Text>
          </View>
        </View>
      </FeatureCard>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
        <SurfaceCard style={{ flex: 1 }}>
          <LimeTile name="heart-outline" size={34} />
          <Text style={[type.caption, { marginTop: 10 }]}>Cause</Text>
          <Text style={[type.callout, { marginTop: 2 }]}>
            {causeLines[0] ?? "Choose a cause"}
          </Text>
          {causeLines[1] ? (
            <Text style={type.caption}>{causeLines[1]}</Text>
          ) : null}
        </SurfaceCard>
        <SurfaceCard style={{ flex: 1 }}>
          <LimeTile name="person-outline" size={34} />
          <Text style={[type.caption, { marginTop: 10 }]}>Verifier</Text>
          <Text style={[type.callout, { marginTop: 2 }]}>
            {friend?.name ?? pendingInvite?.displayName ?? "Choose a verifier"}
          </Text>
          <Text style={type.caption}>
            {friend ? "Accepted friend" : "Pending — invite sent"}
          </Text>
        </SurfaceCard>
      </View>

      <Text style={[type.caption, { marginTop: 18 }]}>Pay with</Text>
      <Text style={type.footnote}>Charged only if you miss</Text>
      <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
        <PaymentTile
          selected={paymentKind === "apple_pay"}
          onPress={() => setPaymentKind("apple_pay")}
          title="Apple Pay"
          caption="Face ID"
          mark="apple"
        />
        <PaymentTile
          selected={paymentKind === "card"}
          onPress={() => setPaymentKind("card")}
          title="Visa ···· 4242"
          caption="09/28"
          mark="card"
        />
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: consented }}
        onPress={() => setConsented(!consented)}
        testID="commitment-consent"
        style={{
          marginTop: 18,
          minHeight: 52,
          borderRadius: 999,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.hairline,
          paddingHorizontal: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View
          style={{
            height: 22,
            width: 22,
            borderRadius: 999,
            borderWidth: consented ? 0 : 1.5,
            borderColor: colors.hairline,
            backgroundColor: consented ? colors.ink : "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {consented ? (
            <Ionicons name="checkmark" size={14} color={colors.lime} />
          ) : null}
        </View>
        <Text style={[type.caption, { flex: 1, color: colors.ink }]}>
          I understand the stake, the 10% company fee, where a missed stake
          goes, and who verifies my proof. ({CURRENT_TERMS_VERSION})
        </Text>
      </Pressable>
    </View>
  );
}

function PaymentTile({
  selected,
  onPress,
  title,
  caption,
  mark,
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  caption: string;
  mark: "apple" | "card";
}) {
  const { colors, type } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={{
        flex: 1,
        borderRadius: 18,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.ink : colors.hairline,
        backgroundColor: colors.surface,
        padding: 14,
        minHeight: 92,
      }}
    >
      <View
        style={{
          height: 34,
          width: 34,
          borderRadius: 10,
          backgroundColor: mark === "apple" ? colors.ink : colors.chip,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={mark === "apple" ? "logo-apple" : "card-outline"}
          size={16}
          color={mark === "apple" ? colors.field : colors.ink}
        />
      </View>
      <Text style={[type.callout, { marginTop: 10 }]}>{title}</Text>
      <Text style={type.caption}>{caption}</Text>
    </Pressable>
  );
}
