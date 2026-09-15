import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import { colors } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { BrandCard } from "../components/BrandCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

function OutcomeRow({
  icon,
  iconColor,
  title,
  body,
  last = false,
}: {
  icon: ComponentProps<typeof OnboardingIcon>["name"];
  iconColor: string;
  title: string;
  body: string;
  last?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 12,
        padding: 16,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: colors.separator,
      }}
    >
      <View style={{ marginTop: 2 }}>
        <OnboardingIcon name={icon} size={22} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={type.headline}>{title}</Text>
        <Text style={[type.bodyTight, { marginTop: 4 }]}>{body}</Text>
      </View>
    </View>
  );
}

export function MoneyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <View>
      <Reveal reduceMotion={reduceMotion} style={{ marginBottom: 12 }}>
        <Text style={type.eyebrow}>CLEAR FROM THE START</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90}>
        <Text style={type.title}>Your money follows the outcome.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          For a €25 stake, every possible outcome is shown before you confirm.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170} style={{ marginTop: 28 }}>
        <BrandCard padded={false}>
          <View accessibilityLabel="Stake example">
            <OutcomeRow
              icon="checkmark-circle"
              iconColor={colors.success}
              title="Complete it"
              body="Keep your full €25."
            />
            <OutcomeRow
              icon="heart"
              iconColor={colors.pending}
              title="Miss it"
              body="€20 (80%) goes in full to that commitment’s selected cause."
            />
            <OutcomeRow
              icon="phone-portrait-outline"
              iconColor={colors.tint}
              title="Disciplined stake"
              body="€5 (20%) covers payment and donation processing."
              last
            />
          </View>
        </BrandCard>
      </Reveal>
    </View>
  );
}
