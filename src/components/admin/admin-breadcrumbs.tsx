"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";
import { ADMIN_NAV } from "./admin-nav";
import { ChevronRight, Home } from "lucide-react";

const navMap = new Map(ADMIN_NAV.map((item) => [item.href, item.label]));

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const items: { label: string; href?: string }[] = [{ label: "Home", href: "/admin" }];

  let accumulated = "";
  for (const segment of segments) {
    accumulated += "/" + segment;
    const href = accumulated;
    const label = navMap.get(href) || segment.charAt(0).toUpperCase() + segment.slice(1);
    items.push({ label, href });
  }

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-base-content/50">
      <Link href="/admin" className="hover:text-base-content">
        <Home className="size-3.5" />
        <span className="sr-only">Admin Home</span>
      </Link>
      {items.slice(1).map((item, i) => {
        const isLast = i === items.slice(1).length - 1;
        return (
          <span key={item.href} className="flex items-center gap-1">
            <ChevronRight className="size-3" />
            {isLast ? (
              <span className="font-medium text-base-content">{item.label}</span>
            ) : (
              <Link href={item.href as Route} className="hover:text-base-content">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
