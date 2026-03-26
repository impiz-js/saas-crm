import { z } from "zod";

export const leadSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]).optional(),
  date: z.string().datetime().optional(),
  source: z.string().max(120).optional().nullable(),
  clientId: z.string().uuid().optional().nullable()
});
