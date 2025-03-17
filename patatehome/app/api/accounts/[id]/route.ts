import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Extraire l'ID de la manière la plus robuste possible
  const url = new URL(request.url);
  const urlPath = url.pathname;
  const pathParts = urlPath.split("/");

  // Essayer d'extraire l'ID directement de l'URL (dernier segment)
  const lastSegment = pathParts[pathParts.length - 1];

  // Vérifier si le dernier segment est numérique
  let id: string = "";

  // Méthode 1: Prendre l'ID directement du chemin s'il est numérique
  if (lastSegment && !isNaN(parseInt(lastSegment))) {
    id = lastSegment;
    console.log(`[API] ID extrait du dernier segment de l'URL: ${id}`);
  }
  // Méthode 2: Essayer les params si le dernier segment n'est pas numérique
  else if (params.id && params.id !== "[id]" && !isNaN(parseInt(params.id))) {
    id = params.id;
    console.log(`[API] ID extrait des params: ${id}`);
  }
  // Méthode 3: Essayer les searchParams comme dernier recours
  else {
    const searchParamsId = url.searchParams.get("id");
    if (searchParamsId && !isNaN(parseInt(searchParamsId))) {
      id = searchParamsId;
      console.log(`[API] ID extrait des searchParams: ${id}`);
    }
  }

  console.log(`[API] Diagnostic complet:`, {
    url: request.url,
    urlPath,
    pathParts,
    lastSegment,
    params,
    searchParams: Object.fromEntries(url.searchParams.entries()),
    extractedId: id,
  });

  if (!id || isNaN(parseInt(id))) {
    const errorMsg = `ID invalide: '${id}'`;
    console.error(`[API] ${errorMsg}`);
    return NextResponse.json(
      {
        error: errorMsg,
        diagnostic: {
          url: request.url,
          urlPath,
          pathParts,
          lastSegment,
          params,
          searchParams: Object.fromEntries(url.searchParams.entries()),
        },
      },
      { status: 400 }
    );
  }

  const accountId = parseInt(id);
  console.log(`[API] Recherche du compte avec ID: ${accountId}`);

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
