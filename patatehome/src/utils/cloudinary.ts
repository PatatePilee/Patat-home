import { v2 as cloudinary } from "cloudinary";

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "your-cloud-name",
  api_key: process.env.CLOUDINARY_API_KEY || "your-api-key",
  api_secret: process.env.CLOUDINARY_API_SECRET || "your-api-secret",
  secure: true,
});

/**
 * Télécharge une image sur Cloudinary et retourne l'URL
 */
export async function uploadToCloudinary(
  file: File
): Promise<{ url: string; publicId: string }> {
  try {
    console.log(
      `Préparation de l'upload sur Cloudinary: ${file.name}, taille: ${file.size}, type: ${file.type}`
    );

    // Convertir le fichier en buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Créer un nom de fichier unique
    const timestamp = Date.now();
    const cleanName = file.name
      .toLowerCase()
      .replace(/[^\w.-]/g, "_")
      .replace(/\s+/g, "_");
    const filename = `${timestamp}-${cleanName}`;

    // Conversion en base64 pour l'upload
    const base64Data = buffer.toString("base64");
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Télécharger sur Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri,
        {
          public_id: `accounts/${filename.replace(/\.[^/.]+$/, "")}`, // Enlever l'extension
          folder: "patatehome",
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            console.error("Erreur Cloudinary:", error);
            reject(
              new Error(
                `Erreur d'upload Cloudinary: ${
                  error?.message || "Erreur inconnue"
                }`
              )
            );
            return;
          }

          console.log(
            `Image téléchargée avec succès sur Cloudinary: ${result.secure_url}`
          );
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );
    });
  } catch (error) {
    console.error("Erreur lors du téléchargement sur Cloudinary:", error);
    throw new Error(
      `Erreur d'upload: ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }
}
