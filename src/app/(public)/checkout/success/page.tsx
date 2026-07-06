import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { Container, Section, Breadcrumb, Button } from "@/components/ui";
import { formatCurrency } from "@/utils/format";
import { SITE } from "@/constants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Order Confirmed | ${SITE.name}`,
};

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { orderId } = await searchParams;
  if (!orderId) redirect("/");

  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/checkout");

  const order = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
    .then((r) => r[0] ?? null);

  if (!order) redirect("/");

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return (
    <Section>
      <Container className="max-w-2xl">
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout", href: "/checkout" },
            { label: "Order Confirmed" },
          ]}
        />

        <div className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-success/10">
            <svg
              className="size-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Order Confirmed!
          </h1>
          <p className="mt-2 text-base-content/60">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          <p className="mt-4 text-sm text-base-content/40">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="border-b border-base-200 px-4 py-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
              </h3>
            </div>

            <ul className="divide-y divide-base-200">
              {items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.productName}
                    </p>
                    <p className="text-xs text-base-content/50">
                      Qty: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium">
                    {formatCurrency(parseFloat(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="border-t border-base-200 px-4 py-3">
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
