"use server";

import { db } from "@/db";
import { productImages, products } from "@/db/schema";
import { requireAdmin } from "@/lib/auth/guards";
import { CACHE_TAGS } from "@/lib/cache";
import { productFormServerSchema } from "@/lib/validations/product";
import { slugify } from "@/utils/slug";
import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";

interface ActionSuccess {
  success: true;
  productId: string;
}

interface ActionError {
  error: string;
}

type ActionResult = ActionSuccess | ActionError;

function parseDbError(err: unknown): string {
  const e = err as Record<string, unknown> & {
    message?: string;
    code?: string;
    constraint?: string;
  };
  if (e.code === "23505" && e.constraint?.includes("slug")) {
    return "A product with this slug already exists";
  }
  if (e.code === "23503") {
    return "Referenced category does not exist";
  }
  if (e.message) return e.message;
  return "An unexpected database error occurred";
}

async function getProductImageUrls(productId: string): Promise<string[]> {
  const rows = await db
    .select({ url: productImages.imageUrl })
    .from(productImages)
    .where(eq(productImages.productId, productId));
  return rows.map((r) => r.url);
}

export async function createProduct(formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const raw = Object.fromEntries(formData);
  const images = (formData.getAll("imageUrl") as string[]).filter(
    (url) => url.trim().length > 0,
  );

  const parsed = productFormServerSchema.safeParse({
    ...raw,
    slug: raw.slug || slugify(raw.title as string),
    images,
  });
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  const data = parsed.data;
  try {
    const [product] = await db.transaction(async (tx) => {
      const [p] = await tx
        .insert(products)
        .values({
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          categoryId: data.categoryId || null,
          brand: data.brand || null,
          price: String(data.price),
          discount: String(data.discount ?? 0),
          stock: data.stock ?? 0,
          featured: data.featured ?? false,
        })
        .returning();

      if (data.images && data.images.length > 0) {
        await tx.insert(productImages).values(
          data.images.map((url, i) => ({
            productId: p.id,
            imageUrl: url,
            alt: null,
            order: i,
          })),
        );
      }

      return [p];
    });

    revalidatePath("/admin/products");
    updateTag(CACHE_TAGS.PRODUCTS);
    return { success: true, productId: product.id };
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function updateProduct(
  productId: string,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();

  const existing = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Product not found" };

  const raw = Object.fromEntries(formData);
  const images = (formData.getAll("imageUrl") as string[]).filter(
    (url) => url.trim().length > 0,
  );

  const parsed = productFormServerSchema.safeParse({
    ...raw,
    slug: raw.slug || slugify(raw.title as string),
    images,
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: `${firstError.path.join(".")}: ${firstError.message}` };
  }

  const data = parsed.data;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(products)
        .set({
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          categoryId: data.categoryId || null,
          brand: data.brand || null,
          price: String(data.price),
          discount: String(data.discount ?? 0),
          stock: data.stock ?? 0,
          featured: data.featured ?? false,
          updatedAt: new Date(),
        })
        .where(eq(products.id, productId));

      await tx
        .delete(productImages)
        .where(eq(productImages.productId, productId));

      if (data.images && data.images.length > 0) {
        await tx.insert(productImages).values(
          data.images.map((url, i) => ({
            productId,
            imageUrl: url,
            alt: null,
            order: i,
          })),
        );
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${productId}`);
    revalidatePath(`/admin/products/${productId}/edit`);
    updateTag(CACHE_TAGS.PRODUCTS);
    return { success: true, productId };
  } catch (err) {
    return { error: parseDbError(err) };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  await requireAdmin();

  const existing = await db
    .select({ id: products.id, title: products.title })
    .from(products)
    .where(eq(products.id, productId))
    .then((r) => r[0] ?? null);

  if (!existing) return { error: "Product not found" };

  try {
    await db.transaction(async (tx) => {
      await tx
        .delete(productImages)
        .where(eq(productImages.productId, productId));
      await tx.delete(products).where(eq(products.id, productId));
    });

    revalidatePath("/admin/products");
    updateTag(CACHE_TAGS.PRODUCTS);
    return { success: true, productId };
  } catch (err) {
    const e = err as Record<string, unknown> & {
      code?: string;
      message?: string;
    };
    if (e.code === "23503") {
      return {
        error: `"${existing.title}" cannot be deleted because it is referenced by orders or other records`,
      };
    }
    return { error: e.message || "Failed to delete product" };
  }
}
