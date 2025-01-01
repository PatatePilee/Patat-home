import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username"),
  email: text("email"),
  password: text("password"),
  role: text("role"),
  createdAt: integer("created_at"),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id").primaryKey(),
  hdv: integer("hdv"),
  level: integer("level"),
  price: integer("price"),
  imageUrl: text("image_url"),
  features: text("features"),
  status: text("status"),
});
