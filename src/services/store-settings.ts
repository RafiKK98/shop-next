import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache";
import { db } from "@/db";
import { storeSettings } from "@/db/schema";

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  supportEmail: string;
  supportPhone: string;
  businessAddress: string;
  timeZone: string;
  currency: string;
  defaultLanguage: string;

  storeLogo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;

  taxRate: number;
  freeShippingThreshold: number;
  defaultShippingCost: number;
  lowStockThreshold: number;
  currencySymbol: string;

  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  defaultKeywords: string;

  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const DEFAULTS: StoreSettings = {
  storeName: "My Store",
  storeDescription: "",
  supportEmail: "",
  supportPhone: "",
  businessAddress: "",
  timeZone: "UTC",
  currency: "USD",
  defaultLanguage: "en",

  storeLogo: "",
  favicon: "",
  primaryColor: "#570df8",
  secondaryColor: "#f000b8",

  taxRate: 8,
  freeShippingThreshold: 100,
  defaultShippingCost: 9.99,
  lowStockThreshold: 10,
  currencySymbol: "$",

  metaTitle: "",
  metaDescription: "",
  ogImage: "",
  defaultKeywords: "",

  maintenanceMode: false,
  maintenanceMessage: "We are currently undergoing maintenance. Please check back soon.",
};

function parseNumber(val: string | null | undefined, fallback: number): number {
  if (val === null || val === undefined || val === "") return fallback;
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function parseBoolean(val: string | null | undefined, fallback: boolean): boolean {
  if (val === null || val === undefined) return fallback;
  return val === "true" || val === "1";
}

export async function getStoreSettings(): Promise<StoreSettings> {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.STORE_SETTINGS);

  const rows = await db.select().from(storeSettings);

  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(row.key, row.value);
  }

  const get = (key: string): string | null => map.get(key) ?? null;

  return {
    storeName: get("store_name") ?? DEFAULTS.storeName,
    storeDescription: get("store_description") ?? DEFAULTS.storeDescription,
    supportEmail: get("support_email") ?? DEFAULTS.supportEmail,
    supportPhone: get("support_phone") ?? DEFAULTS.supportPhone,
    businessAddress: get("business_address") ?? DEFAULTS.businessAddress,
    timeZone: get("time_zone") ?? DEFAULTS.timeZone,
    currency: get("currency") ?? DEFAULTS.currency,
    defaultLanguage: get("default_language") ?? DEFAULTS.defaultLanguage,

    storeLogo: get("store_logo") ?? DEFAULTS.storeLogo,
    favicon: get("favicon") ?? DEFAULTS.favicon,
    primaryColor: get("primary_color") ?? DEFAULTS.primaryColor,
    secondaryColor: get("secondary_color") ?? DEFAULTS.secondaryColor,

    taxRate: parseNumber(get("tax_rate"), DEFAULTS.taxRate),
    freeShippingThreshold: parseNumber(get("free_shipping_threshold"), DEFAULTS.freeShippingThreshold),
    defaultShippingCost: parseNumber(get("default_shipping_cost"), DEFAULTS.defaultShippingCost),
    lowStockThreshold: parseNumber(get("low_stock_threshold"), DEFAULTS.lowStockThreshold),
    currencySymbol: get("currency_symbol") ?? DEFAULTS.currencySymbol,

    metaTitle: get("meta_title") ?? DEFAULTS.metaTitle,
    metaDescription: get("meta_description") ?? DEFAULTS.metaDescription,
    ogImage: get("og_image") ?? DEFAULTS.ogImage,
    defaultKeywords: get("default_keywords") ?? DEFAULTS.defaultKeywords,

    maintenanceMode: parseBoolean(get("maintenance_mode"), DEFAULTS.maintenanceMode),
    maintenanceMessage: get("maintenance_message") ?? DEFAULTS.maintenanceMessage,
  };
}

type SettingsInput = Record<string, string>;

export async function updateStoreSettings(input: SettingsInput): Promise<void> {
  const now = new Date();

  await db.transaction(async (tx) => {
    for (const [key, value] of Object.entries(input)) {
      await tx
        .insert(storeSettings)
        .values({ key, value, updatedAt: now })
        .onConflictDoUpdate({
          target: storeSettings.key,
          set: { value, updatedAt: now },
        });
    }
  });
}

export function getDefaults(): StoreSettings {
  return { ...DEFAULTS };
}
