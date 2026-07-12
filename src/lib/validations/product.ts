import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().default(""),
  categoryId: z.string().default(""),
  brand: z.string().default(""),
  price: z.coerce.number().positive("Price must be positive"),
  discount: z.coerce.number().min(0).max(100).default(0),
  stock: z.coerce.number().int().min(0).default(0),
  featured: z.coerce.boolean().default(false),
  images: z.array(z.string()).default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormServerSchema = productFormSchema.extend({});

export type ProductFormServerValues = z.infer<typeof productFormServerSchema>;
