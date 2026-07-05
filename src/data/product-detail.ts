export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface ProductDetailData {
  shortDescription: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  gallery: string[];
  reviews: Review[];
  sku: string;
}

function gallery(...seeds: string[]): string[] {
  return seeds.map((s) => `https://picsum.photos/seed/${s}/800/800`);
}

const data: Record<string, ProductDetailData> = {
  "wireless-nc-headphones": {
    sku: "SN-HP-1001",
    shortDescription: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and ultra-comfortable over-ear design.",
    description:
      "Experience sound like never before with our flagship wireless noise-cancelling headphones. Featuring advanced adaptive noise cancellation that automatically adjusts to your environment, these headphones deliver pristine audio quality across all frequencies. The premium memory foam ear cushions and lightweight design ensure all-day comfort, while the fold-flat mechanism makes them perfect for travel. With multipoint Bluetooth connectivity, you can seamlessly switch between your phone, laptop, and tablet.",
    features: [
      "Adaptive Active Noise Cancellation (ANC) with ambient sound mode",
      "30-hour battery life with quick 10-minute charge for 3 hours of playback",
      "40mm custom drivers with Hi-Res Audio certification",
      "Bluetooth 5.3 with multipoint connection for up to 3 devices",
      "Built-in microphone array with wind reduction for crystal-clear calls",
      "Fold-flat design with premium hard-shell carrying case",
      "Touch controls for volume, playback, and voice assistant",
      "Works with companion app for custom EQ and sound profiles",
    ],
    specifications: {
      "Driver Size": "40mm dynamic",
      "Frequency Response": "20Hz – 40kHz",
      "Impedance": "32Ω",
      "Bluetooth Version": "5.3",
      "Battery Life": "30 hours (ANC on)",
      "Charging": "USB-C, 10W fast charge",
      "Weight": "250g",
      "Warranty": "2 years",
    },
    gallery: gallery("detail-hp-1", "detail-hp-2", "detail-hp-3", "detail-hp-4"),
    reviews: [
      { id: "r1", author: "Alex Chen", avatar: "https://picsum.photos/seed/alex-c/100/100", rating: 5, date: "2026-06-15", comment: "Best headphones I've ever owned. The noise cancellation is incredible — I can't hear a thing on my commute. Sound quality is top-notch with rich bass and clear highs." },
      { id: "r2", author: "Maria Santos", avatar: "https://picsum.photos/seed/maria-s/100/100", rating: 4, date: "2026-05-28", comment: "Great sound and comfort. Battery life is as advertised. Only gripe is the touch controls can be a bit sensitive sometimes, but overall fantastic value." },
      { id: "r3", author: "David Kim", avatar: "https://picsum.photos/seed/david-k/100/100", rating: 5, date: "2026-04-10", comment: "Upgraded from an older model and the difference is night and day. The multipoint Bluetooth is a game-changer for switching between work and personal devices." },
    ],
  },
  "4k-ultra-hd-monitor": {
    sku: "SN-MN-2002",
    shortDescription: "27-inch 4K UHD monitor with IPS panel, HDR400 support, and USB-C connectivity for professionals and creators.",
    description:
      "Transform your workspace with this stunning 27-inch 4K UHD monitor. The IPS panel delivers vibrant colors and wide viewing angles, making it perfect for creative professionals, developers, and productivity enthusiasts. With HDR400 support, you get enhanced contrast and brighter highlights. The USB-C port provides 65W power delivery — charge your laptop and display video with a single cable.",
    features: [
      "27-inch 4K UHD (3840 × 2160) IPS panel",
      "HDR400 support with 350 nits typical brightness",
      "99% sRGB and 95% DCI-P3 color gamut coverage",
      "USB-C with 65W power delivery and DisplayPort Alt Mode",
      "Height, tilt, swivel, and pivot adjustable stand",
      "Built-in 3W × 2 speakers",
      "TUV Rheinland certified for low blue light and flicker-free",
      "VESA mount compatible (100 × 100mm)",
    ],
    specifications: {
      "Screen Size": "27 inches",
      "Resolution": "3840 × 2160 (4K UHD)",
      "Panel Type": "IPS",
      "Refresh Rate": "60Hz",
      "Response Time": "5ms (GTG)",
      "Brightness": "350 nits",
      "Color Gamut": "99% sRGB, 95% DCI-P3",
      "Connectivity": "USB-C (65W PD), HDMI 2.0 × 2, DP 1.4",
      "Weight": "6.2 kg (with stand)",
    },
    gallery: gallery("detail-mn-1", "detail-mn-2", "detail-mn-3", "detail-mn-4"),
    reviews: [
      { id: "r4", author: "Jordan Lee", avatar: "https://picsum.photos/seed/jordan-l/100/100", rating: 5, date: "2026-06-20", comment: "Excellent monitor for the price. The USB-C with power delivery is incredibly convenient — one cable for my MacBook. Colors are accurate right out of the box." },
      { id: "r5", author: "Priya Patel", avatar: "https://picsum.photos/seed/priya-p/100/100", rating: 4, date: "2026-05-12", comment: "Great picture quality and the stand is very sturdy. Would have liked 120Hz for gaming, but for productivity work this monitor is fantastic." },
    ],
  },
  "premium-cotton-tshirt": {
    sku: "SN-AP-3003",
    shortDescription: "Ultra-soft 100% organic cotton t-shirt with a modern slim fit. Pre-shrunk fabric with reinforced stitching for lasting wear.",
    description:
      "Crafted from premium 100% organic cotton grown without pesticides or synthetic fertilizers, this t-shirt delivers exceptional softness and breathability. The 180 GSM jersey fabric is pre-shrunk to maintain its shape wash after wash. Reinforced double-stitched seams and a ribbed collar ensure durability. The modern slim fit is tailored to flatter without being restrictive, making it perfect for both casual and layered looks.",
    features: [
      "100% organic combed ring-spun cotton (180 GSM)",
      "Pre-shrunk fabric — will not shrink in the wash",
      "Reinforced double-needle stitching at sleeves and hem",
      "Ribbed collar with Lycra for shape retention",
      "Taped neck and shoulder seams for added durability",
      "Modern slim fit — size up for a relaxed look",
      "OEKO-TEX Standard 100 certified",
      "Available in 12 colors",
    ],
    specifications: {
      "Material": "100% organic cotton",
      "Weight": "180 GSM",
      "Fit": "Slim",
      "Collar": "Ribbed crew neck",
      "Sleeves": "Short (set-in)",
      "Care": "Machine wash cold, tumble dry low",
      "Certification": "OEKO-TEX Standard 100",
      "Origin": "Made in Portugal",
    },
    gallery: gallery("detail-ts-1", "detail-ts-2", "detail-ts-3"),
    reviews: [
      { id: "r6", author: "Sam Wilson", avatar: "https://picsum.photos/seed/sam-w/100/100", rating: 5, date: "2026-06-18", comment: "Finally, a t-shirt that doesn't shrink! The fit is perfect and the fabric feels amazing. I've ordered three more in different colors." },
      { id: "r7", author: "Olivia Brown", avatar: "https://picsum.photos/seed/olivia-b/100/100", rating: 4, date: "2026-05-30", comment: "Very soft and comfortable. The slim fit runs slightly smaller than expected, so I'd recommend sizing up if you prefer a looser fit." },
    ],
  },
};

export function getProductDetail(slug: string): ProductDetailData | undefined {
  return data[slug];
}

export function getAllProductSlugs(): string[] {
  return Object.keys(data);
}
