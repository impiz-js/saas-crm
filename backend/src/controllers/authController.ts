import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma.js";
import { ApiError } from "../utils/errors.js";
import { config } from "../config.js";
import { registerSchema, loginSchema } from "../validators/auth.js";
import { Role } from "@prisma/client";
import { Request, Response } from "express";

function signToken(payload: { id: string; role: Role; email: string; name: string }) {
  return jwt.sign(
    { role: payload.role, email: payload.email, name: payload.name },
    config.jwtSecret,
    { subject: payload.id, expiresIn: config.jwtExpiresIn }
  );
}

export async function register(req: Request, res: Response) {
  const input = registerSchema.parse(req.body);

  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ApiError(400, "Пользователь уже существует");
  }

  const usersCount = await prisma.user.count();
  const role = usersCount === 0 ? Role.ADMIN : Role.MANAGER;
  const passwordHash = await bcrypt.hash(input.password, 10);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role
    }
  });

  const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });

  res.status(201).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export async function login(req: Request, res: Response) {
  const input = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw new ApiError(401, "Неверные учетные данные");
  }

  const isValid = await bcrypt.compare(input.password, user.passwordHash);
  if (!isValid) {
    throw new ApiError(401, "Неверные учетные данные");
  }

  const token = signToken({ id: user.id, role: user.role, email: user.email, name: user.name });

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

export async function me(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }

  res.json({ user: req.user });
}
