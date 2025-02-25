import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
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
  imageFilename: text("image_filename").notNull(),
  features: text("features").notNull(),
  status: text("status").notNull().default("available"),
  cartCount: integer("cart_count").notNull().default(0),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const accountAdditionalImages = sqliteTable(
  "account_additional_images",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    accountId: integer("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    filename: text("filename").notNull(),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: integer("created_at")
      .notNull()
      .default(sql`(unixepoch())`),
  }
);

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
  giveawayId: integer("giveaway_id")
    .notNull()
    .references(() => giveaways.id),
  email: text("email").notNull(),
  discord: text("discord").notNull(),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const pageSettings = sqliteTable("page_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pageName: text("page_name").notNull().unique(),
  isActive: integer("is_active").notNull().default(1),
  updatedAt: integer("updated_at")
    .notNull()
    .default(sql`(unixepoch())`),
});

export const cartItems = sqliteTable("cart_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: integer("account_id")
    .notNull()
    .references(() => accounts.id, { onDelete: "cascade" }),
  createdAt: integer("created_at")
    .notNull()
    .default(sql`(unixepoch())`),
});
