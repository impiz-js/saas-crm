import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2 } from "lucide-react";
import { useAuthStore } from "../store/auth";
import { api } from "../lib/api";

const schema = z.object({
  plan: z.enum(["BASIC", "PRO", "BUSINESS"]),
  teamSize: z.coerce.number().int().min(1, "Минимум 1 сотрудник").max(500, "Максимум 500"),
  telegramEnabled: z.boolean(),
  employeeLoadEnabled: z.boolean(),
  onlinePayments: z.boolean()
});

type FormValues = z.infer<typeof schema>;

const planCards: { key: FormValues["plan"]; title: string; price: string; points: string[] }[] = [
  {
    key: "BASIC",
    title: "Basic",
    price: "990 ₽/мес",
    points: ["CRM и база клиентов", "Заявки и сделки", "1 команда"]
  },
  {
    key: "PRO",
    title: "Pro",
    price: "2 490 ₽/мес",
    points: ["Все из Basic", "Автоматизация уведомлений", "Расширенная аналитика"]
  },
  {
    key: "BUSINESS",
    title: "Business",
    price: "4 990 ₽/мес",
    points: ["Все из Pro", "Приоритетная поддержка", "Интеграции и кастомные роли"]
  }
];

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: "PRO",
      teamSize: 5,
      telegramEnabled: true,
      employeeLoadEnabled: true,
      onlinePayments: false
    }
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .getOnboardingStep2(token)
      .then(({ onboarding }) => {
        if (!onboarding) return;
        setValue("plan", onboarding.plan);
        setValue("teamSize", onboarding.teamSize);
        setValue("telegramEnabled", onboarding.telegramEnabled);
        setValue("employeeLoadEnabled", onboarding.employeeLoadEnabled);
        setValue("onlinePayments", onboarding.onlinePayments);
      })
      .finally(() => setLoading(false));
  }, [token, navigate, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!token) return;

    await api.saveOnboardingStep2(token, {
      plan: values.plan,
      teamSize: values.teamSize,
      integrations: {
        telegramEnabled: values.telegramEnabled,
        employeeLoadEnabled: values.employeeLoadEnabled,
        onlinePayments: values.onlinePayments
      }
    });

    setSaved(true);
    setTimeout(() => navigate("/"), 700);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-6 flex items-center gap-2 text-ink-700">
          <Loader2 size={18} className="animate-spin" />
          Загрузка шага 2...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-ink-500">StudioFlow Workspace</div>
              <h1 className="font-display text-3xl text-ink-900 mt-2">Настройка аккаунта (шаг 2/2)</h1>
              <p className="text-sm text-ink-600 mt-2">Выберите тариф, укажите размер команды и подключите интеграции.</p>
            </div>
            <button className="btn-secondary" onClick={() => navigate("/")}>Пропустить</button>
          </div>
        </div>

        <form className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit(onSubmit)}>
          <div className="card p-6 space-y-5">
            <div>
              <div className="text-sm font-semibold text-ink-900 mb-3">Тариф</div>
              <div className="grid gap-3 md:grid-cols-3">
                {planCards.map((plan) => {
                  const isActive = watch("plan") === plan.key;
                  return (
                    <button
                      key={plan.key}
                      type="button"
                      onClick={() => setValue("plan", plan.key, { shouldValidate: true })}
                      className={`rounded-xl border p-4 text-left transition ${
                        isActive ? "border-brand-500 bg-brand-100/50" : "border-ink-200 hover:border-brand-300"
                      }`}
                    >
                      <div className="text-sm font-semibold text-ink-900">{plan.title}</div>
                      <div className="text-xs text-brand-700 mt-1">{plan.price}</div>
                      <ul className="mt-2 space-y-1 text-xs text-ink-600">
                        {plan.points.map((point) => (
                          <li key={point}>• {point}</li>
                        ))}
                      </ul>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-ink-900">Команда</label>
              <input type="number" className="input mt-2" min={1} max={500} {...register("teamSize")} />
              <p className="text-xs text-ink-500 mt-1">Сколько сотрудников будут работать в CRM?</p>
              {errors.teamSize && <p className="text-xs text-red-500 mt-1">{errors.teamSize.message}</p>}
            </div>

            <div>
              <div className="text-sm font-semibold text-ink-900">Интеграции</div>
              <div className="mt-2 space-y-2 text-sm text-ink-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("telegramEnabled")} />
                  Уведомления в Telegram
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("employeeLoadEnabled")} />
                  Контроль загрузки сотрудников
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" {...register("onlinePayments")} />
                  Онлайн-оплата и ссылки на платежи
                </label>
              </div>
            </div>
          </div>

          <div className="card p-6 h-fit">
            <div className="text-sm font-semibold text-ink-900">Почти готово</div>
            <p className="text-sm text-ink-600 mt-2">После сохранения вы попадете в Dashboard с примененными настройками.</p>

            <button className="btn-primary w-full mt-5" type="submit" disabled={isSubmitting || saved}>
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {saved ? <Check size={16} /> : null}
              {saved ? "Сохранено" : isSubmitting ? "Сохраняем..." : "Завершить настройку"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
