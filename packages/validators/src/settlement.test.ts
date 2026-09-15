import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  allocateDonationPool,
  CHARITY_SHARE_BPS,
  DISCIPLINE_TAX_BPS,
  donationAllocationSchema,
  MIN_STAKE_CENTS,
  settleForfeit,
  SETTLEMENT_COPY,
  SETTLEMENT_POLICY_VERSION,
  SettlementError,
  splitStake,
  stakeAmountSchema,
} from "./settlement.ts";

const unicef = "11111111-1111-4111-8111-111111111111";
const wwf = "22222222-2222-4222-8222-222222222222";
const redCross = "33333333-3333-4333-8333-333333333333";

describe("settlement policy", () => {
  it("locks an 80/20 split whose tax covers processing", () => {
    assert.equal(SETTLEMENT_POLICY_VERSION, 1);
    assert.equal(CHARITY_SHARE_BPS + DISCIPLINE_TAX_BPS, 10_000);
    assert.equal(MIN_STAKE_CENTS, 500);
    assert.match(SETTLEMENT_COPY.missOutcome, /Discipline tax/);
    assert.match(SETTLEMENT_COPY.taxCoversProcessing, /full 80%/);
  });

  it("gives charities the full 80% of a €25 stake", () => {
    const split = splitStake(2500);
    assert.deepEqual(split, {
      policyVersion: 1,
      amountCents: 2500,
      donationPoolCents: 2000,
      taxCents: 500,
    });
  });

  it("rounds leftover cents toward charities, never the tax", () => {
    const split = splitStake(1001);
    assert.equal(split.donationPoolCents, 801);
    assert.equal(split.taxCents, 200);
    assert.equal(split.donationPoolCents + split.taxCents, 1001);
    assert.ok(split.donationPoolCents / 1001 >= 0.8);
  });

  it("rejects stakes too small for the tax to cover processing", () => {
    assert.throws(() => splitStake(499), SettlementError);
    assert.equal(stakeAmountSchema.safeParse(499).success, false);
    assert.equal(stakeAmountSchema.safeParse(500).success, true);
  });

  it("pays a single charity the whole donation pool", () => {
    const { split, payouts } = settleForfeit(2500, [
      { charityId: unicef, shareBps: 10_000 },
    ]);
    assert.equal(payouts[0]?.amountCents, split.donationPoolCents);
  });

  it("splits a group allocation across 100% of the donation pool", () => {
    const payouts = allocateDonationPool(2000, [
      { charityId: unicef, shareBps: 5000 },
      { charityId: wwf, shareBps: 3000 },
      { charityId: redCross, shareBps: 2000 },
    ]);

    assert.deepEqual(
      payouts.map((payout) => payout.amountCents),
      [1000, 600, 400],
    );
    assert.equal(
      payouts.reduce((sum, payout) => sum + payout.amountCents, 0),
      2000,
    );
  });

  it("distributes leftover cents instead of dropping them", () => {
    const payouts = allocateDonationPool(100, [
      { charityId: unicef, shareBps: 3333 },
      { charityId: wwf, shareBps: 3333 },
      { charityId: redCross, shareBps: 3334 },
    ]);

    assert.equal(
      payouts.reduce((sum, payout) => sum + payout.amountCents, 0),
      100,
    );
    assert.ok(payouts.every((payout) => payout.amountCents >= 33));
  });

  it("requires charity shares to add up to 100%", () => {
    assert.throws(
      () =>
        allocateDonationPool(2000, [
          { charityId: unicef, shareBps: 5000 },
          { charityId: wwf, shareBps: 4000 },
        ]),
      SettlementError,
    );

    const parsed = donationAllocationSchema.safeParse([
      { charityId: unicef, shareBps: 10_000 },
    ]);
    assert.equal(parsed.success, true);
  });
});
