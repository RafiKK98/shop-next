"use client";

import { useEffect, useState } from "react";
import { FeaturedCategories } from "./featured-categories";
import { FeaturedProducts } from "./featured-products";
import { BestSellers } from "./best-sellers";
import { NewArrivals } from "./new-arrivals";
import { BrandLogos } from "./brand-logos";
import type { HomePageData } from "@/actions/home-page";

export function HomeSections() {
  const [data, setData] = useState<HomePageData | null>(null);

  useEffect(() => {
    (async () => {
      const { loadHomePageData } = await import("@/actions/home-page");
      const result = await loadHomePageData();
      setData(result);
    })();
  }, []);

  if (data === null) return null;

  return (
    <>
      <FeaturedCategories categories={data.categories} />
      <FeaturedProducts products={data.featuredProducts} />
      <BestSellers products={data.bestSellers} />
      <NewArrivals products={data.newArrivals} />
      <BrandLogos brands={data.brands.slice(0, 6)} />
    </>
  );
}
