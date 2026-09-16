import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatDeadline, formatEuro } from "~/features/commitment/format";
import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { Chip } from "~/ui/Chip";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { ScreenScroll } from "~/ui/ScreenScroll";
import { useCommitments } from "./useCommitments";

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
  onCreate,
}: {
  userName?: string | null;
  bottomInset: number;
  onSubmitProof: () => void;
  onDetails: () => void;
  onYou: () => void;
  onCreate: () => void;
}) {
  const { colors, type, spacing } = useTheme();
  const { active } = useCommitments();
  const firstName = greetingName(userName);
  const initials = firstName.slice(0, 1).toUpperCase();
  const stake = active
    ? formatEuro(active.amountCents, active.currency)
    : "€0.00";
  const verifierName =
    active?.verifier?.name ??
    active?.pendingInvite?.displayName ??
    "Your verifier";
  const deadline = active ? formatDeadline(new Date(active.dueAt)) : "";
  const pending = active?.status === "awaiting_verifier";
  const outcome = active?.outcome;

  return (
    <ScreenScroll
      bottomInset={bottomInset}
      contentStyle={{ paddingHorizontal: spacing.screenX }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open profile"
            onPress={onYou}
            style={{
              height: 36,
              width: 36,
              borderRadius: 999,
              backgroundColor: colors.ink,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: type.brand.fontFamily,
                fontSize: 13,
                fontWeight: "700",
                color: colors.field,
              }}
            >
              {initials}
            </Text>
          </Pressable>
          <Chip
            label={active ? (pending ? "Waiting" : "Proof due") : "Ready"}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Search"
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="search" size={20} color={colors.ink} />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Notifications"
            style={{
              height: 44,
              width: 44,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.ink}
            />
          </Pressable>
        </View>
      </View>

      <Text
        style={{
          ...type.bodyInk,
          fontSize: 15,
          fontWeight: "500",
          color: colors.muted,
          marginTop: 24,
        }}
      >
        Today
      </Text>
      <Text style={[type.homeTitle, { marginTop: 4 }]}>
        {greetingPrefix()}, {firstName}
      </Text>

      {!active ? (
        <View style={{ marginTop: 24 }}>
          <FeatureCard
            style={{
              borderRadius: spacing.homeCardRadius,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <Text
              style={{
                ...type.callout,
                color: colors.featureText,
              }}
            >
              No stake is held yet
            </Text>
            <Text style={[type.money, { marginTop: 20 }]}>€0.00</Text>
            <Text
              style={{
                marginTop: 4,
                fontFamily: type.caption.fontFamily,
                fontSize: 13,
                fontWeight: "500",
                color: colors.featureMuted,
              }}
            >
              Create a commitment to put something on it.
            </Text>
          </FeatureCard>
          <View style={{ marginTop: 16 }}>
            <CapsuleButton
              label="Create my first commitment"
              onPress={onCreate}
              testID="today-create-commitment"
            />
          </View>
        </View>
      ) : (
        <>
          <FeatureCard
            style={{
              marginTop: 24,
              borderRadius: spacing.homeCardRadius,
              paddingTop: 24,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  ...type.callout,
                  fontSize: 15,
                  color: colors.featureText,
                }}
              >
                Discipline
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="More"
                onPress={onDetails}
                style={{
                  height: 32,
                  width: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={colors.featureMuted}
                />
              </Pressable>
            </View>
            <Text style={[type.money, { marginTop: 24 }]}>{stake}</Text>
            <Text
              style={{
                marginTop: 4,
                fontFamily: type.caption.fontFamily,
                fontSize: 13,
                fontWeight: "500",
                color: colors.featureMuted,
              }}
            >
              {pending ? "Waiting on" : "Held on"} {active.title}
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginTop: 24 }}>
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
                  backgroundColor: colors.ghost,
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

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Your next proof"
            onPress={onSubmitProof}
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 24,
              backgroundColor: colors.surface,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <LimeTile name="wallet-outline" />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={type.callout}>Your next proof</Text>
              <Text
                style={{
                  ...type.caption,
                  fontSize: 13,
                  marginTop: 2,
                }}
                numberOfLines={1}
              >
                {deadline} · {verifierName}
              </Text>
            </View>
            <Ionicons
              name="ellipsis-horizontal"
              size={18}
              color={colors.muted}
            />
          </Pressable>

          <View
            style={{
              marginTop: 28,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Text style={type.headline}>Recent</Text>
            <Text style={{ ...type.caption, fontSize: 13 }}>
              {stake.replace(".00", "")} at risk
            </Text>
          </View>

          <RecentRow
            avatar={
              <Text
                style={{
                  fontFamily: type.brand.fontFamily,
                  fontSize: 13,
                  fontWeight: "700",
                  color: colors.ink,
                }}
              >
                {verifierName.slice(0, 1).toUpperCase()}
              </Text>
            }
            title={verifierName}
            body={pending ? "Pending — invite sent" : "Trusted verifier"}
            value={pending ? "Waiting" : "Ready"}
          />
          <RecentRow
            icon="time-outline"
            title="Deadline"
            body={deadline}
            value={stake}
          />
          <RecentRow
            icon="add-circle-outline"
            iconColor={colors.positive}
            title="If you complete it"
            body="Returned after verification"
            value={`+${formatEuro(outcome?.returnedCents ?? active.amountCents, active.currency)}`}
            valueColor={colors.positive}
          />
          <RecentRow
            icon="heart-outline"
            title="If missed"
            body="10% company fee, rest to your cause"
            value={`${formatEuro(outcome?.causeCents ?? 0, active.currency)} / ${formatEuro(outcome?.feeCents ?? 0, active.currency)}`}
          />
        </>
      )}
    </ScreenScroll>
  );
}

function RecentRow({
  avatar,
  icon,
  iconColor,
  title,
  body,
  value,
  valueColor,
}: {
  avatar?: ReactNode;
  icon?: ComponentProps<typeof Ionicons>["name"];
  iconColor?: string;
  title: string;
  body: string;
  value: string;
  valueColor?: string;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
      }}
    >
      <View
        style={{
          height: 40,
          width: 40,
          borderRadius: 999,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {avatar ?? (
          <Ionicons name={icon} size={18} color={iconColor ?? colors.ink} />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={type.callout}>{title}</Text>
        <Text style={type.caption}>{body}</Text>
      </View>
      <Text
        style={{
          ...type.callout,
          color: valueColor ?? colors.ink,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
    </View>
  );
}
