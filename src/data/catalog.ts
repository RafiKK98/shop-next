/* ── Category constants (dev-time, used by generateStaticParams) ── */

export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export const catalogCategories: FilterCategory[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", count: 5 },
  { id: "cat-2", name: "Clothing & Fashion", slug: "clothing-fashion", count: 4 },
  { id: "cat-3", name: "Home & Garden", slug: "home-garden", count: 3 },
  { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors", count: 3 },
  { id: "cat-5", name: "Beauty & Health", slug: "beauty-health", count: 3 },
  { id: "cat-6", name: "Books & Media", slug: "books-media", count: 2 },
];

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


