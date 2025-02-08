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

export const POST = async (request: Request) => {
  try {
    const accountData = await request.json();
    console.log("Données reçues:", accountData);

    // Créer le compte
    await db.insert(accounts).values({
      hdv: parseInt(accountData.hdv),
      level: parseInt(accountData.level),
      price: parseInt(accountData.price),
      imageUrl: accountData.imageUrl,
      features: JSON.stringify(accountData.features),
      status: accountData.status || "available",
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    });

    // Récupérer le compte nouvellement créé
    const [newAccount] = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.id))
      .limit(1);

    if (accountData.additionalImages?.length > 0) {
      const additionalImagesData = accountData.additionalImages
        .filter((url: string) => url.trim() !== "")
        .map((url: string, index: number) => ({
          accountId: newAccount.id,
          imageUrl: url,
          displayOrder: index,
          createdAt: Math.floor(Date.now() / 1000),
        }));

      if (additionalImagesData.length > 0) {
        await db.insert(accountAdditionalImages).values(additionalImagesData);
      }
    }

    // Récupérer les images additionnelles
    const additionalImages = await db
      .select()
      .from(accountAdditionalImages)
      .where(eq(accountAdditionalImages.accountId, newAccount.id))
      .orderBy(accountAdditionalImages.displayOrder);

    return NextResponse.json({
      message: "Compte créé avec succès",
      account: {
        ...newAccount,
        additionalImages: additionalImages.map((img) => img.imageUrl),
      },
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
};
