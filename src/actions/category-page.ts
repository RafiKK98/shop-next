"use server";

export async function loadCategoryPage(slug: string) {
  const { cookies } = await import("next/headers");
  cookies();

  const { getAllCategories } = await import("@/services/home");
  const { getCatalogProductsByCategory } = await import("@/services/products");

  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug) ?? null;

  const products = await getCatalogProductsByCategory(slug);

  return { category, products };
}
