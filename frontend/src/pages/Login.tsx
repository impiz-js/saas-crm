import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/validators";
import { z } from "zod";
import { useAuthStore } from "../store/auth";
import { Link, useNavigate } from "react-router-dom";

type FormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: FormValues) => {
    await login(data.email, data.password);
    navigate("/");
  };

  return (
    <div className="card p-8">
      <h2 className="font-display text-2xl text-ink-900">Добро пожаловать</h2>
      <p className="text-sm text-ink-600 mt-2">Войдите, чтобы продолжить работу в CRM.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="text-xs text-ink-500">Email</label>
          <input className="input mt-2" type="email" autoComplete="email" {...register("email")} />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-xs text-ink-500">Пароль</label>
          <input
            className="input mt-2"
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>
        <button className="btn-primary w-full" type="submit" disabled={isSubmitting}>
          Войти
        </button>
      </form>
      <div className="mt-6 text-sm text-ink-600">
        Нет аккаунта?{" "}
        <Link className="text-brand-700 font-semibold" to="/register">
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
}
