"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Search, Heart, ShoppingCart, User } from "lucide-react";
import { NAVIGATION } from "@/constants/navigation";
import { ROUTES } from "@/constants";
import { IconButton } from "@/components/ui";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
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
                    href={ROUTES.dashboardWishlist as unknown as any}
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
