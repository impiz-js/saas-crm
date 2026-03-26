import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2, PlayCircle } from "lucide-react";
import { registerSchema } from "../lib/validators";
import { useAuthStore } from "../store/auth";

const formSchema = registerSchema.extend({
  password: z.string().min(8, "Минимум 8 символов"),
  agree: z.boolean().refine((value) => value, {
    message: "Нужно принять условия использования"
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { agree: false }
  });

  const onSubmit = async (data: FormValues) => {
    await registerUser(data.name, data.email, data.password);
    setIsSuccess(true);
    setTimeout(() => navigate("/onboarding/step-2"), 900);
  };

  return (
    <div className="card p-8">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase tracking-[0.3em] text-ink-500">StudioFlow Workspace</div>
        <div className="text-xs font-semibold text-brand-700">Step 1 of 2</div>
      </div>

      <h2 className="font-display text-2xl text-ink-900">Создание аккаунта (шаг 1/2)</h2>
      <p className="text-sm text-ink-600 mt-2">14 дней бесплатно • от 990 ₽ / месяц • без привязки карты</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs text-ink-500">Название бизнеса</label>
          <input
            className="input mt-2 transition-transform focus:scale-[1.01]"
            autoComplete="organization"
            placeholder="Например, Studio Balance"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-500">Email</label>
          <input
            className="input mt-2 transition-transform focus:scale-[1.01]"
            type="email"
            autoComplete="email"
            placeholder="owner@company.ru"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-500">Пароль</label>
          <input
            className="input mt-2 transition-transform focus:scale-[1.01]"
            type="password"
            autoComplete="new-password"
            placeholder="Минимум 8 символов"
            {...register("password")}
          />
          <p className="text-xs text-ink-500 mt-1">Используйте минимум 8 символов, цифры и буквы.</p>
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <label className="flex items-start gap-2 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4 rounded border-ink-300" {...register("agree")} />
          <span>Согласен с условиями использования и политикой конфиденциальности</span>
        </label>
        {errors.agree && <p className="text-xs text-red-500 -mt-2">{errors.agree.message}</p>}

        <button className="btn-primary w-full" type="submit" disabled={isSubmitting || isSuccess}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSuccess ? <CheckCircle2 size={16} /> : null}
          {isSuccess ? "Аккаунт создан" : isSubmitting ? "Создаем..." : "Далее"}
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Link className="btn-secondary w-full" to="/login">
          Войти
        </Link>
        <Link className="btn-secondary w-full" to="/login">
          <PlayCircle size={16} />
          Посмотреть демо
        </Link>
      </div>
    </div>
  );
}
