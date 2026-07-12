import {
  BestSellers,
  BrandLogos,
  FeaturedCategories,
  FeaturedProducts,
  HeroBanner,
  NewArrivals,
  NewsletterCta,
  PromotionalBanner,
  Testimonials,
} from "@/components/home";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/seo";
import {
  getBestSellers,
  getBrands,
  getFeaturedProducts,
  getHomeCategories,
  getNewArrivals,
} from "@/services/home";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({});
}

export default async function Home() {
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
