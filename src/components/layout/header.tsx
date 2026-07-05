import Link from "next/link";
import { Search, Heart, ShoppingCart, User } from "lucide-react";
import { SITE, ROUTES } from "@/constants";
import { NAVIGATION } from "@/constants/navigation";
import { cn } from "@/utils/cn";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-base-200 bg-base-100/95 backdrop-blur supports-[backdrop-filter]:bg-base-100/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={ROUTES.home as unknown as any}
          className="text-xl font-bold tracking-tight hover:text-primary transition-colors"
        >
          {SITE.name}
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-8">
          {NAVIGATION.main.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href={ROUTES.search as unknown as any}
            className="btn btn-ghost btn-square"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>

          <Link
            href={ROUTES.dashboardWishlist as unknown as any}
            className="btn btn-ghost btn-square"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </Link>

          <Link
            href={ROUTES.cart as unknown as any}
            className="btn btn-ghost btn-square"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
          </Link>

          <Link
            href={ROUTES.login as unknown as any}
            className="btn btn-ghost btn-square"
            aria-label="Sign in"
          >
            <User size={18} />
          </Link>

          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
