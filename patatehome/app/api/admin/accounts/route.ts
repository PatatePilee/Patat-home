import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";

export const POST = async (request: Request) => {
  try {
    const accountData = await request.json();
    console.log("Données reçues:", accountData);

    const newAccount = await db
      .insert(accounts)
      .values({
        hdv: parseInt(accountData.hdv),
        level: parseInt(accountData.level),
        price: parseInt(accountData.price),
        imageUrl: accountData.imageUrl,
        features: JSON.stringify(accountData.features),
        status: accountData.status || "available",
        createdAt: Math.floor(Date.now() / 1000),
        updatedAt: Math.floor(Date.now() / 1000),
      })
      .returning();

    console.log("Compte créé:", newAccount);

    if (accountData.additionalImages?.length > 0) {
      const additionalImagesData = accountData.additionalImages
        .filter((url: string) => url.trim() !== "")
        .map((url: string, index: number) => ({
          accountId: newAccount[0].id,
          imageUrl: url,
          displayOrder: index,
          createdAt: Math.floor(Date.now() / 1000),
        }));

      if (additionalImagesData.length > 0) {
        await db.insert(accountAdditionalImages).values(additionalImagesData);
      }
    }

    return NextResponse.json({
      message: "Compte créé avec succès",
      account: newAccount[0],
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
};
