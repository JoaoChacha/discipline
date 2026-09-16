import { describe, expect, it } from "vitest";

import { completeOnboardingInput } from "@discipline/validators";

import { completeOnboarding, getOnboardingState } from "./onboarding";

describe("onboarding.complete rules", () => {
  it("rejects requests without consent before writing", () => {
    const result = completeOnboardingInput.safeParse({
      consented: false,
      termsVersion: "2026-09-16",
    });
    expect(result.success).toBe(false);
  });

  it("exposes persist helpers for a signed-in user", () => {
    expect(typeof getOnboardingState).toBe("function");
    expect(typeof completeOnboarding).toBe("function");
  });
});
