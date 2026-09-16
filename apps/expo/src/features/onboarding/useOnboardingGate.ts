import { useCallback, useEffect, useSyncExternalStore } from "react";
import { useQuery } from "@tanstack/react-query";

import { completeAuthenticatedOnboarding } from "~/features/auth/completeEntry";
import { queryClient, trpc } from "~/utils/api";
import { authClient } from "~/utils/auth";
import {
  getOnboardingSnapshot,
  publishOnboardingState,
  subscribeOnboarding,
} from "./onboardingStore";
import { loadOnboardingState, saveOnboardingState } from "./storage";

export { publishOnboardingState } from "./onboardingStore";

export function useOnboardingGate() {
  const session = authClient.useSession();
  const local = useSyncExternalStore(
    subscribeOnboarding,
    getOnboardingSnapshot,
    getOnboardingSnapshot,
  );
  const server = useQuery({
    ...trpc.onboarding.getState.queryOptions(),
    enabled: Boolean(session.data),
    retry: false,
  });

  useEffect(() => {
    if (
      !session.data ||
      !local.pendingConsent ||
      server.data?.status === "completed"
    ) {
      return;
    }
    void completeAuthenticatedOnboarding().catch(() => undefined);
  }, [local.pendingConsent, server.data?.status, session.data]);

  const refresh = useCallback(async () => {
    publishOnboardingState(await loadOnboardingState());
    await queryClient.invalidateQueries();
  }, []);

  const replay = useCallback(async () => {
    const nextState = {
      ...getOnboardingSnapshot(),
      status: "pending" as const,
      preview: true,
    };
    await saveOnboardingState(nextState);
    publishOnboardingState(nextState);
  }, []);

  const clearPreview = useCallback(async () => {
    const nextState = {
      ...getOnboardingSnapshot(),
      preview: false,
      status: "completed" as const,
    };
    await saveOnboardingState(nextState);
    publishOnboardingState(nextState);
  }, []);

  const sessionReady = !session.isPending;
  const serverReady = !session.data || !server.isPending;
  const completedOnServer = server.data?.status === "completed";

  return {
    ready: sessionReady && serverReady,
    needsOnboarding:
      Boolean(local.preview) || !session.data || !completedOnServer,
    replay,
    refresh,
    clearPreview,
  };
}
