import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { giveawayEntries } from "../../../../src/db/schema";

// POST /api/giveaways/entries
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation des données
    if (!body.giveawayId || !body.email || !body.discord) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

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
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de l'inscription au giveaway",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
