import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "../lib/api";
import { leadSchema } from "../lib/validators";
import { Client, Lead, PaginatedResponse } from "../types";
import { useAuthStore } from "../store/auth";
import Topbar from "../components/Topbar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge";
import { formatDate } from "../lib/format";

const schema = leadSchema;
type FormValues = z.infer<typeof schema>;

const statusLabels: Record<string, string> = {
  NEW: "Новая",
  IN_PROGRESS: "В работе",
  CLOSED: "Закрыта"
};

export default function Leads() {
  const token = useAuthStore((state) => state.token) as string;
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<PaginatedResponse<Lead> | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "NEW",
      date: new Date().toISOString().slice(0, 10),
      source: "",
      clientId: ""
    }
  });

  const loadLeads = async () => {
    try {
      setError(null);
      const data = await api.listLeads(token, { q: query, status, page });
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
    loadLeads();
  }, [token, query, status, page]);

  const onSubmit = async (values: FormValues) => {
    try {
      const payload = {
        status: values.status,
        date: new Date(values.date).toISOString(),
        source: values.source || undefined,
        clientId: values.clientId || undefined
      };

      if (editing) {
        await api.updateLead(token, editing.id, payload);
      } else {
        await api.createLead(token, payload);
      }

      reset({
        status: "NEW",
        date: new Date().toISOString().slice(0, 10),
        source: "",
        clientId: ""
      });
      setEditing(null);
      await loadLeads();
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    }
  };

  const startEdit = (lead: Lead) => {
    setEditing(lead);
    reset({
      status: lead.status,
      date: lead.date.slice(0, 10),
      source: lead.source || "",
      clientId: lead.client?.id || ""
    });
  };

  const removeLead = async (id: string) => {
    await api.deleteLead(token, id);
    await loadLeads();
  };

  const badgeVariant = (value: string) => {
    if (value === "CLOSED") return "success";
    if (value === "IN_PROGRESS") return "primary";
    return "warning";
  };

  return (
    <div className="space-y-8">
      <Topbar title="Заявки" subtitle="Контроль источников, статусов и привязки к клиентам" />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink-900">Список заявок</div>
              <p className="text-sm text-ink-500">Фильтр по статусу и поиску</p>
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
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value);
                }}
              >
                <option value="">Все статусы</option>
                <option value="NEW">Новая</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="CLOSED">Закрыта</option>
              </select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

          <div className="mt-4 overflow-auto">
            {result && result.data.length === 0 && (
              <EmptyState title="Заявок пока нет" description="Создайте первую заявку" />
            )}
            {result && result.data.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink-500">
                    <th className="py-2">Статус</th>
                    <th className="py-2">Источник</th>
                    <th className="py-2">Дата</th>
                    <th className="py-2">Клиент</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {result.data.map((lead) => (
                    <tr key={lead.id}>
                      <td className="py-3">
                        <Badge label={statusLabels[lead.status]} variant={badgeVariant(lead.status) as any} />
                      </td>
                      <td className="py-3 text-ink-700">{lead.source || "—"}</td>
                      <td className="py-3 text-ink-500">{formatDate(lead.date)}</td>
                      <td className="py-3 text-ink-700">{lead.client?.name || "—"}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="btn-secondary" onClick={() => startEdit(lead)}>
                            Редактировать
                          </button>
                          {user?.role === "ADMIN" && (
                            <button className="btn-secondary" onClick={() => removeLead(lead.id)}>
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
          <div className="font-semibold text-ink-900">{editing ? "Редактировать заявку" : "Новая заявка"}</div>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-xs text-ink-500">Статус</label>
              <select className="input mt-2" {...register("status")}>
                <option value="NEW">Новая</option>
                <option value="IN_PROGRESS">В работе</option>
                <option value="CLOSED">Закрыта</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-ink-500">Дата</label>
              <input className="input mt-2" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label className="text-xs text-ink-500">Источник</label>
              <input className="input mt-2" {...register("source")} placeholder="Instagram, сайт..." />
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
                    reset({
                      status: "NEW",
                      date: new Date().toISOString().slice(0, 10),
                      source: "",
                      clientId: ""
                    });
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
