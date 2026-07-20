"use server";

import { uploadImageToCloudinary } from "@/lib/cloudinary-upload";
import { validateImage, type UploadFolder } from "@/lib/upload";

interface UploadSuccess {
  success: true;
  url: string;
}

interface UploadError {
  error: string;
}

type UploadResult = UploadSuccess | UploadError;

export async function uploadImageAction(
  formData: FormData,
): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const folder =
    (formData.get("folder") as UploadFolder) ?? "ecommerce/products";

  if (!file || !(file instanceof File) || file.size === 0)
    return { error: "No file provided" };

  const validationError = validateImage(file);
  if (validationError) return { error: validationError };

  try {
    const url = await uploadImageToCloudinary(file, folder);
    return { success: true, url };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to upload image";
    return { error: message };
  }
}
