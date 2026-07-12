"use server";

import type { Product } from "@/types/product";

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
}

export interface HomePageData {
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  categories: HomeCategory[];
  brands: Brand[];
}

export async function loadHomePageData(): Promise<HomePageData> {
  const [
    { getFeaturedProducts },
    { getBestSellers },
    { getNewArrivals },
    { getHomeCategories },
    { getBrands },
  ] = await Promise.all([
    import("@/services/home"),
    import("@/services/home"),
    import("@/services/home"),
    import("@/services/home"),
    import("@/services/home"),
  ]);

  const [featuredProducts, bestSellers, newArrivals, categories, brands] =
    await Promise.all([
      getFeaturedProducts(8),
      getBestSellers(8),
      getNewArrivals(8),
      getHomeCategories(),
      getBrands(),
    ]);

  return { featuredProducts, bestSellers, newArrivals, categories, brands };
}
