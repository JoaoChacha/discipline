import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";

import { profile } from "@discipline/db/schema";

import type { DB } from "./reads";
import { events } from "./events";

export async function claimHandle(db: DB, userId: string, handle: string) {
  const taken = await db.query.profile.findFirst({
    where: eq(profile.handle, handle),
  });
  if (taken && taken.userId !== userId) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "That handle is already taken.",
    });
  }

  const existing = await db.query.profile.findFirst({
    where: eq(profile.userId, userId),
  });

  if (existing) {
    const [updated] = await db
      .update(profile)
      .set({ handle })
      .where(eq(profile.userId, userId))
      .returning();
    events.publish([userId], "me");
    return updated;
  }

  const [created] = await db
    .insert(profile)
    .values({ userId, handle })
    .returning();
  events.publish([userId], "me");
  return created;
}

export async function requireHandle(db: DB, userId: string) {
  const row = await db.query.profile.findFirst({
    where: eq(profile.userId, userId),
  });
  if (!row?.handle) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Claim a handle first.",
    });
  }
  return row;
}
