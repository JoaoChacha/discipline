import { and, eq, or } from "drizzle-orm";

import { friendship } from "./app-schema";

/**
 * Accepted friendship in either direction.
 * Reviewers must satisfy this at create time and again at verdict time.
 */
export function acceptedFriendsCondition(userIdA: string, userIdB: string) {
  return and(
    eq(friendship.status, "accepted"),
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
  );
}
