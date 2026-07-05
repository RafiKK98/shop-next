import { notFound } from "next/navigation";
import { Breadcrumb, Container, Section, Divider } from "@/components/ui";
import { ProductGallery, ProductInfo, PurchaseSection, DescriptionSection, ReviewsList, RelatedProducts } from "@/components/product-detail";
import { catalogProducts } from "@/data/catalog";
import { getProductDetail } from "@/data/product-detail";
import type { Product } from "@/types/product";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllProductSlugs } = await import("@/data/product-detail");
  return getAllProductSlugs().map((slug) => ({ slug }));
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = (catalogProducts as Product[]).find((p) => p.slug === slug);
  if (!product) notFound();

  const detail = getProductDetail(slug);
  if (!detail) notFound();

  const related = (catalogProducts as Product[])
    .filter((p) => p.slug !== slug && p.categorySlug === product.categorySlug)
    .slice(0, 4);

  return (
    <>
      <Section className="pb-0">
        <Container>
          <Breadcrumb
            className="mb-6"
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.title },
            ]}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <ProductGallery images={detail.gallery} title={product.title} />
            <div className="flex flex-col gap-6">
              <ProductInfo product={product} />
              <PurchaseSection title={product.title} stockStatus={product.stockStatus} />
            </div>
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <DescriptionSection detail={detail} />
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            <ReviewsList reviews={detail.reviews} />
          </div>
        </Container>
      </Section>

      <RelatedProducts products={related} />
    </>
  );
}
