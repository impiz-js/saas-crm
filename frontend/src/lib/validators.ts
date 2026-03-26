import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Введите имя"),
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Минимум 6 символов")
});

export const clientSchema = z.object({
  name: z.string().min(2, "Имя обязательно"),
  phone: z.string().optional(),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  note: z.string().max(500, "Слишком длинный комментарий").optional()
});

export const leadSchema = z.object({
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
  date: z.string().min(1, "Дата обязательна"),
  source: z.string().optional(),
  clientId: z.string().uuid("Выберите клиента").optional().or(z.literal(""))
});

export const dealSchema = z.object({
  title: z.string().min(2, "Название обязательно"),
  stage: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
  amount: z.string().optional(),
  clientId: z.string().uuid("Выберите клиента").optional().or(z.literal(""))
});
