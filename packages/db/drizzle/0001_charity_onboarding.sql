CREATE TYPE "public"."consent_kind" AS ENUM('onboarding', 'commitment_confirm');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('required', 'completed');--> statement-breakpoint
CREATE TABLE "action_charity_allocation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action_id" uuid NOT NULL,
	"charity_id" uuid NOT NULL,
	"allocation_bps" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "action_charity_allocation_bps_range" CHECK ("action_charity_allocation"."allocation_bps" > 0 AND "action_charity_allocation"."allocation_bps" <= 10000)
);
--> statement-breakpoint
CREATE TABLE "charity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"mission" text NOT NULL,
	"website_url" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "charity_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_consent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" "consent_kind" NOT NULL,
	"terms_version" text NOT NULL,
	"action_id" uuid,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_consent_action_matches_kind" CHECK (("user_consent"."kind" = 'onboarding' AND "user_consent"."action_id" IS NULL) OR ("user_consent"."kind" = 'commitment_confirm' AND "user_consent"."action_id" IS NOT NULL))
);
--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "donation_bps" integer DEFAULT 8000 NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "platform_fee_bps" integer DEFAULT 2000 NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "confirmed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "donation_cents" integer;--> statement-breakpoint
ALTER TABLE "action" ADD COLUMN "platform_fee_cents" integer;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "onboarding_status" "onboarding_status" DEFAULT 'required' NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "onboarding_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "action_charity_allocation" ADD CONSTRAINT "action_charity_allocation_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action_charity_allocation" ADD CONSTRAINT "action_charity_allocation_charity_id_charity_id_fk" FOREIGN KEY ("charity_id") REFERENCES "public"."charity"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consent" ADD CONSTRAINT "user_consent_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_consent" ADD CONSTRAINT "user_consent_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "action_charity_allocation_action_charity_uidx" ON "action_charity_allocation" USING btree ("action_id","charity_id");--> statement-breakpoint
CREATE INDEX "action_charity_allocation_action_idx" ON "action_charity_allocation" USING btree ("action_id");--> statement-breakpoint
CREATE INDEX "charity_active_sort_idx" ON "charity" USING btree ("is_active","sort_order");--> statement-breakpoint
CREATE INDEX "user_consent_user_kind_idx" ON "user_consent" USING btree ("user_id","kind");--> statement-breakpoint
CREATE INDEX "user_consent_action_idx" ON "user_consent" USING btree ("action_id");--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_split_covers_stake" CHECK ("action"."donation_bps" >= 0 AND "action"."platform_fee_bps" >= 0 AND "action"."donation_bps" + "action"."platform_fee_bps" = 10000);--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_settlement_cents_nonnegative" CHECK (("action"."donation_cents" IS NULL OR "action"."donation_cents" >= 0) AND ("action"."platform_fee_cents" IS NULL OR "action"."platform_fee_cents" >= 0));--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_onboarding_completed_at_matches" CHECK (("profile"."onboarding_status" = 'required' AND "profile"."onboarding_completed_at" IS NULL) OR ("profile"."onboarding_status" = 'completed' AND "profile"."onboarding_completed_at" IS NOT NULL));--> statement-breakpoint
CREATE OR REPLACE FUNCTION public.ensure_profile_for_user()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
	INSERT INTO public.profile (user_id)
	VALUES (NEW.id)
	ON CONFLICT (user_id) DO NOTHING;
	RETURN NEW;
END;
$$;
--> statement-breakpoint
DROP TRIGGER IF EXISTS user_ensure_profile ON public."user";--> statement-breakpoint
CREATE TRIGGER user_ensure_profile
AFTER INSERT ON public."user"
FOR EACH ROW
EXECUTE FUNCTION public.ensure_profile_for_user();--> statement-breakpoint
INSERT INTO public.profile (user_id)
SELECT id FROM public."user"
ON CONFLICT (user_id) DO NOTHING;--> statement-breakpoint
INSERT INTO public.charity (slug, name, mission, website_url, sort_order)
VALUES
	('water-org', 'Water.org', 'Clean water access', 'https://water.org', 10),
	('girls-who-code', 'Girls Who Code', 'Education and opportunity', 'https://girlswhocode.com', 20),
	('givedirectly', 'GiveDirectly', 'Direct cash transfers', 'https://www.givedirectly.org', 30),
	('amf', 'Against Malaria Foundation', 'Malaria prevention', 'https://www.againstmalaria.com', 40),
	('wikipedia', 'Wikimedia Foundation', 'Free knowledge for everyone', 'https://wikimediafoundation.org', 50)
ON CONFLICT (slug) DO UPDATE SET
	name = EXCLUDED.name,
	mission = EXCLUDED.mission,
	website_url = EXCLUDED.website_url,
	sort_order = EXCLUDED.sort_order,
	updated_at = now();
