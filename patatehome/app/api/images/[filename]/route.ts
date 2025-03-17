import { NextRequest, NextResponse } from "next/server";

/**
 * Route pour rediriger vers les images stockées sur Cloudinary
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

    // Construire l'URL Cloudinary
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "your-cloud-name";
    const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/upload/patatehome/accounts/${filename}`;

    console.log(`Redirection vers Cloudinary: ${cloudinaryUrl}`);

    // Rediriger vers l'URL Cloudinary
    return NextResponse.redirect(cloudinaryUrl);
  } catch (error) {
    console.error("Erreur générale dans la route d'images:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
