import { NextResponse } from "next/server";
import { db } from "../../../../src/db";
import { accounts } from "../../../../src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, parseInt(params.id)))
      .limit(1);

    if (account.length === 0) {
      return NextResponse.json({ error: "Compte non trouvé" }, { status: 404 });
    }

    return NextResponse.json(account[0]);
  } catch (error) {
    console.error("Erreur lors de la récupération du compte:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du compte" },
      { status: 500 }
    );
  }
}
