import "server-only";

import { db } from "@/db";
import { products, reviews, users } from "@/db/schema";
import { and, asc, count, desc, eq, like, or, sql } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────

export interface AdminReviewListItem {
  id: string;
  rating: number;
  title: string | null;
  comment: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string | null;
  userEmail: string | null;
  productTitle: string | null;
  productId: string | null;
}

export interface AdminReviewsResponse {
  items: AdminReviewListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const REVIEW_STATUS_ORDER = ["pending", "approved", "rejected", "hidden"] as const;

// ── List ─────────────────────────────────────────────────────────────────

export async function getAdminReviews(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  sort?: string;
  order?: "asc" | "desc";
}): Promise<AdminReviewsResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const status = params.status?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const conditions = [];
  if (search) {
    conditions.push(
      or(
        like(products.title, `%${search}%`),
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`),
      ),
    );
  }
  if (status) {
    conditions.push(eq(reviews.status, status as any));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const sortColumn =
    sort === "rating"
      ? reviews.rating
      : sort === "status"
        ? reviews.status
        : reviews.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  const [totalResult, rows] = await Promise.all([
    db
      .select({ value: count() })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(products, eq(reviews.productId, products.id))
      .where(where),
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        title: reviews.title,
        comment: reviews.comment,
        status: reviews.status,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        userName: users.name,
        userEmail: users.email,
        productTitle: products.title,
        productId: products.id,
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .innerJoin(products, eq(reviews.productId, products.id))
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

// ── Moderation ───────────────────────────────────────────────────────────

export async function updateReviewStatus(
  reviewId: string,
  status: string,
): Promise<void> {
  await db
    .update(reviews)
    .set({ status: status as any, updatedAt: new Date() })
    .where(eq(reviews.id, reviewId));
}
