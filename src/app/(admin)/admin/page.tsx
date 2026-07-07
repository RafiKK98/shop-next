import { requireAdmin } from "@/lib/auth/guards";
import { getDashboardAnalytics } from "@/services/admin/analytics";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DashboardSection } from "@/components/admin/dashboard-section";
import { RevenueChart } from "@/components/admin/charts/revenue-chart";
import { OrderStatusChart } from "@/components/admin/charts/order-status-chart";
import { Badge, Avatar, Button } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Layers,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard | Admin | ${SITE.name}`,
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getDashboardAnalytics();

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      {/* ── Overview Metrics ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          variant="warning"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          variant="primary"
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          variant="default"
        />
        <StatCard
          label="Total Categories"
          value={stats.totalCategories}
          icon={Layers}
          variant="default"
        />
        <StatCard
          label="Total Customers"
          value={stats.totalCustomers}
          icon={Users}
          variant="success"
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          variant="warning"
        />
        <StatCard
          label="Processing"
          value={stats.processingOrders}
          icon={TrendingUp}
          variant="primary"
        />
        <StatCard
          label="Low Stock Items"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* ── Revenue Analytics (with trends) ── */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Revenue Today"
          value={formatCurrency(stats.revenueToday.current)}
          icon={DollarSign}
          variant="success"
          trend={{
            direction: stats.revenueToday.changePercent >= 0 ? "up" : "down",
            value: `${Math.abs(stats.revenueToday.changePercent)}% vs yesterday`,
          }}
        />
        <StatCard
          label="Last 7 Days"
          value={formatCurrency(stats.revenueLast7Days.current)}
          icon={DollarSign}
          variant="primary"
          trend={{
            direction: stats.revenueLast7Days.changePercent >= 0 ? "up" : "down",
            value: `${Math.abs(stats.revenueLast7Days.changePercent)}% vs previous week`,
          }}
        />
        <StatCard
          label="Last 30 Days"
          value={formatCurrency(stats.revenueLast30Days.current)}
          icon={DollarSign}
          variant="warning"
          trend={{
            direction: stats.revenueLast30Days.changePercent >= 0 ? "up" : "down",
            value: `${Math.abs(stats.revenueLast30Days.changePercent)}% vs previous month`,
          }}
        />
      </div>

      {/* ── Charts Row ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DashboardSection title="Revenue (Last 30 Days)">
            <RevenueChart data={stats.dailyRevenue} />
          </DashboardSection>
        </div>
        <div>
          <DashboardSection title="Order Status">
            <OrderStatusChart data={stats.orderStatusBreakdown} />
          </DashboardSection>
        </div>
      </div>

      {/* ── Lists Row 1 ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <DashboardSection
          title="Recent Orders"
          action={
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {stats.recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/50">
              No orders yet
            </p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.recentOrders.map((order) => (
                <li
                  key={order.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="group min-w-0"
                  >
                    <p className="text-sm font-medium group-hover:text-primary">
                      #{order.orderNumber}
                    </p>
                    <p className="truncate text-xs text-base-content/50">
                      {order.userName || order.userEmail}
                    </p>
                    <p className="text-xs text-base-content/40">
                      {formatDate(order.createdAt)}
                    </p>
                  </Link>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatCurrency(order.total)}
                    </span>
                    <Badge
                      variant={
                        order.status === "cancelled"
                          ? "neutral"
                          : order.status === "delivered"
                            ? "success"
                            : order.status === "processing"
                              ? "primary"
                              : "warning"
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        {/* Top Selling Products */}
        <DashboardSection title="Top Selling Products">
          {stats.topSellingProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/50">
              No sales data yet
            </p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.topSellingProducts.map((product) => (
                <li
                  key={product.productId}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/admin/products/${product.productId}`}
                    className="group min-w-0 flex-1"
                  >
                    <p className="truncate text-sm font-medium group-hover:text-primary">
                      {product.productName}
                    </p>
                    <p className="text-xs text-base-content/50">
                      {product.unitsSold} unit{product.unitsSold !== 1 ? "s" : ""} sold
                    </p>
                  </Link>
                  <span className="shrink-0 text-sm font-semibold">
                    {formatCurrency(product.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>

      {/* ── Lists Row 2 ── */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Low Stock Products */}
        <DashboardSection
          title="Low Stock Products"
          description={`Products with less than ${10} units`}
          action={
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </Link>
          }
        >
          {stats.lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/50">
              All products are well stocked
            </p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.lowStockProducts.map((product) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="group flex min-w-0 flex-1 items-center gap-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <AlertTriangle className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium group-hover:text-primary">
                        {product.title}
                      </p>
                      <p className="text-xs text-base-content/50">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </Link>
                  <div className="shrink-0 text-right">
                    <span className="text-sm font-semibold text-error">
                      {product.stock}
                    </span>
                    <span className="text-xs text-base-content/50"> left</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        {/* Recent Customers */}
        <DashboardSection
          title="Recent Customers"
          action={
            <Link href="/admin/users">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          }
        >
          {stats.recentCustomers.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/50">
              No users yet
            </p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.recentCustomers.map((user) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="group flex items-center gap-3"
                  >
                    <Avatar
                      src={user.image}
                      alt={user.name ?? user.email}
                      size="sm"
                    />
                    <div>
                      <p className="text-sm font-medium group-hover:text-primary">
                        {user.name || "No name"}
                      </p>
                      <p className="text-xs text-base-content/50">
                        {user.email}
                      </p>
                    </div>
                  </Link>
                  <span className="shrink-0 text-xs text-base-content/40">
                    {formatDate(user.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>
    </>
  );
}
