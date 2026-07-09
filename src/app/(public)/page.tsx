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
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({});
}

export default function Home() {
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromotionalBanner />
      <BestSellers />
      <NewArrivals />
      <Testimonials />
      <BrandLogos />
      <NewsletterCta />
    </>
  );
}