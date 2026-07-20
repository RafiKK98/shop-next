import { cn } from "@/utils/cn";
import type { Route } from "next";
import Link from "next/link";
import { type HTMLAttributes } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps extends HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ className, items, ...props }: BreadcrumbProps) {
  return (
    <div className={cn("breadcrumbs text-sm", className)} {...props}>
      <ul>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.href || item.label}-${i}`}>
              {isLast || !item.href ? (
                <span className={cn(isLast && "font-medium text-base-content")}>
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as Route}
                  className="text-base-content/60 hover:text-base-content"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
