import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import {
  MIN_STAKE_CENTS,
  SETTLEMENT_POLICY_VERSION,
} from "@discipline/validators";

import { user } from "./auth-schema";

export const invitationStatus = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "expired",
  "cancelled",
]);

export const friendshipStatus = pgEnum("friendship_status", [
  "pending",
  "accepted",
  "declined",
  "blocked",
]);

export const actionStatus = pgEnum("action_status", [
  "draft",
  "active",
  "proof_submitted",
  "completed",
  "failed",
  "expired",
  "cancelled",
]);

export const stakeStatus = pgEnum("stake_status", [
  "none",
  "held",
  "returned",
  "forfeited",
]);

export const proofKind = pgEnum("proof_kind", ["note", "photo"]);

export const verdictOutcome = pgEnum("verdict_outcome", [
  "fulfilled",
  "not_fulfilled",
]);

export const profile = pgTable("profile", (t) => ({
  userId: t
    .text()
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  timezone: t.text().notNull().default("UTC"),
  currency: t.char({ length: 3 }).notNull().default("EUR"),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const invitation = pgTable(
  "invitation",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    inviterId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    email: t.text().notNull(),
    tokenHash: t.text().notNull().unique(),
    status: invitationStatus().notNull().default("pending"),
    expiresAt: t.timestamp({ withTimezone: true }).notNull(),
    acceptedUserId: t
      .text()
      .references(() => user.id, { onDelete: "set null" }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    acceptedAt: t.timestamp({ withTimezone: true }),
  }),
  (t) => [
    uniqueIndex("invitation_pending_inviter_email_uidx")
      .on(t.inviterId, t.email)
      .where(sql`${t.status} = 'pending'`),
    index("invitation_email_idx").on(t.email),
  ],
);

export const friendship = pgTable(
  "friendship",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    requesterId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    addresseeId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: friendshipStatus().notNull().default("pending"),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    respondedAt: t.timestamp({ withTimezone: true }),
  }),
  (t) => [
    uniqueIndex("friendship_pair_uidx").on(
      sql`least(${t.requesterId}, ${t.addresseeId})`,
      sql`greatest(${t.requesterId}, ${t.addresseeId})`,
    ),
    check("friendship_not_self", sql`${t.requesterId} <> ${t.addresseeId}`),
    index("friendship_requester_status_idx").on(t.requesterId, t.status),
    index("friendship_addressee_status_idx").on(t.addresseeId, t.status),
  ],
);

export const action = pgTable(
  "action",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    ownerId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verifierId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    title: t.text().notNull(),
    dueAt: t.timestamp({ withTimezone: true }).notNull(),
    status: actionStatus().notNull().default("draft"),
    amountCents: t.integer().notNull(),
    currency: t.char({ length: 3 }).notNull(),
    settlementPolicyVersion: t
      .integer()
      .notNull()
      .default(SETTLEMENT_POLICY_VERSION),
    stakeStatus: stakeStatus().notNull().default("none"),
    settledAt: t.timestamp({ withTimezone: true }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    check("action_not_self_review", sql`${t.ownerId} <> ${t.verifierId}`),
    check(
      "action_amount_min_stake",
      sql`${t.amountCents} >= ${sql.raw(String(MIN_STAKE_CENTS))}`,
    ),
    index("action_owner_status_idx").on(t.ownerId, t.status),
    index("action_verifier_status_idx").on(t.verifierId, t.status),
    index("action_due_at_idx").on(t.dueAt),
  ],
);

export const proof = pgTable(
  "proof",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    actionId: t
      .uuid()
      .notNull()
      .references(() => action.id, { onDelete: "cascade" }),
    submittedBy: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: proofKind().notNull().default("note"),
    note: t.text(),
    storageKey: t.text(),
    submittedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [index("proof_action_idx").on(t.actionId)],
);

export const charity = pgTable(
  "charity",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    goodstackOrganisationId: t.text().notNull(),
    name: t.text().notNull(),
    countryCode: t.char({ length: 3 }).notNull(),
    isActive: t.boolean().notNull().default(true),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    uniqueIndex("charity_goodstack_organisation_uidx").on(
      t.goodstackOrganisationId,
    ),
    index("charity_active_name_idx").on(t.isActive, t.name),
  ],
);

export const charityGroup = pgTable("charity_group", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.text().notNull(),
  isActive: t.boolean().notNull().default(true),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const charityGroupMember = pgTable(
  "charity_group_member",
  (t) => ({
    groupId: t
      .uuid()
      .notNull()
      .references(() => charityGroup.id, { onDelete: "cascade" }),
    charityId: t
      .uuid()
      .notNull()
      .references(() => charity.id, { onDelete: "restrict" }),
  }),
  (t) => [
    uniqueIndex("charity_group_member_uidx").on(t.groupId, t.charityId),
    index("charity_group_member_charity_idx").on(t.charityId),
  ],
);

export const actionDonationAllocation = pgTable(
  "action_donation_allocation",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    actionId: t
      .uuid()
      .notNull()
      .references(() => action.id, { onDelete: "cascade" }),
    charityId: t
      .uuid()
      .notNull()
      .references(() => charity.id, { onDelete: "restrict" }),
    shareBps: t.integer().notNull(),
  }),
  (t) => [
    uniqueIndex("action_donation_allocation_action_charity_uidx").on(
      t.actionId,
      t.charityId,
    ),
    check(
      "action_donation_allocation_share_bps",
      sql`${t.shareBps} > 0 AND ${t.shareBps} <= 10000`,
    ),
    index("action_donation_allocation_action_idx").on(t.actionId),
  ],
);

