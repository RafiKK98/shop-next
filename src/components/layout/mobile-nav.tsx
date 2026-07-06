"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Heart, ShoppingCart, User, LayoutDashboard, Package, LogOut } from "lucide-react";
import { NAVIGATION } from "@/constants/navigation";
import { ROUTES } from "@/constants";
import { IconButton } from "@/components/ui";
import { ThemeToggle } from "./theme-toggle";
import { logoutAction } from "@/actions/auth";
import type { UserRole } from "@/types/auth";

interface MobileNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </IconButton>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 right-0 w-72 max-w-full bg-base-100 shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-base-200">
              <span className="text-lg font-bold">Menu</span>
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </IconButton>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
              <ul className="flex flex-col gap-2">
                {NAVIGATION.main.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href as unknown as any}
                      className="block py-2 text-base font-medium hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <hr className="my-4 border-base-200" />

              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-base-300 text-sm font-medium">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-base-content/60 truncate">{user.email}</p>
                    </div>
                  </div>
                  <ul className="flex flex-col gap-2">
                    <li>
                      <Link
                        href={ROUTES.dashboard as unknown as any}
                        className="flex items-center gap-3 py-2 text-base"
                        onClick={() => setOpen(false)}
                      >
                        <LayoutDashboard size={18} />
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link
                        href={ROUTES.dashboardOrders as unknown as any}
                        className="flex items-center gap-3 py-2 text-base"
                        onClick={() => setOpen(false)}
                      >
                        <Package size={18} />
                        Orders
                      </Link>
                    </li>
                  </ul>
                  <hr className="my-4 border-base-200" />
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 py-2 text-base"
                      onClick={() => setOpen(false)}
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </form>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link
                      href={ROUTES.login as unknown as any}
                      className="flex items-center gap-3 py-2 text-base"
                      onClick={() => setOpen(false)}
                    >
                      <User size={18} />
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={ROUTES.register as unknown as any}
                      className="flex items-center gap-3 py-2 text-base font-medium text-primary"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </ul>
              )}

              <hr className="my-4 border-base-200" />

              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href={ROUTES.search as unknown as any}
                    className="flex items-center gap-3 py-2 text-base"
                    onClick={() => setOpen(false)}
                  >
                    <Search size={18} />
                    Search
                  </Link>
                </li>
                <li>
                  <Link
                      href={ROUTES.wishlist as unknown as any}
                    className="flex items-center gap-3 py-2 text-base"
                    onClick={() => setOpen(false)}
                  >
                    <Heart size={18} />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    href={ROUTES.cart as unknown as any}
                    className="flex items-center gap-3 py-2 text-base"
                    onClick={() => setOpen(false)}
                  >
                    <ShoppingCart size={18} />
                    Cart
                  </Link>
                </li>
              </ul>

              <hr className="my-4 border-base-200" />

              <div className="flex items-center gap-3 py-2">
                <span className="text-base">Theme</span>
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
