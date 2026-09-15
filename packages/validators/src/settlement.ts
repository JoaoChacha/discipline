import { z } from "zod/v4";

/** Locked 80/20 split. Bump this if the public split ever changes. */
export const SETTLEMENT_POLICY_VERSION = 1;

/** Charity share of a forfeited stake, in basis points. */
export const CHARITY_SHARE_BPS = 8000;

/** Disciplined stake share of a forfeited stake, in basis points. */
export const DISCIPLINED_STAKE_BPS = 2000;

/**
 * Smallest allowed stake, in minor units.
 * At €5 the 20% Disciplined stake is €1, which still covers typical Stripe +
 * Goodstack fees so the charity share can be paid in full.
 */
export const MIN_STAKE_CENTS = 500;

export const SETTLEMENT_COPY = {
  missOutcome: "If missed: 80% to your charities, 20% Disciplined stake",
  taxCoversProcessing:
    "The Disciplined stake covers payment and donation processing, so your charities receive the full 80%.",
  confirmAllocation:
    "80% to your charities. 20% Disciplined stake covers processing.",
} as const;

export class SettlementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SettlementError";
  }
}

export interface StakeSplit {
  policyVersion: typeof SETTLEMENT_POLICY_VERSION;
  amountCents: number;
  donationPoolCents: number;
  taxCents: number;
}

export interface DonationShare {
  charityId: string;
  shareBps: number;
}

export interface DonationPayout {
  charityId: string;
  shareBps: number;
  amountCents: number;
}

function assertWholeCents(amountCents: number, label: string) {
  if (!Number.isInteger(amountCents) || amountCents <= 0) {
    throw new SettlementError(`${label} must be a positive integer`);
  }
}

/**
 * Split a forfeited stake so charities receive at least 80%.
 * Remainder cents go to the donation pool, never to the Disciplined stake.
 * Stripe and Goodstack fees are paid from `taxCents`.
 */
export function splitStake(amountCents: number): StakeSplit {
  assertWholeCents(amountCents, "Stake");
  if (amountCents < MIN_STAKE_CENTS) {
    throw new SettlementError(
      `Stake must be at least ${MIN_STAKE_CENTS} cents so the Disciplined stake can cover processing`,
    );
  }

  const donationPoolCents = Math.ceil(
    (amountCents * CHARITY_SHARE_BPS) / 10_000,
  );
  const taxCents = amountCents - donationPoolCents;

  return {
    policyVersion: SETTLEMENT_POLICY_VERSION,
    amountCents,
    donationPoolCents,
    taxCents,
  };
}

export function assertAllocationShares(shares: DonationShare[]) {
  if (shares.length === 0) {
    throw new SettlementError("Select at least one charity");
  }

  const seen = new Set<string>();
  let totalBps = 0;

  for (const share of shares) {
    if (seen.has(share.charityId)) {
      throw new SettlementError("Each charity can only appear once");
    }
    seen.add(share.charityId);

    if (!Number.isInteger(share.shareBps) || share.shareBps <= 0) {
      throw new SettlementError(
        "Each charity share must be a positive integer",
      );
    }
    totalBps += share.shareBps;
  }

  if (totalBps !== 10_000) {
    throw new SettlementError("Charity shares must add up to 100%");
  }
}

/**
 * Split the 80% donation pool across selected charities.
 * Leftover cents go to the largest remainders so the pool is paid in full.
 */
export function allocateDonationPool(
  donationPoolCents: number,
  shares: DonationShare[],
): DonationPayout[] {
  assertWholeCents(donationPoolCents, "Donation pool");
  assertAllocationShares(shares);

  const payouts = shares.map((share) => ({
    charityId: share.charityId,
    shareBps: share.shareBps,
    amountCents: Math.floor((donationPoolCents * share.shareBps) / 10_000),
    remainder: (donationPoolCents * share.shareBps) % 10_000,
  }));

  let leftover =
    donationPoolCents -
    payouts.reduce((sum, payout) => sum + payout.amountCents, 0);

  const remainderOrder = payouts
    .map((payout, index) => ({ index, remainder: payout.remainder }))
    .sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  for (const item of remainderOrder) {
    if (leftover <= 0) break;
    const payout = payouts[item.index];
    if (!payout) continue;
    payout.amountCents += 1;
    leftover -= 1;
  }

  return payouts.map(({ charityId, shareBps, amountCents }) => ({
    charityId,
    shareBps,
    amountCents,
  }));
}

export function settleForfeit(
  amountCents: number,
  shares: DonationShare[],
): {
  split: StakeSplit;
  payouts: DonationPayout[];
} {
  const split = splitStake(amountCents);
  return {
    split,
    payouts: allocateDonationPool(split.donationPoolCents, shares),
  };
}

export const donationShareSchema = z.object({
  charityId: z.uuid(),
  shareBps: z.int().positive().max(10_000),
});

export const donationAllocationSchema = z
  .array(donationShareSchema)
  .min(1)
  .superRefine((shares, ctx) => {
    try {
      assertAllocationShares(shares);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message:
          error instanceof SettlementError
            ? error.message
            : "Invalid charity allocation",
      });
    }
  });

export const stakeAmountSchema = z
  .int()
  .min(
    MIN_STAKE_CENTS,
    `Stake must be at least ${MIN_STAKE_CENTS} cents so the Disciplined stake can cover processing`,
  );
