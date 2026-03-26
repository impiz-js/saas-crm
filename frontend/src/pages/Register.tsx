import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../lib/validators";
import { useAuthStore } from "../store/auth";

type FormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: FormValues) => {
    await registerUser(data.name, data.email, data.password);
    navigate("/");
  };

  return (
    <div className="card p-8">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-ink-900">Создать рабочее пространство</h2>
        <p className="text-sm text-ink-600 mt-2">
          Заполните данные владельца CRM. Первый аккаунт автоматически получает роль `ADMIN`.
        </p>
      </div>

      <div className="rounded-lg border border-brand-100 bg-brand-100/40 p-3 text-xs text-ink-700">
        После регистрации вы сразу попадете в Dashboard и сможете добавить менеджеров.
      </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs text-ink-500">Имя и фамилия</label>
          <input
            className="input mt-2"
            autoComplete="name"
            placeholder="Например, Анна Смирнова"
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs text-ink-500">Рабочий email</label>
          <input
            className="input mt-2"
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
            className="input mt-2"
            type="password"
            autoComplete="new-password"
            placeholder="Минимум 6 символов"
            {...register("password")}
          />
          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
        </div>
        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          Создать аккаунт
        </button>
      </form>

      <div className="mt-6 text-sm text-ink-600">
        Уже зарегистрированы?{" "}
        <Link className="text-brand-700 font-semibold" to="/login">
          Войти
        </Link>
      </div>
    </div>
  );
}
