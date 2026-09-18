import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 120 }).notNull().default("Misba"),
  nickname: varchar("nickname", { length: 60 }).notNull().default("Pgl"),
  birthday: date("birthday").notNull().default("2005-02-23"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  cycleLength: integer("cycle_length").notNull().default(28),
  periodDuration: integer("period_duration").notNull().default(5),
  lastPeriodStart: date("last_period_start"),
  remindersEnabled: boolean("reminders_enabled").notNull().default(true),
  reminderIntervalMinutes: integer("reminder_interval_minutes").notNull().default(120),
  quietStart: varchar("quiet_start", { length: 5 }).notNull().default("22:00"),
  quietEnd: varchar("quiet_end", { length: 5 }).notNull().default("07:00"),
  theme: varchar("theme", { length: 10 }).notNull().default("light"),
  accent: varchar("accent", { length: 20 }).notNull().default("blossom"),
  reminderCategories: text("reminder_categories").notNull().default("water,eyes,rest,breathe,food,posture"),
  notifyBrowser: boolean("notify_browser").notNull().default(false),
});

export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  partOfDay: varchar("part_of_day", { length: 10 }).notNull(), // morning | day | evening | night
  label: varchar("label", { length: 160 }).notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  archived: boolean("archived").notNull().default(false),
});

export const checklistCompletions = pgTable(
  "checklist_completions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    itemId: integer("item_id").notNull(),
    day: date("day").notNull(),
    done: boolean("done").notNull().default(true),
  },
  (t) => [uniqueIndex("completion_item_day_idx").on(t.itemId, t.day)],
);

export const capabilities = pgTable("capabilities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  text: varchar("text", { length: 240 }).notNull(),
  category: varchar("category", { length: 40 }).notNull().default("Capable of"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const checkins = pgTable(
  "checkins",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    day: date("day").notNull(),
    mood: varchar("mood", { length: 20 }).notNull(),
    energy: varchar("energy", { length: 10 }).notNull().default("medium"),
    stress: integer("stress").notNull().default(3),
    note: text("note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("checkin_user_day_idx").on(t.userId, t.day)],
);

export const cycles = pgTable("cycles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  notes: text("notes").notNull().default(""),
});

export const periodLogs = pgTable(
  "period_logs",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    day: date("day").notNull(),
    pain: integer("pain").notNull().default(0),
    energy: varchar("energy", { length: 10 }).notNull().default("medium"),
    mood: varchar("mood", { length: 20 }).notNull().default("calm"),
    symptoms: text("symptoms").notNull().default(""),
    careDone: text("care_done").notNull().default(""),
    note: text("note").notNull().default(""),
  },
  (t) => [uniqueIndex("period_log_user_day_idx").on(t.userId, t.day)],
);

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: varchar("category", { length: 40 }).notNull().default("dream"),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull().default(""),
  progress: integer("progress").notNull().default(0),
  done: boolean("done").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull().default(""),
  day: date("day").notNull(),
  time: varchar("time", { length: 5 }),
  category: varchar("category", { length: 40 }).notNull().default("personal"),
  remind: boolean("remind").notNull().default(true),
  repeatYearly: boolean("repeat_yearly").notNull().default(false),
});

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: varchar("category", { length: 40 }).notNull(),
  body: text("body").notNull(),
  author: varchar("author", { length: 60 }).notNull().default("For you"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const customReminders = pgTable("custom_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  text: varchar("text", { length: 200 }).notNull(),
  enabled: boolean("enabled").notNull().default(true),
});

export type User = typeof users.$inferSelect;
export type Settings = typeof settings.$inferSelect;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type Checkin = typeof checkins.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type NoteRow = typeof notes.$inferSelect;
export type Capability = typeof capabilities.$inferSelect;
export type Cycle = typeof cycles.$inferSelect;
export type PeriodLog = typeof periodLogs.$inferSelect;
export type CustomReminder = typeof customReminders.$inferSelect;
