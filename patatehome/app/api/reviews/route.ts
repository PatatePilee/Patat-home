import { NextResponse } from "next/server";
import { db } from "../../../src/db";
import { reviews } from "../../../src/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .orderBy(desc(reviews.date));

    console.log("Reviews récupérés:", allReviews); // Pour le debug
    return NextResponse.json(allReviews);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des avis" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReview = await db
      .insert(reviews)
      .values({
        username: data.username,
        avatarUrl: data.avatarUrl,
        message: data.message,
        date: Date.now(),
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returning();

    return NextResponse.json(newReview[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
