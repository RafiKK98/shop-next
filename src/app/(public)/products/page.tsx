import { CatalogContent } from "./catalog-content";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Products", description: "Browse our full catalog of products" });
}

export default function ProductsPage() {
  return <CatalogContent />;
}
