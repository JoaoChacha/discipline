import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { and, eq } from "drizzle-orm";

import type * as schema from "@discipline/db/schema";
import {
  completeOnboardingValues,
  newUserProfileValues,
  profile,
  userConsent,
} from "@discipline/db/schema";
import { CURRENT_TERMS_VERSION } from "@discipline/validators";

type Database = PostgresJsDatabase<typeof schema>;

export async function ensureProfile(database: Database, userId: string) {
  await database
    .insert(profile)
    .values(newUserProfileValues(userId))
    .onConflictDoNothing();
}

export async function getOnboardingState(database: Database, userId: string) {
  await ensureProfile(database, userId);

  const row = await database.query.profile.findFirst({
    where: eq(profile.userId, userId),
  });

  const consent = await database.query.userConsent.findFirst({
    where: and(
      eq(userConsent.userId, userId),
      eq(userConsent.kind, "onboarding"),
      eq(userConsent.termsVersion, CURRENT_TERMS_VERSION),
    ),
  });

  return {
    status: row?.onboardingStatus ?? "required",
    completedAt: row?.onboardingCompletedAt ?? null,
    consented: Boolean(consent),
    termsVersion: CURRENT_TERMS_VERSION,
  };
}

export async function completeOnboarding(database: Database, userId: string) {
  const completedAt = new Date();

  await database.transaction(async (tx) => {
    await tx
      .insert(profile)
      .values({
        ...newUserProfileValues(userId),
        ...completeOnboardingValues(completedAt),
      })
      .onConflictDoUpdate({
        target: profile.userId,
        set: completeOnboardingValues(completedAt),
      });

    await tx
      .insert(userConsent)
      .values({
        userId,
        kind: "onboarding",
        termsVersion: CURRENT_TERMS_VERSION,
      })
      .onConflictDoNothing({
        target: [
          userConsent.userId,
          userConsent.kind,
          userConsent.termsVersion,
        ],
      });
  });

  return getOnboardingState(database, userId);
}
