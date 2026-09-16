import { saveOnboardingState } from "~/features/onboarding/storage";
import { publishOnboardingState } from "~/features/onboarding/useOnboardingGate";

export async function completeAuthenticatedEntry() {
  const nextState = { status: "completed" as const };
  await saveOnboardingState(nextState);
  publishOnboardingState(nextState);
}
