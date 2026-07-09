import "server-only";

import { db } from "@/db";
import { coupons } from "@/db/schema";
import { and, asc, count, desc, eq, sql } from "drizzle-orm";

export interface AdminCouponListItem {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  description: string | null;
  minPurchase: string | null;
  maxDiscount: string | null;
  maxUsage: number | null;
  currentUsage: number | null;
  isActive: boolean | null;
  startDate: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminCouponsResponse {
  items: AdminCouponListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AdminCouponDetail {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: string;
  description: string | null;
  minPurchase: string | null;
  maxDiscount: string | null;
  maxUsage: number | null;
  currentUsage: number | null;
  isActive: boolean | null;
  startDate: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getAdminCoupons(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  status?: string;
}): Promise<AdminCouponsResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";
  const status = params.status ?? "";

  const whereConditions = [];

  if (search) {
    whereConditions.push(
      sql`(${coupons.code}::text ilike ${`%${search}%`} OR ${coupons.description}::text ilike ${`%${search}%`})`,
    );
  }

  if (status === "active") {
    whereConditions.push(eq(coupons.isActive, true));
  } else if (status === "inactive") {
    whereConditions.push(eq(coupons.isActive, false));
  }

  const where =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const sortColumn =
    sort === "code"
      ? coupons.code
      : sort === "value"
        ? coupons.value
        : sort === "type"
          ? sql`${coupons.type}::text`
          : sort === "maxUsage"
            ? coupons.maxUsage
            : sort === "currentUsage"
              ? coupons.currentUsage
              : sort === "expiresAt"
                ? coupons.expiresAt
                : coupons.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  const [totalResult, rows] = await Promise.all([
    db.select({ value: count() }).from(coupons).where(where),
    db
      .select()
      .from(coupons)
      .where(where)
      .orderBy(orderFn(sortColumn))
      .offset((page - 1) * pageSize)
      .limit(pageSize),
  ]);

  const total = totalResult[0]?.value ?? 0;

  return {
    items: rows as AdminCouponListItem[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getAdminCouponById(
  id: string,
): Promise<AdminCouponDetail | null> {
  const row = await db
    .select()
    .from(coupons)
    .where(eq(coupons.id, id))
    .then((r) => r[0] ?? null);

  return row as AdminCouponDetail | null;
}

export type CreateCouponInput = {
  code: string;
  type: "percentage" | "fixed";
  value: string;
  description?: string | null;
  minPurchase?: string | null;
  maxDiscount?: string | null;
  maxUsage?: number | null;
  isActive?: boolean;
  startDate?: Date | null;
  expiresAt?: Date | null;
};

export async function createCoupon(input: CreateCouponInput) {
  const [row] = await db
    .insert(coupons)
    .values({
      code: input.code,
      type: input.type,
      value: input.value,
      description: input.description ?? null,
      minPurchase: input.minPurchase ?? null,
      maxDiscount: input.maxDiscount ?? null,
      maxUsage: input.maxUsage ?? null,
      isActive: input.isActive ?? true,
      startDate: input.startDate ?? null,
      expiresAt: input.expiresAt ?? null,
    })
    .returning();
  console.log("Coupon row: ", { row });
  return row;
}

export type UpdateCouponInput = {
  code?: string;
  type?: "percentage" | "fixed";
  value?: string;
  description?: string | null;
  minPurchase?: string | null;
  maxDiscount?: string | null;
  maxUsage?: number | null;
  isActive?: boolean;
  startDate?: Date | null;
  expiresAt?: Date | null;
};

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  const [row] = await db
    .update(coupons)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(eq(coupons.id, id))
    .returning();

  return row;
}

export async function toggleCouponActive(id: string, isActive: boolean) {
  const [row] = await db
    .update(coupons)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(coupons.id, id))
    .returning();

  return row;
}
