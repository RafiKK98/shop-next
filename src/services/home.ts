import "server-only";

import { db } from "@/db";
import { categories, productImages, products, reviews } from "@/db/schema";
import type { Product, StockStatus } from "@/types/product";
import { eq, sql } from "drizzle-orm";

const NEW_PRODUCT_DAYS = 30;

function computeCompareAtPrice(
  price: number,
  discount: number | null,
): number | null {
  if (!discount || discount <= 0) return null;
  return Math.round((price / (1 - discount / 100)) * 100) / 100;
}

function computeStockStatus(stock: number | null): StockStatus {
  if (stock == null || stock <= 0) return "out_of_stock";
  if (stock < 10) return "low_stock";
  return "in_stock";
}

function computeIsNew(createdAt: Date | null): boolean {
  if (!createdAt) return false;
  const age = Date.now() - createdAt.getTime();
  return age < NEW_PRODUCT_DAYS * 24 * 60 * 60 * 1000;
}

const reviewAgg = db
  .select({
    productId: reviews.productId,
    avgRating: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`.as(
      "avg_rating",
    ),
    reviewCount: sql<number>`COUNT(*)`.as("review_count"),
  })
  .from(reviews)
  .where(eq(reviews.status, "approved"))
  .groupBy(reviews.productId)
  .as("review_agg");

function mapRows(
  rows: {
    id: string;
    title: string;
    slug: string;
    price: string;
    discount: string | null;
    stock: number | null;
    featured: boolean | null;
    createdAt: Date | null;
    brand: string | null;
    categorySlug: string | null;
    categoryName: string | null;
    imageUrl: string | null;
    avgRating: number | null;
    reviewCount: number | null;
  }[],
): Product[] {
  const productMap = new Map<string, Product>();
  for (const row of rows) {
    const existing = productMap.get(row.id);
    const price = Number(row.price);
    const discount = row.discount ? Number(row.discount) : null;
    if (existing) {
      if (row.imageUrl && !existing.images.includes(row.imageUrl))
        existing.images.push(row.imageUrl);
    } else {
      productMap.set(row.id, {
        id: row.id,
        title: row.title,
        slug: row.slug,
        images: row.imageUrl ? [row.imageUrl] : [],
        price,
        compareAtPrice: computeCompareAtPrice(price, discount),
        rating: Number(row.avgRating) || 0,
        reviewCount: Number(row.reviewCount) || 0,
        brand: row.brand ?? "",
        categorySlug: row.categorySlug ?? "",
        categoryName: row.categoryName ?? "",
        stockStatus: computeStockStatus(row.stock),
        isNew: computeIsNew(row.createdAt),
        isFeatured: row.featured ?? false,
      });
    }
  }
  return Array.from(productMap.values());
}

const productSelect = {
  id: products.id,
  title: products.title,
  slug: products.slug,
  price: sql<string>`${products.price}`,
  discount: sql<string | null>`${products.discount}`,
  stock: products.stock,
  featured: products.featured,
  createdAt: products.createdAt,
  brand: products.brand,
  categorySlug: categories.slug,
  categoryName: categories.name,
  imageUrl: productImages.imageUrl,
  avgRating: reviewAgg.avgRating,
  reviewCount: reviewAgg.reviewCount,
};

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(reviewAgg, eq(products.id, reviewAgg.productId))
    .where(eq(products.featured, true))
    .orderBy(productImages.order)
    .limit(limit);

  return mapRows(rows);
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(reviewAgg, eq(products.id, reviewAgg.productId))
    .where(sql`${reviewAgg.reviewCount} > 0`)
    .orderBy(sql`${reviewAgg.reviewCount} DESC`, productImages.order)
    .limit(limit);

  return mapRows(rows);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const rows = await db
    .select(productSelect)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(productImages, eq(products.id, productImages.productId))
    .leftJoin(reviewAgg, eq(products.id, reviewAgg.productId))
    .orderBy(sql`${products.createdAt} DESC`, productImages.order)
    .limit(limit);

  return mapRows(rows);
}

export interface HomeCategory {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  productCount: number;
}

export async function getHomeCategories(): Promise<HomeCategory[]> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      image: categories.image,
      productCount: sql<number>`COUNT(${products.id})`,
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id, categories.name, categories.slug, categories.image)
    .orderBy(categories.name);

  return rows;
}

export interface Brand {
  id: string;
  name: string;
}

export async function getBrands(): Promise<Brand[]> {
  const rows = await db
    .select({
      name: products.brand,
    })
    .from(products)
    .where(sql`${products.brand} IS NOT NULL AND ${products.brand} != ''`)
    .groupBy(products.brand)
    .orderBy(products.brand);

  return rows.map((r, i) => ({ id: `brand-${i + 1}`, name: r.name! }));
}

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
}

export async function getAllCategories(): Promise<CatalogCategory[]> {
  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
    })
    .from(categories)
    .where(eq(categories.active, true))
    .orderBy(categories.name);

  return rows;
}
