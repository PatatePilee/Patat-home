import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.DATABASE_URL || "file:src/db/patate.db",
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

async function main() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      username TEXT,
      email TEXT,
      password TEXT,
      role TEXT,
      created_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY,
      hdv INTEGER,
      level INTEGER,
      price INTEGER,
      image_url TEXT,
      features TEXT,
      status TEXT,
      created_at INTEGER,
      updated_at INTEGER
    );
  `);

  console.log("Tables created successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error creating tables:", err);
  process.exit(1);
});
