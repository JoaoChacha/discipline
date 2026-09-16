import { useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import { validateSignIn } from "@discipline/validators";

import { useTheme } from "~/theme/ThemeProvider";
import { CapsuleButton } from "~/ui/CapsuleButton";
import { authClient } from "~/utils/auth";
import { AuthField } from "./AuthField";
import { AuthMessage } from "./AuthMessage";
import { AuthScreen } from "./AuthScreen";
import { SocialAuthButtons } from "./SocialAuthButtons";
import { useSocialSignIn } from "./useSocialSignIn";

export function LoginScreen() {
  const router = useRouter();
  const { colors, type } = useTheme();
  const { busy, setBusy, message, setMessage, finish, signInWith } =
    useSocialSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async () => {
    const nextMessage = validateSignIn({ email, password });
    if (nextMessage) {
      setMessage(nextMessage);
      return;
    }

    setBusy("email");
    setMessage(null);
    try {
      const result = await authClient.signIn.email({
        email: email.trim(),
        password,
      });
      if (result.error) {
        setMessage(result.error.message ?? "Could not sign in.");
        return;
      }
      await finish();
    } catch {
      setMessage("Could not sign in. Try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AuthScreen
      eyebrow="WELCOME BACK"
      title="Sign in to continue."
      body="Your commitments, stake, and verifier stay with this account."
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
            label={busy === "email" ? "Signing in…" : "Sign in"}
            onPress={() => {
              void signInWithEmail();
            }}
            disabled={busy !== null}
            testID="login-submit"
          />
          <CapsuleButton
            variant="link"
            label="Need an account? Get started"
            onPress={() => router.replace("/onboarding")}
            disabled={busy !== null}
            testID="login-get-started"
          />
        </>
      }
    >
      <View style={{ gap: 16 }}>
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
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@email.com"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          testID="login-email"
        />
        <AuthField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="At least 8 characters"
          secureTextEntry
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          testID="login-password"
          onSubmitEditing={() => {
            void signInWithEmail();
          }}
        />
        <AuthMessage message={message} />
        <Text style={{ ...type.caption, color: colors.muted }}>
          Existing accounts stay on the same terms you already confirmed.
        </Text>
      </View>
    </AuthScreen>
  );
}
