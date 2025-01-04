import { NextResponse } from "next/server";
import { db } from "../../../../../src/db";
import { pageSettings } from "../../../../../src/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = await db
      .update(pageSettings)
      .set({
        isActive: body.isActive,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(pageSettings.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
