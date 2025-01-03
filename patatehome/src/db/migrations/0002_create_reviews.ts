import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        avatar_url TEXT NOT NULL,
        message TEXT NOT NULL,
        date INTEGER NOT NULL,
        created_at INTEGER NOT NULL
      );
    `);

    console.log("Table reviews créée avec succès!");
  } catch (error) {
    console.error("Erreur lors de la création de la table reviews:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
