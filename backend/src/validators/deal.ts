import { z } from "zod";

export const dealSchema = z.object({
  title: z.string().min(2, "Название обязательно"),
  stage: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]).optional(),
  amount: z.number().nonnegative().optional().nullable(),
  clientId: z.string().uuid().optional().nullable()
});
