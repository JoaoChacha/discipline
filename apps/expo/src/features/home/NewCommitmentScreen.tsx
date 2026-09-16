import { ScrollView, Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { FeatureCard } from "~/ui/FeatureCard";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";

export function NewCommitmentScreen({ bottomInset }: { bottomInset: number }) {
  const { colors, type, spacing } = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: spacing.screenX,
        paddingBottom: bottomInset,
      }}
    >
      <Text style={type.homeTitle}>New commitment</Text>
      <Text style={[type.body, { marginTop: 8 }]}>
        Setup comes next: action, deadline, stake, cause, and verifier.
      </Text>

      <FeatureCard style={{ marginTop: 24 }}>
        <Text
          style={{
            ...type.caption,
            color: colors.featureMuted,
            textTransform: "uppercase",
            letterSpacing: 0.6,
          }}
        >
          Coming next
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
          Nothing is held until you confirm every term.
        </Text>
      </FeatureCard>

      <SurfaceCard style={{ marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <LimeTile name="add" />
          <Text style={[type.bodyInk, { flex: 1 }]}>
            Choose a cause and a trusted verifier for each commitment.
          </Text>
        </View>
      </SurfaceCard>
    </ScrollView>
  );
}
