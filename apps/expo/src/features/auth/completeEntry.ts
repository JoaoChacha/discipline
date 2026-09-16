import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { publishOnboardingState } from "~/features/onboarding/onboardingStore";
import {
  loadOnboardingState,
  saveOnboardingState,
} from "~/features/onboarding/storage";
import { queryClient, trpcClient } from "~/utils/api";

export async function completeAuthenticatedOnboarding() {
  const local = await loadOnboardingState();
  if (local.pendingConsent) {
    await trpcClient.onboarding.complete.mutate({
      consented: true,
      termsVersion: CURRENT_TERMS_VERSION,
    });

    const nextState = { status: "completed" as const };
    await saveOnboardingState(nextState);
    publishOnboardingState(nextState);
  }

  // Do not block navigation on refetches. Expo web can keep inactive
  // observers alive on the stack, which made login wait on Home queries.
  void queryClient.invalidateQueries();
}
