import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { OnboardingIcon } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";

function OutcomeRow({
  title,
  body,
  amount,
  positive = false,
  info = false,
}: {
  title: string;
  body: string;
  amount: string;
  positive?: boolean;
  info?: boolean;
}) {
  const { colors, type } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginTop: 18,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: "rgba(127,127,127,0.24)",
      }}
    >
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          style={{
            ...type.callout,
            fontSize: 12,
            color: colors.featureText,
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            marginTop: 2,
            fontFamily: type.caption.fontFamily,
            fontSize: 12,
            fontWeight: "500",
            lineHeight: 17,
            color: colors.featureMuted,
          }}
        >
          {body}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
        <Text
          style={{
            fontFamily: type.kpi.fontFamily,
            fontSize: 14,
            fontWeight: "700",
            color: positive ? colors.positive : colors.featureText,
            fontVariant: ["tabular-nums"],
          }}
        >
          {amount}
        </Text>
        {info ? (
          <OnboardingIcon
            name="information-circle-outline"
            size={13}
            color={colors.featureMuted}
          />
        ) : null}
      </View>
    </View>
  );
}

export function MoneyScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <ScreenCopy
          eyebrow="CLEAR FROM THE START"
          title="Your money follows the outcome."
          description="You choose the stake. We show every outcome before you confirm."
        />
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 20 }}>
        <FeatureCard>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                ...type.callout,
                fontSize: 12,
                color: colors.featureText,
              }}
            >
              Example stake
            </Text>
            <View
              style={{
                paddingHorizontal: 12,
                paddingVertical: 9,
                borderRadius: 999,
                backgroundColor: "rgba(127,127,127,0.16)",
              }}
            >
              <Text
                style={{
                  fontFamily: type.caption.fontFamily,
                  fontSize: 11,
                  fontWeight: "600",
                  color: colors.featureText,
                }}
              >
                Held
              </Text>
            </View>
          </View>
          <Text style={[type.money, { marginTop: 18 }]}>€250.00</Text>
          <OutcomeRow
            title="Complete + verify"
            body="Full stake released back"
            amount="+€250.00"
            positive
          />
          <OutcomeRow
            title="Miss it"
            body="Stake goes to charity"
            amount="€250.00"
            info
          />
        </FeatureCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180} style={{ marginTop: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 8,
            marginHorizontal: 4,
          }}
        >
          <OnboardingIcon
            name="information-circle-outline"
            size={14}
            color={colors.muted}
          />
          <Text
            style={{
              flex: 1,
              fontFamily: type.caption.fontFamily,
              fontSize: 11,
              fontWeight: "500",
              lineHeight: 16,
              color: colors.muted,
            }}
          >
            If you miss it, a 10% company fee is applied to the stake. The rest
            is donated to the selected charity or charities.
          </Text>
        </View>
      </Reveal>
    </View>
  );
}
