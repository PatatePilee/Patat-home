import { sqliteTable, text, integer, boolean } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  email: text("email").notNull(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  hdv: integer("hdv").notNull(),
  level: integer("level").notNull(),
  price: integer("price").notNull(),
  imageUrl: text("image_url").notNull(),
  features: text("features").notNull(),
  status: text("status").notNull().default("available"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  message: text("message").notNull(),
  date: integer("date").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const giveaways = sqliteTable("giveaways", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  prizes: text("prizes").notNull(),
  requirements: text("requirements").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
  startDate: integer("start_date", { mode: "timestamp" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

export const giveawayEntries = sqliteTable("giveaway_entries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  giveawayId: integer("giveaway_id").references(() => giveaways.id),
  email: text("email").notNull(),
  discord: text("discord").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});
