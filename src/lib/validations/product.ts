import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().default(""),
  categoryId: z.string().optional().default(""),
  brand: z.string().optional().default(""),
  price: z.coerce.number().positive("Price must be positive"),
  discount: z.coerce.number().min(0).max(100).optional().default(0),
  stock: z.coerce.number().int().min(0).optional().default(0),
  featured: z.coerce.boolean().optional().default(false),
  images: z
    .array(
      z.object({
        url: z.string().url("Must be a valid URL").or(z.literal("")),
        alt: z.string().optional().default(""),
      }),
    )
    .optional()
    .default([]),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormServerSchema = productFormSchema.extend({});

export type ProductFormServerValues = z.infer<typeof productFormServerSchema>;
