import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().min(1, "Address label is required"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
  street: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional().default(""),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State / Division is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
