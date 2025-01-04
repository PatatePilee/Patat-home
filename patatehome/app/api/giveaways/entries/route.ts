import { db } from "@/lib/db";
import { giveawayEntries } from "@/lib/schema";
import { NextResponse } from "next/server";

// POST /api/giveaways/entries
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newEntry = await db
      .insert(giveawayEntries)
      .values({
        giveawayId: body.giveawayId,
        email: body.email,
        discord: body.discord,
      })
      .returning();

    return NextResponse.json(newEntry[0]);
  } catch (error) {
    console.error("Erreur lors de l'inscription au giveaway:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
