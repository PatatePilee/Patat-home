import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    // Suppression des tables existantes pour repartir de zéro
    await client.execute(`DROP TABLE IF EXISTS giveaway_entries;`);
    await client.execute(`DROP TABLE IF EXISTS giveaways;`);

    // Création de la table giveaways
    await client.execute(`
      CREATE TABLE giveaways (
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
    `);

    // Création de la table giveaway_entries
    await client.execute(`
      CREATE TABLE giveaway_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        giveaway_id INTEGER NOT NULL,
        email TEXT NOT NULL,
        discord TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (giveaway_id) REFERENCES giveaways(id) ON DELETE CASCADE
      );
    `);

    console.log("Tables giveaways et giveaway_entries créées avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de la création des tables:", error);
    process.exit(1);
  }
}

main();
