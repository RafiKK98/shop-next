import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/services/orders";
import { Container, Section, Breadcrumb, Button } from "@/components/ui";
import { StatusTimeline } from "@/components/orders";
import { CancelOrderButton } from "./cancel-button";
import { formatCurrency, formatDate } from "@/utils/format";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Order Details | ${SITE.name}`,
};

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderId } = await params;

  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/orders");

  const order = await getOrderById(session.user.id, orderId);
  if (!order) notFound();

  const subtotal = order.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );
  const total = parseFloat(order.total);
  const shipping = total >= 100 ? 0 : 9.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));

  return (
    <Section>
      <Container className="max-w-3xl">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "My Orders", href: "/account/orders" },
            { label: `Order #${order.orderNumber}` },
          ]}
        />

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Order #{order.orderNumber}
            </h1>
            <p className="mt-1 text-sm text-base-content/60">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          {order.status === "pending" && (
            <CancelOrderButton orderId={order.id} />
          )}
        </div>

        <div className="space-y-4">
          <StatusTimeline status={order.status} />

          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="border-b border-base-200 px-4 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Items ({order.items.length})
              </h3>
            </div>

            <ul className="divide-y divide-base-200">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-4 py-3">
                  {item.productImage ? (
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-base-200">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/20">
                      <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{item.productName}</p>
                      <p className="text-xs text-base-content/50">
                        Qty: {item.quantity} &times; {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">
                      {formatCurrency(parseFloat(item.price) * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-base-200 bg-base-100 p-4 space-y-2 text-sm">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-base-content/50">
              Order Summary
            </h3>
            <div className="flex justify-between">
              <span className="text-base-content/60">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Shipping</span>
              <span>
                {shipping === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatCurrency(shipping)
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Estimated Tax</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/60">Payment Status</span>
              <span>
                <span
                  className={`badge badge-sm ${
                    order.paymentStatus === "completed"
                      ? "badge-success"
                      : order.paymentStatus === "failed"
                        ? "badge-error"
                        : "badge-ghost"
                  }`}
                >
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </span>
              </span>
            </div>
            <div className="border-t border-base-200 pt-2">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-base-200 bg-base-100 p-4">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-base-content/50">
              Billing Information
            </h3>
            <p className="text-sm text-base-content/50">
              Billing details will be available after payment integration.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Link href="/account/orders">
              <Button variant="outline">&larr; Back to Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
