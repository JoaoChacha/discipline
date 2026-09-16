export function hasCompletedOnboarding(user: {
  onboardingStatus: "required" | "completed";
  onboardingCompletedAt: Date | null;
}): boolean {
  return (
    user.onboardingStatus === "completed" && user.onboardingCompletedAt !== null
  );
}

/** Every new user starts with onboarding required. */
export function newUserProfileValues(userId: string) {
  return {
    userId,
    onboardingStatus: "required" as const,
    onboardingCompletedAt: null,
  };
}

export function completeOnboardingValues(completedAt = new Date()) {
  return {
    onboardingStatus: "completed" as const,
    onboardingCompletedAt: completedAt,
  };
}
