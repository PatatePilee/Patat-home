import { uploadToCloudinary } from "./cloudinary";

/**
 * Sauvegarde une image uploadée dans Cloudinary
 * et renvoie le nom du fichier pour référence en base de données
 */
export async function saveAccountImage(image: File): Promise<string> {
  if (!image) {
    throw new Error("Image manquante");
  }

  console.log(
    "Sauvegarde de l'image:",
    image.name,
    "Taille:",
    image.size,
    "Type:",
    image.type
  );

  // Vérifier que c'est bien une image
  if (!image.type.startsWith("image/")) {
    throw new Error(`Type de fichier non supporté: ${image.type}`);
  }

  // Vérifier la taille
  if (image.size > 10 * 1024 * 1024) {
    // 10MB max
    throw new Error(
      `Image trop volumineuse (max 10MB): ${image.size / (1024 * 1024)}MB`
    );
  }

  try {
    // Télécharger sur Cloudinary
    const result = await uploadToCloudinary(image);

    // Extraire juste le nom du fichier de l'URL
    const urlParts = result.url.split("/");
    const filename = urlParts[urlParts.length - 1];

    console.log(`Image sauvegardée avec succès: ${filename}`);

    // Stocker l'URL complète dans un attribut supplémentaire si nécessaire
    // image.cloudinaryUrl = result.url;

    return filename;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'image:", error);
    throw new Error(
      `Erreur de sauvegarde de l'image: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
}
