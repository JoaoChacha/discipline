import { Text, View } from "react-native";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";

export function SocialAuthButtons({
  busy,
  onGoogle,
  onApple,
}: {
  busy: string | null;
  onGoogle: () => void;
  onApple: () => void;
}) {
  const { colors, type } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <CapsuleButton
        variant="ghost"
        icon="logo-google"
        label={busy === "google" ? "Opening Google…" : "Continue with Google"}
        onPress={onGoogle}
        disabled={busy !== null}
        testID="auth-google"
      />
      <CapsuleButton
        variant="ghost"
        icon="logo-apple"
        label={busy === "apple" ? "Opening Apple…" : "Continue with Apple"}
        onPress={onApple}
        disabled={busy !== null}
        testID="auth-apple"
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 8,
        }}
      >
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.hairline }}
        />
        <Text
          style={{
            ...type.caption,
            letterSpacing: 0.8,
            textTransform: "uppercase",
          }}
        >
          or use email
        </Text>
        <View
          style={{ flex: 1, height: 1, backgroundColor: colors.hairline }}
        />
      </View>
    </View>
  );
}
