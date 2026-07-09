import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap() {
  const productRows = await db
    .select({ slug: products.slug, updatedAt: products.updatedAt })
    .from(products);

  const categoryRows = await db
    .select({ slug: categories.slug })
    .from(categories)
    .where(and(eq(categories.active, true)));

  const productsEntries = productRows.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoriesEntries = categoryRows.map((c) => ({
    url: `${BASE_URL}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    ...categoriesEntries,
    ...productsEntries,
  ];
}