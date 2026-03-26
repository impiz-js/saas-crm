import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { onboardingStep2Schema } from "../validators/onboarding.js";

export async function getOnboardingStep2(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const onboarding = await prisma.onboardingStep2.findUnique({
    where: { userId: req.user.id }
  });

  res.json({ onboarding });
}

export async function upsertOnboardingStep2(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const input = onboardingStep2Schema.parse(req.body);

  const onboarding = await prisma.onboardingStep2.upsert({
    where: { userId: req.user.id },
    update: {
      plan: input.plan,
      teamSize: input.teamSize,
      telegramEnabled: input.integrations.telegramEnabled,
      employeeLoadEnabled: input.integrations.employeeLoadEnabled,
      onlinePayments: input.integrations.onlinePayments,
      completed: true
    },
    create: {
      userId: req.user.id,
      plan: input.plan,
      teamSize: input.teamSize,
      telegramEnabled: input.integrations.telegramEnabled,
      employeeLoadEnabled: input.integrations.employeeLoadEnabled,
      onlinePayments: input.integrations.onlinePayments,
      completed: true
    }
  });

  res.status(201).json({ onboarding });
}
