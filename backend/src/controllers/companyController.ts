import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { companySchema } from "../validators/company.js";

export async function getCompany(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const company = await prisma.company.findUnique({
    where: { userId: req.user.id }
  });

  res.json({ company });
}

export async function upsertCompany(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");

  const input = companySchema.parse(req.body);

  const company = await prisma.company.upsert({
    where: { userId: req.user.id },
    update: {
      name: input.name,
      logoUrl: input.logoUrl || null,
      timezone: input.timezone,
      currency: input.currency,
      address: input.address || null,
      phone: input.phone || null,
      email: input.email || null,
      website: input.website || null,
      taxId: input.taxId || null
    },
    create: {
      userId: req.user.id,
      name: input.name,
      logoUrl: input.logoUrl || null,
      timezone: input.timezone,
      currency: input.currency,
      address: input.address || null,
      phone: input.phone || null,
      email: input.email || null,
      website: input.website || null,
      taxId: input.taxId || null
    }
  });

  res.status(201).json({ company });
}
