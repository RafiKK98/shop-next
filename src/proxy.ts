import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/products", "/categories", "/search", "/about", "/faq", "/cart"];

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_ROUTES = ["/dashboard", "/checkout", "/orders", "/wishlist"];

const ADMIN_ROUTES = ["/admin"];

export const proxy = auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const role = req.auth?.user?.role;

  if (isAuthenticated && AUTH_ROUTES.some((r) => pathname === r)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtected = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdmin = ADMIN_ROUTES.some((r) => pathname.startsWith(r));
  if (isAdmin) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images).*)"],
};
