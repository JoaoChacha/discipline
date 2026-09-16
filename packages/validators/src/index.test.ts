import { describe, expect, it } from "vitest";

import {
  assertCauseAllocations,
  completeOnboardingInput,
  createCommitmentSchema,
  createEmailInviteSchema,
  CURRENT_TERMS_VERSION,
  handleSchema,
  stakeOutcome,
  validateSignIn,
  validateSignUp,
} from "./index";

describe("handleSchema", () => {
  it("accepts lowercase handles", () => {
    expect(handleSchema.parse("Maya_1")).toBe("maya_1");
  });

  it("rejects short or decorated handles", () => {
    expect(() => handleSchema.parse("ab")).toThrow();
    expect(() => handleSchema.parse("Maya Chen")).toThrow();
  });
});

describe("cause allocations", () => {
  it("requires a 100% split and unique charities", () => {
    expect(() =>
      assertCauseAllocations([
        { charityId: "water-org", percent: 60 },
        { charityId: "girls-who-code", percent: 40 },
      ]),
    ).not.toThrow();
    expect(() =>
      assertCauseAllocations([{ charityId: "water-org", percent: 60 }]),
    ).toThrow(/100%/);
  });
});

describe("stakeOutcome", () => {
  it("applies a 10% company fee", () => {
    expect(stakeOutcome(2500)).toEqual({
      amountCents: 2500,
      feeCents: 250,
      causeCents: 2250,
      returnedCents: 2500,
    });
  });
});

describe("createEmailInviteSchema", () => {
  it("requires a name and a valid email", () => {
    expect(
      createEmailInviteSchema.parse({
        displayName: "Sam Rivera",
        email: "sam@example.com",
      }),
    ).toEqual({
      displayName: "Sam Rivera",
      email: "sam@example.com",
    });
    expect(
      createEmailInviteSchema.safeParse({
        displayName: "S",
        email: "not-an-email",
      }).success,
    ).toBe(false);
  });
});

describe("createCommitmentSchema", () => {
  const future = new Date(Date.now() + 86_400_000);

  it("requires exactly one of verifierId or invitationId", () => {
    const base = {
      title: "Run 5 km before work",
      dueAt: future,
      amountCents: 2500,
      paymentKind: "apple_pay" as const,
      consented: true as const,
      termsVersion: CURRENT_TERMS_VERSION,
      causes: [{ charityId: "water-org", percent: 100 }],
    };

    expect(() => createCommitmentSchema.parse(base)).toThrow();
    expect(() =>
      createCommitmentSchema.parse({
        ...base,
        verifierId: "user_1",
        invitationId: "22222222-2222-4222-8222-222222222222",
      }),
    ).toThrow();
    expect(
      createCommitmentSchema.parse({ ...base, verifierId: "user_1" })
        .verifierId,
    ).toBe("user_1");
  });
});

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
