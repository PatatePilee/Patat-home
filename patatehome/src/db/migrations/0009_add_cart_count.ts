import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function main() {
  try {
    await client.execute(`
      ALTER TABLE accounts 
      ADD COLUMN cart_count INTEGER DEFAULT 0;
    `);

    console.log("Colonne cart_count ajoutée avec succès!");
    process.exit(0);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la colonne cart_count:", error);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
