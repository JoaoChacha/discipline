import { TRPCError } from "@trpc/server";
import { and, eq, or } from "drizzle-orm";

import {
  acceptedFriendsCondition,
  action,
  friendship,
  invitation,
  profile,
  user,
} from "@discipline/db/schema";

import type { DB } from "./reads";
import { events } from "./events";
import { holdStake } from "./hold";
import { requireHandle } from "./profile";
import {
  createInviteToken,
  hashInviteToken,
  inviteExpiry,
  inviteUrls,
} from "./tokens";

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export async function createLinkInvite(
  db: DB,
  inviterId: string,
  note?: string,
) {
  await requireHandle(db, inviterId);
  const { token, tokenHash } = createInviteToken();
  const [row] = await db
    .insert(invitation)
    .values({
      inviterId,
      note,
      tokenHash,
      expiresAt: inviteExpiry(),
    })
    .returning();

  events.publish([inviterId], "invitations");
  return { invitation: row, token, urls: inviteUrls(token, appUrl()) };
}

export async function requestByHandle(
  db: DB,
  inviterId: string,
  handle: string,
) {
  await requireHandle(db, inviterId);

  const [target] = await db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      handle: profile.handle,
    })
    .from(profile)
    .innerJoin(user, eq(user.id, profile.userId))
    .where(eq(profile.handle, handle))
    .limit(1);

  if (!target) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No one has that handle.",
    });
  }
  if (target.id === inviterId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot verify your own commitment.",
    });
  }

  const [alreadyFriends] = await db
    .select({ id: friendship.id })
    .from(friendship)
    .where(acceptedFriendsCondition(inviterId, target.id))
    .limit(1);

  if (alreadyFriends) {
    return { type: "friend" as const, user: target };
  }

  const { token, tokenHash } = createInviteToken();
  const [row] = await db
    .insert(invitation)
    .values({
      inviterId,
      targetUserId: target.id,
      tokenHash,
      expiresAt: inviteExpiry(),
    })
    .returning();

  await upsertFriendship(db, inviterId, target.id, "pending");
  events.publish([inviterId, target.id], "invitations");
  events.publish([inviterId, target.id], "friends");

  return {
    type: "pending" as const,
    invitation: row,
    user: target,
    token,
    urls: inviteUrls(token, appUrl()),
  };
}

export async function acceptInviteToken(db: DB, userId: string, token: string) {
  await requireHandle(db, userId);
  const tokenHash = hashInviteToken(token);
  const [row] = await db
    .select()
    .from(invitation)
    .where(eq(invitation.tokenHash, tokenHash))
    .limit(1);

  if (!row) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found." });
  }
  return acceptInvitation(db, userId, row);
}

export async function acceptIncomingInvite(
  db: DB,
  userId: string,
  invitationId: string,
) {
  await requireHandle(db, userId);
  const [row] = await db
    .select()
    .from(invitation)
    .where(eq(invitation.id, invitationId))
    .limit(1);

  if (row?.targetUserId !== userId) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Invite not found." });
  }
  return acceptInvitation(db, userId, row);
}

async function acceptInvitation(
  db: DB,
  userId: string,
  row: typeof invitation.$inferSelect,
) {
  if (row.inviterId === userId) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot accept your own invite.",
    });
  }
  if (row.status !== "pending") {
    throw new TRPCError({
      code: "CONFLICT",
      message: "This invite is no longer pending.",
    });
  }
  if (row.expiresAt.getTime() <= Date.now()) {
    await db
      .update(invitation)
      .set({ status: "expired" })
      .where(eq(invitation.id, row.id));
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "This invite expired.",
    });
  }

  await db
    .update(invitation)
    .set({
      status: "accepted",
      acceptedUserId: userId,
      acceptedAt: new Date(),
    })
    .where(eq(invitation.id, row.id));

  await upsertFriendship(db, row.inviterId, userId, "accepted");

  const pendingActions = await db
    .select()
    .from(action)
    .where(eq(action.pendingInvitationId, row.id));

  const held: string[] = [];
  for (const current of pendingActions) {
    await db
      .update(action)
      .set({ verifierId: userId })
      .where(eq(action.id, current.id));

    if (current.confirmedAt && current.paymentMethodId) {
      await holdStake(db, current.id);
      held.push(current.id);
    } else {
      events.publish([current.ownerId, userId], `commitment:${current.id}`);
      events.publish([current.ownerId, userId], "commitments");
    }
  }

  events.publish([row.inviterId, userId], "invitations");
  events.publish([row.inviterId, userId], "friends");

  return { invitationId: row.id, held };
}

async function upsertFriendship(
  db: DB,
  userIdA: string,
  userIdB: string,
  status: "pending" | "accepted",
) {
  const [existing] = await db
    .select()
    .from(friendship)
    .where(
      or(
        and(
          eq(friendship.requesterId, userIdA),
          eq(friendship.addresseeId, userIdB),
        ),
        and(
          eq(friendship.requesterId, userIdB),
          eq(friendship.addresseeId, userIdA),
        ),
      ),
    )
    .limit(1);

  if (!existing) {
    await db.insert(friendship).values({
      requesterId: userIdA,
      addresseeId: userIdB,
      status,
      respondedAt: status === "accepted" ? new Date() : null,
    });
    return;
  }

  if (existing.status === "accepted") return;

  await db
    .update(friendship)
    .set({
      status,
      respondedAt: status === "accepted" ? new Date() : existing.respondedAt,
    })
    .where(eq(friendship.id, existing.id));
}
