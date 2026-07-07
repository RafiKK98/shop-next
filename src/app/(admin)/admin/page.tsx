import { requireAdmin } from "@/lib/auth/guards";
import { getAdminDashboardStats } from "@/lib/admin/dashboard";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DashboardSection } from "@/components/admin/dashboard-section";
import { Badge, Button } from "@/components/ui";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  AlertTriangle,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Dashboard | Admin | ${SITE.name}`,
};

export default async function AdminDashboardPage() {
  await requireAdmin();
  const stats = await getAdminDashboardStats();

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={ShoppingBag}
          variant="primary"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          variant="success"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={DollarSign}
          variant="warning"
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          variant="default"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
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
            <p className="py-8 text-center text-sm text-base-content/50">No orders yet</p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.recentOrders.map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">#{order.orderNumber}</p>
                    <p className="truncate text-xs text-base-content/50">
                      {order.userName || order.userEmail}
                    </p>
                    <p className="text-xs text-base-content/40">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold">
                      {formatCurrency(order.total)}
                    </span>
                    <Badge
                      variant={
                        order.status === "cancelled"
                          ? "neutral"
                          : order.status === "delivered"
                            ? "primary"
                            : "secondary"
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

        <DashboardSection
          title="Low Stock Products"
          description="Products with less than 10 units in stock"
          action={
            <Link href="/admin/products">
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </Link>
          }
        >
          {stats.lowStockProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-base-content/50">All products are well stocked</p>
          ) : (
            <ul className="divide-y divide-base-200">
              {stats.lowStockProducts.map((product) => (
                <li key={product.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                      <AlertTriangle className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{product.title}</p>
                      <p className="text-xs text-base-content/50">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className="text-sm font-semibold text-error">{product.stock}</span>
                    <span className="text-xs text-base-content/50">
                      {" "}
                      left
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>

        <div className="lg:col-span-2">
          <DashboardSection
            title="Recent Users"
            action={
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            }
          >
            {stats.recentUsers.length === 0 ? (
              <p className="py-8 text-center text-sm text-base-content/50">No users yet</p>
            ) : (
              <ul className="divide-y divide-base-200">
                {stats.recentUsers.map((user) => (
                  <li key={user.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-full bg-base-200 text-xs font-medium text-base-content/60">
                        {user.name
                          ? user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                          : user.email.slice(0, 2).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{user.name || "No name"}</p>
                        <p className="text-xs text-base-content/50">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant={user.role === "admin" ? "primary" : "ghost"}>
                        {user.role}
                      </Badge>
                      <span className="text-xs text-base-content/40">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </DashboardSection>
        </div>
      </div>
    </>
  );
}
