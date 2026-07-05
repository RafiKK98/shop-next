import type { Product } from "@/types/product";

/* ── Types ── */

export interface CategoryCard {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
}

export interface Brand {
  id: string;
  name: string;
}

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

/* ── Featured Products ── */

export const featuredProducts: Product[] = [
  product({ id: "p1", title: "Wireless Noise-Cancelling Headphones", slug: "wireless-nc-headphones", images: ["https://picsum.photos/seed/featured-1/640/480"], price: 254.99, compareAtPrice: 299.99, rating: 4.8, reviewCount: 234, brand: "SoundPro", isFeatured: true }),
  product({ id: "p2", title: '4K Ultra HD Smart Monitor 27"', slug: "4k-ultra-hd-monitor", images: ["https://picsum.photos/seed/featured-2/640/480"], price: 494.99, compareAtPrice: 549.99, rating: 4.6, reviewCount: 189, brand: "TechWave", isFeatured: true }),
  product({ id: "p3", title: "Adjustable Dumbbell Set 5-52lbs", slug: "adjustable-dumbbell-set", images: ["https://picsum.photos/seed/featured-3/640/480"], price: 269.99, compareAtPrice: 299.99, rating: 4.7, reviewCount: 312, brand: "SportFlex", isFeatured: true, isNew: true }),
  product({ id: "p4", title: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", images: ["https://picsum.photos/seed/featured-4/640/480"], price: 80.99, compareAtPrice: 89.99, rating: 4.3, reviewCount: 456, brand: "UrbanStyle", isFeatured: true }),
  product({ id: "p5", title: "Cast Iron Dutch Oven 6qt", slug: "cast-iron-dutch-oven", images: ["https://picsum.photos/seed/featured-5/640/480"], price: 89.99, compareAtPrice: null, rating: 4.9, reviewCount: 567, brand: "HomeCraft", isFeatured: true }),
  product({ id: "p6", title: "Robot Vacuum Cleaner", slug: "robot-vacuum-cleaner", images: ["https://picsum.photos/seed/featured-6/640/480"], price: 359.99, compareAtPrice: 399.99, rating: 4.5, reviewCount: 890, brand: "TechWave", isFeatured: true, stockStatus: "low_stock" }),
  product({ id: "p7", title: "Acoustic Guitar Dreadnought", slug: "acoustic-guitar-dreadnought", images: ["https://picsum.photos/seed/featured-7/640/480"], price: 269.99, compareAtPrice: 299.99, rating: 4.6, reviewCount: 123, brand: "SoundPro", isFeatured: true }),
  product({ id: "p8", title: "Building Blocks Creative Set", slug: "building-blocks-creative", images: ["https://picsum.photos/seed/featured-8/640/480"], price: 59.99, compareAtPrice: null, rating: 4.8, reviewCount: 678, brand: "GreenLife", isFeatured: true }),
];

/* ── Best Sellers ── */

export const bestSellers: Product[] = [
  product({ id: "b1", title: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt", images: ["https://picsum.photos/seed/bestseller-1/640/480"], price: 34.99, compareAtPrice: null, rating: 4.4, reviewCount: 1234, brand: "UrbanStyle" }),
  product({ id: "b2", title: "Portable Jump Starter 2000A", slug: "portable-jump-starter", images: ["https://picsum.photos/seed/bestseller-2/640/480"], price: 80.99, compareAtPrice: 89.99, rating: 4.7, reviewCount: 890, brand: "ApexGear" }),
  product({ id: "b3", title: "Insulated Water Bottle 32oz", slug: "insulated-water-bottle", images: ["https://picsum.photos/seed/bestseller-3/640/480"], price: 34.99, compareAtPrice: null, rating: 4.6, reviewCount: 2100, brand: "NaturePure" }),
  product({ id: "b4", title: "Yoga Mat Premium Non-Slip", slug: "yoga-mat-premium", images: ["https://picsum.photos/seed/bestseller-4/640/480"], price: 68.99, compareAtPrice: null, rating: 4.5, reviewCount: 1567, brand: "SportFlex" }),
  product({ id: "b5", title: "Organic Coffee Beans Medium Roast", slug: "organic-coffee-beans", images: ["https://picsum.photos/seed/bestseller-5/640/480"], price: 24.99, compareAtPrice: null, rating: 4.8, reviewCount: 3456, brand: "NaturePure", stockStatus: "low_stock" }),
  product({ id: "b6", title: "Vitamin C Serum Anti-Aging", slug: "vitamin-c-serum", images: ["https://picsum.photos/seed/bestseller-6/640/480"], price: 42.99, compareAtPrice: null, rating: 4.3, reviewCount: 2789, brand: "GreenLife" }),
  product({ id: "b7", title: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard", images: ["https://picsum.photos/seed/bestseller-7/640/480"], price: 149.99, compareAtPrice: null, rating: 4.7, reviewCount: 1567, brand: "TechWave", isNew: true }),
  product({ id: "b8", title: "Memory Foam Bed Pillows 2-Pack", slug: "memory-foam-pillows", images: ["https://picsum.photos/seed/bestseller-8/640/480"], price: 47.99, compareAtPrice: 59.99, rating: 4.4, reviewCount: 3456, brand: "HomeCraft" }),
];

/* ── New Arrivals ── */

export const newArrivals: Product[] = [
  product({ id: "n1", title: "Smart Plug Wi-Fi Outlet", slug: "smart-plug-wifi", images: ["https://picsum.photos/seed/new-1/640/480"], price: 24.99, compareAtPrice: null, rating: 4.2, reviewCount: 89, brand: "TechWave", isNew: true }),
  product({ id: "n2", title: "Portable Bluetooth Speaker", slug: "portable-bt-speaker", images: ["https://picsum.photos/seed/new-2/640/480"], price: 63.99, compareAtPrice: 79.99, rating: 4.5, reviewCount: 156, brand: "SoundPro", isNew: true }),
  product({ id: "n3", title: "Laptop Stand Adjustable", slug: "laptop-stand-adjustable", images: ["https://picsum.photos/seed/new-3/640/480"], price: 29.99, compareAtPrice: 39.99, rating: 4.6, reviewCount: 234, brand: "ApexGear", isNew: true }),
  product({ id: "n4", title: "Hair Dryer Ionic Pro", slug: "hair-dryer-ionic", images: ["https://picsum.photos/seed/new-4/640/480"], price: 95.99, compareAtPrice: 119.99, rating: 4.4, reviewCount: 67, brand: "GreenLife", isNew: true }),
  product({ id: "n5", title: "Drone with Camera 4K", slug: "drone-with-camera", images: ["https://picsum.photos/seed/new-5/640/480"], price: 159.99, compareAtPrice: 199.99, rating: 4.7, reviewCount: 45, brand: "TechWave", isNew: true, stockStatus: "out_of_stock" }),
  product({ id: "n6", title: "Indoor Herb Garden Kit", slug: "indoor-herb-garden-kit", images: ["https://picsum.photos/seed/new-6/640/480"], price: 44.99, compareAtPrice: 49.99, rating: 4.3, reviewCount: 178, brand: "NaturePure", isNew: true }),
  product({ id: "n7", title: "Digital Audio Workstation USB Mic", slug: "usb-microphone-daw", images: ["https://picsum.photos/seed/new-7/640/480"], price: 149.99, compareAtPrice: null, rating: 4.5, reviewCount: 92, brand: "SoundPro", isNew: true }),
  product({ id: "n8", title: "Wool Blend Winter Coat", slug: "wool-blend-winter-coat", images: ["https://picsum.photos/seed/new-8/640/480"], price: 199.99, compareAtPrice: 249.99, rating: 4.6, reviewCount: 34, brand: "UrbanStyle", isNew: true }),
];

/* ── Featured Categories ── */

export const featuredCategories: CategoryCard[] = [
  { id: "c1", name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/cat-electronics/400/300", productCount: 120 },
  { id: "c2", name: "Clothing & Fashion", slug: "clothing-fashion", image: "https://picsum.photos/seed/cat-clothing/400/300", productCount: 85 },
  { id: "c3", name: "Home & Garden", slug: "home-garden", image: "https://picsum.photos/seed/cat-home/400/300", productCount: 64 },
  { id: "c4", name: "Sports & Outdoors", slug: "sports-outdoors", image: "https://picsum.photos/seed/cat-sports/400/300", productCount: 93 },
  { id: "c5", name: "Beauty & Health", slug: "beauty-health", image: "https://picsum.photos/seed/cat-beauty/400/300", productCount: 78 },
  { id: "c6", name: "Books & Media", slug: "books-media", image: "https://picsum.photos/seed/cat-books/400/300", productCount: 150 },
];

/* ── Testimonials ── */

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Sarah Mitchell", avatar: "https://picsum.photos/seed/sarah/100/100", rating: 5, text: "Absolutely love my purchases! The quality exceeded my expectations and shipping was incredibly fast. Will definitely be shopping here again." },
  { id: "t2", name: "James Rodriguez", avatar: "https://picsum.photos/seed/james/100/100", rating: 5, text: "Best online shopping experience I've had. The product descriptions are accurate, prices are competitive, and customer service is top-notch." },
  { id: "t3", name: "Emily Chen", avatar: "https://picsum.photos/seed/emily/100/100", rating: 4, text: "Great selection of products and easy checkout process. The only reason I'm not giving 5 stars is that one item took a bit longer to arrive." },
  { id: "t4", name: "Michael Thompson", avatar: "https://picsum.photos/seed/michael/100/100", rating: 5, text: "I've been a loyal customer for over a year now. The quality consistency and reliable delivery keep me coming back. Highly recommended!" },
];

/* ── Brands ── */

export const brands: Brand[] = [
  { id: "br1", name: "TechWave" },
  { id: "br2", name: "UrbanStyle" },
  { id: "br3", name: "NaturePure" },
  { id: "br4", name: "SportFlex" },
  { id: "br5", name: "HomeCraft" },
  { id: "br6", name: "SoundPro" },
  { id: "br7", name: "GreenLife" },
  { id: "br8", name: "ApexGear" },
];
