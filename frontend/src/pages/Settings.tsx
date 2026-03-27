import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Topbar from "../components/Topbar";
import { useAuthStore } from "../store/auth";
import { api, ApiError } from "../lib/api";
import { Company } from "../types";

const companySchema = z.object({
  name: z.string().min(1, "Название компании обязательно"),
  logoUrl: z.string().optional(),
  timezone: z.string().default("UTC"),
  currency: z.string().default("RUB"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  taxId: z.string().optional()
});

type CompanyFormData = z.infer<typeof companySchema>;

const timezones = [
  "UTC",
  "Europe/Moscow",
  "Europe/Kiev",
  "Asia/Yekaterinburg",
  "Asia/Novosibirsk",
  "Asia/Vladivostok"
];

const currencies = [
  { code: "RUB", label: "₽ RUB" },
  { code: "USD", label: "$ USD" },
  { code: "EUR", label: "€ EUR" },
  { code: "KZT", label: "₸ KZT" },
  { code: "BYN", label: "Br BYN" }
];

export default function Settings() {
  const { token, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema)
  });

  useEffect(() => {
    loadCompany();
  }, []);

  async function loadCompany() {
    if (!token) return;
    try {
      const { company } = await api.getCompany(token);
      setCompany(company || null);
      if (company) {
        reset({
          name: company.name,
          logoUrl: company.logoUrl || "",
          timezone: company.timezone,
          currency: company.currency,
          address: company.address || "",
          phone: company.phone || "",
          email: company.email || "",
          website: company.website || "",
          taxId: company.taxId || ""
        });
      }
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    }
  }

  async function onSubmit(data: CompanyFormData) {
    if (!token) return;
    setLoading(true);
    setSaved(false);

    try {
      const { company: newCompany } = await api.saveCompany(token, data);
      setCompany(newCompany);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      if (err instanceof ApiError) {
        alert(err.message);
      } else {
        alert("Ошибка при сохранении");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Topbar title="Настройки" subtitle="Профиль компании" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-ink-900">Основная информация</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Название компании *
              </label>
              <input
                {...register("name")}
                type="text"
                className="input w-full"
                placeholder="ООО Ромашка"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Логотип (URL)
              </label>
              <input
                {...register("logoUrl")}
                type="text"
                className="input w-full"
                placeholder="https://example.com/logo.png"
              />
              {errors.logoUrl && (
                <p className="text-sm text-red-600 mt-1">{errors.logoUrl.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Часовой пояс
              </label>
              <select {...register("timezone")} className="input w-full">
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Валюта
              </label>
              <select {...register("currency")} className="input w-full">
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-semibold text-ink-900">Контактная информация</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="input w-full"
                placeholder="info@company.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Телефон
              </label>
              <input
                {...register("phone")}
                type="tel"
                className="input w-full"
                placeholder="+7 (999) 000-00-00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">
              Адрес
            </label>
            <input
              {...register("address")}
              type="text"
              className="input w-full"
              placeholder="г. Москва, ул. Примерная, д. 1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Сайт
              </label>
              <input
                {...register("website")}
                type="url"
                className="input w-full"
                placeholder="https://company.com"
              />
              {errors.website && (
                <p className="text-sm text-red-600 mt-1">{errors.website.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                ИНН / Tax ID
              </label>
              <input
                {...register("taxId")}
                type="text"
                className="input w-full"
                placeholder="1234567890"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary px-6"
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </button>

          {saved && (
            <span className="text-sm text-green-600">✓ Сохранено!</span>
          )}
        </div>
      </form>
    </div>
  );
}
