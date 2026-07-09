import { z } from "zod";

export const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Code must be 50 characters or less")
    .transform((v) => v.toUpperCase().trim()),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be a positive number").max(999999.99),
  description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
  minPurchase: z.coerce.number().min(0).optional().or(z.literal("")).transform((v) => (v === "" || v === undefined ? null : v)),
  maxDiscount: z.coerce.number().min(0).optional().or(z.literal("")).transform((v) => (v === "" || v === undefined ? null : v)),
  maxUsage: z.coerce.number().int().min(1, "Must be at least 1").optional().or(z.literal("")).transform((v) => (v === "" || v === undefined ? null : v)),
  isActive: z.boolean().default(true),
  startDate: z.string().optional().or(z.literal("")).transform((v) => (v ? new Date(v) : null)),
  expiresAt: z.string().optional().or(z.literal("")).transform((v) => (v ? new Date(v) : null)),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;
