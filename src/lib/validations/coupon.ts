import { z } from "zod";

function emptyToUndefined(v: unknown) {
  return v === "" || v === undefined || v === null ? undefined : v;
}

export const couponFormSchema = z.object({
  code: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Code must be 50 characters or less")
    .transform((v) => v.toUpperCase().trim()),
  type: z.enum(["percentage", "fixed"]),
  value: z.coerce.number().positive("Value must be a positive number").max(999999.99),
  description: z.string().max(500, "Description must be 500 characters or less").optional().or(z.literal("")),
  minPurchase: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()).nullable(),
  maxDiscount: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()).nullable(),
  maxUsage: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).optional()).nullable(),
  isActive: z.coerce.boolean().default(true),
  startDate: z.string().optional().or(z.literal("")).transform((v) => (v ? new Date(v) : null)),
  expiresAt: z.string().optional().or(z.literal("")).transform((v) => (v ? new Date(v) : null)),
});

export type CouponFormValues = z.infer<typeof couponFormSchema>;
