import { describe, expect, it } from "vitest";

import {
  completeOnboardingInput,
  CURRENT_TERMS_VERSION,
  validateSignIn,
  validateSignUp,
} from "./index";

describe("completeOnboardingInput", () => {
  it("accepts current terms with consent", () => {
    expect(
      completeOnboardingInput.parse({
        consented: true,
        termsVersion: CURRENT_TERMS_VERSION,
      }),
    ).toEqual({
      consented: true,
      termsVersion: CURRENT_TERMS_VERSION,
    });
  });

  it("rejects missing consent", () => {
    const result = completeOnboardingInput.safeParse({
      consented: false,
      termsVersion: CURRENT_TERMS_VERSION,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a stale terms version", () => {
    const result = completeOnboardingInput.safeParse({
      consented: true,
      termsVersion: "2020-01-01",
    });
    expect(result.success).toBe(false);
  });
});

describe("auth field validation", () => {
  it("requires a valid email and 8-character password", () => {
    expect(
      validateSignIn({ email: "not-an-email", password: "password1" }),
    ).toBe("Enter a valid email address.");
    expect(
      validateSignIn({ email: "maya@example.com", password: "short" }),
    ).toBe("Password must be at least 8 characters.");
    expect(
      validateSignIn({ email: "maya@example.com", password: "password1" }),
    ).toBeNull();
  });

  it("requires a name on sign-up", () => {
    expect(
      validateSignUp({
        name: "M",
        email: "maya@example.com",
        password: "password1",
      }),
    ).toBe("Enter the name you want on this account.");
    expect(
      validateSignUp({
        name: "Maya",
        email: "maya@example.com",
        password: "password1",
      }),
    ).toBeNull();
  });
});
