import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Имя должно быть не короче 2 символов"),
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов"),
  role: z.enum(["ADMIN", "MANAGER"]).optional()
});

export const loginSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(6, "Минимум 6 символов")
});
