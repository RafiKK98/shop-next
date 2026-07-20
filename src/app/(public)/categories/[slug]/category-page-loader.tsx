"use client";

import type { Product } from "@/types/product";
import { useEffect, useState } from "react";
import { CategoryDetailContent } from "./catalog-content";

interface CategoryPageLoaderProps {
  slug: string;
}

interface LoadedData {
  category: { name: string; slug: string } | null;
  products: Product[];
}

export function CategoryPageLoader({ slug }: CategoryPageLoaderProps) {
  const [data, setData] = useState<LoadedData | null>(null);

  useEffect(() => {
    (async () => {
      const { loadCategoryPage } = await import("@/actions/category-page");
      const result = await loadCategoryPage(slug);
      setData(result as LoadedData);
    })();
  }, [slug]);

  if (data === null)
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  if (!data.category)
    return (
      <p className="py-16 text-center text-base-content/40">
        Category not found
      </p>
    );

  return (
    <CategoryDetailContent category={data.category} products={data.products} />
  );
}
