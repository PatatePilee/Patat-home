import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS page_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        path TEXT NOT NULL UNIQUE,
        is_active INTEGER NOT NULL DEFAULT 1,
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );

      -- Insertion des pages par défaut
      INSERT OR IGNORE INTO page_settings (name, title, path, is_active) VALUES
        ('accounts', 'Comptes', '/products', 1),
        ('delivery', 'Livraison', '/delivery', 1),
        ('discord', 'Discord', '/discord', 1),
        ('giveaway', 'Concours', '/giveaway', 1),
        ('reviews', 'Avis', '/reviews', 1);
    `);

    console.log("Table page_settings créée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error(
      "Erreur lors de la création de la table page_settings:",
      error
    );
    process.exit(1);
  }
}

main();
