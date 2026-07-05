"use client";

interface FilterPriceRangeProps {
  min: number;
  max: number;
  value: { min: number | null; max: number | null };
  onChange: (min: number | null, max: number | null) => void;
}

export function FilterPriceRange({ min, max, value, onChange }: FilterPriceRangeProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        placeholder={`$${min}`}
        aria-label="Minimum price"
        className="input input-sm w-full"
        min={min}
        max={max}
        value={value.min ?? ""}
        onChange={(e) => {
          const v = e.target.value ? Number(e.target.value) : null;
          onChange(v, value.max);
        }}
      />
      <span className="text-base-content/40">—</span>
      <input
        type="number"
        placeholder={`$${max}`}
        aria-label="Maximum price"
        className="input input-sm w-full"
        min={min}
        max={max}
        value={value.max ?? ""}
        onChange={(e) => {
          const v = e.target.value ? Number(e.target.value) : null;
          onChange(value.min, v);
        }}
      />
    </div>
  );
}
