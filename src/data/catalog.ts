import type { Product } from "@/types/product";

/* ── Filter data ── */

export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface FilterBrand {
  name: string;
  count: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export const catalogCategories: FilterCategory[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", count: 5 },
  { id: "cat-2", name: "Clothing & Fashion", slug: "clothing-fashion", count: 4 },
  { id: "cat-3", name: "Home & Garden", slug: "home-garden", count: 3 },
  { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors", count: 3 },
  { id: "cat-5", name: "Beauty & Health", slug: "beauty-health", count: 3 },
  { id: "cat-6", name: "Books & Media", slug: "books-media", count: 2 },
];

export const catalogBrands: FilterBrand[] = [
  { name: "TechWave", count: 5 },
  { name: "SoundPro", count: 3 },
  { name: "UrbanStyle", count: 3 },
  { name: "NaturePure", count: 3 },
  { name: "SportFlex", count: 2 },
  { name: "HomeCraft", count: 2 },
  { name: "GreenLife", count: 2 },
  { name: "ApexGear", count: 2 },
];

export const priceRange: PriceRange = { min: 0, max: 1000 };

export const ratingOptions = [4, 3, 2, 1] as const;

export const discountOptions = [
  { label: "10% or more", value: "10" },
  { label: "20% or more", value: "20" },
  { label: "30% or more", value: "30" },
  { label: "50% or more", value: "50" },
] as const;

/* ── Helper ── */

function product(overrides: Partial<Product> & { title: string; slug: string; price: number; compareAtPrice: number | null; images: string[] }): Product {
  return {
    id: "",
    rating: 4.5,
    reviewCount: 0,
    brand: "Generic",
    stockStatus: "in_stock",
    isNew: false,
    isFeatured: false,
    ...overrides,
  };
}

/* ── Catalog Products (20 items) ── */

export const catalogProducts: Product[] = [
  product({ id: "cp1", title: "Wireless Noise-Cancelling Headphones", slug: "wireless-nc-headphones", images: ["https://picsum.photos/seed/cp1/640/480"], price: 254.99, compareAtPrice: 299.99, rating: 4.8, reviewCount: 234, brand: "SoundPro", isFeatured: true }),
  product({ id: "cp2", title: '4K Ultra HD Smart Monitor 27"', slug: "4k-ultra-hd-monitor", images: ["https://picsum.photos/seed/cp2/640/480"], price: 494.99, compareAtPrice: 549.99, rating: 4.6, reviewCount: 189, brand: "TechWave", isFeatured: true }),
  product({ id: "cp3", title: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt", images: ["https://picsum.photos/seed/cp3/640/480"], price: 34.99, compareAtPrice: null, rating: 4.4, reviewCount: 1234, brand: "UrbanStyle" }),
  product({ id: "cp4", title: "Cast Iron Dutch Oven 6qt", slug: "cast-iron-dutch-oven", images: ["https://picsum.photos/seed/cp4/640/480"], price: 89.99, compareAtPrice: null, rating: 4.9, reviewCount: 567, brand: "HomeCraft", isFeatured: true }),
  product({ id: "cp5", title: "Adjustable Dumbbell Set 5-52lbs", slug: "adjustable-dumbbell-set", images: ["https://picsum.photos/seed/cp5/640/480"], price: 269.99, compareAtPrice: 299.99, rating: 4.7, reviewCount: 312, brand: "SportFlex", isNew: true }),
  product({ id: "cp6", title: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", images: ["https://picsum.photos/seed/cp6/640/480"], price: 80.99, compareAtPrice: 89.99, rating: 4.3, reviewCount: 456, brand: "UrbanStyle" }),
  product({ id: "cp7", title: "Robot Vacuum Cleaner", slug: "robot-vacuum-cleaner", images: ["https://picsum.photos/seed/cp7/640/480"], price: 359.99, compareAtPrice: 399.99, rating: 4.5, reviewCount: 890, brand: "TechWave", stockStatus: "low_stock" }),
  product({ id: "cp8", title: "Acoustic Guitar Dreadnought", slug: "acoustic-guitar-dreadnought", images: ["https://picsum.photos/seed/cp8/640/480"], price: 269.99, compareAtPrice: 299.99, rating: 4.6, reviewCount: 123, brand: "SoundPro" }),
  product({ id: "cp9", title: "Organic Coffee Beans Medium Roast", slug: "organic-coffee-beans", images: ["https://picsum.photos/seed/cp9/640/480"], price: 24.99, compareAtPrice: null, rating: 4.8, reviewCount: 3456, brand: "NaturePure", stockStatus: "low_stock" }),
  product({ id: "cp10", title: "Portable Bluetooth Speaker", slug: "portable-bt-speaker", images: ["https://picsum.photos/seed/cp10/640/480"], price: 63.99, compareAtPrice: 79.99, rating: 4.5, reviewCount: 156, brand: "SoundPro", isNew: true }),
  product({ id: "cp11", title: "Yoga Mat Premium Non-Slip", slug: "yoga-mat-premium", images: ["https://picsum.photos/seed/cp11/640/480"], price: 68.99, compareAtPrice: null, rating: 4.5, reviewCount: 1567, brand: "SportFlex" }),
  product({ id: "cp12", title: "Vitamin C Serum Anti-Aging", slug: "vitamin-c-serum", images: ["https://picsum.photos/seed/cp12/640/480"], price: 42.99, compareAtPrice: null, rating: 4.3, reviewCount: 2789, brand: "GreenLife" }),
  product({ id: "cp13", title: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard", images: ["https://picsum.photos/seed/cp13/640/480"], price: 149.99, compareAtPrice: null, rating: 4.7, reviewCount: 1567, brand: "TechWave", isNew: true }),
  product({ id: "cp14", title: "Memory Foam Bed Pillows 2-Pack", slug: "memory-foam-pillows", images: ["https://picsum.photos/seed/cp14/640/480"], price: 47.99, compareAtPrice: 59.99, rating: 4.4, reviewCount: 3456, brand: "HomeCraft" }),
  product({ id: "cp15", title: "Smart Plug Wi-Fi Outlet", slug: "smart-plug-wifi", images: ["https://picsum.photos/seed/cp15/640/480"], price: 24.99, compareAtPrice: null, rating: 4.2, reviewCount: 89, brand: "TechWave", isNew: true }),
  product({ id: "cp16", title: "Laptop Stand Adjustable", slug: "laptop-stand-adjustable", images: ["https://picsum.photos/seed/cp16/640/480"], price: 29.99, compareAtPrice: 39.99, rating: 4.6, reviewCount: 234, brand: "ApexGear", isNew: true }),
  product({ id: "cp17", title: "Hair Dryer Ionic Pro", slug: "hair-dryer-ionic", images: ["https://picsum.photos/seed/cp17/640/480"], price: 95.99, compareAtPrice: 119.99, rating: 4.4, reviewCount: 67, brand: "GreenLife", isNew: true }),
  product({ id: "cp18", title: "Drone with Camera 4K", slug: "drone-with-camera", images: ["https://picsum.photos/seed/cp18/640/480"], price: 159.99, compareAtPrice: 199.99, rating: 4.7, reviewCount: 45, brand: "TechWave", isNew: true, stockStatus: "out_of_stock" }),
  product({ id: "cp19", title: "Indoor Herb Garden Kit", slug: "indoor-herb-garden-kit", images: ["https://picsum.photos/seed/cp19/640/480"], price: 44.99, compareAtPrice: 49.99, rating: 4.3, reviewCount: 178, brand: "NaturePure" }),
  product({ id: "cp20", title: "Wool Blend Winter Coat", slug: "wool-blend-winter-coat", images: ["https://picsum.photos/seed/cp20/640/480"], price: 199.99, compareAtPrice: 249.99, rating: 4.6, reviewCount: 34, brand: "UrbanStyle" }),
];
