import { db } from "@/db";
import { wishlistItems, products, productImages } from "@/db/schema";
import { eq, and, sql, inArray } from "drizzle-orm";

export interface WishlistItemWithProduct {
  id: string;
  productId: string;
  createdAt: Date;
  product: {
    id: string;
    title: string;
    slug: string;
    price: string;
    discount: string;
    stock: number;
    image: string | null;
    imageAlt: string | null;
  };
}

function getFirstImage() {
  return sql<string | null>`
    (SELECT ${productImages.imageUrl}
     FROM ${productImages}
     WHERE ${productImages.productId} = ${products.id}
     ORDER BY ${productImages.order}
     LIMIT 1)
  `;
}

function getFirstImageAlt() {
  return sql<string | null>`
    (SELECT ${productImages.alt}
     FROM ${productImages}
     WHERE ${productImages.productId} = ${products.id}
     ORDER BY ${productImages.order}
     LIMIT 1)
  `;
}

export async function getWishlistItems(userId: string): Promise<WishlistItemWithProduct[]> {
  const rows = await db
    .select({
      id: wishlistItems.id,
      productId: wishlistItems.productId,
      createdAt: wishlistItems.createdAt,
      product: {
        id: products.id,
        title: products.title,
        slug: products.slug,
        price: products.price,
        discount: products.discount,
        stock: products.stock,
        image: getFirstImage(),
        imageAlt: getFirstImageAlt(),
      },
    })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId))
    .orderBy(wishlistItems.createdAt);

  return rows as WishlistItemWithProduct[];
}

export async function getWishlistCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId))
    .then((rows) => rows[0]?.count ?? 0);

  return result;
}

export async function getWishlistedSlugs(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ slug: products.slug })
    .from(wishlistItems)
    .innerJoin(products, eq(wishlistItems.productId, products.id))
    .where(eq(wishlistItems.userId, userId));

  return new Set(rows.map((r) => r.slug));
}

export async function resolveProductId(slug: string) {
  return db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .then((r) => r[0] ?? null);
}
