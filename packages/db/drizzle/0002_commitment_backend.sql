ALTER TYPE "public"."action_status" ADD VALUE 'awaiting_verifier' BEFORE 'active';--> statement-breakpoint
CREATE TYPE "public"."hold_status" AS ENUM('authorized', 'captured', 'canceled', 'failed');--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "handle" text;--> statement-breakpoint
CREATE UNIQUE INDEX "profile_handle_uidx" ON "profile" USING btree ("handle");--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_handle_format" CHECK ("profile"."handle" IS NULL OR "profile"."handle" ~ '^[a-z0-9_]{3,20}$');--> statement-breakpoint
DROP INDEX IF EXISTS "invitation_pending_inviter_email_uidx";--> statement-breakpoint
DROP INDEX IF EXISTS "invitation_email_idx";--> statement-breakpoint
ALTER TABLE "invitation" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "target_user_id" text;--> statement-breakpoint
ALTER TABLE "invitation" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_target_user_id_user_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_not_self_target" CHECK ("invitation"."target_user_id" IS NULL OR "invitation"."inviter_id" <> "invitation"."target_user_id");--> statement-breakpoint
CREATE INDEX "invitation_inviter_status_idx" ON "invitation" USING btree ("inviter_id","status");--> statement-breakpoint
CREATE INDEX "invitation_target_status_idx" ON "invitation" USING btree ("target_user_id","status");--> statement-breakpoint
CREATE TABLE "charity" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mission" text NOT NULL,
	"icon" text NOT NULL,
	"accent" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);--> statement-breakpoint
CREATE TABLE "billing_customer" (
	"user_id" text PRIMARY KEY NOT NULL,
	"stripe_customer_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "billing_customer_stripe_customer_id_unique" UNIQUE("stripe_customer_id")
);--> statement-breakpoint
ALTER TABLE "billing_customer" ADD CONSTRAINT "billing_customer_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "payment_method" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"stripe_payment_method_id" text NOT NULL,
	"brand" text NOT NULL,
	"last4" char(4) NOT NULL,
	"exp_month" integer NOT NULL,
	"exp_year" integer NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payment_method_stripe_payment_method_id_unique" UNIQUE("stripe_payment_method_id")
);--> statement-breakpoint
ALTER TABLE "payment_method" ADD CONSTRAINT "payment_method_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payment_method_user_idx" ON "payment_method" USING btree ("user_id");--> statement-breakpoint
ALTER TABLE "action" ALTER COLUMN "verifier_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "pending_invitation_id" uuid;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "payment_method_id" uuid;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "fee_bps" integer DEFAULT 1000 NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "action" DROP CONSTRAINT IF EXISTS "action_not_self_review";--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_not_self_review" CHECK ("action"."verifier_id" IS NULL OR "action"."owner_id" <> "action"."verifier_id");--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_verifier_or_invite" CHECK ("action"."verifier_id" IS NOT NULL OR "action"."pending_invitation_id" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_fee_bps_range" CHECK ("action"."fee_bps" >= 0 AND "action"."fee_bps" <= 10000);--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_pending_invitation_id_invitation_id_fk" FOREIGN KEY ("pending_invitation_id") REFERENCES "public"."invitation"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_payment_method_id_payment_method_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE TABLE "action_cause" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"charity_id" text NOT NULL,
	"percent" integer NOT NULL
);--> statement-breakpoint
ALTER TABLE "action_cause" ADD CONSTRAINT "action_cause_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_cause" ADD CONSTRAINT "action_cause_charity_id_charity_id_fk" FOREIGN KEY ("charity_id") REFERENCES "public"."charity"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "action_cause_pair_uidx" ON "action_cause" USING btree ("action_id","charity_id");--> statement-breakpoint
ALTER TABLE "action_cause" ADD CONSTRAINT "action_cause_percent_range" CHECK ("action_cause"."percent" >= 1 AND "action_cause"."percent" <= 100);--> statement-breakpoint
CREATE TABLE "stake_hold" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"payment_method_id" uuid NOT NULL,
	"stripe_payment_intent_id" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" char(3) NOT NULL,
	"status" "hold_status" DEFAULT 'authorized' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stake_hold_action_id_unique" UNIQUE("action_id"),
	CONSTRAINT "stake_hold_stripe_payment_intent_id_unique" UNIQUE("stripe_payment_intent_id")
);--> statement-breakpoint
ALTER TABLE "stake_hold" ADD CONSTRAINT "stake_hold_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stake_hold" ADD CONSTRAINT "stake_hold_payment_method_id_payment_method_id_fk" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_method"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "stake_hold_status_idx" ON "stake_hold" USING btree ("status");--> statement-breakpoint
INSERT INTO "charity" ("id", "name", "mission", "icon", "accent", "is_active") VALUES
	('water-org', 'Water.org', 'Clean water access', 'droplets', 'blue', true),
	('girls-who-code', 'Girls Who Code', 'Education', 'code', 'purple', true),
	('givedirectly', 'GiveDirectly', 'Cash transfers', 'heart', 'green', true),
	('against-malaria', 'Against Malaria Foundation', 'Malaria prevention', 'shield', 'teal', true);
