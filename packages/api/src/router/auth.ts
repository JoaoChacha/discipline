import type { TRPCRouterRecord } from "@trpc/server";

import { completeProfileSchema } from "@discipline/validators";

import { live } from "../lib/events";
import { claimHandle } from "../lib/profile";
import { getMe } from "../lib/reads";
import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => ctx.session),
  onMe: protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const userId = ctx.session.user.id;
    yield* live(userId, ["me"], () => getMe(ctx.db, userId), signal);
  }),
  completeProfile: protectedProcedure
    .input(completeProfileSchema)
    .mutation(async ({ ctx, input }) => {
      await claimHandle(ctx.db, ctx.session.user.id, input.handle);
      return getMe(ctx.db, ctx.session.user.id);
    }),
} satisfies TRPCRouterRecord;
