import { db } from "@/src/db";
import { giveaways } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// PUT /api/admin/giveaways/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updatedGiveaway = await db
      .update(giveaways)
      .set({
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl,
        prizes: JSON.stringify(body.prizes),
        requirements: JSON.stringify(body.requirements),
        isActive: Boolean(body.isActive),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
      })
      .where(eq(giveaways.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updatedGiveaway[0]);
  } catch (error) {
    console.error("Erreur lors de la modification du giveaway:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/admin/giveaways/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(giveaways).where(eq(giveaways.id, parseInt(params.id)));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du giveaway:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
