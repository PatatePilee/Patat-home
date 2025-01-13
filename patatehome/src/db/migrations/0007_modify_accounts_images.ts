import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    // Suppression de la table si elle existe déjà
    await client.execute(`DROP TABLE IF EXISTS account_additional_images;`);

    // Création de la nouvelle table
    await client.execute(`
      CREATE TABLE account_additional_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
      );

      -- Création d'un index pour améliorer les performances
      CREATE INDEX idx_account_images_account_id ON account_additional_images(account_id);
    `);

    console.log("Migration des images de comptes effectuée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de la migration des images:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
