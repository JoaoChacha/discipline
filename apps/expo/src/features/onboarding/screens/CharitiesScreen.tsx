import { Text, View } from "react-native";

import { colors } from "~/theme/tokens";
import { type } from "~/theme/typography";
import { EXAMPLE_CHARITY_GROUP } from "../charities";
import { BrandCard } from "../components/BrandCard";
import { CharityGlyph } from "../components/OnboardingIcon";
import { Reveal } from "../components/Reveal";

export function CharitiesScreen({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <View>
      <Reveal reduceMotion={reduceMotion} style={{ marginBottom: 12 }}>
        <Text style={type.eyebrow}>PER-COMMITMENT CAUSES</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90}>
        <Text style={type.title}>Choose a cause every time.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={90} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Select one vetted charity or create a group during each commitment
          setup.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={170} style={{ marginTop: 28 }}>
        <BrandCard padded={false}>
          <View
            accessibilityLabel="Example charity group"
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
            <Text style={type.callout}>Example charity group</Text>
            <Text
              style={{
                ...type.footnote,
                fontWeight: "600",
                color: colors.success,
              }}
            >
              100% allocated
            </Text>
          </View>

          {EXAMPLE_CHARITY_GROUP.map((item, index) => {
            const isPurple = item.accent === "purple";
            return (
              <View
                key={item.id}
                style={{
                  padding: 16,
                  borderBottomWidth:
                    index < EXAMPLE_CHARITY_GROUP.length - 1 ? 1 : 0,
                  borderBottomColor: colors.separator,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 12,
                      backgroundColor: isPurple
                        ? colors.charityAccentContainer
                        : colors.tintContainer,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CharityGlyph
                      icon={item.icon}
                      size={21}
                      color={isPurple ? colors.charityAccent : colors.tint}
                    />
                  </View>
                  <View style={{ minWidth: 0, flex: 1 }}>
                    <Text style={type.callout}>{item.name}</Text>
                    <Text style={type.caption}>{item.mission}</Text>
                  </View>
                  <Text style={type.kpi}>{item.percent}%</Text>
                </View>
                <View
                  style={{
                    marginTop: 12,
                    height: 8,
                    overflow: "hidden",
                    borderRadius: 999,
                    backgroundColor: colors.separator,
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      width: `${item.percent}%`,
                      borderRadius: 999,
                      backgroundColor: colors.tint,
                    }}
                  />
                </View>
              </View>
            );
          })}
        </BrandCard>
      </Reveal>
    </View>
  );
}
