import sharp from "sharp";

import { supabase, STORAGE_BUCKET } from "./supabase";

export async function uploadImageAsWebP(
  file: File,
  folder: string,
): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const webpBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();

  const timestamp = Date.now();
  const safeName = file.name
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 60);

  const filePath = `${folder}/${timestamp}_${safeName}.webp`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, webpBuffer, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) {
    console.error(`Falha ao enviar imagem: ${error.message}`);

    throw new Error('Falha ao enviar imagem');
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
