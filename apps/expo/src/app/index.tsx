import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";

import { useOnboardingGate } from "~/features/onboarding/useOnboardingGate";
import { colors } from "~/theme/tokens";
import { authClient } from "~/utils/auth";

function MobileAuth() {
  const { data: session } = authClient.useSession();

  return (
    <View style={{ gap: 12 }}>
      <Text
        style={{
          color: colors.label,
          textAlign: "center",
          fontSize: 20,
          fontWeight: "600",
        }}
      >
        {session?.user.name ? `Hello, ${session.user.name}` : "Not logged in"}
      </Text>
      {session ? (
        <Pressable
          onPress={() => authClient.signOut()}
          style={{
            backgroundColor: colors.tint,
            alignItems: "center",
            borderRadius: 12,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{ color: colors.white, fontSize: 17, fontWeight: "600" }}
          >
            Sign Out
          </Text>
        </Pressable>
      ) : (
        <>
          <Pressable
            onPress={() =>
              authClient.signIn.social({
                provider: "apple",
                callbackURL: "/",
              })
            }
            style={{
              backgroundColor: colors.tint,
              alignItems: "center",
              borderRadius: 12,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{ color: colors.white, fontSize: 17, fontWeight: "600" }}
            >
              Sign in with Apple
            </Text>
          </Pressable>
          <Pressable
            onPress={() =>
              authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
              })
            }
            style={{
              backgroundColor: colors.tint,
              alignItems: "center",
              borderRadius: 12,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{ color: colors.white, fontSize: 17, fontWeight: "600" }}
            >
              Sign in with Google
            </Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const { ready, needsOnboarding, replay } = useOnboardingGate();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  if (needsOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 24 }}>
        <Text
          style={{
            color: colors.label,
            textAlign: "center",
            fontSize: 40,
            fontWeight: "700",
            letterSpacing: -0.8,
          }}
        >
          Discipline
        </Text>
        <Text
          style={{
            color: colors.secondaryLabel,
            textAlign: "center",
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          Onboarding is complete. Commitment creation is next.
        </Text>

        <MobileAuth />

        <Pressable
          onPress={() => {
            void replay().then(() => router.replace("/onboarding"));
          }}
          style={{
            alignItems: "center",
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: colors.tint, fontSize: 15, fontWeight: "600" }}>
            Replay onboarding
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
