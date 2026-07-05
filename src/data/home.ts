export interface HomeProduct {
  id: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
}

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

export const featuredCategories: CategoryCard[] = [
  { id: "c1", name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/cat-electronics/400/300", productCount: 120 },
  { id: "c2", name: "Clothing & Fashion", slug: "clothing-fashion", image: "https://picsum.photos/seed/cat-clothing/400/300", productCount: 85 },
  { id: "c3", name: "Home & Garden", slug: "home-garden", image: "https://picsum.photos/seed/cat-home/400/300", productCount: 64 },
  { id: "c4", name: "Sports & Outdoors", slug: "sports-outdoors", image: "https://picsum.photos/seed/cat-sports/400/300", productCount: 93 },
  { id: "c5", name: "Beauty & Health", slug: "beauty-health", image: "https://picsum.photos/seed/cat-beauty/400/300", productCount: 78 },
  { id: "c6", name: "Books & Media", slug: "books-media", image: "https://picsum.photos/seed/cat-books/400/300", productCount: 150 },
];

export const featuredProducts: HomeProduct[] = [
  { id: "p1", title: "Wireless Noise-Cancelling Headphones", slug: "wireless-nc-headphones", image: "https://picsum.photos/seed/featured-1/640/480", price: 299.99, discount: 15, rating: 4.8, reviewCount: 234 },
  { id: "p2", title: "4K Ultra HD Smart Monitor 27\"", slug: "4k-ultra-hd-monitor", image: "https://picsum.photos/seed/featured-2/640/480", price: 549.99, discount: 10, rating: 4.6, reviewCount: 189 },
  { id: "p3", title: "Adjustable Dumbbell Set 5-52lbs", slug: "adjustable-dumbbell-set", image: "https://picsum.photos/seed/featured-3/640/480", price: 299.99, discount: 10, rating: 4.7, reviewCount: 312 },
  { id: "p4", title: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", image: "https://picsum.photos/seed/featured-4/640/480", price: 89.99, discount: 10, rating: 4.3, reviewCount: 456 },
  { id: "p5", title: "Cast Iron Dutch Oven 6qt", slug: "cast-iron-dutch-oven", image: "https://picsum.photos/seed/featured-5/640/480", price: 89.99, discount: 0, rating: 4.9, reviewCount: 567 },
  { id: "p6", title: "Robot Vacuum Cleaner", slug: "robot-vacuum-cleaner", image: "https://picsum.photos/seed/featured-6/640/480", price: 399.99, discount: 10, rating: 4.5, reviewCount: 890 },
  { id: "p7", title: "Acoustic Guitar Dreadnought", slug: "acoustic-guitar-dreadnought", image: "https://picsum.photos/seed/featured-7/640/480", price: 299.99, discount: 10, rating: 4.6, reviewCount: 123 },
  { id: "p8", title: "Building Blocks Creative Set", slug: "building-blocks-creative", image: "https://picsum.photos/seed/featured-8/640/480", price: 59.99, discount: 0, rating: 4.8, reviewCount: 678 },
];

export const bestSellers: HomeProduct[] = [
  { id: "b1", title: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt", image: "https://picsum.photos/seed/bestseller-1/640/480", price: 34.99, discount: 0, rating: 4.4, reviewCount: 1234 },
  { id: "b2", title: "Portable Jump Starter 2000A", slug: "portable-jump-starter", image: "https://picsum.photos/seed/bestseller-2/640/480", price: 89.99, discount: 10, rating: 4.7, reviewCount: 890 },
  { id: "b3", title: "Insulated Water Bottle 32oz", slug: "insulated-water-bottle", image: "https://picsum.photos/seed/bestseller-3/640/480", price: 34.99, discount: 0, rating: 4.6, reviewCount: 2100 },
  { id: "b4", title: "Yoga Mat Premium Non-Slip", slug: "yoga-mat-premium", image: "https://picsum.photos/seed/bestseller-4/640/480", price: 68.99, discount: 0, rating: 4.5, reviewCount: 1567 },
  { id: "b5", title: "Organic Coffee Beans Medium Roast", slug: "organic-coffee-beans", image: "https://picsum.photos/seed/bestseller-5/640/480", price: 24.99, discount: 0, rating: 4.8, reviewCount: 3456 },
  { id: "b6", title: "Vitamin C Serum Anti-Aging", slug: "vitamin-c-serum", image: "https://picsum.photos/seed/bestseller-6/640/480", price: 42.99, discount: 0, rating: 4.3, reviewCount: 2789 },
  { id: "b7", title: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard", image: "https://picsum.photos/seed/bestseller-7/640/480", price: 149.99, discount: 0, rating: 4.7, reviewCount: 1567 },
  { id: "b8", title: "Memory Foam Bed Pillows 2-Pack", slug: "memory-foam-pillows", image: "https://picsum.photos/seed/bestseller-8/640/480", price: 59.99, discount: 20, rating: 4.4, reviewCount: 3456 },
];

export const newArrivals: HomeProduct[] = [
  { id: "n1", title: "Smart Plug Wi-Fi Outlet", slug: "smart-plug-wifi", image: "https://picsum.photos/seed/new-1/640/480", price: 24.99, discount: 0, rating: 4.2, reviewCount: 89 },
  { id: "n2", title: "Portable Bluetooth Speaker", slug: "portable-bt-speaker", image: "https://picsum.photos/seed/new-2/640/480", price: 79.99, discount: 20, rating: 4.5, reviewCount: 156 },
  { id: "n3", title: "Laptop Stand Adjustable", slug: "laptop-stand-adjustable", image: "https://picsum.photos/seed/new-3/640/480", price: 39.99, discount: 25, rating: 4.6, reviewCount: 234 },
  { id: "n4", title: "Hair Dryer Ionic Pro", slug: "hair-dryer-ionic", image: "https://picsum.photos/seed/new-4/640/480", price: 119.99, discount: 20, rating: 4.4, reviewCount: 67 },
  { id: "n5", title: "Drone with Camera 4K", slug: "drone-with-camera", image: "https://picsum.photos/seed/new-5/640/480", price: 199.99, discount: 20, rating: 4.7, reviewCount: 45 },
  { id: "n6", title: "Indoor Herb Garden Kit", slug: "indoor-herb-garden-kit", image: "https://picsum.photos/seed/new-6/640/480", price: 49.99, discount: 10, rating: 4.3, reviewCount: 178 },
  { id: "n7", title: "Digital Audio Workstation USB Mic", slug: "usb-microphone-daw", image: "https://picsum.photos/seed/new-7/640/480", price: 149.99, discount: 0, rating: 4.5, reviewCount: 92 },
  { id: "n8", title: "Wool Blend Winter Coat", slug: "wool-blend-winter-coat", image: "https://picsum.photos/seed/new-8/640/480", price: 249.99, discount: 20, rating: 4.6, reviewCount: 34 },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Mitchell",
    avatar: "https://picsum.photos/seed/sarah/100/100",
    rating: 5,
    text: "Absolutely love my purchases! The quality exceeded my expectations and shipping was incredibly fast. Will definitely be shopping here again.",
  },
  {
    id: "t2",
    name: "James Rodriguez",
    avatar: "https://picsum.photos/seed/james/100/100",
    rating: 5,
    text: "Best online shopping experience I've had. The product descriptions are accurate, prices are competitive, and customer service is top-notch.",
  },
  {
    id: "t3",
    name: "Emily Chen",
    avatar: "https://picsum.photos/seed/emily/100/100",
    rating: 4,
    text: "Great selection of products and easy checkout process. The only reason I'm not giving 5 stars is that one item took a bit longer to arrive.",
  },
  {
    id: "t4",
    name: "Michael Thompson",
    avatar: "https://picsum.photos/seed/michael/100/100",
    rating: 5,
    text: "I've been a loyal customer for over a year now. The quality consistency and reliable delivery keep me coming back. Highly recommended!",
  },
];

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
