import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { pageSettings } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const settings = await db.select().from(pageSettings);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des paramètres" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { pageName, isActive } = body;

    const updated = await db
      .update(pageSettings)
      .set({
        isActive: isActive ? 1 : 0,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(pageSettings.pageName, pageName))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
