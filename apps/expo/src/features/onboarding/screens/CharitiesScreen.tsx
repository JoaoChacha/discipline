import type { GestureResponderEvent } from "react-native";
import { useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import type { CharityAllocation } from "../charities";
import { colors } from "~/theme/tokens";
import { allocationTotal, CHARITY_CATALOG, getCharity } from "../charities";
import { CharityGlyph, OnboardingIcon } from "../components/OnboardingIcon";
import { useOnboarding } from "../OnboardingProvider";

function readTrackX(event: GestureResponderEvent): number | null {
  const native = event.nativeEvent as GestureResponderEvent["nativeEvent"] & {
    offsetX?: number;
  };
  if (
    typeof native.locationX === "number" &&
    Number.isFinite(native.locationX)
  ) {
    return native.locationX;
  }
  if (typeof native.offsetX === "number" && Number.isFinite(native.offsetX)) {
    return native.offsetX;
  }
  return null;
}

function AllocationTrack({
  percent,
  onChange,
}: {
  percent: number;
  onChange: (next: number) => void;
}) {
  const trackRef = useRef<View>(null);
  const widthRef = useRef(0);

  const applyX = (x: number, width: number) => {
    if (width <= 0 || !Number.isFinite(x)) {
      return;
    }
    onChange(Math.round(Math.max(0, Math.min(1, x / width)) * 100));
  };

  const updateFromEvent = (event: GestureResponderEvent) => {
    const localX = readTrackX(event);
    if (localX !== null) {
      applyX(localX, widthRef.current);
      return;
    }

    const eventPageX = event.nativeEvent.pageX;
    trackRef.current?.measureInWindow((pageX, _pageY, measuredWidth) => {
      applyX(eventPageX - pageX, measuredWidth || widthRef.current);
    });
  };

  return (
    <View
      ref={trackRef}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max: 100, now: percent }}
      onLayout={(event) => {
        widthRef.current = event.nativeEvent.layout.width;
      }}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={updateFromEvent}
      onResponderMove={updateFromEvent}
      style={{
        marginTop: 12,
        height: 24,
        justifyContent: "center",
      }}
    >
      <View
        pointerEvents="none"
        style={{
          height: 8,
          overflow: "hidden",
          borderRadius: 999,
          backgroundColor: colors.separator,
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Number.isFinite(percent) ? percent : 0}%`,
            borderRadius: 999,
            backgroundColor: colors.tint,
          }}
        />
      </View>
    </View>
  );
}

function SelectedCharityRow({
  allocation,
  showDivider,
  onChange,
}: {
  allocation: CharityAllocation;
  showDivider: boolean;
  onChange: (percent: number) => void;
}) {
  const charity = getCharity(allocation.charityId);
  if (!charity) {
    return null;
  }

  const isPurple = charity.accent === "purple";

  return (
    <View
      style={{
        padding: 16,
        borderBottomWidth: showDivider ? 1 : 0,
        borderBottomColor: colors.separator,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            height: 44,
            width: 44,
            borderRadius: 12,
            backgroundColor: isPurple
              ? colors.charityAccentContainer
              : colors.tintContainer,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CharityGlyph
            icon={charity.icon}
            size={22}
            color={isPurple ? colors.charityAccent : colors.tint}
          />
        </View>
        <View style={{ minWidth: 0, flex: 1 }}>
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: colors.label }}
          >
            {charity.name}
          </Text>
          <Text style={{ fontSize: 12, color: colors.secondaryLabel }}>
            {charity.mission}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: colors.label,
            fontVariant: ["tabular-nums"],
          }}
        >
          {Number.isFinite(allocation.percent) ? allocation.percent : 0}%
        </Text>
      </View>
      <AllocationTrack percent={allocation.percent} onChange={onChange} />
    </View>
  );
}

export function CharitiesScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { allocations, updatePercent, selectCharity } = useOnboarding();
  const [query, setQuery] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);
  const entering = (delay: number) =>
    reduceMotion ? undefined : FadeInDown.duration(420).delay(delay);
  const total = allocationTotal(allocations);
  const allocated = total === 100;

  const available = useMemo(() => {
    const selected = new Set(allocations.map((item) => item.charityId));
    const needle = query.trim().toLowerCase();
    return CHARITY_CATALOG.filter((charity) => {
      if (selected.has(charity.id)) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return (
        charity.name.toLowerCase().includes(needle) ||
        charity.mission.toLowerCase().includes(needle)
      );
    });
  }, [allocations, query]);

  return (
    <View style={{ flex: 1 }}>
      <Animated.Text
        entering={entering(0)}
        style={{
          marginBottom: 12,
          fontSize: 15,
          fontWeight: "600",
          color: colors.tint,
        }}
      >
        YOUR CAUSES
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          fontSize: 34,
          fontWeight: "700",
          lineHeight: 40,
          letterSpacing: -0.8,
          color: colors.label,
        }}
      >
        Choose where your 80% goes.
      </Animated.Text>
      <Animated.Text
        entering={entering(70)}
        style={{
          marginTop: 12,
          fontSize: 15,
          lineHeight: 20,
          color: colors.secondaryLabel,
        }}
      >
        Select one or more vetted charities. You can change them later.
      </Animated.Text>

      <View
        style={{
          marginTop: 20,
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          borderRadius: 12,
          backgroundColor: colors.surface,
          paddingHorizontal: 16,
        }}
      >
        <OnboardingIcon name="search" size={19} color={colors.secondaryLabel} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search verified charities"
          placeholderTextColor={colors.secondaryLabel}
          accessibilityLabel="Search verified charities"
          autoCorrect={false}
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.label,
            paddingVertical: 0,
          }}
        />
      </View>

      {query.trim() && available.length > 0 ? (
        <View
          style={{
            marginTop: 8,
            overflow: "hidden",
            borderRadius: 16,
            backgroundColor: colors.surface,
          }}
        >
          {available.map((charity, index) => (
            <Pressable
              key={charity.id}
              onPress={() => {
                selectCharity(charity.id);
                setQuery("");
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderBottomWidth: index < available.length - 1 ? 1 : 0,
                borderBottomColor: colors.separator,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.label,
                }}
              >
                {charity.name}
              </Text>
              <Text style={{ fontSize: 13, color: colors.secondaryLabel }}>
                {charity.mission}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}

      <Animated.View
        entering={entering(130)}
        style={{
          marginTop: 16,
          overflow: "hidden",
          borderRadius: 16,
          backgroundColor: colors.surface,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: colors.separator,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{ fontSize: 15, fontWeight: "600", color: colors.label }}
          >
            Selected charities
          </Text>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: allocated ? colors.success : colors.pending,
            }}
          >
            {allocated ? "100% allocated" : `${total}% allocated`}
          </Text>
        </View>

        {allocations.map((allocation, index) => (
          <SelectedCharityRow
            key={allocation.charityId}
            allocation={allocation}
            showDivider={index < allocations.length - 1}
            onChange={(percent) => updatePercent(allocation.charityId, percent)}
          />
        ))}
      </Animated.View>

      <Pressable
        accessibilityRole="button"
        onPress={() => setPickerOpen(true)}
        style={{
          marginTop: 16,
          minHeight: 44,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <OnboardingIcon name="add" size={19} color={colors.tint} />
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.tint }}>
          Add another charity
        </Text>
      </Pressable>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable
          onPress={() => setPickerOpen(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            justifyContent: "flex-end",
          }}
        >
          <Pressable
            onPress={() => undefined}
            style={{
              maxHeight: "70%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: colors.surface,
              padding: 20,
              paddingBottom: 32,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "600",
                color: colors.label,
                marginBottom: 16,
              }}
            >
              Verified charities
            </Text>
            <ScrollView>
              {available.map((charity) => (
                <Pressable
                  key={charity.id}
                  onPress={() => {
                    selectCharity(charity.id);
                    setPickerOpen(false);
                    setQuery("");
                  }}
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
                      borderRadius: 12,
                      backgroundColor:
                        charity.accent === "purple"
                          ? colors.charityAccentContainer
                          : colors.tintContainer,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CharityGlyph
                      icon={charity.icon}
                      size={20}
                      color={
                        charity.accent === "purple"
                          ? colors.charityAccent
                          : colors.tint
                      }
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: colors.label,
                      }}
                    >
                      {charity.name}
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: colors.secondaryLabel }}
                    >
                      {charity.mission}
                    </Text>
                  </View>
                </Pressable>
              ))}
              {available.length === 0 ? (
                <Text style={{ color: colors.secondaryLabel, fontSize: 15 }}>
                  {query.trim()
                    ? "No matching charities."
                    : "Every verified charity is already selected."}
                </Text>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
