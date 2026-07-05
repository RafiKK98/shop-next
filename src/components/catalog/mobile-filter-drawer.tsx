"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui";
import { FilterSidebar } from "./filter-sidebar";
import type { FilterState } from "@/lib/filters";

interface MobileFilterDrawerProps {
  filters: FilterState;
  activeFilterCount: number;
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onToggleRating: (rating: number) => void;
  onToggleAvailability: (value: string) => void;
  onToggleDiscount: (value: number) => void;
  onPriceChange: (min: number | null, max: number | null) => void;
}

export function MobileFilterDrawer({
  filters,
  activeFilterCount,
  onToggleCategory,
  onToggleBrand,
  onToggleRating,
  onToggleAvailability,
  onToggleDiscount,
  onPriceChange,
}: MobileFilterDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn btn-outline btn-sm lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
      >
        <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
        Filters
        {activeFilterCount > 0 && (
          <span className="badge badge-neutral badge-sm ml-1">{activeFilterCount}</span>
        )}
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        side={
          <div className="py-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                type="button"
                className="btn btn-ghost btn-sm btn-square"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                <svg className="size-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onToggleCategory={onToggleCategory}
              onToggleBrand={onToggleBrand}
              onToggleRating={onToggleRating}
              onToggleAvailability={onToggleAvailability}
              onToggleDiscount={onToggleDiscount}
              onPriceChange={onPriceChange}
            />
          </div>
        }
      >
        <div />
      </Drawer>
    </>
  );
}
