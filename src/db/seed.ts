import "dotenv/config";
import { createHash, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { db } from "./index";
import * as schema from "./schema";
import {
  users,
  accounts,
  sessions,
  verificationTokens,
  categories,
  products,
  productImages,
  reviews,
  carts,
  cartItems,
  wishlistItems,
  orders,
  orderItems,
  addresses,
  coupons,
  couponUsages,
} from "./schema";

// ---------------------------------------------------------------------------
// Deterministic ID generation
// ---------------------------------------------------------------------------

function seedId(namespace: string, index: number): string {
  const hash = createHash("md5")
    .update(`${namespace}:${index}`)
    .digest("hex");
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    hash.slice(12, 16),
    hash.slice(16, 20),
    hash.slice(20, 32),
  ].join("-");
}

// ---------------------------------------------------------------------------
// Clear all tables in reverse-dependency order
// ---------------------------------------------------------------------------

async function clearAll() {
  await db.delete(couponUsages);
  await db.delete(coupons);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(carts);
  await db.delete(wishlistItems);
  await db.delete(reviews);
  await db.delete(productImages);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(addresses);
  await db.delete(accounts);
  await db.delete(sessions);
  await db.delete(verificationTokens);
  await db.delete(users);
}

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

async function seedUsers() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const records = [
    {
      id: seedId("user", 1),
      name: "Admin User",
      email: "admin@ecom.com",
      password: hashedPassword,
      role: "admin" as const,
      emailVerified: new Date("2025-01-01"),
    },
    {
      id: seedId("user", 2),
      name: "John Doe",
      email: "john@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
      emailVerified: new Date("2025-01-15"),
    },
    {
      id: seedId("user", 3),
      name: "Jane Smith",
      email: "jane@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
      emailVerified: new Date("2025-01-20"),
    },
    {
      id: seedId("user", 4),
      name: "Bob Johnson",
      email: "bob@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
      emailVerified: new Date("2025-02-01"),
    },
    {
      id: seedId("user", 5),
      name: "Alice Williams",
      email: "alice@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
      emailVerified: new Date("2025-02-10"),
    },
    {
      id: seedId("user", 6),
      name: "Charlie Brown",
      email: "charlie@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
    {
      id: seedId("user", 7),
      name: "Diana Prince",
      email: "diana@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
    {
      id: seedId("user", 8),
      name: "Edward Norton",
      email: "edward@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
    {
      id: seedId("user", 9),
      name: "Fiona Apple",
      email: "fiona@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
    {
      id: seedId("user", 10),
      name: "George Lucas",
      email: "george@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
    {
      id: seedId("user", 11),
      name: "Hannah Montana",
      email: "hannah@ecom.com",
      password: hashedPassword,
      role: "customer" as const,
    },
  ];

  await db.insert(users).values(records);
  return records;
}

async function seedCategories() {
  const records = [
    { id: seedId("category", 1), name: "Electronics", slug: "electronics", image: "https://picsum.photos/seed/cat-electronics/400/300" },
    { id: seedId("category", 2), name: "Clothing & Fashion", slug: "clothing-fashion", image: "https://picsum.photos/seed/cat-clothing/400/300" },
    { id: seedId("category", 3), name: "Home & Garden", slug: "home-garden", image: "https://picsum.photos/seed/cat-home-garden/400/300" },
    { id: seedId("category", 4), name: "Books & Media", slug: "books-media", image: "https://picsum.photos/seed/cat-books/400/300" },
    { id: seedId("category", 5), name: "Sports & Outdoors", slug: "sports-outdoors", image: "https://picsum.photos/seed/cat-sports/400/300" },
    { id: seedId("category", 6), name: "Beauty & Health", slug: "beauty-health", image: "https://picsum.photos/seed/cat-beauty/400/300" },
    { id: seedId("category", 7), name: "Toys & Games", slug: "toys-games", image: "https://picsum.photos/seed/cat-toys/400/300" },
    { id: seedId("category", 8), name: "Automotive", slug: "automotive", image: "https://picsum.photos/seed/cat-automotive/400/300" },
    { id: seedId("category", 9), name: "Food & Groceries", slug: "food-groceries", image: "https://picsum.photos/seed/cat-food/400/300" },
    { id: seedId("category", 10), name: "Music & Instruments", slug: "music-instruments", image: "https://picsum.photos/seed/cat-music/400/300" },
  ];

  await db.insert(categories).values(records);
  return records;
}

// ---------------------------------------------------------------------------
// Product definitions — 8 per category
// ---------------------------------------------------------------------------

interface ProductDef {
  title: string;
  slug: string;
  brand: string;
  price: number;
  discount: number;
  stock: number;
  featured: boolean;
  description: string;
}

// Rich feature/spec data for products where we have it
const RICH_PRODUCT_DATA: Record<string, { features: string[]; specifications: Record<string, string> }> = {
  "wireless-nc-headphones": {
    features: [
      "Adaptive Active Noise Cancellation (ANC) with ambient sound mode",
      "30-hour battery life with quick 10-minute charge for 3 hours of playback",
      "40mm custom drivers with Hi-Res Audio certification",
      "Bluetooth 5.3 with multipoint connection for up to 3 devices",
      "Built-in microphone array with wind reduction for crystal-clear calls",
      "Fold-flat design with premium hard-shell carrying case",
    ],
    specifications: {
      "Driver Size": "40mm dynamic",
      "Frequency Response": "20Hz – 40kHz",
      "Bluetooth Version": "5.3",
      "Battery Life": "30 hours (ANC on)",
      "Charging": "USB-C, 10W fast charge",
      "Weight": "250g",
    },
  },
  "4k-ultra-hd-monitor": {
    features: [
      "27-inch 4K UHD (3840 × 2160) IPS panel",
      "HDR400 support with 350 nits typical brightness",
      "99% sRGB and 95% DCI-P3 color gamut coverage",
      "USB-C with 65W power delivery and DisplayPort Alt Mode",
      "Height, tilt, swivel, and pivot adjustable stand",
      "TUV Rheinland certified for low blue light and flicker-free",
    ],
    specifications: {
      "Screen Size": '27 inches',
      "Resolution": "3840 × 2160 (4K UHD)",
      "Panel Type": "IPS",
      "Refresh Rate": "60Hz",
      "Brightness": "350 nits",
      "Connectivity": "USB-C (65W PD), HDMI 2.0 × 2, DP 1.4",
    },
  },
  "premium-cotton-tshirt": {
    features: [
      "100% organic combed ring-spun cotton (180 GSM)",
      "Pre-shrunk fabric — will not shrink in the wash",
      "Reinforced double-needle stitching at sleeves and hem",
      "Ribbed collar with Lycra for shape retention",
      "Modern slim fit — size up for a relaxed look",
      "Available in 12 colors",
    ],
    specifications: {
      "Material": "100% organic cotton",
      "Weight": "180 GSM",
      "Fit": "Slim",
      "Collar": "Ribbed crew neck",
      "Care": "Machine wash cold, tumble dry low",
    },
  },
};

function deriveFeatures(def: ProductDef): string[] {
  const rich = RICH_PRODUCT_DATA[def.slug];
  if (rich) return rich.features;
  // Generate from description
  const parts = def.description.split(". ").filter(Boolean);
  return parts.slice(0, 5).map((p) => p.trim() + ".");
}

function deriveSpecifications(def: ProductDef): Record<string, string> {
  const rich = RICH_PRODUCT_DATA[def.slug];
  if (rich) return rich.specifications;
  return {
    Brand: def.brand,
    Material: "Premium quality",
    Warranty: "1 year",
    Origin: "Imported",
  };
}

const electronicsProducts: ProductDef[] = [
  { title: "Wireless Noise-Cancelling Headphones", slug: "wireless-nc-headphones", brand: "SoundWave", price: 299.99, discount: 15, stock: 45, featured: true, description: "Premium over-ear headphones with active noise cancellation, 40-hour battery life, and crystal-clear audio. Features Bluetooth 5.4 and multipoint connection." },
  { title: "4K Ultra HD Smart Monitor", slug: "4k-ultra-hd-monitor", brand: "ViewPro", price: 549.99, discount: 10, stock: 28, featured: true, description: "27-inch 4K IPS monitor with HDR600 support, USB-C docking, and built-in speakers. Perfect for creative professionals." },
  { title: "Mechanical Gaming Keyboard", slug: "mechanical-gaming-keyboard", brand: "GameType", price: 149.99, discount: 0, stock: 120, featured: false, description: "RGB mechanical keyboard with hot-swappable switches, PBT keycaps, and aerospace-grade aluminum frame." },
  { title: "Portable Bluetooth Speaker", slug: "portable-bt-speaker", brand: "SoundWave", price: 79.99, discount: 20, stock: 200, featured: false, description: "Waterproof portable speaker with 360-degree sound, 20-hour battery, and built-in microphone." },
  { title: "USB-C Hub Multiport Adapter", slug: "usb-c-hub-adapter", brand: "ConnectPro", price: 45.99, discount: 0, stock: 350, featured: false, description: "7-in-1 USB-C hub with HDMI 4K, 100W PD charging, SD card reader, and USB 3.0 ports." },
  { title: "Wireless Ergonomic Mouse", slug: "wireless-ergonomic-mouse", brand: "ErgoTech", price: 89.99, discount: 5, stock: 175, featured: false, description: "Vertical ergonomic design reduces wrist strain. 6 programmable buttons, 4000 DPI, and 3-month battery life." },
  { title: "Smart Plug Wi-Fi Outlet", slug: "smart-plug-wifi", brand: "HomeSync", price: 24.99, discount: 0, stock: 500, featured: false, description: "Compatible with Alexa and Google Home. Track energy usage, set schedules, and control remotely." },
  { title: "Laptop Stand Adjustable", slug: "laptop-stand-adjustable", brand: "ErgoTech", price: 39.99, discount: 25, stock: 90, featured: true, description: "Aluminum adjustable laptop stand with 6 height levels. Improves airflow and ergonomics." },
];

const clothingProducts: ProductDef[] = [
  { title: "Premium Cotton T-Shirt", slug: "premium-cotton-tshirt", brand: "UrbanWear", price: 34.99, discount: 0, stock: 300, featured: false, description: "100% organic cotton crew neck tee. Pre-shrunk, ring-spun fabric for lasting comfort." },
  { title: "Slim Fit Denim Jeans", slug: "slim-fit-denim-jeans", brand: "UrbanWear", price: 89.99, discount: 10, stock: 150, featured: true, description: "Stretch denim jeans with modern slim fit. Mid-rise waist, five-pocket styling." },
  { title: "Wool Blend Winter Coat", slug: "wool-blend-winter-coat", brand: "ApexStyle", price: 249.99, discount: 20, stock: 40, featured: true, description: "Classic double-breasted wool blend coat with satin lining. Water-resistant outer shell." },
  { title: "Running Shoes Lightweight", slug: "running-shoes-lightweight", brand: "StridePro", price: 129.99, discount: 15, stock: 85, featured: false, description: "Breathable mesh running shoes with responsive cushioning and 10mm drop." },
  { title: "Casual Linen Shirt", slug: "casual-linen-shirt", brand: "ApexStyle", price: 59.99, discount: 0, stock: 120, featured: false, description: "Relaxed fit linen shirt perfect for summer. Available in 6 colors." },
  { title: "Leather Crossbody Bag", slug: "leather-crossbody-bag", brand: "VaultCraft", price: 179.99, discount: 25, stock: 55, featured: false, description: "Genuine full-grain leather crossbody bag with adjustable strap and multiple pockets." },
  { title: "Athletic Shorts Quick-Dry", slug: "athletic-shorts-quickdry", brand: "StridePro", price: 44.99, discount: 0, stock: 200, featured: false, description: "Moisture-wicking athletic shorts with built-in compression liner and zipper pocket." },
  { title: "Cashmere Blend Scarf", slug: "cashmere-blend-scarf", brand: "ApexStyle", price: 69.99, discount: 30, stock: 70, featured: false, description: "Luxurious cashmere-merino blend scarf. Oversized design, available in 4 neutral tones." },
];

const homeGardenProducts: ProductDef[] = [
  { title: "Cast Iron Dutch Oven", slug: "cast-iron-dutch-oven", brand: "KitchenCraft", price: 89.99, discount: 0, stock: 60, featured: false, description: "6-quart enameled cast iron dutch oven. Even heat distribution, self-basting lid." },
  { title: "Indoor Herb Garden Kit", slug: "indoor-herb-garden-kit", brand: "GreenThumb", price: 49.99, discount: 10, stock: 110, featured: true, description: "Self-watering planter with LED grow lights. Includes basil, cilantro, and mint seeds." },
  { title: "Memory Foam Bed Pillows (2-Pack)", slug: "memory-foam-pillows", brand: "SleepWell", price: 59.99, discount: 20, stock: 200, featured: false, description: "Shredded memory foam pillows with adjustable loft. Bamboo-derived cover, hypoallergenic." },
  { title: "Bamboo Cutting Board Set", slug: "bamboo-cutting-board-set", brand: "KitchenCraft", price: 34.99, discount: 0, stock: 180, featured: false, description: "Set of 3 organic bamboo cutting boards with juice grooves and easy-grip handles." },
  { title: "Scented Soy Candle Collection", slug: "scented-soy-candles", brand: "AmbientGlow", price: 42.99, discount: 15, stock: 250, featured: false, description: "Hand-poured soy wax candles. Set of 4: vanilla, lavender, cedar, and eucalyptus." },
  { title: "Robot Vacuum Cleaner", slug: "robot-vacuum-cleaner", brand: "CleanBot", price: 399.99, discount: 10, stock: 35, featured: true, description: "LiDAR navigation, 2500Pa suction, self-emptying base. Works on carpet and hardwood." },
  { title: "Glass Food Storage Containers", slug: "glass-food-storage", brand: "KitchenCraft", price: 28.99, discount: 0, stock: 300, featured: false, description: "10-piece borosilicate glass container set with airtight bamboo lids. Microwave and oven safe." },
  { title: "Adjustable Plant Stand", slug: "adjustable-plant-stand", brand: "GreenThumb", price: 39.99, discount: 5, stock: 65, featured: false, description: "Tiered bamboo plant stand for 4 pots. Water-resistant finish, fits 6-8 inch pots." },
];

const booksProducts: ProductDef[] = [
  { title: "The Art of Clean Code", slug: "art-of-clean-code", brand: "TechPress", price: 39.99, discount: 0, stock: 90, featured: true, description: "A practical guide to writing maintainable, scalable code. Covers design patterns, refactoring, and testing." },
  { title: "Journey Through the Cosmos", slug: "journey-through-cosmos", brand: "StarBooks", price: 28.99, discount: 10, stock: 75, featured: false, description: "Bestselling illustrated guide to astronomy and space exploration. Includes 200+ full-color photographs." },
  { title: "Modern Mediterranean Cooking", slug: "modern-mediterranean-cooking", brand: "CulinaryPress", price: 34.99, discount: 0, stock: 55, featured: false, description: "120 healthy Mediterranean recipes with seasonal ingredients and step-by-step instructions." },
  { title: "The Silent Algorithm", slug: "the-silent-algorithm", brand: "PageTurner", price: 24.99, discount: 20, stock: 120, featured: false, description: "A gripping techno-thriller about AI, surveillance, and one programmer's fight for privacy." },
  { title: "Watercolor Painting for Beginners", slug: "watercolor-painting", brand: "ArtCraft", price: 22.99, discount: 0, stock: 85, featured: false, description: "Complete beginner's guide to watercolor with 12 practice projects and technique tutorials." },
  { title: "Financial Freedom for Millennials", slug: "financial-freedom-millennials", brand: "WealthPress", price: 19.99, discount: 5, stock: 140, featured: false, description: "Practical investing and budgeting guide tailored for the modern workforce." },
  { title: "The Complete Herbal Handbook", slug: "complete-herbal-handbook", brand: "GreenLife", price: 29.99, discount: 0, stock: 40, featured: false, description: "Encyclopedia of medicinal herbs with cultivation tips, preparation methods, and safety guidelines." },
  { title: "Architecture in the Digital Age", slug: "architecture-digital-age", brand: "DesignPress", price: 45.99, discount: 15, stock: 30, featured: false, description: "Exploring how digital tools and sustainable practices are reshaping modern architecture." },
];

const sportsProducts: ProductDef[] = [
  { title: "Yoga Mat Premium Non-Slip", slug: "yoga-mat-premium", brand: "FlexFit", price: 68.99, discount: 0, stock: 160, featured: false, description: "6mm thick eco-friendly TPE yoga mat with alignment lines. Non-slip surface, carries case included." },
  { title: "Adjustable Dumbbell Set", slug: "adjustable-dumbbell-set", brand: "IronForce", price: 299.99, discount: 10, stock: 25, featured: true, description: "Space-saving adjustable dumbbells from 5-52.5 lbs each. Quick-change weight selection." },
  { title: "Insulated Water Bottle 32oz", slug: "insulated-water-bottle", brand: "HydroMax", price: 34.99, discount: 0, stock: 400, featured: false, description: "Double-wall vacuum insulated stainless steel. Keeps drinks cold 24h or hot 12h." },
  { title: "Resistance Bands Set", slug: "resistance-bands-set", brand: "FlexFit", price: 24.99, discount: 20, stock: 280, featured: false, description: "5-level resistance band set with door anchor, handles, and ankle straps. Portable workout." },
  { title: "Cycling Helmet Aerodynamic", slug: "cycling-helmet-aero", brand: "SpeedGear", price: 119.99, discount: 15, stock: 45, featured: false, description: "Aero road cycling helmet with MIPS protection, 16 vents, and magnetic buckle." },
  { title: "Camping Hammock Double", slug: "camping-hammock-double", brand: "TrailBlazer", price: 54.99, discount: 0, stock: 80, featured: false, description: "Double parachute nylon hammock with tree straps. Supports 500 lbs, packs to soccer ball size." },
  { title: "Jump Rope Speed Cable", slug: "jump-rope-speed", brand: "FlexFit", price: 18.99, discount: 0, stock: 350, featured: false, description: "Adjustable speed jump rope with ball bearings and foam handles. Great for cardio training." },
  { title: "Trekking Poles Carbon Fiber", slug: "trekking-poles-carbon", brand: "TrailBlazer", price: 89.99, discount: 25, stock: 35, featured: false, description: "Adjustable carbon fiber trekking poles with cork grips and anti-shock system." },
];

const beautyProducts: ProductDef[] = [
  { title: "Vitamin C Serum Anti-Aging", slug: "vitamin-c-serum", brand: "GlowLab", price: 42.99, discount: 0, stock: 210, featured: false, description: "20% Vitamin C + Hyaluronic Acid serum. Brightens skin, reduces fine lines and dark spots." },
  { title: "Electric Toothbrush Sonic", slug: "electric-toothbrush-sonic", brand: "SmileBright", price: 79.99, discount: 10, stock: 130, featured: false, description: "Sonic toothbrush with 5 cleaning modes, 2-min timer, and USB-C charging. 30-day battery." },
  { title: "Hair Dryer Ionic Pro", slug: "hair-dryer-ionic", brand: "StyleCraft", price: 119.99, discount: 20, stock: 65, featured: true, description: "Professional ionic hair dryer with 3 heat settings, concentrator, and diffuser attachments." },
  { title: "Organic Face Moisturizer", slug: "organic-face-moisturizer", brand: "GlowLab", price: 36.99, discount: 0, stock: 190, featured: false, description: "Lightweight organic face cream with aloe vera, jojoba oil, and green tea extract." },
  { title: "Essential Oil Diffuser", slug: "essential-oil-diffuser", brand: "AromaZen", price: 32.99, discount: 5, stock: 95, featured: false, description: "Ultrasonic aromatherapy diffuser with 7-color LED, 200ml capacity, and auto shut-off." },
  { title: "Beard Trimmer Precision", slug: "beard-trimmer-precision", brand: "StyleCraft", price: 54.99, discount: 0, stock: 110, featured: false, description: "Waterproof beard trimmer with 20 length settings, titanium blades, and vacuum system." },
  { title: "Sunscreen SPF 50 Daily", slug: "sunscreen-spf50-daily", brand: "GlowLab", price: 24.99, discount: 0, stock: 320, featured: false, description: "Lightweight, non-greasy daily sunscreen with zinc oxide. Reef-safe and fragrance-free." },
  { title: "Massage Gun Deep Tissue", slug: "massage-gun-deep-tissue", brand: "RelaxPro", price: 149.99, discount: 15, stock: 40, featured: false, description: "Percussion massage gun with 6 heads, 20 speed levels, and ultra-quiet motor." },
];

const toysProducts: ProductDef[] = [
  { title: "Building Blocks Creative Set", slug: "building-blocks-creative", brand: "BuildFun", price: 59.99, discount: 0, stock: 80, featured: true, description: "800-piece building block set with base plates, wheels, and special pieces. Ages 4+." },
  { title: "Remote Control Racing Car", slug: "rc-racing-car", brand: "TurboToys", price: 44.99, discount: 10, stock: 60, featured: false, description: "4WD RC car with 30mph top speed, rechargeable battery, and extra set of wheels." },
  { title: "Board Game Strategy Edition", slug: "board-game-strategy", brand: "GameNight", price: 39.99, discount: 0, stock: 45, featured: false, description: "Award-winning strategy board game for 2-6 players. Average play time 60 minutes." },
  { title: "Plush Teddy Bear Giant", slug: "plush-teddy-bear-giant", brand: "SnuggleHug", price: 49.99, discount: 15, stock: 35, featured: false, description: "4-foot超大 plush teddy bear made from ultra-soft materials. Hypoallergenic filling." },
  { title: "Science Experiment Kit", slug: "science-experiment-kit", brand: "BrainLab", price: 34.99, discount: 0, stock: 55, featured: false, description: "50+ science experiments for kids ages 8-14. Includes chemicals, tools, and illustrated guide." },
  { title: "Puzzle 1000-Piece Landscape", slug: "puzzle-1000-landscape", brand: "PuzzleCraft", price: 22.99, discount: 0, stock: 100, featured: false, description: "Premium 1000-piece puzzle featuring a scenic mountain landscape. Anti-glare surface." },
  { title: "Card Game Family Fun Pack", slug: "card-game-family-fun", brand: "GameNight", price: 14.99, discount: 0, stock: 300, featured: false, description: "5 classic card games in one box. Perfect for family game night, ages 6+." },
  { title: "Drone with Camera HD", slug: "drone-with-camera", brand: "SkyView", price: 199.99, discount: 20, stock: 20, featured: true, description: "Foldable drone with 4K camera, GPS positioning, 30-min flight time, and one-key return." },
];

const automotiveProducts: ProductDef[] = [
  { title: "Dashboard Camera 4K", slug: "dashboard-camera-4k", brand: "DriveCam", price: 129.99, discount: 0, stock: 70, featured: false, description: "4K dash cam with night vision, parking mode, and wide-angle lens. 64GB included." },
  { title: "Car Phone Mount Magnetic", slug: "car-phone-mount-magnetic", brand: "MountPro", price: 29.99, discount: 0, stock: 400, featured: false, description: "Strong magnetic phone mount for dashboard/vent. 360° rotation, one-hand operation." },
  { title: "Portable Jump Starter", slug: "portable-jump-starter", brand: "PowerPack", price: 89.99, discount: 10, stock: 45, featured: true, description: "2000A peak jump starter with USB power bank. Starts engines up to 8L gas/6L diesel." },
  { title: "Car Vacuum Cleaner Handheld", slug: "car-vacuum-handheld", brand: "CleanBot", price: 49.99, discount: 5, stock: 80, featured: false, description: "Cordless handheld vacuum with HEPA filter, LED light, and crevice tool. 8000Pa suction." },
  { title: "LED Interior Lights Kit", slug: "led-interior-lights-kit", brand: "LightUp", price: 24.99, discount: 0, stock: 200, featured: false, description: "App-controlled RGB LED strip kit with 16 colors, music sync, and 4 strips for full interior." },
  { title: "Tire Inflator Portable", slug: "tire-inflator-portable", brand: "AirFlow", price: 44.99, discount: 0, stock: 110, featured: false, description: "Digital tire inflator with auto shut-off. Inflates car tire in 5 minutes. LED light included." },
  { title: "Car Seat Organizer", slug: "car-seat-organizer", brand: "TravelGear", price: 19.99, discount: 0, stock: 280, featured: false, description: "Waterproof backseat organizer with tablet holder, 5 pockets, and snack pouch." },
  { title: "Windshield Sun Shade", slug: "windshield-sun-shade", brand: "CoolShade", price: 22.99, discount: 20, stock: 160, featured: false, description: "Custom-fit reflective sun shade. Blocks 99% of UV rays, reduces interior temperature." },
];

const foodProducts: ProductDef[] = [
  { title: "Organic Coffee Beans Medium Roast", slug: "organic-coffee-beans", brand: "FreshBrew", price: 24.99, discount: 0, stock: 150, featured: false, description: "Single-origin organic Arabica coffee beans. Medium roast with chocolate and citrus notes." },
  { title: "Premium Matcha Green Tea Powder", slug: "premium-matcha-powder", brand: "ZenTea", price: 34.99, discount: 10, stock: 80, featured: false, description: "Ceremonial grade Japanese matcha. Stone-ground, vibrant green, smooth taste." },
  { title: "Artisan Dark Chocolate Collection", slug: "artisan-dark-chocolate", brand: "CacaoFine", price: 29.99, discount: 0, stock: 120, featured: true, description: "Set of 6 single-origin dark chocolate bars from Peru, Madagascar, and Ghana." },
  { title: "Extra Virgin Olive Oil Cold Pressed", slug: "extra-virgin-olive-oil", brand: "TuscanyGold", price: 39.99, discount: 5, stock: 60, featured: false, description: "First cold-pressed Italian olive oil from Tuscany. Rich, peppery finish." },
  { title: "Trail Mix Deluxe 2lb", slug: "trail-mix-deluxe", brand: "NutHouse", price: 18.99, discount: 0, stock: 200, featured: false, description: "Premium trail mix with almonds, cashews, dried cranberries, dark chocolate chips." },
  { title: "Organic Honey Raw Wildflower", slug: "organic-honey-wildflower", brand: "BeePure", price: 16.99, discount: 0, stock: 90, featured: false, description: "Unfiltered raw wildflower honey from California. Never heated, never processed." },
  { title: "Protein Bars Variety Pack (12)", slug: "protein-bars-variety-pack", brand: "FitFuel", price: 28.99, discount: 15, stock: 300, featured: false, description: "12 plant-based protein bars in 4 flavors. 20g protein, 5g fiber, no artificial sweeteners." },
  { title: "Hot Sauce Collection Set", slug: "hot-sauce-collection", brand: "FireBottle", price: 32.99, discount: 0, stock: 75, featured: false, description: "6 artisan hot sauces ranging from mild to extreme. Small-batch fermented, no additives." },
];

const musicProducts: ProductDef[] = [
  { title: "Acoustic Guitar Dreadnought", slug: "acoustic-guitar-dreadnought", brand: "MelodyCraft", price: 299.99, discount: 10, stock: 15, featured: true, description: "Full-size dreadnought acoustic guitar with solid spruce top and mahogany back and sides." },
  { title: "Digital Audio Workstation USB Mic", slug: "usb-microphone-daw", brand: "SoundCapture", price: 149.99, discount: 0, stock: 40, featured: false, description: "Condenser USB microphone for recording and streaming. Built-in pop filter and gain control." },
  { title: "Vinyl Record Player Turntable", slug: "vinyl-record-player-turntable", brand: "RetroSound", price: 199.99, discount: 15, stock: 25, featured: false, description: "Belt-driven turntable with built-in speakers, Bluetooth output, and USB recording." },
  { title: "Studio Monitor Headphones", slug: "studio-monitor-headphones", brand: "SoundCapture", price: 179.99, discount: 0, stock: 35, featured: false, description: "Closed-back reference headphones with flat frequency response. 45mm neodymium drivers." },
  { title: "Electronic Keyboard 61-Key", slug: "electronic-keyboard-61key", brand: "MelodyCraft", price: 249.99, discount: 20, stock: 20, featured: false, description: "61-key portable keyboard with 500 sounds, 200 rhythms, and LCD display." },
  { title: "Ukulele Soprano Starter Kit", slug: "ukulele-soprano-starter", brand: "MelodyCraft", price: 49.99, discount: 0, stock: 60, featured: false, description: "Soprano ukulele with carrying bag, tuner, and online lesson access. Mahogany construction." },
  { title: "Bluetooth Earbuds True Wireless", slug: "bt-earbuds-true-wireless", brand: "SoundWave", price: 129.99, discount: 10, stock: 145, featured: false, description: "True wireless earbuds with ANC, IPX5 water resistance, and 30-hour total battery." },
  { title: "Guitar Pedal Multi-Effects", slug: "guitar-pedal-multi-effects", brand: "SoundCapture", price: 219.99, discount: 0, stock: 18, featured: false, description: "Multi-effects processor with 100+ effects, looper, drum machine, and expression pedal input." },
];

const allProductDefs = [
  ...electronicsProducts.map((p) => ({ ...p, categoryIdx: 1 })),
  ...clothingProducts.map((p) => ({ ...p, categoryIdx: 2 })),
  ...homeGardenProducts.map((p) => ({ ...p, categoryIdx: 3 })),
  ...booksProducts.map((p) => ({ ...p, categoryIdx: 4 })),
  ...sportsProducts.map((p) => ({ ...p, categoryIdx: 5 })),
  ...beautyProducts.map((p) => ({ ...p, categoryIdx: 6 })),
  ...toysProducts.map((p) => ({ ...p, categoryIdx: 7 })),
  ...automotiveProducts.map((p) => ({ ...p, categoryIdx: 8 })),
  ...foodProducts.map((p) => ({ ...p, categoryIdx: 9 })),
  ...musicProducts.map((p) => ({ ...p, categoryIdx: 10 })),
];

const brands = ["SoundWave", "ViewPro", "GameType", "ConnectPro", "ErgoTech", "HomeSync", "UrbanWear", "ApexStyle", "StridePro", "VaultCraft", "KitchenCraft", "GreenThumb", "SleepWell", "AmbientGlow", "CleanBot", "TechPress", "StarBooks", "CulinaryPress", "PageTurner", "ArtCraft", "WealthPress", "GreenLife", "DesignPress", "FlexFit", "IronForce", "HydroMax", "SpeedGear", "TrailBlazer", "GlowLab", "SmileBright", "StyleCraft", "AromaZen", "RelaxPro", "BuildFun", "TurboToys", "GameNight", "SnuggleHug", "BrainLab", "PuzzleCraft", "SkyView", "DriveCam", "MountPro", "PowerPack", "LightUp", "AirFlow", "TravelGear", "CoolShade", "FreshBrew", "ZenTea", "CacaoFine", "TuscanyGold", "NutHouse", "BeePure", "FitFuel", "FireBottle", "MelodyCraft", "SoundCapture", "RetroSound"];

const reviewComments = [
  "Excellent quality, exceeded my expectations. Would highly recommend.",
  "Good product for the price. Does what it says.",
  "Decent quality but shipping took longer than expected.",
  "Perfect! Exactly as described. Very happy with my purchase.",
  "Not bad but I've seen better options at this price point.",
  "Great build quality and comfortable to use daily.",
  "Amazing value for money. Already recommended to friends.",
  "It works fine but the packaging could be better.",
  "Outstanding product with premium feel. Worth every penny.",
  "Had some minor issues but customer service was helpful.",
  "Very satisfied with this purchase. Would buy again.",
  "Average quality, nothing special but gets the job done.",
  "Top-notch quality and fast delivery. Very impressed.",
  "Exactly what I needed. No complaints at all.",
  "Pretty good overall. A few small design flaws but nothing major.",
];

async function seedProductsAndImages(categoryRecords: Awaited<ReturnType<typeof seedCategories>>) {
  const categoryMap = new Map(categoryRecords.map((c) => [c.slug, c]));

  const productRecords: (typeof products.$inferInsert)[] = [];
  const imageRecords: (typeof productImages.$inferInsert)[] = [];

  for (let i = 0; i < allProductDefs.length; i++) {
    const def = allProductDefs[i];
    const catSlug = categoryRecords[def.categoryIdx - 1].slug;
    const categoryId = categoryMap.get(catSlug)!.id;
    const productId = seedId("product", i + 1);
    const createdAt = new Date(2025, 0, 1 + Math.floor(Math.random() * 180));

    productRecords.push({
      id: productId,
      title: def.title,
      slug: def.slug,
      description: def.description,
      categoryId,
      brand: def.brand,
      price: def.price.toString(),
      discount: def.discount.toString(),
      stock: def.stock,
      featured: def.featured,
      features: deriveFeatures(def),
      specifications: deriveSpecifications(def),
      createdAt,
      updatedAt: createdAt,
    });

    const imageCount = 3 + (i % 3);
    for (let j = 0; j < imageCount; j++) {
      imageRecords.push({
        id: seedId("image", i * 10 + j),
        productId,
        imageUrl: `https://picsum.photos/seed/${def.slug}-${j}/640/480`,
        alt: `${def.title} - Image ${j + 1}`,
        order: j,
      });
    }
  }

  await db.insert(products).values(productRecords);

  for (let i = 0; i < imageRecords.length; i += 50) {
    await db.insert(productImages).values(imageRecords.slice(i, i + 50));
  }

  return productRecords;
}

async function seedReviews(
  userRecords: Awaited<ReturnType<typeof seedUsers>>,
  productRecords: Awaited<ReturnType<typeof seedProductsAndImages>>,
) {
  const customerRecords = userRecords.slice(1);
  const reviewRecords: (typeof reviews.$inferInsert)[] = [];

  for (let pi = 0; pi < productRecords.length; pi++) {
    const reviewCount = 2 + (pi % 4);
    for (let ri = 0; ri < reviewCount; ri++) {
      const userIdx = (pi * 7 + ri * 13) % customerRecords.length;
      const reviewId = seedId("review", pi * 10 + ri);
      const rating = [3, 4, 4, 4, 5, 5, 5, 2, 5, 4][(pi + ri) % 10];
      const commentIdx = (pi + ri) % reviewComments.length;

      reviewRecords.push({
        id: reviewId,
        userId: customerRecords[userIdx].id!,
        productId: productRecords[pi].id!,
        rating,
        comment: reviewComments[commentIdx],
        status: "approved",
        createdAt: new Date(2025, 2, 1 + (pi * 3 + ri) % 200),
        updatedAt: new Date(2025, 2, 1 + (pi * 3 + ri) % 200),
      });
    }
  }

  for (let i = 0; i < reviewRecords.length; i += 50) {
    await db.insert(reviews).values(reviewRecords.slice(i, i + 50));
  }

  return reviewRecords;
}

async function seedAddresses(userRecords: Awaited<ReturnType<typeof seedUsers>>) {
  const customerRecords = userRecords.slice(1);
  const addressRecords: (typeof addresses.$inferInsert)[] = [];
  const cities = [
    { city: "New York", state: "NY", country: "United States" },
    { city: "Los Angeles", state: "CA", country: "United States" },
    { city: "Chicago", state: "IL", country: "United States" },
    { city: "Houston", state: "TX", country: "United States" },
    { city: "Seattle", state: "WA", country: "United States" },
  ];

  for (let i = 0; i < customerRecords.length; i++) {
    const loc = cities[i % cities.length];
    addressRecords.push({
      id: seedId("address", i + 1),
      userId: customerRecords[i].id!,
      label: "Home",
      street: `${100 + i * 50} ${["Main St", "Oak Ave", "Elm St", "Park Blvd", "Cedar Ln"][i % 5]}`,
      city: loc.city,
      state: loc.state,
      postalCode: `${10000 + i * 111}`,
      country: loc.country,
      isDefault: true,
    });

    addressRecords.push({
      id: seedId("address", 100 + i + 1),
      userId: customerRecords[i].id!,
      label: "Work",
      street: `${200 + i * 50} ${["Broadway", "Market St", "Tech Dr", "Commerce Ave", "Innovation Way"][i % 5]}`,
      city: loc.city,
      state: loc.state,
      postalCode: `${20000 + i * 111}`,
      country: loc.country,
      isDefault: false,
    });
  }

  await db.insert(addresses).values(addressRecords);
  return addressRecords;
}

async function seedCartsAndItems(
  userRecords: Awaited<ReturnType<typeof seedUsers>>,
  productRecords: Awaited<ReturnType<typeof seedProductsAndImages>>,
) {
  const customerRecords = userRecords.slice(1, 6);

  for (let i = 0; i < customerRecords.length; i++) {
    const cartId = seedId("cart", i + 1);
    await db.insert(carts).values({
      id: cartId,
      userId: customerRecords[i].id!,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const itemsCount = 2 + i;
    const cartItemRecords: (typeof cartItems.$inferInsert)[] = [];
    for (let j = 0; j < itemsCount; j++) {
      const productIdx = (i * 5 + j * 7) % productRecords.length;
      cartItemRecords.push({
        id: seedId("cartItem", i * 10 + j),
        cartId,
        productId: productRecords[productIdx].id!,
        quantity: 1 + (j % 3),
      });
    }
    await db.insert(cartItems).values(cartItemRecords);
  }
}

async function seedWishlistItems(
  userRecords: Awaited<ReturnType<typeof seedUsers>>,
  productRecords: Awaited<ReturnType<typeof seedProductsAndImages>>,
) {
  const customerRecords = userRecords.slice(2, 8);
  const wishlistRecords: (typeof wishlistItems.$inferInsert)[] = [];

  for (let i = 0; i < customerRecords.length; i++) {
    for (let j = 0; j < 3; j++) {
      const productIdx = (i * 11 + j * 13) % productRecords.length;
      wishlistRecords.push({
        id: seedId("wishlist", i * 10 + j),
        userId: customerRecords[i].id!,
        productId: productRecords[productIdx].id!,
        createdAt: new Date(2025, 3, 1 + (i * 5 + j) % 30),
      });
    }
  }

  await db.insert(wishlistItems).values(wishlistRecords);
}

async function seedOrders(
  userRecords: Awaited<ReturnType<typeof seedUsers>>,
  productRecords: Awaited<ReturnType<typeof seedProductsAndImages>>,
) {
  const customerRecords = userRecords.slice(1, 8);
  const orderRecords: (typeof orders.$inferInsert)[] = [];
  const orderItemsRecords: (typeof orderItems.$inferInsert)[] = [];

  const orderDefs = [
    { userIdx: 0, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 60, itemCount: 2 },
    { userIdx: 0, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 45, itemCount: 3 },
    { userIdx: 0, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 20, itemCount: 1 },
    { userIdx: 1, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 55, itemCount: 4 },
    { userIdx: 1, status: "shipped" as const, paymentStatus: "completed" as const, daysAgo: 5, itemCount: 2 },
    { userIdx: 2, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 30, itemCount: 1 },
    { userIdx: 2, status: "processing" as const, paymentStatus: "completed" as const, daysAgo: 3, itemCount: 3 },
    { userIdx: 3, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 90, itemCount: 2 },
    { userIdx: 3, status: "cancelled" as const, paymentStatus: "failed" as const, daysAgo: 10, itemCount: 1 },
    { userIdx: 3, status: "pending" as const, paymentStatus: "pending" as const, daysAgo: 0, itemCount: 2 },
    { userIdx: 4, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 40, itemCount: 3 },
    { userIdx: 4, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 15, itemCount: 2 },
    { userIdx: 5, status: "paid" as const, paymentStatus: "completed" as const, daysAgo: 2, itemCount: 1 },
    { userIdx: 5, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 70, itemCount: 4 },
    { userIdx: 6, status: "cancelled" as const, paymentStatus: "refunded" as const, daysAgo: 25, itemCount: 2 },
    { userIdx: 6, status: "processing" as const, paymentStatus: "completed" as const, daysAgo: 4, itemCount: 1 },
    { userIdx: 6, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 50, itemCount: 3 },
    { userIdx: 1, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 80, itemCount: 2 },
    { userIdx: 2, status: "shipped" as const, paymentStatus: "completed" as const, daysAgo: 7, itemCount: 1 },
    { userIdx: 4, status: "pending" as const, paymentStatus: "pending" as const, daysAgo: 0, itemCount: 3 },
    { userIdx: 0, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 100, itemCount: 5 },
    { userIdx: 3, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 35, itemCount: 2 },
    { userIdx: 5, status: "delivered" as const, paymentStatus: "completed" as const, daysAgo: 65, itemCount: 1 },
    { userIdx: 6, status: "paid" as const, paymentStatus: "completed" as const, daysAgo: 1, itemCount: 2 },
    { userIdx: 2, status: "cancelled" as const, paymentStatus: "failed" as const, daysAgo: 12, itemCount: 2 },
  ];

  let orderItemIdx = 0;

  for (let oi = 0; oi < orderDefs.length; oi++) {
    const def = orderDefs[oi];
    const orderId = seedId("order", oi + 1);
    const createdAt = new Date(Date.now() - def.daysAgo * 86400000);
    let total = 0;

    const items: (typeof orderItems.$inferInsert)[] = [];
    for (let j = 0; j < def.itemCount; j++) {
      const productIdx = (oi * 7 + j * 11) % productRecords.length;
      const product = productRecords[productIdx];
      const productPrice = product.price!;
      const price = parseFloat(productPrice);
      const quantity = 1 + (j % 2);
      total += price * quantity;
      items.push({
        id: seedId("orderItem", ++orderItemIdx),
        orderId,
        productId: product.id!,
        quantity,
        price: productPrice,
        productName: product.title!,
      });
    }

    orderRecords.push({
      id: orderId,
      userId: customerRecords[def.userIdx].id!,
      total: total.toFixed(2),
      status: def.status,
      paymentStatus: def.paymentStatus,
      createdAt,
      updatedAt: createdAt,
    });

    orderItemsRecords.push(...items);
  }

  await db.insert(orders).values(orderRecords);
  await db.insert(orderItems).values(orderItemsRecords);
}

async function seedCoupons() {
  const couponRecords: (typeof coupons.$inferInsert)[] = [
    {
      id: seedId("coupon", 1),
      code: "SAVE10",
      type: "percentage",
      value: "10",
      minPurchase: "50",
      maxUsage: 500,
      currentUsage: 42,
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    },
    {
      id: seedId("coupon", 2),
      code: "FLAT50",
      type: "fixed",
      value: "50",
      minPurchase: "200",
      maxUsage: 100,
      currentUsage: 15,
      isActive: true,
      expiresAt: new Date("2026-06-30"),
    },
    {
      id: seedId("coupon", 3),
      code: "EXPIRED20",
      type: "percentage",
      value: "20",
      maxUsage: 100,
      currentUsage: 100,
      isActive: false,
      expiresAt: new Date("2025-01-01"),
    },
    {
      id: seedId("coupon", 4),
      code: "NEWUSER",
      type: "percentage",
      value: "15",
      minPurchase: "25",
      maxUsage: 200,
      currentUsage: 88,
      isActive: true,
      expiresAt: new Date("2026-09-30"),
    },
    {
      id: seedId("coupon", 5),
      code: "WELCOMEBACK",
      type: "fixed",
      value: "25",
      minPurchase: "100",
      maxUsage: 50,
      currentUsage: 0,
      isActive: true,
      expiresAt: new Date("2026-03-31"),
    },
    {
      id: seedId("coupon", 6),
      code: "FREESHIP",
      type: "fixed",
      value: "0",
      isActive: true,
      expiresAt: new Date("2026-12-31"),
    },
  ];

  await db.insert(coupons).values(couponRecords);
  return couponRecords;
}

async function seedCouponUsages(
  userRecords: Awaited<ReturnType<typeof seedUsers>>,
  couponRecords: Awaited<ReturnType<typeof seedCoupons>>,
) {
  // Add some usage history on completed orders
  // We'll associate coupon usage with specific users who have orders
  const usageRecords: (typeof couponUsages.$inferInsert)[] = [
    {
      id: seedId("couponUsage", 1),
      couponId: couponRecords[0].id!, // SAVE10
      userId: userRecords[2].id!,     // John
      usedAt: new Date(Date.now() - 20 * 86400000),
    },
    {
      id: seedId("couponUsage", 2),
      couponId: couponRecords[1].id!, // FLAT50
      userId: userRecords[3].id!,     // Jane
      usedAt: new Date(Date.now() - 55 * 86400000),
    },
    {
      id: seedId("couponUsage", 3),
      couponId: couponRecords[3].id!, // NEWUSER
      userId: userRecords[6].id!,     // Charlie
      usedAt: new Date(Date.now() - 70 * 86400000),
    },
    {
      id: seedId("couponUsage", 4),
      couponId: couponRecords[3].id!, // NEWUSER
      userId: userRecords[7].id!,     // Diana
      usedAt: new Date(Date.now() - 50 * 86400000),
    },
    {
      id: seedId("couponUsage", 5),
      couponId: couponRecords[0].id!, // SAVE10
      userId: userRecords[4].id!,     // Bob
      usedAt: new Date(Date.now() - 30 * 86400000),
    },
  ];

  await db.insert(couponUsages).values(usageRecords);
}

// ---------------------------------------------------------------------------
// Main entry
// ---------------------------------------------------------------------------

async function main() {
  console.log("Clearing existing data...");
  await clearAll();

  console.log("Seeding users...");
  const userRecords = await seedUsers();

  console.log("Seeding categories...");
  const categoryRecords = await seedCategories();

  console.log("Seeding products and images...");
  const productRecords = await seedProductsAndImages(categoryRecords);

  console.log("Seeding reviews...");
  await seedReviews(userRecords, productRecords);

  console.log("Seeding addresses...");
  await seedAddresses(userRecords);

  console.log("Seeding carts and cart items...");
  await seedCartsAndItems(userRecords, productRecords);

  console.log("Seeding wishlist items...");
  await seedWishlistItems(userRecords, productRecords);

  console.log("Seeding orders and order items...");
  await seedOrders(userRecords, productRecords);

  console.log("Seeding coupons...");
  const couponRecords = await seedCoupons();

  console.log("Seeding coupon usages...");
  await seedCouponUsages(userRecords, couponRecords);

  console.log("Seed complete!");
  console.log(`  Users: ${userRecords.length}`);
  console.log(`  Categories: ${categoryRecords.length}`);
  console.log(`  Products: ${productRecords.length}`);
  console.log(`  Orders: 25`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
