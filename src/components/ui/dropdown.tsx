"use client";

import { cn } from "@/utils/cn";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  align?: "start" | "end" | "center";
}

export function Dropdown({
  trigger,
  children,
  className,
  align = "start",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "dropdown",
        open && "dropdown-open",
        align === "end" && "dropdown-end",
        align === "center" && "dropdown-center",
        className,
      )}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(!open);
          }
        }}
      >
        {trigger}
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box shadow-md z-50 w-52 p-2"
        onClick={() => setOpen(false)}
      >
        {children}
      </ul>
    </div>
  );
}
