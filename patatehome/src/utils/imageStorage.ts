import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveAccountImage(
  accountId: number,
  imageFile: File
): Promise<string> {
  const uploadsDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "accounts",
    accountId.toString()
  );

  try {
    await mkdir(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `${Date.now()}-${imageFile.name}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    return `/uploads/accounts/${accountId}/${filename}`;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de l'image:", error);
    throw error;
  }
}
