import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { leadSchema } from "../validators/lead.js";
import { getPagination } from "../utils/pagination.js";
import { logActivity } from "../services/activityService.js";
import { ActivityAction, ActivityEntity, LeadStatus } from "@prisma/client";
import { ApiError } from "../utils/errors.js";

export async function listLeads(req: Request, res: Response) {
  const { page, pageSize, skip, take } = getPagination(req.query as Record<string, unknown>);
  const q = (req.query.q as string | undefined)?.trim();
  const status = req.query.status as LeadStatus | undefined;
  const source = (req.query.source as string | undefined)?.trim();
  const from = req.query.from ? new Date(String(req.query.from)) : undefined;
  const to = req.query.to ? new Date(String(req.query.to)) : undefined;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { source: { contains: q, mode: "insensitive" } },
      { client: { name: { contains: q, mode: "insensitive" } } }
    ];
  }
  if (status) where.status = status;
  if (source) where.source = { contains: source, mode: "insensitive" };
  if (from || to) where.date = { gte: from, lte: to };

  const [total, data] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { client: true, createdBy: { select: { name: true } } }
    })
  ]);

  res.json({ data, pagination: { page, pageSize, total } });
}

export async function createLead(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = leadSchema.parse(req.body);

  const lead = await prisma.lead.create({
    data: {
      status: input.status ?? "NEW",
      source: input.source || null,
      date: input.date ? new Date(input.date) : new Date(),
      clientId: input.clientId || null,
      createdById: req.user.id
    },
    include: { client: true, createdBy: { select: { name: true } } }
  });

  await logActivity({
    entityType: ActivityEntity.LEAD,
    entityId: lead.id,
    action: ActivityAction.CREATED,
    message: `Создана заявка: ${lead.source || "Без источника"}`,
    userId: req.user.id
  });

  res.status(201).json(lead);
}

export async function updateLead(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = leadSchema.partial().parse(req.body);

  const lead = await prisma.lead.update({
    where: { id: req.params.id },
    data: {
      status: input.status ?? undefined,
      source: input.source ?? undefined,
      date: input.date ? new Date(input.date) : undefined,
      clientId: input.clientId ?? undefined
    },
    include: { client: true, createdBy: { select: { name: true } } }
  });

  await logActivity({
    entityType: ActivityEntity.LEAD,
    entityId: lead.id,
    action: ActivityAction.UPDATED,
    message: `Обновлена заявка: ${lead.source || "Без источника"}`,
    userId: req.user.id
  });

  res.json(lead);
}

export async function deleteLead(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const lead = await prisma.lead.delete({ where: { id: req.params.id } });

  await logActivity({
    entityType: ActivityEntity.LEAD,
    entityId: lead.id,
    action: ActivityAction.DELETED,
    message: `Удалена заявка: ${lead.source || "Без источника"}`,
    userId: req.user.id
  });

  res.status(204).send();
}
