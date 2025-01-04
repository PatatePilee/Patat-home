import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { giveaways } from "../../../../src/db/schema";

// GET /api/admin/giveaways
export async function GET() {
  try {
    const allGiveaways = await db.select().from(giveaways);
    console.log("Giveaways récupérés:", allGiveaways); // Debug
    return NextResponse.json(allGiveaways);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des giveaways",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/admin/giveaways
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Données reçues:", body); // Debug

    // Vérification des champs requis
    if (
      !body.title ||
      !body.description ||
      !body.imageUrl ||
      !body.prizes ||
      !body.requirements ||
      !body.startDate ||
      !body.endDate
    ) {
      return NextResponse.json(
        {
          error: "Tous les champs sont requis",
        },
        { status: 400 }
      );
    }

    const newGiveaway = await db
      .insert(giveaways)
      .values([
        {
          title: body.title,
          description: body.description,
          imageUrl: body.imageUrl,
          prizes: JSON.stringify(body.prizes),
          requirements: JSON.stringify(body.requirements),
          isActive: body.isActive ? 1 : 0,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          createdAt: new Date(),
        },
      ])
      .returning();

    console.log("Giveaway créé:", newGiveaway); // Debug
    return NextResponse.json(newGiveaway[0]);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la création du giveaway",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
