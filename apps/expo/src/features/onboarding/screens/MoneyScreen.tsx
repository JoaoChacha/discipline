import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

export function MoneyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <Text style={type.title}>Your money follows the outcome.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={80} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          For a €250 stake, every possible outcome is shown before you confirm.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 24 }}>
        <FeatureCard>
          <Text
            style={{
              ...type.caption,
              color: colors.featureMuted,
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            Example stake
          </Text>
          <Text style={[type.money, { marginTop: 12 }]}>€250.00</Text>
        </FeatureCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <SurfaceCard padded={false}>
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.hairline,
            }}
          >
            <OnboardingIcon
              name="checkmark-circle"
              size={22}
              color={colors.positive}
            />
            <View style={{ flex: 1 }}>
              <Text style={type.headline}>Complete it</Text>
              <Text
                style={[type.body, { marginTop: 4, color: colors.positive }]}
              >
                +€250.00 returned after verification
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12, padding: 16 }}>
            <OnboardingIcon name="heart-outline" size={22} color={colors.ink} />
            <View style={{ flex: 1 }}>
              <Text style={type.headline}>Miss it</Text>
              <View
                style={{
                  marginTop: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text style={type.bodyInk}>€250.00</Text>
                <OnboardingIcon
                  name="information-circle-outline"
                  size={16}
                  color={colors.muted}
                />
              </View>
            </View>
          </View>
        </SurfaceCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <Text style={type.caption}>
          A 10% company fee is applied to the stake. The rest is donated to the
          selected charity or charities.
        </Text>
      </Reveal>
    </View>
  );
}
