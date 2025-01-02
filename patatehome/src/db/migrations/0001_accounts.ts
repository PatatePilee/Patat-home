import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "..";

async function main() {
  console.log("Migration started...");

  try {
    await migrate(db, {
      migrationsFolder: "src/db/migrations/sql",
    });
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

main();
