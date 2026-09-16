import type { TRPCRouterRecord } from "@trpc/server";

import { completeOnboardingInput } from "@discipline/validators";

import { completeOnboarding, getOnboardingState } from "../lib/onboarding";
import { protectedProcedure } from "../trpc";

export const onboardingRouter = {
  getState: protectedProcedure.query(({ ctx }) => {
    return getOnboardingState(ctx.db, ctx.session.user.id);
  }),
  complete: protectedProcedure
    .input(completeOnboardingInput)
    .mutation(({ ctx }) => {
      return completeOnboarding(ctx.db, ctx.session.user.id);
    }),
} satisfies TRPCRouterRecord;
