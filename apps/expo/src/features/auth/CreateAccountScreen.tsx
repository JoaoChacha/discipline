import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { LimeTile } from "~/ui/LimeTile";
import { SurfaceCard } from "~/ui/SurfaceCard";
import { authClient } from "~/utils/auth";
import { AuthField } from "./AuthField";
import { AuthMessage } from "./AuthMessage";
import { AuthScreen } from "./AuthScreen";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useSocialSignIn } from "./useSocialSignIn";
import { validateSignUp } from "./validation";

export function CreateAccountScreen() {
  const router = useRouter();
  const { colors, type } = useTheme();
  const { busy, setBusy, message, setMessage, finish, signInWith } =
    useSocialSignIn();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = async () => {
    const nextMessage = validateSignUp({ name, email, password });
    if (nextMessage) {
      setMessage(nextMessage);
      return;
    }

    setBusy("email");
    setMessage(null);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.error) {
        setMessage(result.error.message ?? "Could not create this account.");
        return;
      }
      await finish();
    } catch {
      setMessage("Could not create this account. Try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AuthScreen
      eyebrow="ALMOST THERE"
      title="Before you create your first commitment"
      body="Create an account so this action, stake, and verifier stay with you."
      onBack={() => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace("/onboarding");
      }}
      actions={
        <>
          <CapsuleButton
            label={busy === "email" ? "Creating account…" : "Create account"}
            onPress={() => {
              void createAccount();
            }}
            disabled={busy !== null}
            testID="create-account-submit"
          />
          <CapsuleButton
            variant="link"
            label="I already have an account"
            onPress={() => router.push("/login")}
            disabled={busy !== null}
            testID="create-account-login"
          />
        </>
      }
      footer={
        <Text
          style={{
            ...type.caption,
            textAlign: "center",
            marginTop: 8,
            color: colors.muted,
          }}
        >
          No money is held until you confirm a commitment.
        </Text>
      }
    >
      <View style={{ gap: 16 }}>
        <SurfaceCard>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <LimeTile name="lock-closed-outline" />
            <Text style={[type.bodyInk, { flex: 1 }]}>
              Nothing is held until you confirm.
            </Text>
          </View>
        </SurfaceCard>
        <SocialAuthButtons
          busy={busy}
          onGoogle={() => {
            void signInWith("google");
          }}
          onApple={() => {
            void signInWith("apple");
          }}
        />
        <AuthField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="How we should greet you"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          testID="create-account-name"
        />
        <AuthField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          testID="create-account-email"
        />
        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
          autoComplete="password"
          textContentType="newPassword"
          returnKeyType="done"
          testID="create-account-password"
          onSubmitEditing={() => {
            void createAccount();
          }}
        />
        <AuthMessage message={message} />
      </View>
    </AuthScreen>
  );
}
