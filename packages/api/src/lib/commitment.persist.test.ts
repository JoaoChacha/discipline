import { randomUUID } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { afterAll, describe, expect, it } from "vitest";

import * as schema from "@discipline/db/schema";
import {
  action,
  friendship,
  invitation,
  user,
  userConsent,
} from "@discipline/db/schema";
import { CURRENT_TERMS_VERSION } from "@discipline/validators";

import { createCommitment } from "./commitment";
import { acceptInviteToken, createEmailInvite } from "./invite";
import { completeOnboarding } from "./onboarding";

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

describe.skipIf(!reachable)("commitment create persist", () => {
  const client = postgres(connectionString!);
  const database = drizzle({ client, schema, casing: "snake_case" });

  afterAll(async () => {
    await client.end();
  });

  async function insertUser(name: string) {
    const userId = `test_${randomUUID()}`;
    const now = new Date();
    await database.insert(user).values({
      id: userId,
      name,
      email: `${userId}@example.com`,
      emailVerified: false,
      createdAt: now,
      updatedAt: now,
    });
    return userId;
  }

  it("rejects create before onboarding is completed", async () => {
    const ownerId = await insertUser("Maya");
    await expect(
      createCommitment(database, ownerId, {
        title: "Run 5 km before work",
        dueAt: new Date(Date.now() + 86_400_000),
        amountCents: 2500,
        currency: "EUR",
        invitationId: randomUUID(),
        causes: [{ charityId: "water-org", percent: 100 }],
        paymentKind: "apple_pay",
        consented: true,
        termsVersion: CURRENT_TERMS_VERSION,
      }),
    ).rejects.toMatchObject({ code: "PRECONDITION_FAILED" });
  });

  it("creates with an email invite and no handle or payment method", async () => {
    const ownerId = await insertUser("Maya");
    await completeOnboarding(database, ownerId);

    const invite = await createEmailInvite(database, ownerId, {
      displayName: "Sam Rivera",
      email: "sam@example.com",
    });
    expect(invite.displayName).toBe("Sam Rivera");
    expect(invite.email).toBe("sam@example.com");

    const created = await createCommitment(database, ownerId, {
      title: "Run 5 km before work",
      dueAt: new Date(Date.now() + 86_400_000),
      amountCents: 2500,
      currency: "EUR",
      invitationId: invite.id,
      causes: [
        { charityId: "water-org", percent: 60 },
        { charityId: "girls-who-code", percent: 40 },
      ],
      paymentKind: "apple_pay",
      consented: true,
      termsVersion: CURRENT_TERMS_VERSION,
    });

    expect(created.status).toBe("awaiting_verifier");
    expect(created.stakeStatus).toBe("none");
    expect(created.paymentKind).toBe("apple_pay");
    expect(created.outcome.feeCents).toBe(250);
    expect(created.pendingInvite?.displayName).toBe("Sam Rivera");

    const consents = await database
      .select()
      .from(userConsent)
      .where(
        and(
          eq(userConsent.userId, ownerId),
          eq(userConsent.kind, "commitment_confirm"),
        ),
      );
    expect(consents).toHaveLength(1);

    const storedInvite = await database
      .select()
      .from(invitation)
      .where(eq(invitation.id, invite.id));
    expect(storedInvite[0]?.email).toBe("sam@example.com");
  });

  it("holds the stake logically when a friend verifies without Stripe", async () => {
    const ownerId = await insertUser("Maya");
    const friendId = await insertUser("Alex");
    await completeOnboarding(database, ownerId);

    await database.insert(friendship).values({
      requesterId: ownerId,
      addresseeId: friendId,
      status: "accepted",
      respondedAt: new Date(),
    });

    const created = await createCommitment(database, ownerId, {
      title: "Call Mum on Sunday",
      dueAt: new Date(Date.now() + 86_400_000),
      amountCents: 1000,
      currency: "EUR",
      verifierId: friendId,
      causes: [{ charityId: "givedirectly", percent: 100 }],
      paymentKind: "card",
      consented: true,
      termsVersion: CURRENT_TERMS_VERSION,
    });

    expect(created.status).toBe("active");
    expect(created.stakeStatus).toBe("held");
    expect(created.verifier?.id).toBe(friendId);
  });

  it("holds a pending invite commitment once the verifier accepts", async () => {
    const ownerId = await insertUser("Maya");
    const verifierId = await insertUser("Sam");
    await completeOnboarding(database, ownerId);

    const invite = await createEmailInvite(database, ownerId, {
      displayName: "Sam Rivera",
      email: "sam@example.com",
    });

    const created = await createCommitment(database, ownerId, {
      title: "Ship the portfolio site",
      dueAt: new Date(Date.now() + 86_400_000),
      amountCents: 5000,
      currency: "EUR",
      invitationId: invite.id,
      causes: [{ charityId: "against-malaria", percent: 100 }],
      paymentKind: "apple_pay",
      consented: true,
      termsVersion: CURRENT_TERMS_VERSION,
    });
    expect(created.status).toBe("awaiting_verifier");

    const accepted = await acceptInviteToken(
      database,
      verifierId,
      invite.token,
    );
    expect(accepted.held).toContain(created.id);

    const [row] = await database
      .select()
      .from(action)
      .where(eq(action.id, created.id));
    expect(row?.status).toBe("active");
    expect(row?.stakeStatus).toBe("held");
    expect(row?.verifierId).toBe(verifierId);
  });
});
