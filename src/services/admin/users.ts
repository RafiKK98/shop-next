import "server-only";

import { db } from "@/db";
import {
  addresses,
  orderItems,
  orders,
  users,
  wishlistItems,
} from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  desc as descFn,
  eq,
  or,
  sql,
} from "drizzle-orm";
import { cache } from "react";
import type {
  RecentOrder,
  RecentWishlistItem,
  UserDetail,
  UserRole,
  UsersResponse,
  UserStatus,
} from "./user-types";

// ── Queries ─────────────────────────────────────────────────────────────

const orderCountSubquery = sql<number>`
  (SELECT count(*)::int FROM ${orders} WHERE ${eq(orders.userId, users.id)})
`;

const userListColumns = {
  id: users.id,
  name: users.name,
  email: users.email,
  image: users.image,
  role: users.role,
  status: users.status,
  emailVerified: users.emailVerified,
  orderCount: orderCountSubquery,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export async function getAdminUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  role?: UserRole | "";
  status?: UserStatus | "";
}): Promise<UsersResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const whereConditions = [];
  if (search) {
    whereConditions.push(
      or(
        sql`${users.name}::text ilike ${`%${search}%`}`,
        sql`${users.email}::text ilike ${`%${search}%`}`,
      ),
    );
  }
  if (params.role) {
    whereConditions.push(eq(users.role, params.role));
  }
  if (params.status) {
    whereConditions.push(eq(users.status, params.status));
  }
  const where =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const sortColumn =
    sort === "name"
      ? users.name
      : sort === "role"
        ? users.role
        : sort === "status"
          ? users.status
          : sort === "orderCount"
            ? orderCountSubquery
            : users.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  try {
    const [totalResult, rows] = await Promise.all([
      db.select({ value: count() }).from(users).where(where),
      db
        .select(userListColumns)
        .from(users)
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
  } catch (err) {
    const e = err as Record<string, unknown> & {
      message?: string;
      code?: string;
    };
    console.error("[DB ERROR] getAdminUsers:", e.code ?? "", e.message ?? "");
    throw err;
  }
}

export const getAdminUserById = cache(async function getAdminUserById(
  id: string,
): Promise<UserDetail | null> {
  try {
    const [user, defaultAddress] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          image: users.image,
          role: users.role,
          status: users.status,
          emailVerified: users.emailVerified,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          orderCount: orderCountSubquery,
          totalSpent: sql<number>`
            COALESCE((SELECT sum(${orders.total})::numeric(12,2) FROM ${orders}
              WHERE ${eq(orders.userId, users.id)} AND ${eq(orders.paymentStatus, "completed")}), 0)
          `,
          wishlistCount: sql<number>`
            (SELECT count(*)::int FROM ${wishlistItems} WHERE ${eq(wishlistItems.userId, users.id)})
          `,
        })
        .from(users)
        .where(eq(users.id, id))
        .then((r) => r[0] ?? null),
      db
        .select({
          fullName: addresses.fullName,
          street: addresses.street,
          city: addresses.city,
          state: addresses.state,
          postalCode: addresses.postalCode,
          country: addresses.country,
        })
        .from(addresses)
        .where(and(eq(addresses.userId, id), eq(addresses.isDefault, true)))
        .then((r) => r[0] ?? null),
    ]);

    if (!user) return null;

    return { ...user, totalSpent: Number(user.totalSpent), defaultAddress };
  } catch (err) {
    const e = err as Record<string, unknown> & {
      message?: string;
      code?: string;
    };
    console.error(
      "[DB ERROR] getAdminUserById:",
      e.code ?? "",
      e.message ?? "",
    );
    throw err;
  }
});

export async function getUserRecentOrders(
  userId: string,
  limit = 5,
): Promise<RecentOrder[]> {
  return db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      createdAt: orders.createdAt,
      itemCount: sql<number>`count(${orderItems.id})::int`,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(orders.userId, userId))
    .groupBy(orders.id)
    .orderBy(descFn(orders.createdAt))
    .limit(limit);
}

export async function getUserRecentWishlistItems(
  userId: string,
  limit = 5,
): Promise<RecentWishlistItem[]> {
  return db
    .select({
      id: wishlistItems.id,
      productId: wishlistItems.productId,
      createdAt: wishlistItems.createdAt,
    })
    .from(wishlistItems)
    .where(eq(wishlistItems.userId, userId))
    .orderBy(descFn(wishlistItems.createdAt))
    .limit(limit);
}

// ── Mutation ────────────────────────────────────────────────────────────

export interface UpdateUserData {
  name: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
}

export async function updateUserDb(
  id: string,
  data: UpdateUserData,
  actorId: string,
): Promise<void> {
  const user = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.id, id))
    .then((r) => r[0] ?? null);

  if (!user) throw new Error("User not found");

  const isSelf = user.id === actorId;

  if (isSelf && data.role !== user.role && data.role !== "admin") {
    throw new Error("You cannot remove your own admin role");
  }

  const result = await db
    .update(users)
    .set({
      name: data.name || null,
      phone: data.phone || null,
      role: data.role,
      status: data.status,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning({ id: users.id });

  if (result.length === 0) {
    throw new Error("User not found");
  }
}
