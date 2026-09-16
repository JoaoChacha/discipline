import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";
import { useOnboarding } from "../OnboardingProvider";

function SummaryRow({
  icon,
  title,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  title: string;
  body: string;
  last?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      }}
    >
      <View style={{ marginTop: 2 }}>
        <OnboardingIcon name={icon} size={21} color={colors.ink} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={type.callout}>{title}</Text>
        <Text style={[type.caption, { marginTop: 2 }]}>{body}</Text>
      </View>
    </View>
  );
}

export function ConsentScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { consented, setConsented } = useOnboarding();
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <Text style={type.title}>Ready to make it real?</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={80} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Every commitment starts with rules you understand and approve.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 24 }}>
        <SurfaceCard padded={false}>
          <View accessibilityLabel="Commitment agreement summary">
            <SummaryRow
              icon="checkbox-outline"
              title="Action and deadline"
              body="You define success before starting."
            />
            <SummaryRow
              icon="cash-outline"
              title="Charity outcome after a 10% company fee"
              body="The remaining stake is donated if the commitment is missed."
            />
            <SummaryRow
              icon="person-circle-outline"
              title="A cause and verifier each time"
              body="Every commitment gets its own charity or group and allocation."
              last
            />
          </View>
        </SurfaceCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: consented }}
          onPress={() => setConsented(!consented)}
          testID="onboarding-consent"
          style={{
            marginTop: 16,
            minHeight: 64,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            borderRadius: 999,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: consented ? colors.ink : colors.hairline,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <View
            style={{
              height: 24,
              width: 24,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: consented ? colors.ink : colors.hairline,
              backgroundColor: consented ? colors.ink : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {consented ? (
              <OnboardingIcon
                name="checkmark"
                size={14}
                color={colors.ctaText}
              />
            ) : null}
          </View>
          <Text style={[type.caption, { flex: 1, color: colors.ink }]}>
            I understand the stake, 10% company fee, per-commitment charity
            choice, and verification rules.
          </Text>
        </Pressable>
      </Reveal>
    </View>
  );
}
