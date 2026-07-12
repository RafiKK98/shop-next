import { CatalogContent } from "./catalog-content";
import { createMetadata } from "@/lib/seo";
import { getCatalogProducts } from "@/services/products";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Products", description: "Browse our full catalog of products" });
}

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  return <CatalogContent products={products} />;
}
