"use server";

import { requireAdmin } from "@/lib/auth/guards";
import { categoryFormServerSchema } from "@/lib/validations/category";
import {
  createCategoryDb,
  updateCategoryDb,
  deleteCategoryDb,
} from "@/services/admin/categories";
import { revalidatePath } from "next/cache";

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
    await deleteCategoryDb(categoryId);
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to delete category",
    };
  }
}
