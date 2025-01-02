import { NextResponse } from "next/server";
import { db } from "../../../../../src/db";
import { accounts } from "../../../../../src/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(accounts).where(eq(accounts.id, parseInt(params.id)));
    return NextResponse.json({ message: "Compte supprimé avec succès" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du compte" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accountData = await request.json();
    const updatedAccount = await db
      .update(accounts)
      .set({
        hdv: parseInt(accountData.hdv),
        level: parseInt(accountData.level),
        price: parseInt(accountData.price),
        imageUrl: accountData.imageUrl,
        features: JSON.stringify(accountData.features),
        status: accountData.status,
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .where(eq(accounts.id, parseInt(params.id)))
      .returning();

    return NextResponse.json(updatedAccount[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la modification du compte" },
      { status: 500 }
    );
  }
}
