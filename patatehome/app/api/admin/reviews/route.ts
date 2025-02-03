import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { reviews } from "@/src/db/schema";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newReview = await db
      .insert(reviews)
      .values({
        username: data.username,
        avatarUrl: data.avatarUrl,
        message: data.message,
        date: data.date,
        createdAt: Math.floor(Date.now() / 1000),
      })
      .returning();

    return NextResponse.json(newReview[0]);
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'avis" },
      { status: 500 }
    );
  }
}
