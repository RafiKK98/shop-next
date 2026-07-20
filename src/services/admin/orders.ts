import "server-only";

import { db } from "@/db";
import { addresses, orderItems, orders, users } from "@/db/schema";
import { CACHE_TAGS } from "@/lib/cache";
import { and, asc, count, desc, eq, gte, lte, or, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";
import type {
  OrderDetail,
  OrdersResponse,
  OrderStats,
  OrderStatus,
  PaymentStatus,
} from "./order-types";
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  VALID_ORDER_TRANSITIONS,
  VALID_PAYMENT_TRANSITIONS,
} from "./order-types";

// ── Queries ─────────────────────────────────────────────────────────────

export async function getAdminOrders(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  status?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
  dateFrom?: string;
  dateTo?: string;
}): Promise<OrdersResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const search = params.search?.trim() ?? "";
  const sort = params.sort ?? "createdAt";
  const order = params.order ?? "desc";

  const whereConditions = [];

  if (search)
    whereConditions.push(
      or(
        sql`${users.name}::text ilike ${`%${search}%`}`,
        sql`${users.email}::text ilike ${`%${search}%`}`,
        sql`${orders.id}::text ilike ${`%${search}%`}`,
      ),
    );

  if (params.status) whereConditions.push(eq(orders.status, params.status));

  if (params.paymentStatus)
    whereConditions.push(eq(orders.paymentStatus, params.paymentStatus));

  if (params.dateFrom)
    whereConditions.push(gte(orders.createdAt, new Date(params.dateFrom)));

  if (params.dateTo)
    whereConditions.push(lte(orders.createdAt, new Date(params.dateTo)));

  const where =
    whereConditions.length > 0 ? and(...whereConditions) : undefined;

  const sortColumn =
    sort === "total"
      ? orders.total
      : sort === "status"
        ? orders.status
        : sort === "paymentStatus"
          ? orders.paymentStatus
          : orders.createdAt;

  const orderFn = order === "asc" ? asc : desc;

  const [totalResult, rows] = await Promise.all([
    db
      .select({ value: count() })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .where(where),
    db
      .select({
        id: orders.id,
        customerName: users.name,
        customerEmail: users.email,
        total: orders.total,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        itemCount: sql<number>`count(${orderItems.id})::int`,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .where(where)
      .groupBy(orders.id, users.name, users.email)
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

export const getAdminOrderById = cache(async function getAdminOrderById(
  id: string,
): Promise<OrderDetail | null> {
  const order = await db
    .select({
      id: orders.id,
      userId: orders.userId,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      stripeCheckoutSessionId: orders.stripeCheckoutSessionId,
      stripePaymentIntentId: orders.stripePaymentIntentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerName: users.name,
      customerEmail: users.email,
      customerPhone: users.phone,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .then((r) => r[0] ?? null);

  if (!order) return null;

  const [items, address] = await Promise.all([
    db
      .select({
        id: orderItems.id,
        productId: orderItems.productId,
        productName: orderItems.productName,
        productImage: orderItems.productImage,
        quantity: orderItems.quantity,
        price: orderItems.price,
      })
      .from(orderItems)
      .where(eq(orderItems.orderId, id)),
    db
      .select({
        fullName: addresses.fullName,
        phone: addresses.phone,
        street: addresses.street,
        addressLine2: addresses.addressLine2,
        city: addresses.city,
        state: addresses.state,
        postalCode: addresses.postalCode,
        country: addresses.country,
      })
      .from(addresses)
      .where(
        and(eq(addresses.userId, order.userId), eq(addresses.isDefault, true)),
      )
      .then((r) => r[0] ?? null),
  ]);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0,
  );

  return {
    id: order.id,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    stripeCheckoutSessionId: order.stripeCheckoutSessionId,
    stripePaymentIntentId: order.stripePaymentIntentId,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    customer: order.customerName
      ? {
          name: order.customerName,
          email: order.customerEmail ?? null,
          phone: order.customerPhone ?? null,
        }
      : null,
    shippingAddress: address,
    items,
    subtotal,
  };
});

export async function getOrderStats(): Promise<OrderStats> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.ORDERS);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [[pendingCount], [processingCount], [revenueResult], [todayCount]] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(orders)
        .where(eq(orders.status, "pending")),
      db
        .select({ value: count() })
        .from(orders)
        .where(eq(orders.status, "processing")),
      db
        .select({ value: sql<string>`coalesce(sum(${orders.total}), '0')` })
        .from(orders)
        .where(eq(orders.paymentStatus, "completed")),
      db
        .select({ value: count() })
        .from(orders)
        .where(gte(orders.createdAt, today)),
    ]);

  return {
    pending: pendingCount?.value ?? 0,
    processing: processingCount?.value ?? 0,
    revenue: parseFloat(revenueResult?.value ?? "0"),
    ordersToday: todayCount?.value ?? 0,
  };
}

export async function updateOrderStatusDb(
  id: string,
  newStatus: OrderStatus,
): Promise<void> {
  const order = await db
    .select({ id: orders.id, status: orders.status })
    .from(orders)
    .where(eq(orders.id, id))
    .then((r) => r[0] ?? null);

  if (!order) throw new Error("Order not found");

  const allowed = VALID_ORDER_TRANSITIONS[order.status as OrderStatus];
  if (!allowed.includes(newStatus))
    throw new Error(
      `Cannot change order status from "${ORDER_STATUS_LABEL[order.status as OrderStatus]}" to "${ORDER_STATUS_LABEL[newStatus]}"`,
    );

  await db
    .update(orders)
    .set({ status: newStatus, updatedAt: new Date() })
    .where(eq(orders.id, id));
}

export async function updatePaymentStatusDb(
  id: string,
  newStatus: PaymentStatus,
): Promise<void> {
  const order = await db
    .select({ id: orders.id, paymentStatus: orders.paymentStatus })
    .from(orders)
    .where(eq(orders.id, id))
    .then((r) => r[0] ?? null);

  if (!order) throw new Error("Order not found");

  const allowed =
    VALID_PAYMENT_TRANSITIONS[order.paymentStatus as PaymentStatus];
  if (!allowed.includes(newStatus))
    throw new Error(
      `Cannot change payment status from "${PAYMENT_STATUS_LABEL[order.paymentStatus as PaymentStatus]}" to "${PAYMENT_STATUS_LABEL[newStatus]}"`,
    );

  await db
    .update(orders)
    .set({ paymentStatus: newStatus, updatedAt: new Date() })
    .where(eq(orders.id, id));
}
