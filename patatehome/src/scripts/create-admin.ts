import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { hash } from "bcrypt";
import { users } from "../db/schema";

const client = createClient({
  url: "file:src/db/patate.db",
});

const db = drizzle(client);

async function createAdmin() {
  const hashedPassword = await hash("admin123", 10);

  try {
    await db.insert(users).values({
      username: "admin",
      email: "admin@patate.com",
      password: hashedPassword,
      role: "admin",
      createdAt: Date.now(),
    });

    console.log("Compte admin créé avec succès!");
  } catch (error) {
    console.error("Erreur lors de la création du compte admin:", error);
  }

  process.exit(0);
}

createAdmin();
