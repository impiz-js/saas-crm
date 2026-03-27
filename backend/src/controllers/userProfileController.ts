import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { updateProfileSchema, changePasswordSchema } from "../validators/userProfile.js";

export async function getProfile(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new ApiError(404, "Пользователь не найден");
  }

  res.json({ user });
}

export async function updateProfile(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const input = updateProfileSchema.parse(req.body);

  // Проверка, что email не занят другим пользователем
  const existing = await prisma.user.findFirst({
    where: {
      email: input.email,
      id: { not: req.user.id }
    }
  });

  if (existing) {
    throw new ApiError(400, "Email уже занят");
  }

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      name: input.name,
      email: input.email
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    }
  });

  res.json({ user });
}

export async function changePassword(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  const input = changePasswordSchema.parse(req.body);

  const user = await prisma.user.findUnique({
    where: { id: req.user.id }
  });

  if (!user) {
    throw new ApiError(404, "Пользователь не найден");
  }

  // Проверка текущего пароля
  const isValid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!isValid) {
    throw new ApiError(400, "Неверный текущий пароль");
  }

  // Хэширование нового пароля
  const newPasswordHash = await bcrypt.hash(input.newPassword, 10);

  await prisma.user.update({
    where: { id: req.user.id },
    data: {
      passwordHash: newPasswordHash
    }
  });

  res.status(200).json({ message: "Пароль успешно изменён" });
}
