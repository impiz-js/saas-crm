import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { clientSchema } from "../validators/client.js";
import { getPagination } from "../utils/pagination.js";
import { logActivity } from "../services/activityService.js";
import { ActivityAction, ActivityEntity } from "@prisma/client";
import { ApiError } from "../utils/errors.js";

export async function listClients(req: Request, res: Response) {
  const { page, pageSize, skip, take } = getPagination(req.query as Record<string, unknown>);
  const q = (req.query.q as string | undefined)?.trim();

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } }
        ]
      }
    : {};

  const [total, data] = await Promise.all([
    prisma.client.count({ where }),
    prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        _count: { select: { leads: true, deals: true } }
      }
    })
  ]);

  res.json({ data, pagination: { page, pageSize, total } });
}

export async function createClient(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = clientSchema.parse(req.body);

  const client = await prisma.client.create({
    data: {
      name: input.name,
      phone: input.phone || null,
      email: input.email || null,
      note: input.note || null,
      createdById: req.user.id
    }
  });

  await logActivity({
    entityType: ActivityEntity.CLIENT,
    entityId: client.id,
    action: ActivityAction.CREATED,
    message: `Создан клиент: ${client.name}`,
    userId: req.user.id
  });

  res.status(201).json(client);
}

export async function updateClient(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const input = clientSchema.partial().parse(req.body);

  const client = await prisma.client.update({
    where: { id: req.params.id },
    data: {
      name: input.name ?? undefined,
      phone: input.phone ?? undefined,
      email: input.email ?? undefined,
      note: input.note ?? undefined
    }
  });

  await logActivity({
    entityType: ActivityEntity.CLIENT,
    entityId: client.id,
    action: ActivityAction.UPDATED,
    message: `Обновлен клиент: ${client.name}`,
    userId: req.user.id
  });

  res.json(client);
}

export async function deleteClient(req: Request, res: Response) {
  if (!req.user) throw new ApiError(401, "Unauthorized");
  const client = await prisma.client.delete({ where: { id: req.params.id } });

  await logActivity({
    entityType: ActivityEntity.CLIENT,
    entityId: client.id,
    action: ActivityAction.DELETED,
    message: `Удален клиент: ${client.name}`,
    userId: req.user.id
  });

  res.status(204).send();
}
