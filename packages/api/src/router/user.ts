import type { TRPCRouterRecord } from "@trpc/server";

import { handleSearchSchema } from "@discipline/validators";

import { searchHandles } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const userRouter = {
  searchHandle: protectedProcedure
    .input(handleSearchSchema)
    .query(({ ctx, input }) =>
      searchHandles(ctx.db, ctx.session.user.id, input.query),
    ),
} satisfies TRPCRouterRecord;
