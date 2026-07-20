"use client";

import { ROUTES } from "@/constants";
import { cn } from "@/utils/cn";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.accountDashboard, icon: LayoutDashboard },
  { label: "Profile", href: ROUTES.accountProfile, icon: User },
  { label: "Orders", href: ROUTES.accountOrders, icon: Package },
  { label: "Addresses", href: ROUTES.accountAddresses, icon: MapPin },
  { label: "Wishlist", href: ROUTES.wishlist, icon: Heart },
] as const;

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 md:w-56">
      <nav aria-label="Account navigation">
        <ul className="menu menu-md rounded-box gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== ROUTES.accountDashboard &&
                pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-base-content/60 hover:bg-base-200 hover:text-base-content",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            );
          })}

          <li className="mt-4 border-t border-base-200 pt-4">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
              >
                <LogOut className="size-4 shrink-0" />
                Sign Out
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export function AccountMobileNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account navigation" className="md:hidden">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== ROUTES.accountDashboard &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-base-content/50 hover:bg-base-200",
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
