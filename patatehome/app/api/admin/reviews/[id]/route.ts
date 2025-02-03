import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { reviews } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(reviews).where(eq(reviews.id, parseInt(params.id)));
    return NextResponse.json({ message: "Avis supprimé avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'avis" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updatedReview = await db
      .update(reviews)
      .set({
        username: data.username,
        avatarUrl: data.avatarUrl,
        message: data.message,
      })
      .where(eq(reviews.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updatedReview[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'avis" },
      { status: 500 }
    );
  }
}
