import { ActivityAction, ActivityEntity } from "@prisma/client";
import { prisma } from "../prisma.js";

interface ActivityInput {
  entityType: ActivityEntity;
  entityId: string;
  action: ActivityAction;
  message: string;
  userId: string;
}

export async function logActivity(input: ActivityInput) {
  return prisma.activity.create({ data: input });
}
