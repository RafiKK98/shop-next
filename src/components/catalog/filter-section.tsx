"use client";

import { cn } from "@/utils/cn";
import { type ReactNode, useState } from "react";

interface FilterSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
  className?: string;
}

export function FilterSection({
  title,
  defaultOpen = true,
  children,
  className,
}: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border-b border-base-200 pb-4", className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-base-content"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {title}
        <svg
          className={cn(
            "size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {open && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
}
