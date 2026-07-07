import "server-only";

import { db } from "@/db";
import { products, orders, users, orderItems } from "@/db/schema";
import { sql, desc, eq, ne } from "drizzle-orm";

export interface AdminDashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: string;
  totalUsers: number;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
  recentUsers: RecentUser[];
}

export interface RecentOrder {
  id: string;
  orderNumber: string;
  total: string;
  status: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: Date;
}

export interface LowStockProduct {
  id: string;
  title: string;
  slug: string;
  stock: number | null;
  price: string;
}

export interface RecentUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
}

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    totalProducts,
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrdersData,
    lowStockData,
    recentUsersData,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .then((r) => r[0].count),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .then((r) => r[0].count),
    db
      .select({ total: sql<string>`coalesce(sum(${orders.total}), '0')` })
      .from(orders)
      .where(ne(orders.status, "cancelled"))
      .then((r) => r[0].total),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .then((r) => r[0].count),
    db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
        itemCount: sql<number>`count(${orderItems.id})::int`,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
      .groupBy(orders.id, users.name, users.email)
      .orderBy(desc(orders.createdAt))
      .limit(5),
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        stock: products.stock,
        price: products.price,
      })
      .from(products)
      .where(sql`${products.stock} < 10`)
      .orderBy(products.stock)
      .limit(5),
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5),
  ]);

  return {
    totalProducts,
    totalCategories: 0,
    totalOrders,
    totalRevenue,
    totalUsers,
    recentOrders: recentOrdersData.map((r) => ({
      ...r,
      orderNumber: r.id.slice(0, 8).toUpperCase(),
    })),
    lowStockProducts: lowStockData,
    recentUsers: recentUsersData,
  };
}
