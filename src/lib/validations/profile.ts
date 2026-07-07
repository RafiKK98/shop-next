import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[\d\s\-+()]+\d[\d\s\-+()]*$/.test(val),
      "Please enter a valid phone number",
    ),
});

export type ProfileInput = z.infer<typeof profileSchema>;
