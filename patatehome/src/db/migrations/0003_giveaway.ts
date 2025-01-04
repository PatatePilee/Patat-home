import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS giveaways (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        prizes TEXT NOT NULL,
        requirements TEXT NOT NULL,
        is_active INTEGER NOT NULL DEFAULT 0,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      CREATE TABLE IF NOT EXISTS giveaway_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        giveaway_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        discord TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (giveaway_id) REFERENCES giveaways(id)
      );
    `);

    console.log("Tables giveaways et giveaway_entries créées avec succès!");
  } catch (error) {
    console.error("Erreur lors de la création des tables:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
