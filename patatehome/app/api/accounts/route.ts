import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const allAccounts = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.id));

    // Récupérer les images additionnelles pour chaque compte
    const accountsWithImages = await Promise.all(
      allAccounts.map(async (account) => {
        const additionalImages = await db
          .select()
          .from(accountAdditionalImages)
          .where(eq(accountAdditionalImages.accountId, account.id))
          .orderBy(accountAdditionalImages.displayOrder);

        return {
          ...account,
          features: JSON.parse(account.features),
          additionalImages: additionalImages.map((img) => img.imageUrl),
        };
      })
    );

    return NextResponse.json(accountsWithImages);
  } catch (error) {
    console.error("Erreur lors de la récupération des comptes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des comptes" },
      { status: 500 }
    );
  }
}
