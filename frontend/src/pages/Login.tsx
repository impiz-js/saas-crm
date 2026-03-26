import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, PlayCircle } from "lucide-react";
import { loginSchema } from "../lib/validators";
import { useAuthStore } from "../store/auth";

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormValues) => {
    await login(data.email, data.password);
    navigate("/");
  };

  const onDemo = async () => {
    setValue("email", "admin@studioflow.local", { shouldValidate: true });
    setValue("password", "admin123", { shouldValidate: true });
    await login("admin@studioflow.local", "admin123");
    navigate("/");
  };

  return (
    <div className="card p-8">
      <div className="text-xs uppercase tracking-[0.3em] text-ink-500">StudioFlow Workspace</div>
      <h2 className="font-display text-2xl text-ink-900 mt-3">Вход в систему</h2>
      <p className="text-sm text-ink-600 mt-2">Управляйте командой, записями и продажами в едином кабинете.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs text-ink-500">Email</label>
          <input
            className="input mt-2 transition-transform focus:scale-[1.01]"
            type="email"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-xs text-ink-500">Пароль</label>
          <input
            className="input mt-2 transition-transform focus:scale-[1.01]"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSubmitting ? "Входим..." : "Войти"}
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button className="btn-secondary w-full" type="button" onClick={onDemo}>
          <PlayCircle size={16} />
          Посмотреть демо
        </button>
        <Link className="btn-secondary w-full" to="/register">
          Регистрация
        </Link>
      </div>

      <div className="mt-5 text-sm text-ink-600">
        Нет аккаунта?{" "}
        <Link className="text-brand-700 font-semibold hover:text-brand-900" to="/register">
          Создать
        </Link>
      </div>
    </div>
  );
}
