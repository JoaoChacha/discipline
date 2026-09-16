CREATE TYPE "public"."consent_kind" AS ENUM('onboarding');--> statement-breakpoint
CREATE TYPE "public"."onboarding_status" AS ENUM('required', 'completed');--> statement-breakpoint
CREATE TABLE "user_consent" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"kind" "consent_kind" DEFAULT 'onboarding' NOT NULL,
	"terms_version" text NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "onboarding_status" "onboarding_status" DEFAULT 'required' NOT NULL;--> statement-breakpoint
ALTER TABLE "profile" ADD COLUMN "onboarding_completed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_consent" ADD CONSTRAINT "user_consent_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_consent_user_kind_version_uidx" ON "user_consent" USING btree ("user_id","kind","terms_version");--> statement-breakpoint
CREATE INDEX "user_consent_user_kind_idx" ON "user_consent" USING btree ("user_id","kind");--> statement-breakpoint
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
$$;--> statement-breakpoint
DROP TRIGGER IF EXISTS user_ensure_profile ON public."user";--> statement-breakpoint
CREATE TRIGGER user_ensure_profile
AFTER INSERT ON public."user"
FOR EACH ROW
EXECUTE FUNCTION public.ensure_profile_for_user();--> statement-breakpoint
INSERT INTO public.profile (user_id)
SELECT id FROM public."user"
ON CONFLICT (user_id) DO NOTHING;