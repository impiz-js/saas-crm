import { z } from "zod";

export const companySchema = z.object({
  name: z.string().min(1, "Название компании обязательно"),
  logoUrl: z.string().url().optional().or(z.literal("")),
  timezone: z.string().default("UTC"),
  currency: z.string().default("RUB"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  taxId: z.string().optional()
});
