import { z } from "zod";

export const onboardingStep2Schema = z.object({
  plan: z.enum(["BASIC", "PRO", "BUSINESS"]),
  teamSize: z.number().int().min(1).max(500),
  integrations: z.object({
    telegramEnabled: z.boolean(),
    employeeLoadEnabled: z.boolean(),
    onlinePayments: z.boolean()
  })
});
