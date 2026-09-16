import { and, desc, eq, ilike, ne, or, sql } from "drizzle-orm";

import type { db as Database } from "@discipline/db/client";
import {
  action,
  actionCause,
  billingCustomer,
  charity,
  friendship,
  invitation,
  paymentMethod,
  profile,
  stakeHold,
  user,
} from "@discipline/db/schema";
import { stakeOutcome } from "@discipline/validators";

type DB = typeof Database;

export async function getMe(db: DB, userId: string) {
  const [row] = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      handle: profile.handle,
      timezone: profile.timezone,
      currency: profile.currency,
    })
    .from(user)
    .leftJoin(profile, eq(profile.userId, user.id))
    .where(eq(user.id, userId))
    .limit(1);

  if (!row) return null;

  return {
    ...row,
    needsHandle: !row.handle,
  };
}

export async function listFriends(db: DB, userId: string) {
  const rows = await db
    .select({
      friendshipId: friendship.id,
      requesterId: friendship.requesterId,
      addresseeId: friendship.addresseeId,
      id: user.id,
      name: user.name,
      image: user.image,
      handle: profile.handle,
    })
    .from(friendship)
    .innerJoin(
      user,
      or(
        and(
          eq(friendship.requesterId, userId),
          eq(user.id, friendship.addresseeId),
        ),
        and(
          eq(friendship.addresseeId, userId),
          eq(user.id, friendship.requesterId),
        ),
      ),
    )
    .leftJoin(profile, eq(profile.userId, user.id))
    .where(eq(friendship.status, "accepted"));

  return rows.map(({ friendshipId, ...friend }) => ({
    friendshipId,
    ...friend,
  }));
}

export async function searchHandles(db: DB, userId: string, query: string) {
  return db
    .select({
      id: user.id,
      name: user.name,
      image: user.image,
      handle: profile.handle,
    })
    .from(profile)
    .innerJoin(user, eq(user.id, profile.userId))
    .where(
      and(
        ne(profile.userId, userId),
        sql`${profile.handle} IS NOT NULL`,
        ilike(profile.handle, `${query}%`),
      ),
    )
    .orderBy(profile.handle)
    .limit(20);
}

export async function listOutgoingInvitations(db: DB, userId: string) {
  return db
    .select()
    .from(invitation)
    .where(eq(invitation.inviterId, userId))
    .orderBy(desc(invitation.createdAt));
}

export async function listIncomingInvitations(db: DB, userId: string) {
  return db
    .select()
    .from(invitation)
    .where(
      and(
        eq(invitation.targetUserId, userId),
        eq(invitation.status, "pending"),
      ),
    )
    .orderBy(desc(invitation.createdAt));
}

export async function listCharities(db: DB) {
  return db
    .select()
    .from(charity)
    .where(eq(charity.isActive, true))
    .orderBy(charity.name);
}

export async function listPaymentMethods(db: DB, userId: string) {
  return db
    .select()
    .from(paymentMethod)
    .where(eq(paymentMethod.userId, userId))
    .orderBy(desc(paymentMethod.isDefault), desc(paymentMethod.createdAt));
}

export async function getCommitment(db: DB, id: string, userId: string) {
  const [row] = await db
    .select()
    .from(action)
    .where(
      and(
        eq(action.id, id),
        or(eq(action.ownerId, userId), eq(action.verifierId, userId)),
      ),
    )
    .limit(1);

  if (!row) return null;

  const [causes, hold, pendingInvite, verifier] = await Promise.all([
    db
      .select({
        charityId: actionCause.charityId,
        percent: actionCause.percent,
        name: charity.name,
        mission: charity.mission,
        icon: charity.icon,
        accent: charity.accent,
      })
      .from(actionCause)
      .innerJoin(charity, eq(charity.id, actionCause.charityId))
      .where(eq(actionCause.actionId, id)),
    db.query.stakeHold.findFirst({
      where: eq(stakeHold.actionId, id),
    }),
    row.pendingInvitationId
      ? db.query.invitation.findFirst({
          where: eq(invitation.id, row.pendingInvitationId),
        })
      : Promise.resolve(null),
    row.verifierId
      ? db
          .select({
            id: user.id,
            name: user.name,
            image: user.image,
            handle: profile.handle,
          })
          .from(user)
          .leftJoin(profile, eq(profile.userId, user.id))
          .where(eq(user.id, row.verifierId))
          .limit(1)
          .then((rows) => rows[0] ?? null)
      : Promise.resolve(null),
  ]);

  const outcome = stakeOutcome(row.amountCents, row.feeBps);

  return {
    ...row,
    causes,
    hold: hold ?? null,
    outcome,
    verifier,
    pendingInvite: pendingInvite
      ? {
          id: pendingInvite.id,
          displayName: pendingInvite.displayName,
          email: pendingInvite.email,
          status: pendingInvite.status,
        }
      : null,
  };
}

export async function listMine(db: DB, userId: string) {
  const rows = await db
    .select()
    .from(action)
    .where(or(eq(action.ownerId, userId), eq(action.verifierId, userId)))
    .orderBy(desc(action.createdAt));

  const loaded = await Promise.all(
    rows.map((row) => getCommitment(db, row.id, userId)),
  );
  return loaded.filter((row): row is NonNullable<typeof row> => Boolean(row));
}

export async function requireBillingCustomer(db: DB, userId: string) {
  return db.query.billingCustomer.findFirst({
    where: eq(billingCustomer.userId, userId),
  });
}

export { type DB };
