import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Package, User, MapPin, CreditCard, Clock } from "lucide-react";
import { SITE } from "@/constants";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { Badge, Button } from "@/components/ui";
import { OrderStatusSelect, PaymentStatusSelect } from "@/components/admin/orders";
import { getAdminOrderById } from "@/services/admin/orders";
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from "@/services/admin/order-types";
import { formatCurrency, formatDate } from "@/utils/format";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { orderId } = await params;
  return {
    title: `Order #${orderId.slice(0, 8)} | Admin | ${SITE.name}`,
  };
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

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { orderId } = await params;
  const order = await getAdminOrderById(orderId);

  if (!order) notFound();

  return (
    <>
      <div className="mb-4">
        <AdminBreadcrumbs />
      </div>

      <AdminPageHeader
        title={`Order #${order.id.slice(0, 8)}`}
        actions={
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ChevronLeft className="mr-1 size-4" />
              Back to Orders
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Order Items */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <Package className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Order Items
              </h2>
            </div>
            <div className="divide-y divide-base-200">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-5 py-4"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-base-200">
                    {item.productImage ? (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="size-full object-cover"
                      />
                    ) : (
                      <Package className="size-6 text-base-content/30" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.productName}</p>
                    <p className="text-xs text-base-content/40">
                      {formatCurrency(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {formatCurrency(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-base-200 px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-base-content/50">Subtotal</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <Clock className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Timeline
              </h2>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-success/20">
                  <div className="size-2 rounded-full bg-success" />
                </div>
                <div>
                  <p className="text-sm font-medium">Order placed</p>
                  <p className="text-xs text-base-content/40">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <div className="size-2 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Last updated</p>
                  <p className="text-xs text-base-content/40">
                    {formatDate(order.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-base-300">
                  <div className="size-2 rounded-full bg-base-content/30" />
                </div>
                <div>
                  <p className="text-sm font-medium">Current status</p>
                  <Badge
                    variant={statusBadgeVariant[order.status] as any}
                    size="sm"
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <CreditCard className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Status
              </h2>
            </div>
            <div className="space-y-4 px-5 py-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-base-content/50">
                  Order Status
                </label>
                <OrderStatusSelect
                  orderId={order.id}
                  currentStatus={order.status}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-base-content/50">
                  Payment Status
                </label>
                <PaymentStatusSelect
                  orderId={order.id}
                  currentStatus={order.paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <User className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Customer
              </h2>
            </div>
            <div className="space-y-2 px-5 py-4">
              {order.customer ? (
                <>
                  <p className="text-sm font-medium">{order.customer.name}</p>
                  <p className="text-xs text-base-content/40">
                    {order.customer.email}
                  </p>
                  {order.customer.phone && (
                    <p className="text-xs text-base-content/40">
                      {order.customer.phone}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-base-content/40">Guest checkout</p>
              )}
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <MapPin className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Shipping Address
              </h2>
            </div>
            <div className="space-y-1 px-5 py-4">
              {order.shippingAddress ? (
                <>
                  {order.shippingAddress.fullName && (
                    <p className="text-sm font-medium">
                      {order.shippingAddress.fullName}
                    </p>
                  )}
                  <p className="text-sm">{order.shippingAddress.street}</p>
                  {order.shippingAddress.addressLine2 && (
                    <p className="text-sm">
                      {order.shippingAddress.addressLine2}
                    </p>
                  )}
                  <p className="text-sm">
                    {order.shippingAddress.city}
                    {order.shippingAddress.state &&
                      `, ${order.shippingAddress.state}`}
                    {order.shippingAddress.postalCode &&
                      ` ${order.shippingAddress.postalCode}`}
                  </p>
                  <p className="text-sm">{order.shippingAddress.country}</p>
                  {order.shippingAddress.phone && (
                    <p className="mt-2 text-xs text-base-content/40">
                      {order.shippingAddress.phone}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-base-content/40">
                  No shipping address on file
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
