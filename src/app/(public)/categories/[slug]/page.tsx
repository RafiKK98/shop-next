import { notFound } from "next/navigation";
import { SITE } from "@/constants";
import { catalogCategories, catalogProducts } from "@/data/catalog";
import type { Metadata } from "next";
import { CategoryDetailContent } from "./catalog-content";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return catalogCategories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = catalogCategories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} | ${SITE.name}`,
    description: `Browse ${category.name} products`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = catalogCategories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = catalogProducts.filter((p) => p.categorySlug === slug);

  return <CategoryDetailContent category={category} products={products} />;
}
