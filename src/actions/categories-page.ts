"use server";

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
}

export async function loadCategoriesPage(): Promise<HomeCategory[]> {
  const { getHomeCategories } = await import("@/services/home");
  return getHomeCategories();
}
