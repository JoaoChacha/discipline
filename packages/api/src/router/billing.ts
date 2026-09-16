import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";

import { billingCustomer, paymentMethod } from "@discipline/db/schema";
import { setDefaultPaymentMethodSchema } from "@discipline/validators";

import { events, live } from "../lib/events";
import { getPayments } from "../lib/payments";
import { listPaymentMethods } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const billingRouter = {
  createSetupIntent: protectedProcedure.mutation(async ({ ctx }) => {
    const payments = getPayments();
    const existing = await ctx.db.query.billingCustomer.findFirst({
      where: eq(billingCustomer.userId, ctx.session.user.id),
    });

    const stripeCustomerId =
      existing?.stripeCustomerId ??
      (await payments.ensureCustomer({
        userId: ctx.session.user.id,
        email: ctx.session.user.email,
        name: ctx.session.user.name,
      }));

    if (!existing) {
      await ctx.db.insert(billingCustomer).values({
        userId: ctx.session.user.id,
        stripeCustomerId,
      });
    }

    return payments.createSetupIntent(stripeCustomerId);
  }),
  setDefault: protectedProcedure
    .input(setDefaultPaymentMethodSchema)
    .mutation(async ({ ctx, input }) => {
      const method = await ctx.db.query.paymentMethod.findFirst({
        where: and(
          eq(paymentMethod.id, input.paymentMethodId),
          eq(paymentMethod.userId, ctx.session.user.id),
        ),
      });
      if (!method) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Payment method not found.",
        });
      }

      await ctx.db
        .update(paymentMethod)
        .set({ isDefault: false })
        .where(eq(paymentMethod.userId, ctx.session.user.id));
      await ctx.db
        .update(paymentMethod)
        .set({ isDefault: true })
        .where(eq(paymentMethod.id, method.id));

      events.publish([ctx.session.user.id], "paymentMethods");
      return listPaymentMethods(ctx.db, ctx.session.user.id);
    }),
  onPaymentMethods: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    const userId = ctx.session.user.id;
    yield* live(
      userId,
      ["paymentMethods"],
      () => listPaymentMethods(ctx.db, userId),
      signal,
    );
  }),
} satisfies TRPCRouterRecord;
