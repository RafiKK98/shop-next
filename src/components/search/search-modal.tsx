"use client";

import { ROUTES } from "@/constants";
import {
  CreditCard,
  FolderOpen,
  Heart,
  HelpCircle,
  Home,
  Info,
  LayoutDashboard,
  LogIn,
  Mail,
  Package,
  Search,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Sliders,
  Tag,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchLink {
  label: string;
  href: string;
  group: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
  requiresGuest?: boolean;
  requiresAdmin?: boolean;
}

const SEARCH_LINKS: SearchLink[] = [
  {
    label: "Home",
    href: ROUTES.home,
    group: "Pages",
    icon: <Home size={18} />,
  },
  {
    label: "Products",
    href: ROUTES.products,
    group: "Pages",
    icon: <Package size={18} />,
  },
  {
    label: "Categories",
    href: ROUTES.categories,
    group: "Pages",
    icon: <FolderOpen size={18} />,
  },
  { label: "About", href: "/about", group: "Pages", icon: <Info size={18} /> },
  {
    label: "FAQ",
    href: "/faq",
    group: "Pages",
    icon: <HelpCircle size={18} />,
  },
  {
    label: "Contact",
    href: "/contact",
    group: "Pages",
    icon: <Mail size={18} />,
  },

  {
    label: "Sign In",
    href: ROUTES.login,
    group: "Auth",
    icon: <LogIn size={18} />,
    requiresGuest: true,
  },
  {
    label: "Create Account",
    href: ROUTES.register,
    group: "Auth",
    icon: <UserPlus size={18} />,
    requiresGuest: true,
  },

  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    group: "Account",
    icon: <LayoutDashboard size={18} />,
    requiresAuth: true,
  },
  {
    label: "Orders",
    href: ROUTES.dashboardOrders,
    group: "Account",
    icon: <ShoppingBag size={18} />,
    requiresAuth: true,
  },
  {
    label: "Wishlist",
    href: ROUTES.wishlist,
    group: "Account",
    icon: <Heart size={18} />,
    requiresAuth: true,
  },
  {
    label: "Cart",
    href: ROUTES.cart,
    group: "Account",
    icon: <ShoppingCart size={18} />,
  },
  {
    label: "Checkout",
    href: ROUTES.checkout,
    group: "Account",
    icon: <CreditCard size={18} />,
  },

  {
    label: "Admin Panel",
    href: ROUTES.admin,
    group: "Admin",
    icon: <Shield size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Products",
    href: ROUTES.adminProducts,
    group: "Admin",
    icon: <Package size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Categories",
    href: ROUTES.adminCategories,
    group: "Admin",
    icon: <FolderOpen size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Orders",
    href: ROUTES.adminOrders,
    group: "Admin",
    icon: <ShoppingBag size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Users",
    href: ROUTES.adminUsers,
    group: "Admin",
    icon: <Users size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Coupons",
    href: ROUTES.adminCoupons,
    group: "Admin",
    icon: <Tag size={18} />,
    requiresAdmin: true,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    group: "Admin",
    icon: <Sliders size={18} />,
    requiresAdmin: true,
  },
];

interface SearchModalProps {
  onClose: () => void;
  userRole: string | null;
}

export function SearchModal({ onClose, userRole }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const filtered = SEARCH_LINKS.filter((link) => {
    if (link.requiresAdmin && userRole !== "admin") return false;
    if (link.requiresAuth && !userRole) return false;
    if (link.requiresGuest && userRole) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      link.label.toLowerCase().includes(q) ||
      link.href.toLowerCase().includes(q)
    );
  });

  const groups = [...new Set(filtered.map((l) => l.group))];

  const handleNavigate = useCallback(
    (href: string) => {
      router.push(href as never);
      onClose();
    },
    [router, onClose],
  );

  if (!open) return null;

  return (
    <div
      className="fixed h-screen inset-0 z-50 flex items-start justify-center bg-black/50 pt-12 sm:pt-24"
      onClick={onClose}
    >
      <div
        className="mx-4 w-full max-w-lg rounded-xl border border-base-300 bg-base-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-base-200 px-4 py-3">
          <Search size={20} className="text-base-content/40 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages..."
            className="w-full bg-transparent text-base outline-none placeholder:text-base-content/40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd className="hidden shrink-0 rounded-md border border-base-300 px-1.5 text-xs text-base-content/40 sm:inline-block">
            ESC
          </kbd>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-square shrink-0"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center">
              <Search size={32} className="text-base-content/20" />
              <p className="text-sm text-base-content/50">No pages found</p>
              <p className="text-xs text-base-content/30">
                Try a different search term
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div key={group}>
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-base-content/40">
                  {group}
                </div>
                {filtered
                  .filter((l) => l.group === group)
                  .map((link) => (
                    <button
                      key={link.href}
                      type="button"
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-base-content/80 transition-colors hover:bg-base-200"
                      onClick={() => handleNavigate(link.href)}
                    >
                      <span className="shrink-0 text-base-content/40">
                        {link.icon}
                      </span>
                      <span>{link.label}</span>
                      <span className="ml-auto text-xs text-base-content/30">
                        {link.href}
                      </span>
                    </button>
                  ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Okay, nicely done. Now I was wondering, the product detail page has 3 sections called features, specifications and customer reviews, which all are empty ever since we used data from the database. Before when we used static data (src/data/product-detail) we used those, now we need to solve this (for reviews we can use the reviews of the product using the reviews table), but specificatons and features are not in the DB so, do that.
