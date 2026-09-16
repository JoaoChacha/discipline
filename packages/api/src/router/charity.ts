import type { TRPCRouterRecord } from "@trpc/server";

import { live } from "../lib/events";
import { listCharities } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const charityRouter = {
  onList: protectedProcedure.subscription(async function* ({ ctx, signal }) {
    yield* live(
      ctx.session.user.id,
      ["charities"],
      () => listCharities(ctx.db),
      signal,
    );
  }),
} satisfies TRPCRouterRecord;
