"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
}

export function NavLink({ href, children, className, activeClassName, exact = false }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href) && (href === "/" ? pathname === "/" : true);

  return (
    <Link
      href={href as unknown as any}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        isActive ? (activeClassName ?? "text-primary") : "text-base-content/70",
        className,
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
