import { notFound } from "next/navigation";
import { SITE } from "@/constants";
import { getCatalogProductsByCategory } from "@/services/products";
import { getAllCategories } from "@/services/home";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { CategoryDetailContent } from "./catalog-content";

const STATIC_CATEGORIES: Record<string, string> = {
  electronics: "Electronics",
  "clothing-fashion": "Clothing & Fashion",
  "home-garden": "Home & Garden",
  "sports-outdoors": "Sports & Outdoors",
  "beauty-health": "Beauty & Health",
  "books-media": "Books & Media",
  "toys-games": "Toys & Games",
  automotive: "Automotive",
  "food-groceries": "Food & Groceries",
  "music-instruments": "Music & Instruments",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return Object.keys(STATIC_CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const name = STATIC_CATEGORIES[slug];
  if (!name) return {};
  return {
    title: `${name} | ${SITE.name}`,
    description: `Browse ${name} products`,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const name = STATIC_CATEGORIES[slug];
  if (!name) notFound();

  const _cookies = await cookies();

  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug)!;

  const products = await getCatalogProductsByCategory(slug);

  return <CategoryDetailContent category={category} products={products} />;
}
