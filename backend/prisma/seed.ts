import bcrypt from "bcryptjs";
import { PrismaClient, Role, LeadStatus, DealStage, ActivityAction, ActivityEntity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findFirst();
  if (existing) {
    console.log("Seed skipped: users already exist");
    return;
  }

  const passwordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@studioflow.local",
      passwordHash,
      role: Role.ADMIN
    }
  });

  const client = await prisma.client.create({
    data: {
      name: "Александра Ким",
      phone: "+7 999 123-45-67",
      email: "alex@studioflow.local",
      note: "Предпочитает утренние слоты",
      createdById: admin.id
    }
  });

  await prisma.lead.createMany({
    data: [
      {
        status: LeadStatus.NEW,
        source: "Instagram",
        date: new Date(),
        createdById: admin.id,
        clientId: client.id
      },
      {
        status: LeadStatus.IN_PROGRESS,
        source: "Сайт",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        createdById: admin.id
      }
    ]
  });

  const deal = await prisma.deal.create({
    data: {
      title: "Абонемент на 3 месяца",
      stage: DealStage.IN_PROGRESS,
      amount: 18900,
      createdById: admin.id,
      clientId: client.id
    }
  });

  await prisma.activity.createMany({
    data: [
      {
        entityType: ActivityEntity.CLIENT,
        entityId: client.id,
        action: ActivityAction.CREATED,
        message: "Создан клиент: Александра Ким",
        userId: admin.id
      },
      {
        entityType: ActivityEntity.DEAL,
        entityId: deal.id,
        action: ActivityAction.CREATED,
        message: "Создана сделка: Абонемент на 3 месяца",
        userId: admin.id
      }
    ]
  });

  console.log("Seed completed. Admin login: admin@studioflow.local / admin123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
