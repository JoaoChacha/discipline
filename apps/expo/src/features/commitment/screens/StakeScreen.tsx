import { useState } from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthField } from "~/features/auth/AuthField";
import { ScreenCopy } from "~/features/onboarding/components/ScreenCopy";
import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { useCommitment, useStakeMath } from "../CommitmentProvider";
import { SelectChip } from "../components/SelectChip";
import { formatEuro } from "../format";

const PRESETS = [1000, 2500, 5000, 10000] as const;

export function StakeScreen() {
  const { colors, type } = useTheme();
  const { amountCents, setAmountCents } = useCommitment();
  const outcome = useStakeMath();
  const [custom, setCustom] = useState(!PRESETS.includes(amountCents as 1000));
  const customLabel =
    amountCents >= 100 && !PRESETS.includes(amountCents as 1000)
      ? formatEuro(amountCents)
      : "";

  return (
    <View>
      <ScreenCopy
        eyebrow="PUT SOMETHING ON IT"
        title="Choose your stake."
        description="Held once your verifier accepts. Nothing is charged unless you miss."
      />

      <FeatureCard style={{ marginTop: 22 }}>
        <Text style={type.money}>{formatEuro(amountCents)}</Text>
        <Text
          style={{
            marginTop: 6,
            fontFamily: type.caption.fontFamily,
            fontSize: 13,
            fontWeight: "500",
            color: colors.featureMuted,
          }}
        >
          Held once your verifier accepts
        </Text>
      </FeatureCard>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 16,
        }}
      >
        {PRESETS.map((preset) => (
          <SelectChip
            key={preset}
            label={formatEuro(preset).replace(".00", "")}
            selected={!custom && amountCents === preset}
            onPress={() => {
              setCustom(false);
              setAmountCents(preset);
            }}
          />
        ))}
        <SelectChip
          label="Custom"
          selected={custom}
          onPress={() => setCustom(true)}
          testID="commitment-custom-stake"
        />
      </View>

      {custom ? (
        <View style={{ marginTop: 14 }}>
          <AuthField
            label="Custom stake"
            value={customLabel.replace("€", "")}
            onChangeText={(value) => {
              const parsed = Number.parseFloat(value.replace(",", "."));
              if (Number.isFinite(parsed)) {
                setAmountCents(Math.round(parsed * 100));
              }
            }}
            placeholder="25.00"
            autoComplete="off"
            keyboardType="default"
            testID="commitment-custom-amount"
          />
        </View>
      ) : null}

      <SurfaceCard style={{ marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={type.callout}>Complete it</Text>
            <Text style={[type.caption, { marginTop: 2 }]}>
              Returned after verification.
            </Text>
          </View>
          <Text
            style={{
              ...type.callout,
              color: colors.positive,
              fontVariant: ["tabular-nums"],
            }}
          >
            +{formatEuro(outcome.returnedCents)}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: colors.hairline,
            marginVertical: 14,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <View style={{ flex: 1 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text style={type.callout}>Miss it</Text>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={colors.muted}
              />
            </View>
            <Text style={[type.caption, { marginTop: 2 }]}>
              A 10% company fee ({formatEuro(outcome.feeCents)}) is applied to
              the stake and the rest is donated to the charity or charities you
              choose next.
            </Text>
          </View>
          <Text
            style={{
              ...type.callout,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatEuro(outcome.causeCents)}
          </Text>
        </View>
      </SurfaceCard>
    </View>
  );
}
