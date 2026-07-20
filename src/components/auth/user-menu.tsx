"use client";

import { logoutAction } from "@/actions/auth";
import { Avatar } from "@/components/ui";
import { ROUTES } from "@/constants";
import type { UserRole } from "@/types/auth";
import { Heart, LayoutDashboard, LogOut, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role: UserRole;
  } | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user)
    return (
      <div className="hidden items-center gap-2 md:flex">
        <Link href={ROUTES.login} className="btn btn-ghost btn-sm">
          Sign In
        </Link>
        <Link href={ROUTES.register} className="btn btn-primary btn-sm">
          Register
        </Link>
      </div>
    );

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="btn btn-ghost btn-sm gap-2"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar
          src={user.image}
          alt={user.name || "User"}
          size="xs"
          fallback={(user.name || "U").charAt(0)}
        />
        <span className="hidden max-w-25 truncate lg:inline">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-box border border-base-200 bg-base-100 shadow-xl z-50">
          <div className="border-b border-base-200 px-4 py-3">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-base-content/60 truncate">
              {user.email}
            </p>
          </div>
          <div className="p-2">
            <Link
              href={ROUTES.accountDashboard}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="size-4" />
              Dashboard
            </Link>
            <Link
              href={ROUTES.accountOrders}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => setOpen(false)}
            >
              <Package className="size-4" />
              Orders
            </Link>
            <Link
              href={ROUTES.wishlist}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
              onClick={() => setOpen(false)}
            >
              <Heart className="size-4" />
              Wishlist
            </Link>
          </div>
          <div className="border-t border-base-200 p-2">
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-base-200"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
