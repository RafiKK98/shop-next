import { Suspense } from "react";
import {
  ShoppingBag,
  Package,
  DollarSign,
  Calendar,
} from "lucide-react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { StatCard } from "@/components/admin/stat-card";
import { OrdersTable } from "@/components/admin/orders";
import { getAdminOrders, getOrderStats } from "@/services/admin/orders";
import type { OrderStatus, PaymentStatus } from "@/services/admin/order-types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Orders | Admin | ${SITE.name}`,
};

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const pageSize = Number(sp.pageSize) || 20;
  const search = (sp.search as string) ?? "";
  const sort = (sp.sort as string) ?? "createdAt";
  const order = (sp.order as "asc" | "desc") ?? "desc";
  const statusFilter = (sp.status as OrderStatus | "") ?? "";
  const paymentFilter = (sp.paymentStatus as PaymentStatus | "") ?? "";
  const dateFrom = (sp.dateFrom as string) ?? "";
  const dateTo = (sp.dateTo as string) ?? "";

  const [result, stats] = await Promise.all([
    getAdminOrders({
      page,
      pageSize,
      search,
      sort,
      order,
      status: statusFilter,
      paymentStatus: paymentFilter,
      dateFrom,
      dateTo,
    }),
    getOrderStats(),
  ]);

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description={`${result.total} order${result.total === 1 ? "" : "s"} total`}
      />

      {/* Summary Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending Orders"
          value={stats.pending}
          icon={ShoppingBag}
          variant="warning"
        />
        <StatCard
          label="Processing"
          value={stats.processing}
          icon={Package}
          variant="primary"
        />
        <StatCard
          label="Revenue"
          value={`$${stats.revenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
          variant="success"
        />
        <StatCard
          label="Orders Today"
          value={stats.ordersToday}
          icon={Calendar}
        />
      </div>

      <Suspense fallback={<div className="h-96 animate-pulse rounded-xl bg-base-200" />}>
        <OrdersTable
          orders={result.items}
          total={result.total}
          page={result.page}
          pageSize={result.pageSize}
          totalPages={result.totalPages}
          search={search}
          sort={sort}
          order={order}
          statusFilter={statusFilter}
          paymentFilter={paymentFilter}
        />
      </Suspense>
    </>
  );
}
