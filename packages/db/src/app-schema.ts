import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  pgEnum,
  pgTable,
  uniqueIndex,
} from "drizzle-orm/pg-core";

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

export const onboardingStatus = pgEnum("onboarding_status", [
  "required",
  "completed",
]);

export const consentKind = pgEnum("consent_kind", [
  "onboarding",
  "commitment_confirm",
]);

export const profile = pgTable(
  "profile",
  (t) => ({
    userId: t
      .text()
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    timezone: t.text().notNull().default("UTC"),
    currency: t.char({ length: 3 }).notNull().default("EUR"),
    onboardingStatus: onboardingStatus().notNull().default("required"),
    onboardingCompletedAt: t.timestamp({ withTimezone: true }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    check(
      "profile_onboarding_completed_at_matches",
      sql`(${t.onboardingStatus} = 'required' AND ${t.onboardingCompletedAt} IS NULL) OR (${t.onboardingStatus} = 'completed' AND ${t.onboardingCompletedAt} IS NOT NULL)`,
    ),
  ],
);

export const charity = pgTable(
  "charity",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    slug: t.text().notNull().unique(),
    name: t.text().notNull(),
    mission: t.text().notNull(),
    websiteUrl: t.text(),
    isActive: t.boolean().notNull().default(true),
    sortOrder: t.integer().notNull().default(0),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index("charity_active_sort_idx").on(t.isActive, t.sortOrder)],
);

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
    stakeStatus: stakeStatus().notNull().default("none"),
    donationBps: t.integer().notNull().default(9000),
    platformFeeBps: t.integer().notNull().default(1000),
    confirmedAt: t.timestamp({ withTimezone: true }),
    donationCents: t.integer(),
    platformFeeCents: t.integer(),
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
    check("action_amount_positive", sql`${t.amountCents} > 0`),
    check(
      "action_split_covers_stake",
      sql`${t.donationBps} >= 0 AND ${t.platformFeeBps} >= 0 AND ${t.donationBps} + ${t.platformFeeBps} = 10000`,
    ),
    check(
      "action_settlement_cents_nonnegative",
      sql`(${t.donationCents} IS NULL OR ${t.donationCents} >= 0) AND (${t.platformFeeCents} IS NULL OR ${t.platformFeeCents} >= 0)`,
    ),
    index("action_owner_status_idx").on(t.ownerId, t.status),
    index("action_verifier_status_idx").on(t.verifierId, t.status),
    index("action_due_at_idx").on(t.dueAt),
  ],
);

export const actionCharityAllocation = pgTable(
  "action_charity_allocation",
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
    allocationBps: t.integer().notNull(),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [
    uniqueIndex("action_charity_allocation_action_charity_uidx").on(
      t.actionId,
      t.charityId,
    ),
    check(
      "action_charity_allocation_bps_range",
      sql`${t.allocationBps} > 0 AND ${t.allocationBps} <= 10000`,
    ),
    index("action_charity_allocation_action_idx").on(t.actionId),
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

export const userConsent = pgTable(
  "user_consent",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    kind: consentKind().notNull(),
    termsVersion: t.text().notNull(),
    actionId: t.uuid().references(() => action.id, { onDelete: "cascade" }),
    acceptedAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [
    check(
      "user_consent_action_matches_kind",
      sql`(${t.kind} = 'onboarding' AND ${t.actionId} IS NULL) OR (${t.kind} = 'commitment_confirm' AND ${t.actionId} IS NOT NULL)`,
    ),
    index("user_consent_user_kind_idx").on(t.userId, t.kind),
    index("user_consent_action_idx").on(t.actionId),
  ],
);

export const profileRelations = relations(profile, ({ one, many }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
  consents: many(userConsent),
}));

export const charityRelations = relations(charity, ({ many }) => ({
  allocations: many(actionCharityAllocation),
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
  charityAllocations: many(actionCharityAllocation),
  consents: many(userConsent),
}));

export const actionCharityAllocationRelations = relations(
  actionCharityAllocation,
  ({ one }) => ({
    action: one(action, {
      fields: [actionCharityAllocation.actionId],
      references: [action.id],
    }),
    charity: one(charity, {
      fields: [actionCharityAllocation.charityId],
      references: [charity.id],
    }),
  }),
);

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

export const userConsentRelations = relations(userConsent, ({ one }) => ({
  user: one(user, {
    fields: [userConsent.userId],
    references: [user.id],
    relationName: "consents",
  }),
  profile: one(profile, {
    fields: [userConsent.userId],
    references: [profile.userId],
  }),
  action: one(action, {
    fields: [userConsent.actionId],
    references: [action.id],
  }),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  consents: many(userConsent, { relationName: "consents" }),
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
