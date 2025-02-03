import { db } from "../../src/db";
import { giveaways } from "../../src/db/schema";
import { eq } from "drizzle-orm";

export async function getGiveaway() {
  try {
    const activeGiveaway = await db
      .select()
      .from(giveaways)
      .where(eq(giveaways.isActive, true))
      .limit(1);
    return activeGiveaway[0] || null;
  } catch (error) {
    console.error("Erreur lors de la récupération du giveaway:", error);
    return null;
  }
}
