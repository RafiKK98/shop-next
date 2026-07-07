import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/format";
import { ROUTES } from "@/constants";
import type { OrderListItem } from "@/services/orders";

interface RecentOrdersProps {
  orders: OrderListItem[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  if (orders.length === 0) return null;

  return (
    <div className="rounded-xl border border-base-200 bg-base-100">
      <div className="flex items-center justify-between border-b border-base-200 px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
          Recent Orders
        </h2>
        <Link
          href={ROUTES.accountOrders}
          className="text-xs font-medium text-primary hover:underline"
        >
          View All
        </Link>
      </div>

      <ul className="divide-y divide-base-200">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={ROUTES.accountOrderDetail(order.id)}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-base-50"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-base-200">
                  <Package className="size-4 text-base-content/50" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">#{order.orderNumber}</p>
                  <p className="text-xs text-base-content/50">
                    {formatDate(order.createdAt)} &middot; {order.itemCount}{" "}
                    {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm font-semibold">
                  {formatCurrency(order.total)}
                </span>
                <span
                  className={`badge badge-sm ${
                    order.status === "cancelled"
                      ? "badge-error"
                      : order.status === "delivered"
                        ? "badge-success"
                        : order.status === "pending"
                          ? "badge-warning"
                          : "badge-ghost"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <ArrowRight className="size-4 text-base-content/30" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
