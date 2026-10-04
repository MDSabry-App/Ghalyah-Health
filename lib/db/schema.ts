import { pgTable, text, timestamp, integer, uuid, decimal } from "drizzle-orm/pg-core"
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  role: text("role").notNull(),
});
export const mealSettings = pgTable("meal_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  breakfastTime: text("breakfast_time").notNull().default("11:00"),
  lunchTime: text("lunch_time").notNull().default("17:00"),
  dinnerTime: text("dinner_time").notNull().default("22:00"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
export const medications = pgTable("medications", {
  id: uuid("id").primaryKey().defaultRandom(),
  nameAr: text("name_ar").notNull(),
  strips: integer("strips").notNull(),
  unitsPerStrip: integer("units_per_strip").notNull(),
  totalUnits: integer("total_units").notNull(),
});
export const scheduleRules = pgTable("schedule_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  medicationId: uuid("medication_id").references(()=> medications.id),
  type: text("type").notNull(),
  customTime: text("custom_time"),
});
export const doseEvents = pgTable("dose_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  occurrenceId: text("occurrence_id").notNull(),
  operationId: text("operation_id").notNull().unique(),
  status: text("status").notNull(),
  quantity: decimal("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});