/**
 * Snapshot of the locked 80/20 split when a stake is forfeited.
 * `donationPoolCents` is paid in full to the selected charities.
 * Stripe and Goodstack fees come out of `taxCents`.
 */
export const stakeSettlement = pgTable(
  "stake_settlement",
  (t) => ({
    actionId: t
      .uuid()
      .primaryKey()
      .references(() => action.id, { onDelete: "cascade" }),
    policyVersion: t.integer().notNull(),
    amountCents: t.integer().notNull(),
    donationPoolCents: t.integer().notNull(),
    taxCents: t.integer().notNull(),
    currency: t.char({ length: 3 }).notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [
    check(
      "stake_settlement_split",
      sql`${t.donationPoolCents} + ${t.taxCents} = ${t.amountCents}`,
    ),
    check("stake_settlement_positive", sql`${t.amountCents} > 0`),
  ],
);

export const verdict = pgTable("verdict", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  proofId: t
    .uuid()
    .notNull()
    .unique()
    .references(() => proof.id, { onDelete: "cascade" }),
  verifierId: t
    .text()
    .notNull()
    .references(() => user.id, { onDelete: "restrict" }),
  outcome: verdictOutcome().notNull(),
  note: t.text(),
  decidedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
    relationName: "sentInvitations",
  }),
  acceptedUser: one(user, {
    fields: [invitation.acceptedUserId],
    references: [user.id],
    relationName: "acceptedInvitations",
  }),
}));

export const friendshipRelations = relations(friendship, ({ one }) => ({
  requester: one(user, {
    fields: [friendship.requesterId],
    references: [user.id],
    relationName: "sentFriendRequests",
  }),
  addressee: one(user, {
    fields: [friendship.addresseeId],
    references: [user.id],
    relationName: "receivedFriendRequests",
  }),
}));

export const actionRelations = relations(action, ({ one, many }) => ({
  owner: one(user, {
    fields: [action.ownerId],
    references: [user.id],
    relationName: "ownedActions",
  }),
  verifier: one(user, {
    fields: [action.verifierId],
    references: [user.id],
    relationName: "verifyingActions",
  }),
  proofs: many(proof),
  donationAllocations: many(actionDonationAllocation),
  settlement: one(stakeSettlement),
}));

export const proofRelations = relations(proof, ({ one }) => ({
  action: one(action, { fields: [proof.actionId], references: [action.id] }),
  submitter: one(user, {
    fields: [proof.submittedBy],
    references: [user.id],
    relationName: "submittedProofs",
  }),
  verdict: one(verdict),
}));

export const verdictRelations = relations(verdict, ({ one }) => ({
  proof: one(proof, { fields: [verdict.proofId], references: [proof.id] }),
  verifier: one(user, {
    fields: [verdict.verifierId],
    references: [user.id],
    relationName: "writtenVerdicts",
  }),
}));

export const charityRelations = relations(charity, ({ many }) => ({
  groupMembers: many(charityGroupMember),
  donationAllocations: many(actionDonationAllocation),
}));

export const charityGroupRelations = relations(charityGroup, ({ many }) => ({
  members: many(charityGroupMember),
}));

export const charityGroupMemberRelations = relations(
  charityGroupMember,
  ({ one }) => ({
    group: one(charityGroup, {
      fields: [charityGroupMember.groupId],
      references: [charityGroup.id],
    }),
    charity: one(charity, {
      fields: [charityGroupMember.charityId],
      references: [charity.id],
    }),
  }),
);

export const actionDonationAllocationRelations = relations(
  actionDonationAllocation,
  ({ one }) => ({
    action: one(action, {
      fields: [actionDonationAllocation.actionId],
      references: [action.id],
    }),
    charity: one(charity, {
      fields: [actionDonationAllocation.charityId],
      references: [charity.id],
    }),
  }),
);

export const stakeSettlementRelations = relations(
  stakeSettlement,
  ({ one }) => ({
    action: one(action, {
      fields: [stakeSettlement.actionId],
      references: [action.id],
    }),
  }),
);

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  sentInvitations: many(invitation, { relationName: "sentInvitations" }),
  acceptedInvitations: many(invitation, {
    relationName: "acceptedInvitations",
  }),
  sentFriendRequests: many(friendship, { relationName: "sentFriendRequests" }),
  receivedFriendRequests: many(friendship, {
    relationName: "receivedFriendRequests",
  }),
  ownedActions: many(action, { relationName: "ownedActions" }),
  verifyingActions: many(action, { relationName: "verifyingActions" }),
  submittedProofs: many(proof, { relationName: "submittedProofs" }),
  writtenVerdicts: many(verdict, { relationName: "writtenVerdicts" }),
}));
