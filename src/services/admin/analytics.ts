import "server-only";

import { db } from "@/db";
import { categories, orderItems, orders, products, users } from "@/db/schema";
import { and, count, desc, eq, gte, ne, sql } from "drizzle-orm";

// ── Types ────────────────────────────────────────────────────────────────

export interface RevenuePeriod {
  current: string;
  previous: string;
  changePercent: number;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export interface DashboardRecentOrder {
  id: string;
  orderNumber: string;
  total: string;
  status: string;
  userName: string | null;
  userEmail: string | null;
  createdAt: Date;
}

export interface DashboardLowStockProduct {
  id: string;
  title: string;
  slug: string;
  stock: number | null;
  price: string;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  slug: string | null;
  unitsSold: number;
  revenue: string;
}

export interface DashboardRecentCustomer {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

export interface DashboardAnalytics {
  totalRevenue: string;
  totalOrders: number;
  totalProducts: number;
  totalCategories: number;
  totalCustomers: number;
  pendingOrders: number;
  processingOrders: number;
  lowStockCount: number;

  revenueToday: RevenuePeriod;
  revenueLast7Days: RevenuePeriod;
  revenueLast30Days: RevenuePeriod;

  dailyRevenue: DailyRevenue[];
  orderStatusBreakdown: OrderStatusCount[];

  recentOrders: DashboardRecentOrder[];
  lowStockProducts: DashboardLowStockProduct[];
  topSellingProducts: TopSellingProduct[];
  recentCustomers: DashboardRecentCustomer[];
}

// ── Constants ────────────────────────────────────────────────────────────

const CANCELLED = "cancelled";
const PENDING = "pending";
const PROCESSING = "processing";
const LOW_STOCK_THRESHOLD = 10;

// ── Helpers ──────────────────────────────────────────────────────────────

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = startOfToday();
  d.setDate(d.getDate() - n);
  return d;
}

function computeRevenuePeriod(
  dailyData: { date: Date; total: string }[],
  currentStart: Date,
  previousStart: Date,
  periodEnd: Date,
): RevenuePeriod {
  const current = dailyData
    .filter((r) => r.date >= currentStart && r.date < periodEnd)
    .reduce((acc, r) => acc + Number(r.total), 0);
  const previous = dailyData
    .filter((r) => r.date >= previousStart && r.date < currentStart)
    .reduce((acc, r) => acc + Number(r.total), 0);

  const changePercent =
    previous > 0
      ? Math.round(((current - previous) / previous) * 100)
      : current > 0
        ? 100
        : 0;

  return {
    current: current.toFixed(2),
    previous: previous.toFixed(2),
    changePercent,
  };
}

// ── Main query ───────────────────────────────────────────────────────────

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const sixtyDaysAgo = daysAgo(60);
  const thirtyDaysAgo = daysAgo(30);
  const sevenDaysAgo = daysAgo(7);
  const todayStart = startOfToday();
  const yesterdayStart = daysAgo(1);

  const nonCancelled = ne(orders.status, CANCELLED);

  const [
    totalOrders,
    totalProducts,
    totalCategories,
    totalCustomers,
    pendingOrdersCount,
    processingOrdersCount,
    lowStockCount,
    totalRevenueResult,
    dailyRevenueRows,
    statusBreakdown,
    recentOrdersData,
    lowStockData,
    topSellingData,
    recentCustomersData,
  ] = await Promise.all([
    // ── Overview counts ──
    db
      .select({ value: count() })
      .from(orders)
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(products)
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(categories)
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(users)
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, PENDING))
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(orders)
      .where(eq(orders.status, PROCESSING))
      .then((r) => r[0].value),
    db
      .select({ value: count() })
      .from(products)
      .where(sql`${products.stock} < ${LOW_STOCK_THRESHOLD}`)
      .then((r) => r[0].value),

    // ── Total revenue (all time, non-cancelled) ──
    db
      .select({ value: sql<string>`coalesce(sum(${orders.total})::text, '0')` })
      .from(orders)
      .where(nonCancelled)
      .then((r) => r[0].value),

