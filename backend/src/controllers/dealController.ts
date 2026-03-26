import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { dealSchema } from "../validators/deal.js";
import { getPagination } from "../utils/pagination.js";
import { logActivity } from "../services/activityService.js";
import { ActivityAction, ActivityEntity, DealStage } from "@prisma/client";
import { ApiError } from "../utils/errors.js";

export async function listDeals(req: Request, res: Response) {
  const { page, pageSize, skip, take } = getPagination(req.query as Record<string, unknown>);
  const q = (req.query.q as string | undefined)?.trim();
  const stage = req.query.stage as DealStage | undefined;

  const where: Record<string, unknown> = {};
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { client: { name: { contains: q, mode: "insensitive" } } }
    ];
  }
  if (stage) where.stage = stage;

  const [total, data] = await Promise.all([
    prisma.deal.count({ where }),
    prisma.deal.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: { client: true, createdBy: { select: { name: true } } }
    })
  ]);

  res.json({ data, pagination: { page, pageSize, total } });
}

export async function createDeal(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = dealSchema.parse(req.body);

  const deal = await prisma.deal.create({
    data: {
      title: input.title,
      stage: input.stage ?? "NEW",
      amount: input.amount ?? null,
      clientId: input.clientId || null,
      createdById: req.user.id
    },
    include: { client: true, createdBy: { select: { name: true } } }
  });

  await logActivity({
    entityType: ActivityEntity.DEAL,
    entityId: deal.id,
    action: ActivityAction.CREATED,
    message: `Создана сделка: ${deal.title}`,
    userId: req.user.id
  });

  res.status(201).json(deal);
}

export async function updateDeal(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = dealSchema.partial().parse(req.body);

  const deal = await prisma.deal.update({
    where: { id: req.params.id },
    data: {
      title: input.title ?? undefined,
      stage: input.stage ?? undefined,
      amount: input.amount ?? undefined,
      clientId: input.clientId ?? undefined
    },
    include: { client: true, createdBy: { select: { name: true } } }
  });

  await logActivity({
    entityType: ActivityEntity.DEAL,
    entityId: deal.id,
    action: ActivityAction.UPDATED,
    message: `Обновлена сделка: ${deal.title}`,
    userId: req.user.id
  });

  res.json(deal);
}

export async function deleteDeal(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const deal = await prisma.deal.delete({ where: { id: req.params.id } });

  await logActivity({
    entityType: ActivityEntity.DEAL,
    entityId: deal.id,
    action: ActivityAction.DELETED,
    message: `Удалена сделка: ${deal.title}`,
    userId: req.user.id
  });

  res.status(204).send();
}
