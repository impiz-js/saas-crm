import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Имя обязательно"),
  phone: z.string().optional().nullable(),
  email: z.string().email("Некорректный email").optional().nullable(),
  note: z.string().max(500, "Слишком длинный комментарий").optional().nullable()
});
