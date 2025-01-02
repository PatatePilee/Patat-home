import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hdv INTEGER NOT NULL,
        level INTEGER NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        features TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    console.log("Table accounts créée avec succès!");
  } catch (error) {
    console.error("Erreur lors de la création de la table accounts:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
