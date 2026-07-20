import { db } from "@/db";
import {
  orderItems,
  orders,
  orderStatusEnum,
  paymentStatusEnum,
  products,
} from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

type OrderStatus = (typeof orderStatusEnum.enumValues)[number];
type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

export interface OrderListItem {
  id: string;
  orderNumber: string;
  total: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  itemCount: number;
  createdAt: Date;
  thumbnail: string | null;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  userId: string;
  total: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: string;
    productName: string;
    productImage: string | null;
  }[];
}

export async function getUserOrders(userId: string): Promise<OrderListItem[]> {
  const rows = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      itemCount: sql<number>`count(${orderItems.id})::int`,
      thumbnail: sql<string | null>`min(${orderItems.productImage})`,
      orderNumber: orders.id,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .where(eq(orders.userId, userId))
    .groupBy(orders.id)
    .orderBy(desc(orders.createdAt));

  return rows.map((r) => ({
    ...r,
    orderNumber: r.orderNumber.slice(0, 8).toUpperCase(),
  }));
}

export async function getOrderById(
  userId: string,
  orderId: string,
): Promise<OrderDetail | null> {
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .then((r) => r[0] ?? null);

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: orderItems.productName,
      productImage: orderItems.productImage,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return {
    id: order.id,
    orderNumber: order.id.slice(0, 8).toUpperCase(),
    userId: order.userId,
    total: order.total,
    status: order.status,
    paymentStatus: order.paymentStatus,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    items,
  };
}

export async function cancelOrderById(
  userId: string,
  orderId: string,
): Promise<{ success: true } | { error: string }> {
  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .then((r) => r[0] ?? null);

  if (!order) return { error: "Order not found" };

  if (order.status !== "pending")
    return { error: "Only pending orders can be cancelled" };

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  const result = await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    for (const item of items) {
      await tx
        .update(products)
        .set({
          stock: sql`${products.stock} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, item.productId));
    }

    return { success: true as const };
  });

  return result;
}
