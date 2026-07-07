import { z } from "zod";

export const reviewFormSchema = z.object({
  rating: z.coerce.number().int().min(1, "Rating is required").max(5),
  title: z.string().optional().default(""),
  comment: z.string().min(1, "Review comment is required").max(2000),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const reviewFormServerSchema = reviewFormSchema;

export type ReviewFormServerValues = z.infer<typeof reviewFormServerSchema>;
