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

export default function Home() {
  return (
    <>
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
