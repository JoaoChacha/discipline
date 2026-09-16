import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import type { CreateCommitmentInput } from "@discipline/validators";
import {
  acceptedFriendsCondition,
  action,
  actionCause,
  friendship,
  hasCompletedOnboarding,
  invitation,
  paymentMethod,
  profile,
  userConsent,
} from "@discipline/db/schema";
import { COMPANY_FEE_BPS, CURRENT_TERMS_VERSION } from "@discipline/validators";

import type { DB } from "./reads";
import { events } from "./events";
import { ensureStakeHeld } from "./hold";
import { ensureProfile } from "./onboarding";
import { getCommitment } from "./reads";

export async function requireCompletedOnboarding(db: DB, ownerId: string) {
  await ensureProfile(db, ownerId);
  const row = await db.query.profile.findFirst({
    where: eq(profile.userId, ownerId),
  });
  if (!row || !hasCompletedOnboarding(row)) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Finish onboarding before creating a commitment.",
    });
  }
  return row;
}

export async function createCommitment(
  db: DB,
  ownerId: string,
  input: CreateCommitmentInput,
) {
  await requireCompletedOnboarding(db, ownerId);

  let paymentMethodId: string | null = null;
  if (input.paymentMethodId) {
    const method = await db.query.paymentMethod.findFirst({
      where: eq(paymentMethod.id, input.paymentMethodId),
    });
    if (method?.userId !== ownerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Choose one of your payment methods.",
      });
    }
    paymentMethodId = method.id;
  }

  let verifierId: string | null = null;
  let pendingInvitationId: string | null = null;

  if (input.verifierId) {
    if (input.verifierId === ownerId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You cannot verify your own commitment.",
      });
    }
    const [friend] = await db
      .select({ id: friendship.id })
      .from(friendship)
      .where(acceptedFriendsCondition(ownerId, input.verifierId))
      .limit(1);
    if (!friend) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Pick an accepted friend or send them an invite first.",
      });
    }
    verifierId = input.verifierId;
  } else if (input.invitationId) {
    const [invite] = await db
      .select()
      .from(invitation)
      .where(eq(invitation.id, input.invitationId))
      .limit(1);
    if (
      invite?.inviterId !== ownerId ||
      invite.status !== "pending" ||
      invite.expiresAt.getTime() <= Date.now()
    ) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "That invite cannot be used.",
      });
    }
    pendingInvitationId = invite.id;
  }

  const now = new Date();
  const [created] = await db
    .insert(action)
    .values({
      ownerId,
      verifierId,
      pendingInvitationId,
      paymentMethodId,
      paymentKind: input.paymentKind,
      title: input.title,
      dueAt: input.dueAt,
      amountCents: input.amountCents,
      currency: input.currency,
      feeBps: COMPANY_FEE_BPS,
      status: verifierId ? "draft" : "awaiting_verifier",
      confirmedAt: now,
    })
    .returning();

  if (!created) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Could not create the commitment.",
    });
  }

  await db.insert(actionCause).values(
    input.causes.map((cause) => ({
      actionId: created.id,
      charityId: cause.charityId,
      percent: cause.percent,
    })),
  );

  await db
    .insert(userConsent)
    .values({
      userId: ownerId,
      kind: "commitment_confirm",
      termsVersion: input.termsVersion ?? CURRENT_TERMS_VERSION,
    })
    .onConflictDoNothing({
      target: [userConsent.userId, userConsent.kind, userConsent.termsVersion],
    });

  if (verifierId) {
    await ensureStakeHeld(db, created.id);
  } else {
    events.publish([ownerId], `commitment:${created.id}`);
    events.publish([ownerId], "commitments");
  }

  const result = await getCommitment(db, created.id, ownerId);
  if (!result) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Created commitment could not be loaded.",
    });
  }
  return result;
}
