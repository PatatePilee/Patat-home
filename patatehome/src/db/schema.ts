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
