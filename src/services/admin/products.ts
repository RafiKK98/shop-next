import "server-only";

import { db } from "@/db";
import { products, productImages, categories, reviews } from "@/db/schema";
import { eq, sql, desc, asc, and, count } from "drizzle-orm";

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  brand: string | null;
  price: string;
  discount: string | null;
  stock: number | null;
  categoryName: string | null;
  categoryId: string | null;
  thumbnail: string | null;
  createdAt: Date;
  featured: boolean | null;
}

export interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  brand: string | null;
  price: string;
  discount: string | null;
  stock: number | null;
  featured: boolean | null;
  categoryId: string | null;
  categoryName: string | null;
  images: { id: string; url: string; alt: string | null; order: number | null }[];
  createdAt: Date;
  updatedAt: Date;
  reviewCount: number;
  avgRating: number | null;
}

export interface ProductsResponse {
  items: ProductListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryOption {
  id: string;
  name: string;
}

export async function getAdminProducts(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<ProductsResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const whereConditions = [];
  if (search) {
    whereConditions.push(
      sql`(${products.title}::text ilike ${`%${search}%`} OR ${products.brand}::text ilike ${`%${search}%`})`,
    );
  }

  const where = whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const sortColumn =
    sort === "title"
      ? products.title
      : sort === "price"
        ? products.price
        : sort === "stock"
          ? sql`${products.stock}::text`
          : sort === "featured"
            ? products.featured
            : products.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  const [totalResult, rows] = await Promise.all([
    db.select({ value: count() }).from(products).where(where),
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        brand: products.brand,
        price: products.price,
        discount: products.discount,
        stock: products.stock,
        featured: products.featured,
        categoryId: products.categoryId,
        categoryName: categories.name,
        thumbnail: sql<string | null>`
          (SELECT ${productImages.imageUrl}
           FROM ${productImages}
           WHERE ${productImages.productId} = ${products.id}
           ORDER BY ${productImages.order}
           LIMIT 1)
        `,
        createdAt: products.createdAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderFn(sortColumn))
      .offset((page - 1) * pageSize)
      .limit(pageSize),
  ]);

  const total = totalResult[0]?.value ?? 0;

  return {
    items: rows,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminProductById(id: string): Promise<ProductDetail | null> {
  const product = await db
    .select({
      id: products.id,
      title: products.title,
      slug: products.slug,
      description: products.description,
      brand: products.brand,
      price: products.price,
      discount: products.discount,
      stock: products.stock,
      featured: products.featured,
      categoryId: products.categoryId,
      categoryName: categories.name,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .then((r) => r[0] ?? null);

  if (!product) return null;

  const [images, reviewStats] = await Promise.all([
    db
      .select({
        id: productImages.id,
        url: productImages.imageUrl,
        alt: productImages.alt,
        order: productImages.order,
      })
      .from(productImages)
      .where(eq(productImages.productId, id))
      .orderBy(productImages.order),
    db
      .select({
        count: sql<number>`count(*)::int`,
        avg: sql<string | null>`avg(rating)::numeric(2,1)`,
      })
      .from(reviews)
      .where(eq(reviews.productId, id))
      .then((r) => r[0]),
  ]);

  return {
    ...product,
    images,
    reviewCount: reviewStats?.count ?? 0,
    avgRating: reviewStats?.avg ? parseFloat(reviewStats.avg) : null,
  };
}

export async function getAdminCategories(): Promise<CategoryOption[]> {
  return db
    .select({
      id: categories.id,
      name: categories.name,
    })
    .from(categories)
    .orderBy(asc(categories.name));
}
