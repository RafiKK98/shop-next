import "server-only";

import { cloudinary } from "@/lib/cloudinary";
import { extractPublicId, type UploadFolder } from "@/lib/upload";

/**
 * Upload a file to Cloudinary and return the secure URL.
 */
export async function uploadImageToCloudinary(
  file: File,
  folder: UploadFolder,
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64 = buffer.toString("base64");
  const dataUri = `data:${file.type};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
  });

  return result.secure_url;
}

/**
 * Delete an image from Cloudinary by its secure URL.
 * This is a no-op if the public ID cannot be extracted.
 *
 * Structured for future use. Once wired into mutation Server Actions,
 * call this for any image URL removed from a product/category/avatar
 * before persisting the new set.
 */
export async function deleteImageFromCloudinary(url: string): Promise<void> {
  const publicId = extractPublicId(url);
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
