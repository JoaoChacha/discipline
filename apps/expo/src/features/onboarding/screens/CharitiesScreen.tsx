import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { LimeTile } from "~/ui/LimeTile";
import { Notice } from "~/ui/Notice";
import { RowIcon } from "~/ui/RowIcon";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { EXAMPLE_CHARITY_GROUP } from "../charities";
import { Reveal } from "../components/Reveal";
import { ScreenCopy } from "../components/ScreenCopy";

export function CharitiesScreen({ reduceMotion }: { reduceMotion: boolean }) {
  const { colors, type } = useTheme();

  return (
    <View>
      <Reveal reduceMotion={reduceMotion}>
        <ScreenCopy
          eyebrow="PER-COMMITMENT CAUSES"
          title="Choose a cause every time."
          description="Select one vetted charity or build a group during each commitment setup."
        />
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={140} style={{ marginTop: 20 }}>
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
            <Text style={{ ...type.callout, fontSize: 13 }}>
              Example charity group
            </Text>
            <Text
              style={{
                ...type.caption,
                fontSize: 12,
                color: colors.positive,
              }}
            >
              100% allocated
            </Text>
          </View>

          {EXAMPLE_CHARITY_GROUP.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth:
                  index < EXAMPLE_CHARITY_GROUP.length - 1 ? 1 : 0,
                borderBottomColor: colors.hairline,
              }}
            >
              {index === 0 ? (
                <LimeTile
                  name={
                    item.icon === "droplets"
                      ? "water-outline"
                      : "code-slash-outline"
                  }
                />
              ) : (
                <RowIcon
                  name={
                    item.icon === "droplets"
                      ? "water-outline"
                      : "code-slash-outline"
                  }
                />
              )}
              <View style={{ minWidth: 0, flex: 1 }}>
                <Text style={{ ...type.callout, fontSize: 13 }}>
                  {item.name}
                </Text>
                <Text style={[type.micro, { marginTop: 2, marginBottom: 7 }]}>
                  {item.mission}
                </Text>
                <View
                  style={{
                    height: 5,
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
              <Text style={{ ...type.callout, fontSize: 13 }}>
                {item.percent}%
              </Text>
            </View>
          ))}
        </SurfaceCard>
      </Reveal>

      <Reveal reduceMotion={reduceMotion} delay={180}>
        <Notice
          subtle
          icon="refresh-outline"
          title="A fresh choice each time"
          body="Your cause can differ for every commitment."
        />
      </Reveal>
    </View>
  );
}
