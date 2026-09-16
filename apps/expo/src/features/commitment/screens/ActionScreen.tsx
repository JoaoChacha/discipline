import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AuthField } from "~/features/auth/AuthField";
import { ScreenCopy } from "~/features/onboarding/components/ScreenCopy";
import { useTheme } from "~/theme/ThemeProvider";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { useCommitment } from "../CommitmentProvider";
import { SelectChip } from "../components/SelectChip";
import {
  formatDateRow,
  formatTimeRow,
  withDatePreset,
  withTimePreset,
} from "../format";

const SUGGESTIONS = [
  "Run 5 km before work",
  "No sugar for 7 days",
  "Ship the portfolio site",
  "Call Mum on Sunday",
] as const;

const DATE_PRESETS = [
  { label: "Tomorrow", days: 1 },
  { label: "In 3 days", days: 3 },
  { label: "Next week", days: 7 },
] as const;

const TIME_PRESETS = [
  { label: "7:30 AM", hours: 7, minutes: 30 },
  { label: "9:00 AM", hours: 9, minutes: 0 },
  { label: "6:00 PM", hours: 18, minutes: 0 },
  { label: "8:00 PM", hours: 20, minutes: 0 },
] as const;

export function ActionScreen() {
  const { colors, type } = useTheme();
  const { title, setTitle, dueAt, setDueAt } = useCommitment();

  return (
    <View>
      <ScreenCopy
        eyebrow="WHAT WILL YOU DO"
        title="Name the action."
        description="Be specific enough that a friend can tell whether it happened."
      />

      <View style={{ marginTop: 22 }}>
        <AuthField
          label="Action"
          value={title}
          onChangeText={setTitle}
          placeholder="Run 5 km before work"
          autoComplete="off"
          testID="commitment-title"
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 14,
        }}
      >
        {SUGGESTIONS.map((suggestion) => (
          <SelectChip
            key={suggestion}
            label={suggestion}
            selected={title === suggestion}
            onPress={() => setTitle(suggestion)}
          />
        ))}
      </View>

      <SurfaceCard style={{ marginTop: 20 }}>
        <DeadlineRow
          label={formatDateRow(dueAt)}
          caption="Proof is due by this time."
        />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          {DATE_PRESETS.map((preset) => (
            <SelectChip
              key={preset.label}
              label={preset.label}
              selected={
                formatDateRow(dueAt) ===
                formatDateRow(withDatePreset(dueAt, preset.days))
              }
              onPress={() => setDueAt(withDatePreset(dueAt, preset.days))}
            />
          ))}
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: colors.hairline,
            marginVertical: 16,
          }}
        />

        <DeadlineRow label={formatTimeRow(dueAt)} />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
          }}
        >
          {TIME_PRESETS.map((preset) => (
            <SelectChip
              key={preset.label}
              label={preset.label}
              selected={
                dueAt.getHours() === preset.hours &&
                dueAt.getMinutes() === preset.minutes
              }
              onPress={() =>
                setDueAt(withTimePreset(dueAt, preset.hours, preset.minutes))
              }
            />
          ))}
        </View>
      </SurfaceCard>
      <Text style={[type.caption, { marginTop: 10 }]}>
        Proof is due by this time.
      </Text>
    </View>
  );
}

function DeadlineRow({ label, caption }: { label: string; caption?: string }) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={type.callout}>{label}</Text>
        {caption ? (
          <Text style={[type.caption, { marginTop: 2 }]}>{caption}</Text>
        ) : null}
      </View>
      <Pressable
        accessibilityElementsHidden
        importantForAccessibility="no"
        style={{
          height: 32,
          width: 32,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      </Pressable>
    </View>
  );
}
