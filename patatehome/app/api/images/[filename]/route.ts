import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

/**
 * Route simple pour servir les images stockées dans public/accounts
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;

    if (!filename) {
      console.error("Erreur: Nom de fichier manquant");
      return NextResponse.json(
        { error: "Nom de fichier manquant" },
        { status: 400 }
      );
    }

    // Chemin vers le fichier dans le dossier public/accounts
    const filePath = path.join(process.cwd(), "public", "accounts", filename);

    try {
      // Lire le contenu du fichier
      const fileBuffer = await fs.readFile(filePath);

      // Déterminer le type MIME en fonction de l'extension du fichier
      const extension = path.extname(filename).toLowerCase();
      let contentType = "application/octet-stream"; // par défaut

      switch (extension) {
        case ".jpg":
        case ".jpeg":
          contentType = "image/jpeg";
          break;
        case ".png":
          contentType = "image/png";
          break;
        case ".gif":
          contentType = "image/gif";
          break;
        case ".webp":
          contentType = "image/webp";
          break;
      }

      // Créer une réponse avec le contenu du fichier et désactiver tout cache
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });
    } catch (error) {
      console.error(`Erreur lors de la lecture du fichier ${filename}:`, error);
      return NextResponse.json(
        { error: `Fichier non trouvé: ${filename}` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Erreur générale dans la route d'images:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
