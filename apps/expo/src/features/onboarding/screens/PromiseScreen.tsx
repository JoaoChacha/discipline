import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { RowIcon } from "~/ui/RowIcon";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";

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
        <ScreenCopy
          eyebrow="ACCOUNTABILITY THAT FEELS FAIR"
          title="Your commitment, backed by you."
          description="Choose an action that matters and put money behind it—with terms you understand."
        />
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 20 }}>
        <FeatureCard>
          <Text
            style={{
              fontFamily: type.eyebrow.fontFamily,
              fontSize: 11,
              fontWeight: "700",
              letterSpacing: 1.1,
              color: colors.featureMuted,
            }}
          >
            THE PROMISE
          </Text>
          <Text
            style={{
              fontFamily: type.homeTitle.fontFamily,
              fontSize: 27,
              fontWeight: "800",
              lineHeight: 31,
              letterSpacing: -0.8,
              color: colors.featureText,
              marginTop: 14,
            }}
          >
            A promise,{"\n"}not a punishment.
          </Text>
          <Text
            style={{
              marginTop: 8,
              fontFamily: type.caption.fontFamily,
              fontSize: 12,
              fontWeight: "500",
              lineHeight: 17,
              color: colors.featureMuted,
            }}
          >
            Make your intention concrete without shame when plans change.
          </Text>
        </FeatureCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <SurfaceCard padded={false} style={{ paddingVertical: 4 }}>
          {POINTS.map((point, index) => (
            <View
              key={point.label}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                minHeight: 55,
                paddingHorizontal: 16,
                borderBottomWidth: index < POINTS.length - 1 ? 1 : 0,
                borderBottomColor: colors.hairline,
              }}
            >
              <RowIcon name={point.icon} size={32} />
              <Text
                style={{
                  ...type.callout,
                  fontSize: 13,
                  flex: 1,
                }}
              >
                {point.label}
              </Text>
            </View>
          ))}
        </SurfaceCard>
      </Reveal>
    </View>
  );
}
