import { useState } from "react";
import { useRouter } from "expo-router";

import { authClient } from "~/utils/auth";
import { completeAuthenticatedEntry } from "./completeEntry";

type SocialProvider = "google" | "apple";

export function useSocialSignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState<SocialProvider | "email" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const finish = async () => {
    await completeAuthenticatedEntry();
    router.replace("/");
  };

  const signInWith = async (provider: SocialProvider) => {
    setBusy(provider);
    setMessage(null);
    try {
      await completeAuthenticatedEntry();
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch {
      setMessage(
        provider === "google"
          ? "Could not open Google sign-in."
          : "Could not open Apple sign-in.",
      );
      setBusy(null);
    }
  };

  return { busy, setBusy, message, setMessage, finish, signInWith };
}
