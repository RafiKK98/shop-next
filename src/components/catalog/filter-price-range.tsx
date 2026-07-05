interface FilterPriceRangeProps {
  min: number;
  max: number;
}

export function FilterPriceRange({ min, max }: FilterPriceRangeProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder={`$${min}`}
        aria-label="Minimum price"
        className="input input-sm w-full"
        min={min}
        max={max}
      />
      <span className="text-base-content/40">—</span>
      <input
        type="number"
        placeholder={`$${max}`}
        aria-label="Maximum price"
        className="input input-sm w-full"
        min={min}
        max={max}
      />
    </div>
  );
}
