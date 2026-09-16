import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { publishOnboardingState } from "~/features/onboarding/onboardingStore";
import {
  loadOnboardingState,
  saveOnboardingState,
} from "~/features/onboarding/storage";
import { queryClient, trpcClient } from "~/utils/api";

export async function completeAuthenticatedOnboarding() {
  const local = await loadOnboardingState();
  if (!local.pendingConsent) {
    await queryClient.invalidateQueries();
    return;
  }

  await trpcClient.onboarding.complete.mutate({
    consented: true,
    termsVersion: CURRENT_TERMS_VERSION,
  });

  const nextState = { status: "completed" as const };
  await saveOnboardingState(nextState);
  publishOnboardingState(nextState);
  await queryClient.invalidateQueries();
}
