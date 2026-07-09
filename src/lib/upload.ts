export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
] as const;

export const ACCEPTED_IMAGE_TYPES_SET = new Set<string>(ACCEPTED_IMAGE_TYPES);

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const UPLOAD_FOLDERS = {
  products: "ecommerce/products",
  categories: "ecommerce/categories",
  avatars: "ecommerce/avatars",
  branding: "ecommerce/branding",
} as const;

export type UploadFolder = (typeof UPLOAD_FOLDERS)[keyof typeof UPLOAD_FOLDERS];

export function validateImage(file: {
  type: string;
  size: number;
}): string | null {
  if (!ACCEPTED_IMAGE_TYPES_SET.has(file.type)) {
    const supported = ACCEPTED_IMAGE_TYPES.map((t) => t.split("/")[1].toUpperCase()).join(", ");
    return `Unsupported file type "${file.type.split("/")[1]}". Supported: ${supported}.`;
  }
  if (file.size > MAX_FILE_SIZE) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `File too large (${mb}MB). Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB.`;
  }
  return null;
}

/**
 * Extract the Cloudinary public ID from a Cloudinary secure URL.
 * The public ID includes the folder path and excludes the file extension.
 *
 * Example:
 *   URL:  https://res.cloudinary.com/demo/image/upload/v123456/ecommerce/products/abc123.jpg
 *   Returns: "ecommerce/products/abc123"
 */
export function extractPublicId(url: string): string | null {
  const uploadMarker = "/upload/";
  const idx = url.indexOf(uploadMarker);
  if (idx === -1) return null;

  const afterUpload = url.slice(idx + uploadMarker.length);
  const withoutVersion = afterUpload.replace(/^v\d+\//, "");
  const extDot = withoutVersion.lastIndexOf(".");
  return extDot > 0 ? withoutVersion.slice(0, extDot) : withoutVersion;
}

/**
 * Given two sets of image URLs (old and new), return the URLs that are
 * no longer present in the new set and have a valid Cloudinary public ID.
 * These can be passed to deleteImageFromCloudinary() for orphan cleanup.
 */
export function getRemovedImageUrls(oldUrls: string[], newUrls: string[]): string[] {
  const newSet = new Set(newUrls);
  return oldUrls.filter((url) => !newSet.has(url) && extractPublicId(url));
}
