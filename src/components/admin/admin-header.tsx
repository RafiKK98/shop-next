"use client";

import { logoutAction } from "@/actions/auth";
import { Dropdown } from "@/components/ui";
import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";

interface AdminHeaderProps {
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.slice(0, 2).toUpperCase() ?? "A");

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-base-200 bg-base-100/80 px-4 backdrop-blur-sm sm:px-6">
      <label
        htmlFor="admin-drawer"
        className="btn btn-ghost btn-square btn-sm lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="size-5" />
      </label>

      <div className="hidden min-w-0 flex-1 lg:block">
        <AdminBreadcrumbs />
      </div>

      <div className="flex flex-1 items-center lg:hidden">
        <AdminBreadcrumbs />
      </div>

      <div className="flex shrink-0 items-center">
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-base-200"
            >
              <div className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                {initials}
              </div>
              <span className="hidden text-sm font-medium sm:inline">
                {user.name || user.email}
              </span>
              <ChevronDown className="size-3.5 text-base-content/40" />
            </button>
          }
          align="end"
        >
          <li>
            <Link href="/account/dashboard" className="text-sm">
              Customer Dashboard
            </Link>
          </li>
          <li>
            <form action={logoutAction}>
              <button
                type="submit"
                className="w-full text-left text-sm text-error"
              >
                Sign Out
              </button>
            </form>
          </li>
        </Dropdown>
      </div>
    </header>
  );
}
