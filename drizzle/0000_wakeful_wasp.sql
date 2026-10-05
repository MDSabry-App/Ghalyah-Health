CREATE TYPE "public"."dose_status" AS ENUM('upcoming', 'due', 'snoozed', 'taken', 'skipped', 'missed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."inventory_type" AS ENUM('initial_stock', 'taken_dose', 'purchase', 'correction', 'discarded', 'discontinued');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('owner', 'caregiver', 'viewer');--> statement-breakpoint
CREATE TABLE "devices" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"person_id" uuid,
	"platform" text NOT NULL,
	"push_token" text,
	"installation_id" text NOT NULL,
	"last_seen" timestamp with time zone DEFAULT now(),
	CONSTRAINT "devices_installation_id_unique" UNIQUE("installation_id")
);
--> statement-breakpoint
CREATE TABLE "dose_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"occurrence_id" uuid NOT NULL,
	"medication_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"type" text NOT NULL,
	"recorded_by" text NOT NULL,
	"operation_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "dose_events_operation_id_unique" UNIQUE("operation_id")
);
--> statement-breakpoint
CREATE TABLE "dose_occurrences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medication_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"schedule_version_id" uuid NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" "dose_status" DEFAULT 'upcoming' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "household_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "role" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "households" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "inventory_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medication_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"type" "inventory_type" NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"balance_before" numeric(10, 2) NOT NULL,
	"balance_after" numeric(10, 2) NOT NULL,
	"operation_id" text NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "inventory_events_operation_id_unique" UNIQUE("operation_id")
);
--> statement-breakpoint
CREATE TABLE "medication_packages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medication_id" uuid NOT NULL,
	"strips" integer,
	"units_per_strip" integer,
	"total_units" numeric(10, 2) NOT NULL,
	"expiry_date" timestamp,
	"batch_no" text
);
--> statement-breakpoint
CREATE TABLE "medications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"person_id" uuid NOT NULL,
	"name_ar" text NOT NULL,
	"name_en" text,
	"form" text NOT NULL,
	"strength" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"household_id" uuid NOT NULL,
	"full_name" text NOT NULL,
	"timezone" text DEFAULT 'Africa/Cairo' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedule_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"medication_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"effective_from" timestamp with time zone NOT NULL,
	"effective_to" timestamp with time zone,
	"rule_type" text NOT NULL,
	"rule_config" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_occurrence_id_dose_occurrences_id_fk" FOREIGN KEY ("occurrence_id") REFERENCES "public"."dose_occurrences"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_events" ADD CONSTRAINT "dose_events_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_occurrences" ADD CONSTRAINT "dose_occurrences_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_occurrences" ADD CONSTRAINT "dose_occurrences_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dose_occurrences" ADD CONSTRAINT "dose_occurrences_schedule_version_id_schedule_versions_id_fk" FOREIGN KEY ("schedule_version_id") REFERENCES "public"."schedule_versions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "household_memberships" ADD CONSTRAINT "household_memberships_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_events" ADD CONSTRAINT "inventory_events_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medication_packages" ADD CONSTRAINT "medication_packages_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "medications" ADD CONSTRAINT "medications_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "people" ADD CONSTRAINT "people_household_id_households_id_fk" FOREIGN KEY ("household_id") REFERENCES "public"."households"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedule_versions" ADD CONSTRAINT "schedule_versions_medication_id_medications_id_fk" FOREIGN KEY ("medication_id") REFERENCES "public"."medications"("id") ON DELETE no action ON UPDATE no action;