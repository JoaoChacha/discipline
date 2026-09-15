import { Text, View } from "react-native";

import { colors } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { BrandCard } from "../components/BrandCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

export function PromiseScreen({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <View>
      <Reveal reduceMotion={reduceMotion} style={{ marginBottom: 12 }}>
        <Text style={type.eyebrow}>ACCOUNTABILITY THAT FEELS FAIR</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90}>
        <Text style={type.title}>Your commitment, backed by you.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          For every commitment, choose a charity or charity group that receives
          80% if you miss it.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170} style={{ marginTop: 28 }}>
        <BrandCard>
          <View
            accessibilityLabel="Accountability promise"
            style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 12,
                backgroundColor: colors.tintContainer,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <OnboardingIcon
                name="shield-checkmark"
                size={22}
                color={colors.tint}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={type.headline}>A promise, not a punishment</Text>
              <Text style={[type.bodyTight, { marginTop: 4 }]}>
                Make your intention concrete with fair rules you understand.
              </Text>
            </View>
          </View>
        </BrandCard>
      </Reveal>
    </View>
  );
}
