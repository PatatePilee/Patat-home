import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { accounts } from "../../../../src/db/schema";

export async function POST(request: Request) {
  try {
    const accountData = await request.json();

    const newAccount = await db
      .insert(accounts)
      .values({
        ...accountData,
        features: JSON.stringify(accountData.features),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      .returning();

    return NextResponse.json({
      message: "Compte créé avec succès",
      account: newAccount[0],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
