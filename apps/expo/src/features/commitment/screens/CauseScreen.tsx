import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";

import type { CauseDraft } from "../types";
import { ScreenCopy } from "~/features/onboarding/components/ScreenCopy";
import { useTheme } from "~/theme/ThemeProvider";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { trpc } from "~/utils/api";
import { useCommitment } from "../CommitmentProvider";
import { RadioRow } from "../components/RadioRow";
import { SelectChip } from "../components/SelectChip";

const CHARITY_ICONS = {
  droplets: "water-outline",
  code: "code-slash-outline",
  heart: "heart-outline",
  shield: "shield-outline",
} as const;

function iconFor(icon: string) {
  return CHARITY_ICONS[icon as keyof typeof CHARITY_ICONS] ?? "heart-outline";
}

function evenSplit(ids: string[]): CauseDraft[] {
  if (ids.length === 0) return [];
  const base = Math.floor(100 / ids.length);
  const remainder = 100 - base * ids.length;
  return ids.map((charityId, index) => ({
    charityId,
    percent: base + (index === 0 ? remainder : 0),
  }));
}

export function CauseScreen() {
  const { colors, type } = useTheme();
  const { causeMode, setCauseMode, causes, setCauses } = useCommitment();
  const charities = useQuery(trpc.charity.list.queryOptions());
  const catalog = charities.data ?? [];
  const allocated = causes.reduce((sum, cause) => sum + cause.percent, 0);

  useEffect(() => {
    if (catalog.length === 0 || causes.length > 0) return;
    const defaults = catalog.slice(0, 2).map((item) => item.id);
    setCauses(
      defaults.length === 2
        ? [
            { charityId: defaults[0]!, percent: 60 },
            { charityId: defaults[1]!, percent: 40 },
          ]
        : evenSplit(defaults),
    );
    if (defaults.length < 2) setCauseMode("one");
  }, [catalog, causes.length, setCauseMode, setCauses]);

  const selectOne = (charityId: string) => {
    setCauseMode("one");
    setCauses([{ charityId, percent: 100 }]);
  };

  const toggleGroup = (charityId: string) => {
    const ids = causes.map((cause) => cause.charityId);
    const nextIds = ids.includes(charityId)
      ? ids.filter((id) => id !== charityId)
      : [...ids, charityId].slice(0, 8);
    setCauses(evenSplit(nextIds));
  };

  return (
    <View>
      <ScreenCopy
        eyebrow="WHERE A MISSED STAKE GOES"
        title="Choose a cause every time."
        description="Pick one vetted charity, or build a group and split it to 100%."
      />

      <View style={{ flexDirection: "row", gap: 8, marginTop: 22 }}>
        <SelectChip
          label="One charity"
          selected={causeMode === "one"}
          onPress={() => {
            setCauseMode("one");
            const first = causes[0]?.charityId ?? catalog[0]?.id;
            if (first) setCauses([{ charityId: first, percent: 100 }]);
          }}
        />
        <SelectChip
          label="A group"
          selected={causeMode === "group"}
          onPress={() => {
            setCauseMode("group");
            if (causes.length < 2) {
              setCauses(evenSplit(catalog.slice(0, 2).map((item) => item.id)));
            }
          }}
        />
      </View>

      <SurfaceCard style={{ marginTop: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={type.callout}>
            {causeMode === "group" ? "Your group" : "Your charity"}
          </Text>
          <Text
            style={{
              ...type.caption,
              color: allocated === 100 ? colors.positive : colors.muted,
            }}
          >
            {allocated}% allocated
          </Text>
        </View>

        {catalog.map((charity) => {
          const selected = causes.find(
            (cause) => cause.charityId === charity.id,
          );
          return (
            <View key={charity.id}>
              <RadioRow
                selected={Boolean(selected)}
                onPress={() =>
                  causeMode === "one"
                    ? selectOne(charity.id)
                    : toggleGroup(charity.id)
                }
                title={charity.name}
                caption={
                  selected
                    ? `${selected.percent}% · ${charity.mission}`
                    : charity.mission
                }
                leading={<LimeTile name={iconFor(charity.icon)} />}
                testID={`commitment-charity-${charity.id}`}
              />
              {selected && causeMode === "group" ? (
                <View
                  style={{
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: colors.hairline,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: `${selected.percent}%`,
                      height: "100%",
                      backgroundColor: colors.lime,
                    }}
                  />
                </View>
              ) : null}
            </View>
          );
        })}

        {causeMode === "group" ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add a charity"
            onPress={() => {
              const next = catalog.find(
                (item) => !causes.some((cause) => cause.charityId === item.id),
              );
              if (next) toggleGroup(next.id);
            }}
            style={{
              minHeight: 48,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 999,
                backgroundColor: colors.chip,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="add" size={20} color={colors.ink} />
            </View>
            <Text style={type.callout}>Add a charity</Text>
          </Pressable>
        ) : null}
      </SurfaceCard>
    </View>
  );
}
