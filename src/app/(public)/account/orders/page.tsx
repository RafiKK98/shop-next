import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserOrders } from "@/services/orders";
import { Container, Section, Breadcrumb, Button, EmptyState } from "@/components/ui";
import { StatusTimeline } from "@/components/orders";
import { formatCurrency, formatDate } from "@/utils/format";
import { ShoppingBag } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "My Orders", description: "View your order history", noIndex: true });
}

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/orders");

  const orders = await getUserOrders(session.user.id);

  return (
    <Section>
      <Container>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Home", href: "/" },
            { label: "My Orders" },
          ]}
        />

        <h1 className="mb-8 text-2xl font-bold tracking-tight md:text-3xl">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-16" />}
            title="No orders yet"
            description="You haven't placed any orders yet. Start shopping to see your orders here."
            action={
              <Link href="/">
                <Button variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block rounded-xl border border-base-200 bg-base-100 transition-all hover:border-base-300 hover:shadow-sm"
              >
                <div className="flex items-center gap-4 p-4">
                  {order.thumbnail ? (
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-base-200">
                      <img
                        src={order.thumbnail}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-base-200 text-base-content/20">
                      <ShoppingBag className="size-6" />
                    </div>
                  )}

                  <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="font-medium">Order #{order.orderNumber}</p>
                      <p className="text-xs text-base-content/50">
                        {formatDate(order.createdAt)} &middot; {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:shrink-0">
                      <span className="text-sm font-semibold">
                        {formatCurrency(order.total)}
                      </span>
                      <span
                        className={`badge badge-sm ${
                          order.status === "cancelled"
                            ? "badge-error"
                            : order.status === "delivered"
                              ? "badge-success"
                              : "badge-ghost"
                        }`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
