import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

async function main() {
  const client = createClient({
    url: "file:src/db/patate.db",
  });

  const db = drizzle(client);

  console.log("Migration started...");
  await migrate(db, {
    migrationsFolder: "src/db/migrations",
  });
  console.log("Migration completed!");

  process.exit(0);
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
