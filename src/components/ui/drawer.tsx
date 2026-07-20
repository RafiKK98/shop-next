"use client";

import { cn } from "@/utils/cn";
import { type ReactNode, useCallback, useEffect, useId, useRef } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side: ReactNode;
  children: ReactNode;
  className?: string;
  sideClassName?: string;
}

export function Drawer({
  open,
  onClose,
  side,
  children,
  className,
  sideClassName,
}: DrawerProps) {
  const uid = useId();
  const checkboxId = `drawer-toggle-${uid}`;
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (checkboxRef.current && checkboxRef.current.checked !== open)
      checkboxRef.current.checked = open;
  }, [open]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleChange = useCallback(() => {
    if (checkboxRef.current && !checkboxRef.current.checked) onClose();
  }, [onClose]);

  return (
    <div className={cn("drawer w-auto", className)}>
      <input
        ref={checkboxRef}
        id={checkboxId}
        type="checkbox"
        className="drawer-toggle"
        onChange={handleChange}
        aria-label="Toggle drawer"
      />
      <div className="drawer-content">{children}</div>
      <div className={cn("drawer-side z-40", sideClassName)}>
        <label
          htmlFor={checkboxId}
          className="drawer-overlay"
          aria-label="Close drawer"
        />
        <aside className="bg-base-100 flex min-h-full w-80 flex-col p-6">
          {side}
        </aside>
      </div>
    </div>
  );
}
