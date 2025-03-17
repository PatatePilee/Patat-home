import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log(`Début GET /api/accounts/${params.id}`);

  // Récupérer l'ID depuis les params OU depuis la query string
  let id = params.id;

  // Si l'ID n'est pas dans params, essayons de le récupérer de l'URL
  if (!id || id === "[id]") {
    const url = new URL(request.url);
    id = url.searchParams.get("id") || "";
    console.log(`ID récupéré depuis searchParams: ${id}`);
  }

  console.log(`Traitement pour ID: ${id}`);

  if (!id || isNaN(parseInt(id))) {
    console.error("ID invalide:", id);
    return NextResponse.json(
      { error: "ID de compte invalide" },
      { status: 400 }
    );
  }

  const accountId = parseInt(id);
  console.log(`Recherche du compte avec ID: ${accountId}`);

  try {
    // Utiliser la méthode simple select plutôt que query builder
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.id, accountId))
      .limit(1);

    if (!account) {
      console.error(`Compte avec ID ${accountId} non trouvé`);
      return NextResponse.json(
        { error: `Compte avec ID ${accountId} non trouvé` },
        { status: 404 }
      );
    }

    console.log(`Compte trouvé:`, {
      id: account.id,
      hdv: account.hdv,
      level: account.level,
    });

    // Récupérer les images additionnelles
    const additionalImages = await db
      .select()
      .from(accountAdditionalImages)
      .where(eq(accountAdditionalImages.accountId, account.id))
      .orderBy(accountAdditionalImages.displayOrder);

    console.log(`${additionalImages.length} images additionnelles trouvées`);

    // Assurer que features est un tableau
    let features = [];
    try {
      features =
        typeof account.features === "string"
          ? JSON.parse(account.features)
          : account.features;
    } catch (e) {
      console.error(
        `Erreur de parsing features pour account.id=${account.id}:`,
        e
      );
      features = account.features ? [account.features] : [];
    }

    return NextResponse.json(
      {
        ...account,
        features,
        additionalImages: additionalImages.map((img) => img.filename),
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du compte ${accountId}:`,
      error
    );
    return NextResponse.json(
      {
        error: `Erreur lors de la récupération du compte: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`,
      },
      { status: 500 }
    );
  }
}
