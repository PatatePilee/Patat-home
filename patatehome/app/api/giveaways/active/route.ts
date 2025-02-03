import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { giveaways } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const activeGiveaway = await db
      .select()
      .from(giveaways)
      .where(eq(giveaways.isActive, true))
      .limit(1);

    if (!activeGiveaway.length) {
      return NextResponse.json(null);
    }

    const giveaway = {
      ...activeGiveaway[0],
      startDate: new Date(activeGiveaway[0].startDate).getTime(),
      endDate: new Date(activeGiveaway[0].endDate).getTime(),
      isActive: Boolean(activeGiveaway[0].isActive),
    };

    return NextResponse.json(giveaway);
  } catch (error) {
    console.error("Erreur lors de la récupération du giveaway:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
