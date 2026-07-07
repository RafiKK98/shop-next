import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { ROUTES, SITE } from "@/constants";
import { getUserOrders } from "@/services/orders";
import { db } from "@/db";
import { addresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Button } from "@/components/ui";
import {
  Package,
  MapPin,
  User,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: `Account | ${SITE.name}`,
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const [orders, userAddresses] = await Promise.all([
    getUserOrders(session.user.id),
    db
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, session.user.id))
      .then((r) => r.length),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Welcome, {session.user.name || "there"}
        </h1>
        <p className="mt-1 text-sm text-base-content/60">{session.user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href={ROUTES.accountOrders}
          className="rounded-xl border border-base-200 bg-base-100 p-4 transition-all hover:border-base-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="size-5" />
              </span>
              <div>
                <p className="font-medium">Orders</p>
                <p className="text-sm text-base-content/50">
                  {orders.length} {orders.length === 1 ? "order" : "orders"}
                </p>
              </div>
            </div>
            <ArrowRight className="size-4 text-base-content/30" />
          </div>
        </Link>

        <Link
          href={ROUTES.accountAddresses}
          className="rounded-xl border border-base-200 bg-base-100 p-4 transition-all hover:border-base-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <MapPin className="size-5" />
              </span>
              <div>
                <p className="font-medium">Addresses</p>
                <p className="text-sm text-base-content/50">
                  {userAddresses} saved
                </p>
              </div>
            </div>
            <ArrowRight className="size-4 text-base-content/30" />
          </div>
        </Link>

        <Link
          href={ROUTES.accountProfile}
          className="rounded-xl border border-base-200 bg-base-100 p-4 transition-all hover:border-base-300 hover:shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <User className="size-5" />
              </span>
              <div>
                <p className="font-medium">Profile</p>
                <p className="text-sm text-base-content/50">Edit your info</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-base-content/30" />
          </div>
        </Link>
      </div>
    </div>
  );
}
