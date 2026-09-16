import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import {
  commitmentIdSchema,
  createCommitmentSchema,
} from "@discipline/validators";

import { createCommitment } from "../lib/commitment";
import { live } from "../lib/events";
import { getCommitment, listMine } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const commitmentRouter = {
  create: protectedProcedure
    .input(createCommitmentSchema)
    .mutation(({ ctx, input }) =>
      createCommitment(ctx.db, ctx.session.user.id, input),
    ),
  list: protectedProcedure.query(({ ctx }) =>
    listMine(ctx.db, ctx.session.user.id),
  ),
  get: protectedProcedure
    .input(commitmentIdSchema)
    .query(async ({ ctx, input }) => {
      const row = await getCommitment(ctx.db, input.id, ctx.session.user.id);
      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Commitment not found.",
        });
      }
      return row;
    }),
  onGet: protectedProcedure
    .input(commitmentIdSchema)
    .subscription(async function* ({ ctx, input, signal }) {
      const userId = ctx.session.user.id;
      yield* live(
        userId,
        ["commitments", `commitment:${input.id}`],
        async () => {
          const row = await getCommitment(ctx.db, input.id, userId);
          if (!row) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Commitment not found.",
            });
          }
          return row;
        },
        signal,
      );
    }),
  onMine: protectedProcedure.subscription(async function* ({ ctx, signal }) {
    const userId = ctx.session.user.id;
    yield* live(
      userId,
      ["commitments"],
      () => listMine(ctx.db, userId),
      signal,
    );
  }),
} satisfies TRPCRouterRecord;
