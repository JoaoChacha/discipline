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

export async function upsertPaymentMethodFromStripe(
  db: DB,
  stripePaymentMethodId: string,
  payments = getPayments(),
) {
  const card = await payments.retrieveCard(stripePaymentMethodId);
  const customer = await db.query.billingCustomer.findFirst({
    where: eq(billingCustomer.stripeCustomerId, card.customerId),
  });
  if (!customer) return null;

  const existing = await db.query.paymentMethod.findFirst({
    where: eq(paymentMethod.stripePaymentMethodId, stripePaymentMethodId),
  });

  const defaults = await db
    .select({ id: paymentMethod.id })
    .from(paymentMethod)
    .where(eq(paymentMethod.userId, customer.userId));

  const isDefault = defaults.length === 0;

  const [row] = existing
    ? await db
        .update(paymentMethod)
        .set({
          brand: card.brand,
          last4: card.last4,
          expMonth: card.expMonth,
          expYear: card.expYear,
        })
        .where(eq(paymentMethod.id, existing.id))
        .returning()
    : await db
        .insert(paymentMethod)
        .values({
          userId: customer.userId,
          stripePaymentMethodId,
          brand: card.brand,
          last4: card.last4,
          expMonth: card.expMonth,
          expYear: card.expYear,
          isDefault,
        })
        .returning();

  events.publish([customer.userId], "paymentMethods");
  return row;
}

export async function applyPaymentIntentStatus(
  db: DB,
  stripePaymentIntentId: string,
  status: "authorized" | "captured" | "canceled" | "failed",
) {
  const [hold] = await db
    .update(stakeHold)
    .set({ status })
    .where(eq(stakeHold.stripePaymentIntentId, stripePaymentIntentId))
    .returning();

  if (!hold) return null;

  if (status === "canceled" || status === "failed") {
    await db
      .update(action)
      .set({ stakeStatus: "none" })
      .where(eq(action.id, hold.actionId));
  }

  const current = await db.query.action.findFirst({
    where: eq(action.id, hold.actionId),
  });
  if (current) {
    events.publish(
      [current.ownerId, current.verifierId ?? ""],
      `commitment:${current.id}`,
    );
    events.publish([current.ownerId, current.verifierId ?? ""], "commitments");
  }
  return hold;
}
