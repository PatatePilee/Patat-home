import { NextResponse } from "next/server";
import { db } from "@/src/db";
import { accounts, accountAdditionalImages } from "@/src/db/schema";
import { eq, desc } from "drizzle-orm";
import { saveAccountImage } from "@/src/utils/imageStorage";

// Journalisation améliorée
const logger = {
  debug: (...args: any[]) => console.log("DEBUG:", ...args),
  info: (...args: any[]) => console.log("INFO:", ...args),
  error: (...args: any[]) => console.error("ERROR:", ...args),
};

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

        // Gérer de façon sécurisée le parsing des features
        let features = [];
        try {
          features = JSON.parse(account.features);
        } catch (e) {
          console.error(`Erreur de parsing pour account.id=${account.id}:`, e);
          features = account.features ? [account.features] : [];
        }

        return {
          ...account,
          features,
          additionalImages: additionalImages.map((img) => img.filename),
        };
      })
    );

    return NextResponse.json(accountsWithImages, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    logger.error("Erreur lors de la récupération des comptes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des comptes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("Début de la requête POST pour création de compte");

  try {
    // 1. Récupérer les données du formulaire
    const formData = await request.formData();
    console.log(
      "Données formData reçues:",
      Object.fromEntries(
        Array.from(formData.entries())
          .filter(([key]) => key !== "image")
          .map(([key, value]) => [key, value])
      )
    );

    // 2. Vérifier les données obligatoires
    const hdvValue = formData.get("hdv");
    const levelValue = formData.get("level");
    const priceValue = formData.get("price");

    if (!hdvValue || !levelValue || !priceValue) {
      console.error("Données obligatoires manquantes:", {
        hdv: hdvValue,
        level: levelValue,
        price: priceValue,
      });
      return NextResponse.json(
        { error: "Les champs HDV, niveau et prix sont obligatoires" },
        { status: 400 }
      );
    }

    // 3. Vérifier l'image principale
    const imageFile = formData.get("image") as File | null;
    if (!imageFile) {
      console.error("Aucune image fournie");
      return NextResponse.json(
        { error: "Une image est requise" },
        { status: 400 }
      );
    }

    // 4. Convertir et valider les données numériques
    const hdv = parseInt(hdvValue as string);
    const level = parseInt(levelValue as string);
    const price = parseInt(priceValue as string);

    // Validation des nombres
    if (isNaN(hdv) || isNaN(level) || isNaN(price)) {
      console.error("Valeurs numériques invalides:", { hdv, level, price });
      return NextResponse.json(
        { error: "HDV, niveau et prix doivent être des nombres valides" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    logger.info("Début du traitement des images:", startTime);

    // 5. Traitement optimisé des images - Sauvegarde en parallèle
    // 5.1 Extraire toutes les images additionnelles
    const additionalImageEntries = Array.from(formData.entries())
      .filter(
        ([key, value]) =>
          key.startsWith("additionalImages[") && value instanceof File
      )
      .map(([key, value]) => ({
        key,
        file: value as File,
        order: parseInt(key.match(/\[(\d+)\]/)?.[1] || "0"),
      }));

    // 5.2 Traiter l'image principale et les images additionnelles en parallèle
    const [imageFilename, ...additionalImageResults] = await Promise.all([
      saveAccountImage(imageFile),
      ...additionalImageEntries.map((entry) =>
        saveAccountImage(entry.file)
          .then((filename) => ({
            success: true,
            filename,
            order: entry.order,
          }))
          .catch((error) => ({
            success: false,
            error,
            order: entry.order,
          }))
      ),
    ]);

    logger.info(
      "Temps de traitement des images:",
      Date.now() - startTime,
      "ms"
    );

    // Filtrer les résultats réussis
    const successfulAdditionalImages = additionalImageResults
      .filter(
        (
          result
        ): result is { success: true; filename: string; order: number } =>
          result.success && "filename" in result
      )
      .map((result) => ({
        filename: result.filename,
        displayOrder: result.order,
      }));

    // 6. Préparer et insérer les données du compte
    const featuresStr = (formData.get("features") as string) || "[]";

    const accountData = {
      hdv,
      level,
      price,
      imageFilename,
      features: featuresStr,
      status: (formData.get("status") as string) || "available",
      cartCount: 0,
      createdAt: Math.floor(Date.now() / 1000),
      updatedAt: Math.floor(Date.now() / 1000),
    };

    logger.info("Données du compte à insérer:", accountData);

    // 7. Insertion en base de données - regrouper les opérations pour réduire les allers-retours
    const dbStartTime = Date.now();
    try {
      // 7.1 Insérer le compte
      const [newAccount] = await db
        .insert(accounts)
        .values(accountData)
        .returning();
      logger.info("Compte créé avec succès, ID:", newAccount.id);

      // 7.2 Préparer les données des images additionnelles
      const additionalImageValues = successfulAdditionalImages.map((img) => ({
        accountId: newAccount.id,
        filename: img.filename,
        displayOrder: img.displayOrder,
      }));

      // 7.3 Insérer les images additionnelles si nécessaire
      if (additionalImageValues.length > 0) {
        await db.insert(accountAdditionalImages).values(additionalImageValues);
        logger.info(
          `${additionalImageValues.length} images additionnelles ajoutées`
        );
      }

      logger.info(
        "Temps d'insertion en base de données:",
        Date.now() - dbStartTime,
        "ms"
      );
      logger.info(
        "Temps total de création du compte:",
        Date.now() - startTime,
        "ms"
      );

      // 8. Renvoyer la réponse
      return NextResponse.json({
        message: "Compte créé avec succès",
        account: {
          ...newAccount,
          imageUrl: `/api/images/${imageFilename}?v=${Date.now()}`,
          additionalImages: additionalImageValues.map((img) => img.filename),
          processingTime: Date.now() - startTime,
        },
      });
    } catch (dbError) {
      logger.error("Erreur base de données:", dbError);
      return NextResponse.json(
        {
          error: `Erreur base de données: ${
            dbError instanceof Error ? dbError.message : "Erreur inconnue"
          }`,
        },
        { status: 500 }
      );
    }
  } catch (generalError) {
    logger.error(
      "Erreur générale lors de la création du compte:",
      generalError
    );
    return NextResponse.json(
      {
        error: `Erreur lors de la création du compte: ${
          generalError instanceof Error
            ? generalError.message
            : "Erreur inconnue"
        }`,
      },
      { status: 500 }
    );
  }
}
