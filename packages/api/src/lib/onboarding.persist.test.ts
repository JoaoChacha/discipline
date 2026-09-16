import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, describe, expect, it } from "vitest";

import * as schema from "@discipline/db/schema";
import { profile, user, userConsent } from "@discipline/db/schema";
import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { completeOnboarding, getOnboardingState } from "./onboarding";

const connectionString = process.env.POSTGRES_URL;

async function canReachPostgres(url: string) {
  const probe = postgres(url, { max: 1, connect_timeout: 2 });
  try {
    await probe`select 1`;
    return true;
  } catch {
    return false;
  } finally {
    await probe.end({ timeout: 1 });
  }
}

const reachable = connectionString
  ? await canReachPostgres(connectionString)
  : false;

describe.skipIf(!reachable)("onboarding persist", () => {
  const client = postgres(connectionString!);
  const database = drizzle({ client, schema, casing: "snake_case" });

  afterAll(async () => {
    await client.end();
  });

  it("writes completed status and consent, then stays idempotent", async () => {
    const userId = `test_${randomUUID()}`;
    const now = new Date();

    await database.insert(user).values({
      id: userId,
      name: "Maya",
      email: `${userId}@example.com`,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });

    const required = await getOnboardingState(database, userId);
    expect(required.status).toBe("required");
    expect(required.consented).toBe(false);

    const completed = await completeOnboarding(database, userId);
    expect(completed.status).toBe("completed");
    expect(completed.consented).toBe(true);
    expect(completed.termsVersion).toBe(CURRENT_TERMS_VERSION);
    expect(completed.completedAt).toBeInstanceOf(Date);

    const again = await completeOnboarding(database, userId);
    expect(again.status).toBe("completed");

    const consents = await database
      .select()
      .from(userConsent)
      .where(eq(userConsent.userId, userId));
    expect(consents).toHaveLength(1);

    const profiles = await database
      .select()
      .from(profile)
      .where(eq(profile.userId, userId));
    expect(profiles).toHaveLength(1);
    expect(profiles[0]?.onboardingStatus).toBe("completed");
  });
});
