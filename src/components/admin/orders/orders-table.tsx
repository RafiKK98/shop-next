"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronUp,
  ChevronDown,
  Search,
  Eye,
  ShoppingBag,
  Calendar,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_LABEL,
  type OrderListItem,
} from "@/services/admin/order-types";
import { Badge, Button } from "@/components/ui";

interface OrdersTableProps {
  orders: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  statusFilter: string;
  paymentFilter: string;
}

const statusBadgeVariant: Record<string, string> = {
  pending: "badge-warning",
  paid: "badge-info",
  processing: "badge-info",
  shipped: "badge-primary",
  delivered: "badge-success",
  cancelled: "badge-error",
};

const paymentBadgeVariant: Record<string, string> = {
  pending: "badge-warning",
  completed: "badge-success",
  failed: "badge-error",
  refunded: "badge-info",
};

const ORDER_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  ...Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
];

const PAYMENT_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Payments" },
  ...Object.entries(PAYMENT_STATUS_LABEL).map(([value, label]) => ({
    value,
    label,
  })),
];

export function OrdersTable({
  orders,
  total,
  page,
  pageSize,
  totalPages,
  search,
  sort,
  order,
  statusFilter,
  paymentFilter,
}: OrdersTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().split("T")[0];

  const createUrl = (params: Record<string, string>) => {
    const sp = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(params)) {
      if (value) sp.set(key, value);
      else sp.delete(key);
    }
    return `/admin/orders?${sp.toString()}`;
  };

  const navigate = (url: string) => {
    router.push(url as any);
  };

  const toggleSort = (column: string) => {
    const newOrder = sort === column && order === "asc" ? "desc" : "asc";
    navigate(createUrl({ sort: column, order: newOrder, page: "1" }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const sp = new URLSearchParams(searchParams);
    if (value) sp.set("search", value);
    else sp.delete("search");
    sp.set("page", "1");
    navigate(`/admin/orders?${sp.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    navigate(createUrl({ [key]: value, page: "1" }));
  };

  const handleDateChange = (key: string, value: string) => {
    navigate(createUrl({ [key]: value, page: "1" }));
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
          <input
            type="text"
            defaultValue={search}
            onChange={handleSearch}
            placeholder="Search orders..."
            className="input input-sm w-full pl-9"
            aria-label="Search orders"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="select select-sm w-40"
          aria-label="Filter by order status"
        >
          {ORDER_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={paymentFilter}
          onChange={(e) => handleFilterChange("paymentStatus", e.target.value)}
          className="select select-sm w-40"
          aria-label="Filter by payment status"
        >
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-base-content/40" />
            <input
              type="date"
              defaultValue={searchParams.get("dateFrom") ?? ""}
              onChange={(e) => handleDateChange("dateFrom", e.target.value)}
              className="input input-sm w-36 pl-8"
              aria-label="From date"
              max={today}
            />
          </div>
          <span className="text-xs text-base-content/40">to</span>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-base-content/40" />
            <input
              type="date"
              defaultValue={searchParams.get("dateTo") ?? ""}
              onChange={(e) => handleDateChange("dateTo", e.target.value)}
              className="input input-sm w-36 pl-8"
              aria-label="To date"
              max={today}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-base-200 text-xs uppercase tracking-wider text-base-content/50">
              <th>Order</th>
              <th>Customer</th>
              <th className="hidden sm:table-cell">
                <button
                  type="button"
                  onClick={() => toggleSort("createdAt")}
                  className="flex items-center gap-1"
                >
                  Date
                  {sort === "createdAt" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("status")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sort === "status" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden md:table-cell">Payment</th>
              <th>
                <button
                  type="button"
                  onClick={() => toggleSort("total")}
                  className="flex items-center gap-1"
                >
                  Total
                  {sort === "total" &&
                    (order === "asc" ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    ))}
                </button>
              </th>
              <th className="hidden lg:table-cell">Items</th>
              <th className="w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-16 text-center text-sm text-base-content/40"
                >
                  {search || statusFilter || paymentFilter
                    ? "No orders match your filters"
                    : "No orders yet"}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover">
                  <td>
                    <span className="font-mono text-xs font-medium">
                      #{order.id.slice(0, 8)}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm font-medium">
                      {order.customerName ?? (
                        <span className="text-base-content/30">Guest</span>
                      )}
                    </div>
                    {order.customerEmail && (
                      <p className="text-xs text-base-content/40">
                        {order.customerEmail}
                      </p>
                    )}
                  </td>
                  <td className="hidden text-xs text-base-content/50 sm:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td>
                    <Badge
                      variant={
                        statusBadgeVariant[order.status] as any
                      }
                      size="xs"
                    >
                      {ORDER_STATUS_LABEL[order.status]}
                    </Badge>
                  </td>
                  <td className="hidden md:table-cell">
                    <Badge
                      variant={
                        paymentBadgeVariant[order.paymentStatus] as any
                      }
                      size="xs"
                    >
                      {PAYMENT_STATUS_LABEL[order.paymentStatus]}
                    </Badge>
                  </td>
                  <td className="text-sm font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="hidden text-sm text-base-content/50 lg:table-cell">
                    {order.itemCount}
                  </td>
                  <td>
                    <div className="flex items-center justify-end">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label="View order details"
                      >
                        <Eye className="size-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-base-content/50">
            Page {page} of {totalPages} ({total} orders)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                navigate(createUrl({ page: String(page - 1) }))
              }
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                navigate(createUrl({ page: String(page + 1) }))
              }
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
