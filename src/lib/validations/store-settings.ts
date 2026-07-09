import { z } from "zod";

export const generalSettingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required").max(100),
  storeDescription: z.string().max(500).optional().or(z.literal("")),
  supportEmail: z.email("Invalid email").optional().or(z.literal("")),
  supportPhone: z.string().max(30).optional().or(z.literal("")),
  businessAddress: z.string().max(500).optional().or(z.literal("")),
  timeZone: z.string().min(1, "Time zone is required"),
  currency: z.string().min(1, "Currency is required"),
  defaultLanguage: z.string().min(1, "Language is required"),
});

export const brandingSettingsSchema = z.object({
  storeLogo: z.string().optional().or(z.literal("")),
  favicon: z.string().optional().or(z.literal("")),
  primaryColor: z
    .string()
    .min(1, "Primary color is required")
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
  secondaryColor: z
    .string()
    .min(1, "Secondary color is required")
    .regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
});

export const commerceSettingsSchema = z.object({
  taxRate: z.coerce.number().min(0).max(100),
  freeShippingThreshold: z.coerce.number().min(0),
  defaultShippingCost: z.coerce.number().min(0),
  lowStockThreshold: z.coerce.number().int().min(0),
  currencySymbol: z.string().min(1, "Currency symbol is required").max(10),
});

export const seoSettingsSchema = z.object({
  metaTitle: z.string().max(120).optional().or(z.literal("")),
  metaDescription: z.string().max(320).optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  defaultKeywords: z.string().max(500).optional().or(z.literal("")),
});

export const maintenanceSettingsSchema = z.object({
  maintenanceMode: z.coerce.boolean(),
  maintenanceMessage: z.string().max(500).optional().or(z.literal("")),
});
