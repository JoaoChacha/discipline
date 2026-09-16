import { z } from "zod/v4";

export const COMPANY_FEE_BPS = 1000;

export const handleSchema = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9_]{3,20}$/, "Use 3–20 letters, numbers, or underscores.");

export const completeProfileSchema = z.object({
  handle: handleSchema,
});

export const handleSearchSchema = z.object({
  query: z
    .string()
    .trim()
    .toLowerCase()
    .min(1)
    .max(20)
    .regex(/^[a-z0-9_]*$/),
});

export const createLinkInviteSchema = z.object({
  note: z.string().trim().max(80).optional(),
});

export const requestByHandleSchema = z.object({
  handle: handleSchema,
});

export const acceptInviteTokenSchema = z.object({
  token: z.string().min(16).max(128),
});

export const acceptIncomingInviteSchema = z.object({
  invitationId: z.uuid(),
});

export const causeAllocationSchema = z.object({
  charityId: z.string().min(1).max(64),
  percent: z.number().int().min(1).max(100),
});

export function assertCauseAllocations(
  causes: { charityId: string; percent: number }[],
) {
  if (causes.length === 0) {
    throw new Error("Pick at least one charity.");
  }

  const ids = new Set(causes.map((cause) => cause.charityId));
  if (ids.size !== causes.length) {
    throw new Error("Each charity can only appear once.");
  }

  const total = causes.reduce((sum, cause) => sum + cause.percent, 0);
  if (total !== 100) {
    throw new Error("Cause allocation must total 100%.");
  }
}

export const createCommitmentSchema = z
  .object({
    title: z.string().trim().min(3).max(120),
    dueAt: z.coerce.date(),
    amountCents: z.number().int().min(100),
    currency: z.string().length(3).toUpperCase().default("EUR"),
    verifierId: z.string().min(1).optional(),
    invitationId: z.uuid().optional(),
    causes: z.array(causeAllocationSchema).min(1).max(8),
    paymentMethodId: z.uuid(),
    consented: z.literal(true),
  })
  .superRefine((value, ctx) => {
    const hasVerifier = Boolean(value.verifierId);
    const hasInvite = Boolean(value.invitationId);
    if (hasVerifier === hasInvite) {
      ctx.addIssue({
        code: "custom",
        message: "Choose a friend or a pending invite, not both.",
        path: ["verifierId"],
      });
    }

    try {
      assertCauseAllocations(value.causes);
    } catch (error) {
      ctx.addIssue({
        code: "custom",
        message: error instanceof Error ? error.message : "Invalid causes.",
        path: ["causes"],
      });
    }

    if (value.dueAt.getTime() <= Date.now()) {
      ctx.addIssue({
        code: "custom",
        message: "Deadline must be in the future.",
        path: ["dueAt"],
      });
    }
  });

export const commitmentIdSchema = z.object({
  id: z.uuid(),
});

export const setDefaultPaymentMethodSchema = z.object({
  paymentMethodId: z.uuid(),
});

export type HandleInput = z.infer<typeof handleSchema>;
export type CreateCommitmentInput = z.infer<typeof createCommitmentSchema>;
