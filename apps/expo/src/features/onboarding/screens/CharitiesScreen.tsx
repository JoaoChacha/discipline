import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { EXAMPLE_CHARITY_GROUP } from "../charities";
import { Reveal } from "../components/Reveal";

export function CharitiesScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <Text style={type.title}>Choose a cause every time.</Text>
      </Reveal>
      <Reveal reduceMotion={reduceMotion} delay={80} style={{ marginTop: 12 }}>
        <Text style={type.body}>
          Select one vetted charity or create a group during each commitment
          setup.
        </Text>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 24 }}>
        <SurfaceCard padded={false}>
          <View
            accessibilityLabel="Example charity group"
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: colors.hairline,
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <Text style={type.callout}>Example charity group</Text>
            <Text style={{ ...type.caption, color: colors.positive }}>
              100% allocated
            </Text>
          </View>

          {EXAMPLE_CHARITY_GROUP.map((item, index) => (
            <View
              key={item.id}
              style={{
                padding: 16,
                borderBottomWidth:
                  index < EXAMPLE_CHARITY_GROUP.length - 1 ? 1 : 0,
                borderBottomColor: colors.hairline,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <LimeTile
                  name={
                    item.icon === "droplets"
                      ? "water-outline"
                      : "code-slash-outline"
                  }
                />
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
                  backgroundColor: colors.hairline,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${item.percent}%`,
                    borderRadius: 999,
                    backgroundColor: colors.lime,
                  }}
                />
              </View>
            </View>
          ))}
        </SurfaceCard>
      </Reveal>
    </View>
  );
}
