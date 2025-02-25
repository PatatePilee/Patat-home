import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { saveAccountImage } from "@/src/utils/imageStorage";

export async function GET() {
  try {
    const allAccounts = await db
      .select()
      .from(accounts)
      .orderBy(desc(accounts.id));

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
          additionalImages: additionalImages.map((img) => img.filename),
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

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Handle image upload
    const imageFile = formData.get("image") as File;
    let imageFilename = "";

    if (imageFile) {
      imageFilename = await saveAccountImage(imageFile);
    }

    // Create account
    const accountData = {
      hdv: parseInt(formData.get("hdv") as string),
      level: parseInt(formData.get("level") as string),
      price: parseInt(formData.get("price") as string),
      imageFilename: imageFilename,
      features: formData.get("features") as string,
      status: (formData.get("status") as string) || "available",
      cartCount: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    const [newAccount] = await db
      .insert(accounts)
      .values(accountData)
      .returning();

    // Handle additional images
    const additionalImages = [];
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (key.startsWith("additionalImages[") && value instanceof File) {
        const filename = await saveAccountImage(value);
        additionalImages.push({
          accountId: newAccount.id,
          filename: filename,
          displayOrder: parseInt(key.match(/\[(\d+)\]/)?.[1] || "0"),
        });
      }
    }

    if (additionalImages.length > 0) {
      await db.insert(accountAdditionalImages).values(additionalImages);
    }
    return NextResponse.json({
      message: "Compte créé avec succès",
      account: {
        ...newAccount,
        imageUrl: `/accounts/${newAccount.imageFilename}`,
      },
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du compte" },
      { status: 500 }
    );
  }
}
