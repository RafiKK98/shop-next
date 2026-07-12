import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { UserEditForm } from "@/components/admin/users";
import { Avatar, Badge, Button } from "@/components/ui";
import { BadgeProps } from "@/components/ui/feedback";
import { SITE } from "@/constants";
import { auth } from "@/lib/auth/config";
import {
  USER_ROLE_LABEL,
  USER_STATUS_LABEL,
} from "@/services/admin/user-types";
import {
  getAdminUserById,
  getUserRecentOrders,
  getUserRecentWishlistItems,
} from "@/services/admin/users";
import { formatCurrency, formatDate } from "@/utils/format";
import {
  ChevronLeft,
  DollarSign,
  Heart,
  MapPin,
  ShoppingBag,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `User | Admin | ${SITE.name}`,
  };
}

const statusBadgeVariant: Record<string, BadgeProps["variant"]> = {
  active: "success",
  suspended: "warning",
  disabled: "error",
};

const roleBadgeVariant: Record<string, BadgeProps["variant"]> = {
  customer: "ghost",
  admin: "primary",
};

export default async function AdminUserDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { userId } = await params;
  const sp = await searchParams;
  const isEditing = sp.edit === "true";

  const [user, session] = await Promise.all([getAdminUserById(userId), auth()]);

  if (!user) notFound();

  const isSelf = session?.user?.id === userId;

  // Edit mode
  if (isEditing) {
    return (
      <>
        <div className="mb-4">
          <AdminBreadcrumbs />
        </div>

        <AdminPageHeader
          title={`Edit: ${user.name ?? "User"}`}
          actions={
            <Link href={`/admin/users/${userId}`}>
              <Button variant="outline" size="sm">
                <ChevronLeft className="mr-1 size-4" />
                Cancel
              </Button>
            </Link>
          }
        />

        <div className="mx-auto max-w-2xl">
          <UserEditForm
            userId={user.id}
            currentName={user.name}
            currentEmail={user.email}
            currentPhone={user.phone}
            currentRole={user.role}
            currentStatus={user.status}
            isSelf={isSelf}
          />
        </div>
      </>
    );
  }

  // Detail mode — fetch recent data
  const [recentOrders, recentWishlist] = await Promise.all([
    getUserRecentOrders(userId),
    getUserRecentWishlistItems(userId),
  ]);

  return (
    <>
      <div className="mb-4">
        <AdminBreadcrumbs />
      </div>

      <AdminPageHeader
        title={user.name ?? "User"}
        description={user.email}
        actions={
          <Link href={`/admin/users/${userId}?edit=true`}>
            <Button size="sm">Edit User</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Commerce Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-base-200 bg-base-100 p-4">
              <div className="flex items-center gap-2 text-base-content/50">
                <ShoppingBag className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Orders
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold">{user.orderCount}</p>
            </div>
            <div className="rounded-xl border border-base-200 bg-base-100 p-4">
              <div className="flex items-center gap-2 text-base-content/50">
                <DollarSign className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Total Spent
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold">
                {formatCurrency(user.totalSpent)}
              </p>
            </div>
            <div className="rounded-xl border border-base-200 bg-base-100 p-4">
              <div className="flex items-center gap-2 text-base-content/50">
                <Heart className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  Wishlist
                </span>
              </div>
              <p className="mt-2 text-2xl font-bold">{user.wishlistCount}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center justify-between border-b border-base-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-base-content/50" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                  Recent Orders
                </h2>
              </div>
              {user.orderCount > 0 && (
                <Link
                  href={`/admin/orders?search=${user.email}`}
                  className="text-xs text-primary hover:underline"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="divide-y divide-base-200">
              {recentOrders.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-base-content/40">
                  No orders yet
                </p>
              ) : (
                recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-base-200/50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-xs text-base-content/40">
                        {order.itemCount} item{order.itemCount === 1 ? "" : "s"}{" "}
                        · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {formatCurrency(order.total)}
                      </p>
                      <Badge
                        variant={statusBadgeVariant[order.status] ?? "ghost"}
                        size="xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Wishlist */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <Heart className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Wishlist Items
              </h2>
            </div>
            <div className="divide-y divide-base-200">
              {recentWishlist.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-base-content/40">
                  No wishlist items
                </p>
              ) : (
                recentWishlist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        Product ID: {item.productId.slice(0, 8)}
                      </p>
                      <p className="text-xs text-base-content/40">
                        Added {formatDate(item.createdAt)}
                      </p>
                    </div>
                    <Link
                      href={`/products/${item.productId}`}
                      className="text-xs text-primary hover:underline"
                    >
                      View product
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <User className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Profile
              </h2>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src={user.image ?? undefined}
                  alt={user.name ?? user.email}
                  size="lg"
                />
                <div>
                  <p className="text-sm font-medium">
                    {user.name ?? (
                      <span className="text-base-content/30">Unnamed</span>
                    )}
                  </p>
                  <p className="text-xs text-base-content/40">{user.email}</p>
                </div>
              </div>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-base-content/50">Role</dt>
                  <dd>
                    <Badge variant={roleBadgeVariant[user.role]} size="xs">
                      {USER_ROLE_LABEL[user.role]}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-base-content/50">Status</dt>
                  <dd>
                    <Badge variant={statusBadgeVariant[user.status]} size="xs">
                      {USER_STATUS_LABEL[user.status]}
                    </Badge>
                  </dd>
                </div>
                {user.phone && (
                  <div className="flex justify-between">
                    <dt className="text-base-content/50">Phone</dt>
                    <dd className="text-base-content/70">{user.phone}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-base-content/50">Verified</dt>
                  <dd className="text-base-content/70">
                    {user.emailVerified ? "Yes" : "No"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-base-content/50">Member since</dt>
                  <dd className="text-base-content/70">
                    {formatDate(user.createdAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-base-200 bg-base-100">
            <div className="flex items-center gap-2 border-b border-base-200 px-5 py-4">
              <MapPin className="size-4 text-base-content/50" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-base-content/50">
                Default Address
              </h2>
            </div>
            <div className="px-5 py-4">
              {user.defaultAddress ? (
                <div className="space-y-1 text-sm text-base-content/70">
                  {user.defaultAddress.fullName && (
                    <p className="font-medium text-base-content">
                      {user.defaultAddress.fullName}
                    </p>
                  )}
                  <p>{user.defaultAddress.street}</p>
                  <p>
                    {user.defaultAddress.city}
                    {user.defaultAddress.state &&
                      `, ${user.defaultAddress.state}`}
                    {user.defaultAddress.postalCode &&
                      ` ${user.defaultAddress.postalCode}`}
                  </p>
                  <p>{user.defaultAddress.country}</p>
                </div>
              ) : (
                <p className="text-sm text-base-content/40">
                  No address on file
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
