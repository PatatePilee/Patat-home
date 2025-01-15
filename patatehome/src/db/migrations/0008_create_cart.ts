import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`DROP TABLE IF EXISTS cart_items;`);

    await client.execute(`
      CREATE TABLE cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
        UNIQUE(user_id, account_id)
      );

      CREATE INDEX idx_cart_user_id ON cart_items(user_id);
      CREATE INDEX idx_cart_account_id ON cart_items(account_id);
    `);

    console.log("Table cart_items créée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de la création de la table cart_items:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
