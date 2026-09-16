import type { TRPCRouterRecord } from "@trpc/server";

import { live } from "../lib/events";
import { listFriends } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const friendRouter = {
  onList: protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const userId = ctx.session.user.id;
    yield* live(userId, ["friends"], () => listFriends(ctx.db, userId), signal);
  }),
} satisfies TRPCRouterRecord;
