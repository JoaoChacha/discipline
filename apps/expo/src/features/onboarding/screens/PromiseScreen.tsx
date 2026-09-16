import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

const POINTS = [
  { icon: "checkbox-outline" as const, label: "You set the action" },
  { icon: "cash-outline" as const, label: "You choose the stake" },
  {
    icon: "person-circle-outline" as const,
    label: "A trusted person verifies",
  },
];

export function PromiseScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <Text style={type.title}>Your commitment, backed by you.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={80} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          For every commitment, choose a charity or charity group that receives
          the donated share if you miss it.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 24 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <LimeTile name="shield-checkmark-outline" />
          <Text style={[type.callout, { flex: 1 }]}>
            Fair rules, in writing
          </Text>
        </View>
        <FeatureCard>
          <Text
            style={{
              ...type.caption,
              color: colors.featureMuted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            The promise
          </Text>
          <Text
            style={{
              fontFamily: type.homeTitle.fontFamily,
              fontSize: 24,
              fontWeight: "800",
              lineHeight: 30,
              letterSpacing: -0.6,
              color: colors.featureText,
              marginTop: 10,
            }}
          >
            A promise, not a punishment.
          </Text>
        </FeatureCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <SurfaceCard padded={false}>
          {POINTS.map((point, index) => (
            <View
              key={point.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: index < POINTS.length - 1 ? 1 : 0,
                borderBottomColor: colors.hairline,
              }}
            >
              <OnboardingIcon name={point.icon} size={20} color={colors.ink} />
              <Text style={type.bodyInk}>{point.label}</Text>
            </View>
          ))}
        </SurfaceCard>
      </Reveal>
    </View>
  );
}
