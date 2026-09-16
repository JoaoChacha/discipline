import { describe, expect, it } from "vitest";

import {
  assertCauseAllocations,
  createCommitmentSchema,
  handleSchema,
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

describe("createCommitmentSchema", () => {
  const future = new Date(Date.now() + 86_400_000);

  it("requires exactly one of verifierId or invitationId", () => {
    const base = {
      title: "Run 5 km before work",
      dueAt: future,
      amountCents: 2500,
      paymentMethodId: "11111111-1111-4111-8111-111111111111",
      consented: true as const,
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
