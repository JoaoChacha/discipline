import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import {
  action,
  billingCustomer,
  paymentMethod,
  stakeHold,
} from "@discipline/db/schema";

import type { DB } from "./reads";
import { events } from "./events";
import { getPayments } from "./payments";

export async function holdStake(
  db: DB,
  actionId: string,
  payments = getPayments(),
) {
  const existing = await db.query.stakeHold.findFirst({
    where: eq(stakeHold.actionId, actionId),
  });
  if (existing?.status === "authorized") {
    return existing;
  }

  const [current] = await db
    .select()
    .from(action)
    .where(eq(action.id, actionId))
    .limit(1);

  if (!current) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Commitment not found.",
    });
  }
  if (!current.verifierId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "A verifier must accept before the stake is held.",
    });
  }
  if (!current.paymentMethodId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Add a payment method before holding the stake.",
    });
  }

  const [method, customer] = await Promise.all([
    db.query.paymentMethod.findFirst({
      where: eq(paymentMethod.id, current.paymentMethodId),
    }),
    db.query.billingCustomer.findFirst({
      where: eq(billingCustomer.userId, current.ownerId),
    }),
  ]);

  if (!method || method.userId !== current.ownerId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Payment method is not available.",
    });
  }
  if (!customer) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Billing customer is missing.",
    });
  }

  const { paymentIntentId } = await payments.createHold({
    customerId: customer.stripeCustomerId,
    stripePaymentMethodId: method.stripePaymentMethodId,
    amountCents: current.amountCents,
    currency: current.currency,
    actionId,
  });

  const [hold] = existing
    ? await db
        .update(stakeHold)
        .set({
          paymentMethodId: method.id,
          stripePaymentIntentId: paymentIntentId,
          amountCents: current.amountCents,
          currency: current.currency,
          status: "authorized",
        })
        .where(eq(stakeHold.id, existing.id))
        .returning()
    : await db
        .insert(stakeHold)
        .values({
          actionId,
          paymentMethodId: method.id,
          stripePaymentIntentId: paymentIntentId,
          amountCents: current.amountCents,
          currency: current.currency,
          status: "authorized",
        })
        .returning();

  await db
    .update(action)
    .set({
      status: "active",
      stakeStatus: "held",
    })
    .where(eq(action.id, actionId));

  events.publish(
    [current.ownerId, current.verifierId],
    `commitment:${actionId}`,
  );
  events.publish([current.ownerId, current.verifierId], "commitments");

  return hold;
}

export async function applyLogicalHold(db: DB, actionId: string) {
  const [current] = await db
    .select()
    .from(action)
    .where(eq(action.id, actionId))
    .limit(1);

  if (!current) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Commitment not found.",
    });
  }
  if (!current.verifierId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "A verifier must accept before the stake is held.",
    });
  }

  await db
    .update(action)
    .set({
      status: "active",
      stakeStatus: "held",
    })
    .where(eq(action.id, actionId));

  events.publish(
    [current.ownerId, current.verifierId],
    `commitment:${actionId}`,
  );
  events.publish([current.ownerId, current.verifierId], "commitments");

  return current;
}

export async function ensureStakeHeld(db: DB, actionId: string) {
  const [current] = await db
    .select()
    .from(action)
    .where(eq(action.id, actionId))
    .limit(1);

  if (!current) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Commitment not found.",
    });
  }

  const canCharge =
    Boolean(current.paymentMethodId) && Boolean(process.env.STRIPE_SECRET_KEY);

  if (canCharge) {
    const customer = await db.query.billingCustomer.findFirst({
      where: eq(billingCustomer.userId, current.ownerId),
    });
    if (customer) {
      try {
        return await holdStake(db, actionId);
      } catch {
        return applyLogicalHold(db, actionId);
      }
    }
  }

  return applyLogicalHold(db, actionId);
}
