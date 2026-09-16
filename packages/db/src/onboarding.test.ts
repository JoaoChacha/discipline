import { describe, expect, it } from "vitest";

import {
  completeOnboardingValues,
  hasCompletedOnboarding,
  newUserProfileValues,
} from "./onboarding";

describe("onboarding helpers", () => {
  it("marks every new user as required", () => {
    expect(newUserProfileValues("user_1")).toEqual({
      userId: "user_1",
      onboardingStatus: "required",
      onboardingCompletedAt: null,
    });
    expect(
      hasCompletedOnboarding({
        onboardingStatus: "required",
        onboardingCompletedAt: null,
      }),
    ).toBe(false);
  });

  it("treats completed only when a timestamp is present", () => {
    const completedAt = new Date("2026-09-16T12:00:00.000Z");
    expect(completeOnboardingValues(completedAt)).toEqual({
      onboardingStatus: "completed",
      onboardingCompletedAt: completedAt,
    });
    expect(
      hasCompletedOnboarding({
        onboardingStatus: "completed",
        onboardingCompletedAt: completedAt,
      }),
    ).toBe(true);
    expect(
      hasCompletedOnboarding({
        onboardingStatus: "completed",
        onboardingCompletedAt: null,
      }),
    ).toBe(false);
  });
});
