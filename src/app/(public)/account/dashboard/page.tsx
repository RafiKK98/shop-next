import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, addresses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserOrders } from "@/services/orders";
import { getCartCount } from "@/lib/cart";
import { getWishlistCount } from "@/lib/wishlist";
import { WelcomeSection } from "@/components/dashboard/welcome-section";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { DefaultAddress } from "@/components/dashboard/default-address";
import { RecentlyViewed } from "@/components/dashboard/recently-viewed";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { AccountCompletion } from "@/components/dashboard/account-completion";
import { createMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({ title: "Dashboard", description: "Your account dashboard", noIndex: true });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account/dashboard");

  const [allOrders, cartCount, wishlistCount, userAddresses, user] = await Promise.all([
    getUserOrders(session.user.id),
    getCartCount(session.user.id),
    getWishlistCount(session.user.id),
    db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, session.user.id))
      .orderBy(addresses.isDefault),
    db
      .select({ name: users.name, phone: users.phone, createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, session.user.id))
      .then((r) => r[0]),
  ]);

  const pendingOrders = allOrders.filter((o) => o.status === "pending").length;
  const recentOrders = allOrders.slice(0, 5);
  const defaultAddress = userAddresses.find((a) => a.isDefault) ?? null;
  const hasPhone = !!user?.phone;
  const hasName = !!user?.name;
  const hasAddress = userAddresses.length > 0;

  return (
    <div className="space-y-6">
      <WelcomeSection
        name={user?.name}
        email={session.user.email}
        image={session.user.image}
        createdAt={user?.createdAt}
        totalOrders={allOrders.length}
      />

      <StatsCards
        totalOrders={allOrders.length}
        pendingOrders={pendingOrders}
        wishlistCount={wishlistCount}
        cartCount={cartCount}
      />

      <RecentOrders orders={recentOrders} />

      <DefaultAddress address={defaultAddress as any} />

      <RecentlyViewed />

      <AccountCompletion
        hasName={hasName}
        hasPhone={hasPhone}
        hasAddress={hasAddress}
      />

      <QuickActions />
    </div>
  );
}
