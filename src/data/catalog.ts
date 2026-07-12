/* ── Filter constants ── */

export interface PriceRange {
  min: number;
  max: number;
}

export const priceRange: PriceRange = { min: 0, max: 1000 };

export const ratingOptions = [4, 3, 2, 1] as const;

export const discountOptions = [
  { label: "10% or more", value: "10" },
  { label: "20% or more", value: "20" },
  { label: "30% or more", value: "30" },
  { label: "50% or more", value: "50" },
] as const;