    // ── Daily revenue for last 60 days (powers all revenue analytics + chart) ──
    db
      .select({
        date: sql<Date>`date_trunc('day', ${orders.createdAt})::date`,
        total: sql<string>`coalesce(sum(${orders.total})::text, '0')`,
      })
      .from(orders)
      .where(and(nonCancelled, gte(orders.createdAt, sixtyDaysAgo)))
      .groupBy(sql`date_trunc('day', ${orders.createdAt})::date`)
      .orderBy(sql`date_trunc('day', ${orders.createdAt})::date`),

    // ── Order status breakdown ──
    db
      .select({
        status: orders.status,
        count: sql<number>`count(*)::int`,
      })
      .from(orders)
      .groupBy(orders.status)
      .orderBy(desc(sql`count(*)`)),

    // ── Recent orders (last 10) ──
    db
      .select({
        id: orders.id,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
        userName: users.name,
        userEmail: users.email,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt))
      .limit(10),

    // ── Low stock products ──
    db
      .select({
        id: products.id,
        title: products.title,
        slug: products.slug,
        stock: products.stock,
        price: products.price,
      })
      .from(products)
      .where(sql`${products.stock} < ${LOW_STOCK_THRESHOLD}`)
      .orderBy(products.stock)
      .limit(10),

    // ── Top selling products ──
    db
      .select({
        productId: orderItems.productId,
        productName: orderItems.productName,
        slug: products.slug,
        unitsSold: sql<number>`sum(${orderItems.quantity})::int`,
        revenue: sql<string>`coalesce(sum(${orderItems.quantity} * ${orderItems.price}::numeric)::text, '0')`,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .groupBy(orderItems.productId, orderItems.productName, products.slug)
      .orderBy(desc(sql`sum(${orderItems.quantity})`))
      .limit(10),

    // ── Recent customers ──
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(10),
  ]);

  // ── Compute revenue periods from daily data ──

  const dailyData = dailyRevenueRows.map((r) => ({
    date: new Date(r.date),
    total: r.total,
  }));

  const revenueToday = computeRevenuePeriod(
    dailyData,
    todayStart,
    yesterdayStart,
    todayStart,
  );
  const revenueLast7Days = computeRevenuePeriod(
    dailyData,
    sevenDaysAgo,
    daysAgo(14),
    todayStart,
  );
  const revenueLast30Days = computeRevenuePeriod(
    dailyData,
    thirtyDaysAgo,
    daysAgo(60),
    todayStart,
  );

  // ── Chart data (last 30 days, fill gaps with 0) ──

  const chartMap = new Map<string, number>();
  for (const row of dailyRevenueRows) {
    const d = new Date(row.date);
    if (d >= thirtyDaysAgo) {
      chartMap.set(d.toISOString().slice(0, 10), Number(row.total));
    }
  }

  const dailyRevenue: DailyRevenue[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = daysAgo(i);
    const key = d.toISOString().slice(0, 10);
    dailyRevenue.push({
      date: key,
      revenue: chartMap.get(key) ?? 0,
    });
  }

  // ── Status breakdown with zero-fill ──

  const statusMap = new Map<string, number>();
  for (const row of statusBreakdown) {
    statusMap.set(row.status, row.count);
  }

  const allStatuses = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  const orderStatusBreakdown = allStatuses.map((status) => ({
    status,
    count: statusMap.get(status) ?? 0,
  }));

  // ── Assemble result ──

  return {
    totalRevenue: totalRevenueResult,
    totalOrders,
    totalProducts,
    totalCategories,
    totalCustomers,
    pendingOrders: pendingOrdersCount,
    processingOrders: processingOrdersCount,
    lowStockCount,
    revenueToday,
    revenueLast7Days,
    revenueLast30Days,
    dailyRevenue,
    orderStatusBreakdown,
    recentOrders: recentOrdersData.map((r) => ({
      ...r,
      orderNumber: r.id.slice(0, 8).toUpperCase(),
    })),
    lowStockProducts: lowStockData,
    topSellingProducts: topSellingData,
    recentCustomers: recentCustomersData,
  };
}
