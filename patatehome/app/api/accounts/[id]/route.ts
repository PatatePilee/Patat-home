import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const account = await db.query.accounts.findFirst({
      where: (accounts, { eq }) => eq(accounts.id, parseInt(params.id)),
    });

    if (!account) {
      return NextResponse.json({ error: "Compte non trouvé" }, { status: 404 });
    }

    const additionalImages = await db
      .select()
      .from(accountAdditionalImages)
      .where(eq(accountAdditionalImages.accountId, account.id))
      .orderBy(accountAdditionalImages.displayOrder);

    return NextResponse.json({
      ...account,
      additionalImages: additionalImages.map((img) => img.imageUrl),
    });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du compte" },
      { status: 500 }
    );
  }
}
