import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  slug: z.string().min(1, "Slug is required").max(200),
  description: z.string().default(""),
  image: z.string().default(""),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export const categoryFormServerSchema = categoryFormSchema;
