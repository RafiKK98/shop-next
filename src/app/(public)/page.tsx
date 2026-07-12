import { HeroBanner, PromotionalBanner, Testimonials, NewsletterCta } from "@/components/home";
import { HomeSections } from "@/components/home/home-sections";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/lib/json-ld";
import { createMetadata } from "@/lib/seo";
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
      <HomeSections />
      <PromotionalBanner />
      <Testimonials />
      <NewsletterCta />
    </>
  );
}
