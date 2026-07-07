import "server-only";

import { db } from "@/db";
import { orderItems, orders, reviews, users } from "@/db/schema";
import { and, asc, count, desc, eq, inArray, ne, sql } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────

export interface ReviewListItem {
  id: string;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  authorName: string | null;
  authorImage: string | null;
}

export interface ReviewAggregate {
  total: number;
  average: number | null;
  breakdown: Record<number, number>;
}

export interface ReviewsResponse {
  items: ReviewListItem[];
  aggregate: ReviewAggregate;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface UserReview {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ── Verified purchase ────────────────────────────────────────────────────

export async function hasVerifiedPurchase(
  userId: string,
  productId: string,
): Promise<boolean> {
  const result = await db
    .select({ id: orderItems.id })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .where(
      and(
        eq(orders.userId, userId),
        eq(orderItems.productId, productId),
        ne(orders.status, "cancelled"),
      ),
    )
    .limit(1)
    .then((r) => r[0] ?? null);

  return result !== null;
}

// ── User's existing review for a product ─────────────────────────────────

export async function getUserReviewForProduct(
  userId: string,
  productId: string,
): Promise<UserReview | null> {
  return db
    .select({
      id: reviews.id,
      rating: reviews.rating,
      title: reviews.title,
      comment: reviews.comment,
      createdAt: reviews.createdAt,
      updatedAt: reviews.updatedAt,
    })
    .from(reviews)
    .where(and(eq(reviews.userId, userId), eq(reviews.productId, productId)))
    .then((r) => r[0] ?? null);
}

// ── Product reviews (paginated, approved only) ───────────────────────────

export async function getProductReviews(
  productId: string,
  params: {
    page?: number;
    pageSize?: number;
    sort?: "newest" | "highest" | "lowest";
  },
): Promise<ReviewsResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 10));
  const sort = params.sort ?? "newest";
  const approvedStatus = "approved";

  const where = and(eq(reviews.productId, productId), eq(reviews.status, approvedStatus));

  const orderFn =
    sort === "highest"
      ? desc(reviews.rating)
      : sort === "lowest"
        ? asc(reviews.rating)
        : desc(reviews.createdAt);

  const [totalResult, items, aggregate] = await Promise.all([
    db.select({ value: count() }).from(reviews).where(where),
    db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        status: reviews.status,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(where)
      .orderBy(orderFn)
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    // Aggregate in a single query
    db
      .select({
        total: sql<number>`count(*)::int`,
        average: sql<string | null>`avg(${reviews.rating})::numeric(2,1)`,
        rating5: sql<number>`count(*) filter (where ${reviews.rating} = 5)::int`,
        rating4: sql<number>`count(*) filter (where ${reviews.rating} = 4)::int`,
        rating3: sql<number>`count(*) filter (where ${reviews.rating} = 3)::int`,
        rating2: sql<number>`count(*) filter (where ${reviews.rating} = 2)::int`,
        rating1: sql<number>`count(*) filter (where ${reviews.rating} = 1)::int`,
      })
      .from(reviews)
      .where(where),
  ]);

  const total = totalResult[0]?.value ?? 0;
  const agg = aggregate[0];

  return {
    items,
    aggregate: {
      total: agg?.total ?? 0,
      average: agg?.average ? parseFloat(agg.average) : null,
      breakdown: {
        5: agg?.rating5 ?? 0,
        4: agg?.rating4 ?? 0,
        3: agg?.rating3 ?? 0,
        2: agg?.rating2 ?? 0,
        1: agg?.rating1 ?? 0,
      },
    },
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
