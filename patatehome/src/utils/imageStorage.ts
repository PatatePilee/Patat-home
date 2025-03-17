import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";

/**
 * Sauvegarde une image uploadée dans le dossier public/accounts
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

  // Chemin du dossier d'upload
  const uploadsDir = path.join(process.cwd(), "public", "accounts");
  console.log("Dossier de destination:", uploadsDir);

  try {
    // S'assurer que le dossier existe
    if (!fs.existsSync(uploadsDir)) {
      console.log("Création du dossier d'uploads manquant:", uploadsDir);
      await mkdir(uploadsDir, { recursive: true });
    }

    // Créer un nom de fichier sécurisé
    const timestamp = Date.now();
    // Nettoyer le nom du fichier pour éviter les caractères problématiques
    const cleanName = image.name
      .toLowerCase()
      .replace(/[^\w.-]/g, "_") // Remplacer tout ce qui n'est pas alphanumérique, ., - par _
      .replace(/\s+/g, "_"); // Remplacer les espaces par _

    // Créer un nom unique avec timestamp
    const filename = `${timestamp}-${cleanName}`;
    const filePath = path.join(uploadsDir, filename);

    // Convertir en buffer et écrire sur le disque
    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, buffer);

    console.log(
      `Image sauvegardée avec succès: ${filePath} (${buffer.length} octets)`
    );

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
