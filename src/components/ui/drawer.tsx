"use client";

import { cn } from "@/utils/cn";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  sideClassName?: string;
}

export function Drawer({ open, onClose, side, children, className, sideClassName }: DrawerProps) {
  return (
    <div className={cn("drawer", open && "drawer-open", className)}>
      <input
        type="checkbox"
        className="drawer-toggle"
        checked={open}
        onChange={() => onClose()}
        aria-label="Toggle drawer"
      />
      <div className="drawer-content">{children}</div>
      <div className={cn("drawer-side z-40", sideClassName)}>
        <label className="drawer-overlay" onClick={onClose} aria-label="Close drawer" />
        <aside className="bg-base-100 min-h-full w-80 p-4">{side}</aside>
      </div>
    </div>
  );
}
