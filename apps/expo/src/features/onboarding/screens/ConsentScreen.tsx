import type { ComponentProps } from "react";
import { Pressable, Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { LimeTile } from "~/ui/LimeTile";
import { RowIcon } from "~/ui/RowIcon";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";
import { useOnboarding } from "../OnboardingProvider";

function SummaryRow({
  icon,
  title,
  body,
  lime = false,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  title: string;
  body: string;
  lime?: boolean;
  last?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 66,
        paddingHorizontal: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.hairline,
      }}
    >
      {lime ? (
        <LimeTile name={icon} size={34} />
      ) : (
        <RowIcon name={icon} size={34} />
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ ...type.callout, fontSize: 12 }}>{title}</Text>
        <Text style={[type.micro, { marginTop: 2 }]}>{body}</Text>
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
        <ScreenCopy
          eyebrow="YOU SET THE TERMS"
          title="Ready to make it real?"
          description="Every commitment starts with rules you understand and approve."
        />
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 20 }}>
        <SurfaceCard padded={false} style={{ paddingVertical: 3 }}>
          <View accessibilityLabel="Commitment agreement summary">
            <SummaryRow
              icon="checkbox-outline"
              title="Action and deadline"
              body="You define success before starting."
            />
            <SummaryRow
              icon="heart-outline"
              title="Stake supports your charity"
              body="If missed; 10% fee, remainder to charity."
            />
            <SummaryRow
              icon="person-circle-outline"
              title="Cause and verifier"
              body="Chosen for every commitment."
              lime
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
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderRadius: 20,
            backgroundColor: colors.chip,
            paddingHorizontal: 13,
            paddingVertical: 13,
          }}
        >
          <View
            style={{
              height: 18,
              width: 18,
              borderRadius: 999,
              borderWidth: 1.5,
              borderColor: consented ? colors.lime : colors.muted,
              backgroundColor: consented ? colors.lime : colors.surface,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {consented ? (
              <OnboardingIcon name="checkmark" size={12} color="#0E0C0D" />
            ) : null}
          </View>
          <Text style={[type.micro, { flex: 1 }]}>
            I understand the stake, charity outcome, company fee, charity
            choice, and verification rules.
          </Text>
        </Pressable>
      </Reveal>
    </View>
  );
}
