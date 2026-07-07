"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { categoryFormServerSchema } from "@/lib/validations/category";
import {
  createCategoryDb,
  updateCategoryDb,
  deleteCategoryDb,
  getCategoryImageUrl,
} from "@/services/admin/categories";
import { revalidatePath } from "next/cache";
import { extractPublicId } from "@/lib/upload";

interface ActionSuccess {
  success: true;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

async function parseFormData(formData: FormData) {
  const raw = Object.fromEntries(formData);
  return categoryFormServerSchema.safeParse({
    ...raw,
    featured: raw.featured === "true",
    active: raw.active === "true",
  });
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const parsed = await parseFormData(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  try {
    await createCategoryDb(parsed.data);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create category",
    };
  }
}

export async function updateCategory(
  categoryId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const parsed = await parseFormData(formData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  try {
    /*
     * ── Cloudinary cleanup hook point ──
     *
     * When the category image is replaced, the old Cloudinary URL becomes
     * orphaned. To clean it up:
     *
     *   const oldImageUrl = await getCategoryImageUrl(categoryId);
     *   const newImageUrl = parsed.data.image;
     *   if (oldImageUrl && newImageUrl && oldImageUrl !== newImageUrl && extractPublicId(oldImageUrl)) {
     *     // Store oldImageUrl to delete after the update succeeds
     *   }
     *
     * Then after updateCategoryDb() succeeds:
     *
     *   await deleteImageFromCloudinary(oldImageUrl);
     */

    await updateCategoryDb(categoryId, parsed.data);
    revalidatePath("/admin/categories");
    revalidatePath(`/admin/categories/${categoryId}`);
    revalidatePath(`/admin/categories/${categoryId}/edit`);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update category",
    };
  }
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  await requireAdmin();

  try {
    /*
     * ── Cloudinary cleanup hook point ──
     *
     * Before deleting the category DB record, fetch the image URL and
     * delete the Cloudinary asset:
     *
     *   const imageUrl = await getCategoryImageUrl(categoryId);
     *   if (imageUrl && extractPublicId(imageUrl)) {
     *     // Will delete after DB deletion
     *   }
     */

    await deleteCategoryDb(categoryId);

    /*
     * Then call:
     *   await deleteImageFromCloudinary(imageUrl);
     */

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete category",
    };
  }
}
