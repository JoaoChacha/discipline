ALTER TYPE "public"."consent_kind" ADD VALUE IF NOT EXISTS 'commitment_confirm';--> statement-breakpoint
CREATE TYPE "public"."payment_kind" AS ENUM('apple_pay', 'card');--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "display_name" text;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "payment_kind" "payment_kind";
