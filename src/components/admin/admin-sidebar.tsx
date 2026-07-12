"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/utils/cn";
import { ADMIN_NAV } from "./admin-nav";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex min-h-screen flex-col border-r border-base-200 bg-base-100 transition-all duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b border-base-200 px-4">
        <Link
          href="/admin"
          className={cn(
            "flex items-center gap-2 font-bold",
            collapsed && "justify-center",
          )}
        >
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-content">
            A
          </span>
          {!collapsed && <span className="text-sm">Admin</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Admin navigation">
        <ul className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href + "/"));

            return (
              <li key={item.href}>
                <Link
                  href={item.href as Route}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-base-content/60 hover:bg-base-200 hover:text-base-content",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="size-4 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-base-200 p-2">
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/40 transition-colors hover:bg-base-200 hover:text-base-content",
            collapsed && "justify-center px-2",
          )}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft
            className={cn(
              "size-4 shrink-0 transition-transform",
              collapsed && "rotate-180",
            )}
          />
          {!collapsed && <span>Collapse</span>}
        </button>

        <form action="/api/auth/signout" method="POST" className="mt-1">
          <button
            type="submit"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-base-content/40 transition-colors hover:bg-base-200 hover:text-error",
              collapsed && "justify-center px-2",
            )}
            title="Sign Out"
          >
            <LogOut className="size-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
