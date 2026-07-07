import Link from "next/link";
import { ShoppingBag, Package, Heart, MapPin, User, ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants";

const actions = [
  { label: "Continue Shopping", href: ROUTES.products, icon: ShoppingBag },
  { label: "View Orders", href: ROUTES.accountOrders, icon: Package },
  { label: "Manage Wishlist", href: ROUTES.wishlist, icon: Heart },
  { label: "Manage Addresses", href: ROUTES.accountAddresses, icon: MapPin },
  { label: "Edit Profile", href: ROUTES.accountProfile, icon: User },
];

export function QuickActions() {
  return (
    <div className="rounded-xl border border-base-200 bg-base-100 p-4">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-base-content/50">
        Quick Actions
      </h2>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center justify-between rounded-lg border border-base-200 px-3 py-2.5 text-sm transition-colors hover:border-base-300 hover:bg-base-50"
          >
            <span className="flex items-center gap-2">
              <action.icon className="size-4 text-base-content/50" />
              {action.label}
            </span>
            <ArrowRight className="size-3.5 text-base-content/30" />
          </Link>
        ))}
      </div>
    </div>
  );
}
