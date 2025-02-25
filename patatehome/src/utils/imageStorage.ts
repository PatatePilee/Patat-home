import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function saveAccountImage(image: File): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "accounts");

  try {
    await mkdir(uploadsDir, { recursive: true });
    const filename = `${Date.now()}-${image.name}`;
    const filePath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await image.arrayBuffer());
    await writeFile(filePath, buffer);

    return filename;
  } catch (error) {
    console.error("Error saving image:", error);
    throw error;
  }
}
