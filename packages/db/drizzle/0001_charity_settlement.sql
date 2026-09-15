CREATE TABLE "action_donation_allocation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"charity_id" uuid NOT NULL,
	"share_bps" integer NOT NULL,
	CONSTRAINT "action_donation_allocation_share_bps" CHECK ("action_donation_allocation"."share_bps" > 0 AND "action_donation_allocation"."share_bps" <= 10000)
);
--> statement-breakpoint
CREATE TABLE "charity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"goodstack_organisation_id" text NOT NULL,
	"name" text NOT NULL,
	"country_code" char(3) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "charity_group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "charity_group_member" (
	"group_id" uuid NOT NULL,
	"charity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stake_settlement" (
	"action_id" uuid PRIMARY KEY NOT NULL,
	"policy_version" integer NOT NULL,
	"amount_cents" integer NOT NULL,
	"donation_pool_cents" integer NOT NULL,
	"tax_cents" integer NOT NULL,
	"currency" char(3) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "stake_settlement_split" CHECK ("stake_settlement"."donation_pool_cents" + "stake_settlement"."tax_cents" = "stake_settlement"."amount_cents"),
	CONSTRAINT "stake_settlement_positive" CHECK ("stake_settlement"."amount_cents" > 0)
);
--> statement-breakpoint
ALTER TABLE "action" DROP CONSTRAINT "action_amount_positive";--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "settlement_policy_version" integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "action_donation_allocation" ADD CONSTRAINT "action_donation_allocation_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_donation_allocation" ADD CONSTRAINT "action_donation_allocation_charity_id_charity_id_fk" FOREIGN KEY ("charity_id") REFERENCES "public"."charity"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charity_group_member" ADD CONSTRAINT "charity_group_member_group_id_charity_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."charity_group"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "charity_group_member" ADD CONSTRAINT "charity_group_member_charity_id_charity_id_fk" FOREIGN KEY ("charity_id") REFERENCES "public"."charity"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stake_settlement" ADD CONSTRAINT "stake_settlement_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "action_donation_allocation_action_charity_uidx" ON "action_donation_allocation" USING btree ("action_id","charity_id");--> statement-breakpoint
CREATE INDEX "action_donation_allocation_action_idx" ON "action_donation_allocation" USING btree ("action_id");--> statement-breakpoint
CREATE UNIQUE INDEX "charity_goodstack_organisation_uidx" ON "charity" USING btree ("goodstack_organisation_id");--> statement-breakpoint
CREATE INDEX "charity_active_name_idx" ON "charity" USING btree ("is_active","name");--> statement-breakpoint
CREATE UNIQUE INDEX "charity_group_member_uidx" ON "charity_group_member" USING btree ("group_id","charity_id");--> statement-breakpoint
CREATE INDEX "charity_group_member_charity_idx" ON "charity_group_member" USING btree ("charity_id");--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_amount_min_stake" CHECK ("action"."amount_cents" >= 500);