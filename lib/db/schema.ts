import { pgTable, uuid, text, integer, timestamp, jsonb, decimal, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner","caregiver","viewer"]);
export const doseStatusEnum = pgEnum("dose_status", ["upcoming","due","snoozed","taken","skipped","missed","cancelled"]);
export const inventoryTypeEnum = pgEnum("inventory_type", ["initial_stock","taken_dose","purchase","correction","discarded","discontinued"]);

export const households = pgTable("households", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const householdMemberships = pgTable("household_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id").references(()=> households.id).notNull(),
  userId: text("user_id").notNull(),
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const people = pgTable("people", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id").references(()=> households.id).notNull(),
  fullName: text("full_name").notNull(),
  timezone: text("timezone").notNull().default("Africa/Cairo"),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const medications = pgTable("medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  householdId: uuid("household_id").references(()=> households.id).notNull(),
  personId: uuid("person_id").references(()=> people.id).notNull(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en"),
  form: text("form").notNull(),
  strength: text("strength"),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const medicationPackages = pgTable("medication_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id").references(()=> medications.id).notNull(),
  strips: integer("strips"),
  unitsPerStrip: integer("units_per_strip"),
  totalUnits: decimal("total_units", {precision:10, scale:2}).notNull(),
  expiryDate: timestamp("expiry_date"),
  batchNo: text("batch_no"),
});

export const scheduleVersions = pgTable("schedule_versions", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id").references(()=> medications.id).notNull(),
  version: integer("version").notNull(),
  effectiveFrom: timestamp("effective_from", {withTimezone:true}).notNull(),
  effectiveTo: timestamp("effective_to", {withTimezone:true}),
  ruleType: text("rule_type").notNull(),
  ruleConfig: jsonb("rule_config").notNull(),
});

export const doseOccurrences = pgTable("dose_occurrences", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id").references(()=> medications.id).notNull(),
  personId: uuid("person_id").references(()=> people.id).notNull(),
  scheduleVersionId: uuid("schedule_version_id").references(()=> scheduleVersions.id).notNull(),
  scheduledAt: timestamp("scheduled_at", {withTimezone:true}).notNull(),
  status: doseStatusEnum("status").notNull().default("upcoming"),
});

export const doseEvents = pgTable("dose_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  occurrenceId: uuid("occurrence_id").references(()=> doseOccurrences.id).notNull(),
  medicationId: uuid("medication_id").references(()=> medications.id).notNull(),
  personId: uuid("person_id").references(()=> people.id).notNull(),
  quantity: decimal("quantity", {precision:10, scale:2}).notNull(),
  type: text("type").notNull(),
  recordedBy: text("recorded_by").notNull(),
  operationId: text("operation_id").notNull().unique(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const inventoryEvents = pgTable("inventory_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id").references(()=> medications.id).notNull(),
  personId: uuid("person_id").references(()=> people.id).notNull(),
  type: inventoryTypeEnum("type").notNull(),
  quantity: decimal("quantity", {precision:10, scale:2}).notNull(),
  balanceBefore: decimal("balance_before", {precision:10, scale:2}).notNull(),
  balanceAfter: decimal("balance_after", {precision:10, scale:2}).notNull(),
  operationId: text("operation_id").notNull().unique(),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at", {withTimezone:true}).defaultNow(),
});

export const devices = pgTable("devices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  personId: uuid("person_id").references(()=> people.id),
  platform: text("platform").notNull(),
  pushToken: text("push_token"),
  installationId: text("installation_id").notNull().unique(),
  lastSeen: timestamp("last_seen", {withTimezone:true}).defaultNow(),
});