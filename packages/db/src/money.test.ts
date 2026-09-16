import assert from "node:assert/strict";
import test from "node:test";

import {
  allocateDonationCents,
  allocationsCoverDonationPool,
  splitForfeitedStake,
} from "./money.ts";
import {
  completeOnboardingValues,
  hasCompletedOnboarding,
  newUserProfileValues,
} from "./onboarding.ts";

test("€25 miss retains a €2.50 fee and donates €22.50", () => {
  assert.deepEqual(splitForfeitedStake(2500), {
    donationCents: 2250,
    platformFeeCents: 250,
  });
});

test("charity group allocations must cover the full donation pool", () => {
  assert.equal(
    allocationsCoverDonationPool([
      { charityId: "water-org", allocationBps: 6000 },
      { charityId: "girls-who-code", allocationBps: 4000 },
    ]),
    true,
  );
  assert.equal(
    allocationsCoverDonationPool([
      { charityId: "water-org", allocationBps: 6000 },
    ]),
    false,
  );
});

test("donation leftover cents go to the last charity", () => {
  assert.deepEqual(
    allocateDonationCents(2001, [
      { charityId: "water-org", allocationBps: 6000 },
      { charityId: "girls-who-code", allocationBps: 4000 },
    ]),
    [
      { charityId: "water-org", amountCents: 1200 },
      { charityId: "girls-who-code", amountCents: 801 },
    ],
  );
});

test("every new user starts with required onboarding", () => {
  const profile = newUserProfileValues("user_1");
  assert.equal(profile.onboardingStatus, "required");
  assert.equal(profile.onboardingCompletedAt, null);
  assert.equal(hasCompletedOnboarding(profile), false);
  assert.equal(
    hasCompletedOnboarding({
      ...profile,
      ...completeOnboardingValues(new Date("2026-09-15T00:00:00.000Z")),
    }),
    true,
  );
});
