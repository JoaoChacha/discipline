import type { ComponentProps } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "~/theme/ThemeProvider";
import { Chip } from "~/ui/Chip";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { ACTIVE_COMMITMENT } from "./data";

function greetingName(name?: string | null) {
  const first = name?.trim().split(/\s+/)[0];
  return first && first.length > 0 ? first : "Maya";
}

function greetingPrefix(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function TodayScreen({
  userName,
  bottomInset,
  onSubmitProof,
  onDetails,
  onYou,
}: {
  userName?: string | null;
  bottomInset: number;
  onSubmitProof: () => void;
  onDetails: () => void;
  onYou: () => void;
}) {
  const { colors, type, spacing } = useTheme();
  const initials = greetingName(userName).slice(0, 1).toUpperCase();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.screenX,
        paddingBottom: bottomInset,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={type.homeTitle}>
            {greetingPrefix()}, {greetingName(userName)}
          </Text>
          <View style={{ marginTop: 10 }}>
            <Chip label="Proof due" />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={{
              height: 40,
              width: 40,
              borderRadius: 999,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.hairline,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={colors.ink}
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={onYou}
            style={{
              height: 40,
              width: 40,
              borderRadius: 999,
              backgroundColor: colors.feature,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ ...type.callout, color: colors.featureText }}>
              {initials}
            </Text>
          </Pressable>
        </View>
      </View>

      <FeatureCard style={{ marginTop: 24 }}>
        <Text
          style={{
            ...type.caption,
            color: colors.featureMuted,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          Discipline
        </Text>
        <Text style={[type.money, { marginTop: 10 }]}>
          {ACTIVE_COMMITMENT.stake}
        </Text>
        <Text
          style={{
            ...type.caption,
            color: colors.featureMuted,
            marginTop: 6,
          }}
        >
          Held on {ACTIVE_COMMITMENT.title}
        </Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 20 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Submit proof"
            onPress={onSubmitProof}
            testID="today-submit-proof"
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 999,
              backgroundColor: colors.ghost,
              borderWidth: 1,
              borderColor: colors.ghost,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ ...type.pill, color: colors.featureText }}>
              Submit proof
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Details"
            onPress={onDetails}
            style={({ pressed }) => ({
              flex: 1,
              height: 44,
              borderRadius: 999,
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: colors.ghost,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ ...type.pill, color: colors.featureText }}>
              Details
            </Text>
          </Pressable>
        </View>
      </FeatureCard>

      <SurfaceCard style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <LimeTile name="time-outline" />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={type.callout}>Your next proof</Text>
            <Text style={[type.caption, { marginTop: 2 }]}>
              {ACTIVE_COMMITMENT.deadline} · {ACTIVE_COMMITMENT.verifier}
            </Text>
          </View>
        </View>
      </SurfaceCard>

      <Text style={[type.caption, { marginTop: 28, marginBottom: 10 }]}>
        Recent
      </Text>
      <SurfaceCard padded={false}>
        <RecentRow
          icon="person-circle-outline"
          title={ACTIVE_COMMITMENT.verifier}
          body="Trusted verifier"
        />
        <RecentRow
          icon="calendar-outline"
          title={ACTIVE_COMMITMENT.deadline}
          body="Deadline"
        />
        <RecentRow
          icon="heart-outline"
          title={`If missed: ${ACTIVE_COMMITMENT.missedDonation} / ${ACTIVE_COMMITMENT.missedFee}`}
          body="80% to your charities, 20% platform fee"
          last
        />
      </SurfaceCard>
    </ScrollView>
  );
}

function RecentRow({
  icon,
  title,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof Ionicons>["name"];
  title: string;
  body: string;
  last?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      }}
    >
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 999,
          backgroundColor: colors.chip,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={colors.ink} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={type.callout}>{title}</Text>
        <Text style={type.caption}>{body}</Text>
      </View>
    </View>
  );
}
