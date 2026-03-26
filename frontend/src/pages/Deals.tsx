import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../lib/api";
import { dealSchema } from "../lib/validators";
import { Client, Deal, PaginatedResponse } from "../types";
import { useAuthStore } from "../store/auth";
import Topbar from "../components/Topbar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import { formatDate, formatMoney } from "../lib/format";

const schema = dealSchema;
type FormValues = z.infer<typeof schema>;

const stageLabels: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыта"
};

export default function Deals() {
  const token = useAuthStore((state) => state.token) as string;
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<PaginatedResponse<Deal> | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Deal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: "", stage: "NEW", amount: "", clientId: "" }
  });

  const loadDeals = async () => {
    try {
      setError(null);
      const data = await api.listDeals(token, { q: query, stage, page });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки");
    }
  };

  const loadClients = async () => {
    try {
      const data = await api.listClients(token, { page: 1, pageSize: 50 });
      setClients(data.data);
    } catch {
      setClients([]);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadClients();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    loadDeals();
  }, [token, query, stage, page]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        title: values.title,
        stage: values.stage,
        amount: values.amount ? Number(values.amount) : undefined,
        clientId: values.clientId || undefined
      };

      if (editing) {
        await api.updateDeal(token, editing.id, payload);
      } else {
        await api.createDeal(token, payload);
      }

      reset({ title: "", stage: "NEW", amount: "", clientId: "" });
      setEditing(null);
      await loadDeals();
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    }
  };

  const startEdit = (deal: Deal) => {
    setEditing(deal);
    reset({
      title: deal.title,
      stage: deal.stage,
      amount: deal.amount ? String(deal.amount) : "",
      clientId: deal.client?.id || ""
    });
  };

  const removeDeal = async (id: string) => {
    await api.deleteDeal(token, id);
    await loadDeals();
  };

  const badgeVariant = (value: string) => {
    if (value === "CLOSED") return "success";
    if (value === "IN_PROGRESS") return "primary";
    return "warning";
  };

  return (
    <div className="space-y-8">
      <Topbar title="Сделки" subtitle="Воронка продаж с привязкой к клиентам" />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink-900">Список сделок</div>
              <p className="text-sm text-ink-500">Фильтр по этапам и поиску</p>
            </div>
            <div className="flex gap-2">
              <input
                className="input max-w-xs"
                placeholder="Поиск..."
                value={query}
                onChange={(event) => {
                  setPage(1);
                  setQuery(event.target.value);
                }}
              />
              <select
                className="input"
                value={stage}
                onChange={(event) => {
                  setPage(1);
                  setStage(event.target.value);
                }}
              >
                <option value="">Все этапы</option>
                <option value="NEW">Новая</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="CLOSED">Закрыта</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          <div className="mt-4 overflow-auto">
            {result && result.data.length === 0 && (
              <EmptyState title="Сделок пока нет" description="Создайте первую сделку" />
            )}
            {result && result.data.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink-500">
                    <th className="py-2">Этап</th>
                    <th className="py-2">Сделка</th>
                    <th className="py-2">Сумма</th>
                    <th className="py-2">Дата</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {result.data.map((deal) => (
                    <tr key={deal.id}>
                      <td className="py-3">
                        <Badge label={stageLabels[deal.stage]} variant={badgeVariant(deal.stage) as any} />
                      </td>
                      <td className="py-3 text-ink-700">
                        <div className="font-semibold text-ink-900">{deal.title}</div>
                        <div className="text-xs text-ink-500">{deal.client?.name || "Без клиента"}</div>
                      </td>
                      <td className="py-3 text-ink-700">{formatMoney(deal.amount)}</td>
                      <td className="py-3 text-ink-500">{formatDate(deal.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="btn-secondary" onClick={() => startEdit(deal)}>
                            Редактировать
                          </button>
                          {user?.role === "ADMIN" && (
                            <button className="btn-secondary" onClick={() => removeDeal(deal.id)}>
                              Удалить
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {result && (
            <div className="mt-4 flex justify-end">
              <Pagination
                page={result.pagination.page}
                pageSize={result.pagination.pageSize}
                total={result.pagination.total}
                onChange={setPage}
              />
            </div>
          )}
        </div>

        <div className="card p-5">
          <div className="font-semibold text-ink-900">{editing ? "Редактировать сделку" : "Новая сделка"}</div>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-xs text-ink-500">Название</label>
              <input className="input mt-2" {...register("title")} />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
            </div>
            <div>
              <label className="text-xs text-ink-500">Этап</label>
              <select className="input mt-2" {...register("stage")}>
                <option value="NEW">Новая</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="CLOSED">Закрыта</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-500">Сумма</label>
              <input className="input mt-2" {...register("amount")} placeholder="Например 15000" />
            </div>
            <div>
              <label className="text-xs text-ink-500">Клиент</label>
              <select className="input mt-2" {...register("clientId")}>
                <option value="">Без клиента</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-xs text-red-500 mt-1">{errors.clientId.message}</p>}
            </div>
            <div className="flex gap-2">
              <button className="btn-primary" type="submit" disabled={isSubmitting}>
                {editing ? "Сохранить" : "Добавить"}
              </button>
              {editing && (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    reset({ title: "", stage: "NEW", amount: "", clientId: "" });
                  }}
                >
                  Отменить
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
