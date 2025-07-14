import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  typeId: z.string(),
  userId: z.string(),
  price: z.number().positive,
  dueDate: z.date(),
});
