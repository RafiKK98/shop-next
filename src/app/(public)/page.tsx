import { createMetadata } from "@/lib/seo";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/json-ld";
import {
  HeroBanner,
  FeaturedCategories,
  FeaturedProducts,
  PromotionalBanner,
  BestSellers,
  NewArrivals,
  Testimonials,
  BrandLogos,
  NewsletterCta,
} from "@/components/home";
import {
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  getHomeCategories,
  getBrands,
} from "@/services/home";
import { cookies } from "next/headers";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({});
}

export default async function Home() {
  const _cookies = await cookies();

  const [featuredProducts, bestSellers, newArrivals, categories, brands] =
    await Promise.all([
      getFeaturedProducts(8),
      getBestSellers(8),
      getNewArrivals(8),
      getHomeCategories(),
      getBrands(),
    ]);

  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HeroBanner />
      <FeaturedCategories categories={categories} />
      <FeaturedProducts products={featuredProducts} />
      <PromotionalBanner />
      <BestSellers products={bestSellers} />
      <NewArrivals products={newArrivals} />
      <Testimonials />
      <BrandLogos brands={brands.slice(0, 6)} />
      <NewsletterCta />
    </>
  );
}