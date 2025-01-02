import { NextResponse } from "next/server";
import { db } from "../../../src/db";
import { accounts } from "../../../src/db/schema";

export async function GET() {
  try {
    const allAccounts = await db.select().from(accounts);
    return NextResponse.json(allAccounts);
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des comptes" },
      { status: 500 }
    );
  }
}
