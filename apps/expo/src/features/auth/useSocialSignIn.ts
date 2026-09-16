import { useState } from "react";
import { useRouter } from "expo-router";

import { queryClient, trpcClient } from "~/utils/api";
import { authClient } from "~/utils/auth";
import { completeAuthenticatedOnboarding } from "./completeEntry";

type SocialProvider = "google" | "apple";

export function useSocialSignIn() {
  const router = useRouter();
  const [busy, setBusy] = useState<SocialProvider | "email" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const finish = async (opts?: { first?: boolean }) => {
    await completeAuthenticatedOnboarding();
    if (opts?.first) {
      try {
        const mine = await trpcClient.commitment.list.query();
        await queryClient.invalidateQueries();
        if (mine.filter(Boolean).length === 0) {
          router.replace("/commitment/new?first=1");
          return;
        }
      } catch {
        router.replace("/");
        return;
      }
    }
    router.replace("/");
  };

  const signInWith = async (provider: SocialProvider) => {
    setBusy(provider);
    setMessage(null);
    try {
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
