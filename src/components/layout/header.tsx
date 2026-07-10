import { ROUTES, SITE } from "@/constants";
import { NAVIGATION } from "@/constants/navigation";
import { auth } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";
import { getWishlistCount } from "@/lib/wishlist";
import { Shield } from "lucide-react";
import Link from "next/link";
import { UserMenu } from "../auth/user-menu";
import { CartCount } from "../cart/cart-count";
import { WishlistCount } from "../wishlist/wishlist-count";
import { MobileNav } from "./mobile-nav";
import { NavLink } from "./nav-link";
import { ThemeToggle } from "./theme-toggle";
import { SearchTrigger } from "../search/search-trigger";

export async function Header() {
  const session = await auth();

  let cartCount = 0;
  let wishlistCount = 0;
  if (session?.user?.id) {
    cartCount = await getCartCount(session.user.id);
    wishlistCount = await getWishlistCount(session.user.id);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-base-200 bg-base-100/95 backdrop-blur supports-backdrop-filter:bg-base-100/80">
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
          <SearchTrigger userRole={session?.user?.role ?? null} />

          {session?.user?.role === "admin" && (
            <Link
              href={ROUTES.admin as unknown as any}
              className="btn btn-ghost btn-square text-warning"
              aria-label="Admin Panel"
            >
              <Shield size={18} />
            </Link>
          )}

          <WishlistCount count={wishlistCount} href={ROUTES.wishlist} />

          <CartCount count={cartCount} />

          <UserMenu user={session?.user ?? null} />

          <span className="hidden md:inline-flex">
            <ThemeToggle />
          </span>

          <MobileNav user={session?.user ?? null} />
        </div>
      </div>
    </header>
  );
}
