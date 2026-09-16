export const STAKE_SPLIT_BPS = 10_000;
export const DEFAULT_DONATION_BPS = 9_000;
export const DEFAULT_PLATFORM_FEE_BPS = 1_000;

export interface StakeSplit {
  donationCents: number;
  platformFeeCents: number;
}

export interface CharityAllocation {
  charityId: string;
  allocationBps: number;
}

export interface CharityPayout {
  charityId: string;
  amountCents: number;
}

/** 90/10 of a forfeited stake. The app keeps 10%; remainder after flooring stays in the fee. */
export function splitForfeitedStake(
  amountCents: number,
  donationBps = DEFAULT_DONATION_BPS,
): StakeSplit {
  const donationCents = Math.floor((amountCents * donationBps) / STAKE_SPLIT_BPS);
  return {
    donationCents,
    platformFeeCents: amountCents - donationCents,
  };
}

export function allocationsCoverDonationPool(
  allocations: readonly CharityAllocation[],
): boolean {
  if (allocations.length === 0) return false;
  return (
    allocations.every((row) => row.allocationBps > 0) &&
    allocations.reduce((sum, row) => sum + row.allocationBps, 0) ===
      STAKE_SPLIT_BPS
  );
}

/** Split the 90% donation pool across charities. Last row receives leftover cents. */
export function allocateDonationCents(
  donationCents: number,
  allocations: readonly CharityAllocation[],
): CharityPayout[] {
  if (!allocationsCoverDonationPool(allocations)) {
    throw new Error("Charity allocations must be positive and sum to 10000 bps");
  }

  const payouts = allocations.map((row, index) => {
    if (index === allocations.length - 1) {
      return { charityId: row.charityId, amountCents: 0 };
    }
    return {
      charityId: row.charityId,
      amountCents: Math.floor(
        (donationCents * row.allocationBps) / STAKE_SPLIT_BPS,
      ),
    };
  });

  const assigned = payouts
    .slice(0, -1)
    .reduce((sum, row) => sum + row.amountCents, 0);
  payouts[payouts.length - 1] = {
    charityId: allocations[allocations.length - 1]!.charityId,
    amountCents: donationCents - assigned,
  };

  return payouts;
}
