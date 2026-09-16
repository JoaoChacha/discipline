import type { TRPCRouterRecord } from "@trpc/server";

import {
  acceptIncomingInviteSchema,
  acceptInviteTokenSchema,
  createLinkInviteSchema,
  requestByHandleSchema,
} from "@discipline/validators";

import { live } from "../lib/events";
import {
  acceptIncomingInvite,
  acceptInviteToken,
  createLinkInvite,
  requestByHandle,
} from "../lib/invite";
import { listIncomingInvitations, listOutgoingInvitations } from "../lib/reads";
import { protectedProcedure } from "../trpc";

export const invitationRouter = {
  createLink: protectedProcedure
    .input(createLinkInviteSchema)
    .mutation(({ ctx, input }) =>
      createLinkInvite(ctx.db, ctx.session.user.id, input.note),
    ),
  requestByHandle: protectedProcedure
    .input(requestByHandleSchema)
    .mutation(({ ctx, input }) =>
      requestByHandle(ctx.db, ctx.session.user.id, input.handle),
    ),
  accept: protectedProcedure
    .input(acceptInviteTokenSchema)
    .mutation(({ ctx, input }) =>
      acceptInviteToken(ctx.db, ctx.session.user.id, input.token),
    ),
  acceptIncoming: protectedProcedure
    .input(acceptIncomingInviteSchema)
    .mutation(({ ctx, input }) =>
      acceptIncomingInvite(ctx.db, ctx.session.user.id, input.invitationId),
    ),
  onOutgoing: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    const userId = ctx.session.user.id;
    yield* live(
      userId,
      ["invitations"],
      () => listOutgoingInvitations(ctx.db, userId),
      signal,
    );
  }),
  onIncoming: protectedProcedure.subscription(async function* ({
    ctx,
    signal,
  }) {
    const userId = ctx.session.user.id;
    yield* live(
      userId,
      ["invitations"],
      () => listIncomingInvitations(ctx.db, userId),
      signal,
    );
  }),
} satisfies TRPCRouterRecord;
