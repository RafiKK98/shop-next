"use server";
import { requireAdmin } from "@/lib/auth/guards";
import { updateStoreSettings } from "@/services/store-settings";
import {
  generalSettingsSchema,
  brandingSettingsSchema,
  commerceSettingsSchema,
  seoSettingsSchema,
  maintenanceSettingsSchema,
} from "@/lib/validations/store-settings";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const validators = {
  general: generalSettingsSchema,
  branding: brandingSettingsSchema,
  commerce: commerceSettingsSchema,
  seo: seoSettingsSchema,
  maintenance: maintenanceSettingsSchema,
};

export async function saveSettingsAction(tab: string, formData: FormData) {
  await requireAdmin();

  const raw: Record<string, string> = {};
  for (const [k, v] of formData.entries()) {
    raw[k] = v as string;
  }

  const schema = validators[tab as keyof typeof validators] as z.ZodType;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error!.issues.map((e: { message: string }) => e.message).join(", "),
    };
  }

  const data = parsed.data as Record<string, unknown>;

  const keyMap: Record<string, string> = {
    storeName: "store_name",
    storeDescription: "store_description",
    supportEmail: "support_email",
    supportPhone: "support_phone",
    businessAddress: "business_address",
    timeZone: "time_zone",
    currency: "currency",
    defaultLanguage: "default_language",

    storeLogo: "store_logo",
    favicon: "favicon",
    primaryColor: "primary_color",
    secondaryColor: "secondary_color",

    taxRate: "tax_rate",
    freeShippingThreshold: "free_shipping_threshold",
    defaultShippingCost: "default_shipping_cost",
    lowStockThreshold: "low_stock_threshold",
    currencySymbol: "currency_symbol",

    metaTitle: "meta_title",
    metaDescription: "meta_description",
    ogImage: "og_image",
    defaultKeywords: "default_keywords",

    maintenanceMode: "maintenance_mode",
    maintenanceMessage: "maintenance_message",
  };

  const input: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    const dbKey = keyMap[key];
    if (dbKey) {
      input[dbKey] = String(value);
    }
  }

  await updateStoreSettings(input);

  revalidatePath("/admin/settings");
}
