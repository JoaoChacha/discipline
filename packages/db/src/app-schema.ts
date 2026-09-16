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
  "awaiting_verifier",
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

export const holdStatus = pgEnum("hold_status", [
  "authorized",
  "captured",
  "canceled",
  "failed",
]);

export const proofKind = pgEnum("proof_kind", ["note", "photo"]);

export const verdictOutcome = pgEnum("verdict_outcome", [
  "fulfilled",
  "not_fulfilled",
]);

export const profile = pgTable(
  "profile",
  (t) => ({
    userId: t
      .text()
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    handle: t.text(),
    timezone: t.text().notNull().default("UTC"),
    currency: t.char({ length: 3 }).notNull().default("EUR"),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    uniqueIndex("profile_handle_uidx").on(t.handle),
    check(
      "profile_handle_format",
      sql`${t.handle} IS NULL OR ${t.handle} ~ '^[a-z0-9_]{3,20}$'`,
    ),
  ],
);

export const invitation = pgTable(
  "invitation",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    inviterId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    targetUserId: t.text().references(() => user.id, { onDelete: "set null" }),
    note: t.text(),
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
    index("invitation_inviter_status_idx").on(t.inviterId, t.status),
    index("invitation_target_status_idx").on(t.targetUserId, t.status),
    check(
      "invitation_not_self_target",
      sql`${t.targetUserId} IS NULL OR ${t.inviterId} <> ${t.targetUserId}`,
    ),
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

export const charity = pgTable("charity", (t) => ({
  id: t.text().primaryKey(),
  name: t.text().notNull(),
  mission: t.text().notNull(),
  icon: t.text().notNull(),
  accent: t.text().notNull(),
  isActive: t.boolean().notNull().default(true),
}));

export const billingCustomer = pgTable("billing_customer", (t) => ({
  userId: t
    .text()
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: t.text().notNull().unique(),
  createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: t
    .timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}));

export const paymentMethod = pgTable(
  "payment_method",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    stripePaymentMethodId: t.text().notNull().unique(),
    brand: t.text().notNull(),
    last4: t.char({ length: 4 }).notNull(),
    expMonth: t.integer().notNull(),
    expYear: t.integer().notNull(),
    isDefault: t.boolean().notNull().default(false),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
  }),
  (t) => [index("payment_method_user_idx").on(t.userId)],
);

export const action = pgTable(
  "action",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    ownerId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    verifierId: t.text().references(() => user.id, { onDelete: "restrict" }),
    pendingInvitationId: t
      .uuid()
      .references(() => invitation.id, { onDelete: "restrict" }),
    paymentMethodId: t.uuid().references(() => paymentMethod.id, {
      onDelete: "restrict",
    }),
    title: t.text().notNull(),
    dueAt: t.timestamp({ withTimezone: true }).notNull(),
    status: actionStatus().notNull().default("draft"),
    amountCents: t.integer().notNull(),
    currency: t.char({ length: 3 }).notNull(),
    feeBps: t.integer().notNull().default(1000),
    stakeStatus: stakeStatus().notNull().default("none"),
    confirmedAt: t.timestamp({ withTimezone: true }),
    settledAt: t.timestamp({ withTimezone: true }),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [
    check(
      "action_not_self_review",
      sql`${t.verifierId} IS NULL OR ${t.ownerId} <> ${t.verifierId}`,
    ),
    check(
      "action_verifier_or_invite",
      sql`${t.verifierId} IS NOT NULL OR ${t.pendingInvitationId} IS NOT NULL`,
    ),
    check("action_amount_positive", sql`${t.amountCents} > 0`),
    check(
      "action_fee_bps_range",
      sql`${t.feeBps} >= 0 AND ${t.feeBps} <= 10000`,
    ),
    index("action_owner_status_idx").on(t.ownerId, t.status),
    index("action_verifier_status_idx").on(t.verifierId, t.status),
    index("action_due_at_idx").on(t.dueAt),
  ],
);

export const actionCause = pgTable(
  "action_cause",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    actionId: t
      .uuid()
      .notNull()
      .references(() => action.id, { onDelete: "cascade" }),
    charityId: t
      .text()
      .notNull()
      .references(() => charity.id, { onDelete: "restrict" }),
    percent: t.integer().notNull(),
  }),
  (t) => [
    uniqueIndex("action_cause_pair_uidx").on(t.actionId, t.charityId),
    check(
      "action_cause_percent_range",
      sql`${t.percent} >= 1 AND ${t.percent} <= 100`,
    ),
  ],
);

export const stakeHold = pgTable(
  "stake_hold",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    actionId: t
      .uuid()
      .notNull()
      .unique()
      .references(() => action.id, { onDelete: "cascade" }),
    paymentMethodId: t
      .uuid()
      .notNull()
      .references(() => paymentMethod.id, { onDelete: "restrict" }),
    stripePaymentIntentId: t.text().notNull().unique(),
    amountCents: t.integer().notNull(),
    currency: t.char({ length: 3 }).notNull(),
    status: holdStatus().notNull().default("authorized"),
    createdAt: t.timestamp({ withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  }),
  (t) => [index("stake_hold_status_idx").on(t.status)],
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

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, { fields: [profile.userId], references: [user.id] }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id],
    relationName: "sentInvitations",
  }),
  targetUser: one(user, {
    fields: [invitation.targetUserId],
    references: [user.id],
    relationName: "targetedInvitations",
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

export const billingCustomerRelations = relations(
  billingCustomer,
  ({ one }) => ({
    user: one(user, {
      fields: [billingCustomer.userId],
      references: [user.id],
    }),
  }),
);

export const paymentMethodRelations = relations(paymentMethod, ({ one }) => ({
  user: one(user, { fields: [paymentMethod.userId], references: [user.id] }),
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
  pendingInvitation: one(invitation, {
    fields: [action.pendingInvitationId],
    references: [invitation.id],
  }),
  paymentMethod: one(paymentMethod, {
    fields: [action.paymentMethodId],
    references: [paymentMethod.id],
  }),
  causes: many(actionCause),
  proofs: many(proof),
  hold: one(stakeHold),
}));

export const actionCauseRelations = relations(actionCause, ({ one }) => ({
  action: one(action, {
    fields: [actionCause.actionId],
    references: [action.id],
  }),
  charity: one(charity, {
    fields: [actionCause.charityId],
    references: [charity.id],
  }),
}));

export const stakeHoldRelations = relations(stakeHold, ({ one }) => ({
  action: one(action, {
    fields: [stakeHold.actionId],
    references: [action.id],
  }),
  paymentMethod: one(paymentMethod, {
    fields: [stakeHold.paymentMethodId],
    references: [paymentMethod.id],
  }),
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

export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  billingCustomer: one(billingCustomer),
  paymentMethods: many(paymentMethod),
  sentInvitations: many(invitation, { relationName: "sentInvitations" }),
  targetedInvitations: many(invitation, {
    relationName: "targetedInvitations",
  }),
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
