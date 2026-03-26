import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema } from "../lib/validators";
import { z } from "zod";
import { api } from "../lib/api";
import { Client, PaginatedResponse } from "../types";
import { useAuthStore } from "../store/auth";
import Topbar from "../components/Topbar";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import { formatDate } from "../lib/format";

const schema = clientSchema;

type FormValues = z.infer<typeof schema>;

export default function Clients() {
  const token = useAuthStore((state) => state.token) as string;
  const user = useAuthStore((state) => state.user);
  const [result, setResult] = useState<PaginatedResponse<Client> | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const load = async () => {
    try {
      setError(null);
      const data = await api.listClients(token, { q: query, page });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Ошибка загрузки");
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token, query, page]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (editing) {
        await api.updateClient(token, editing.id, values);
      } else {
        await api.createClient(token, values);
      }
      reset({ name: "", phone: "", email: "", note: "" });
      setEditing(null);
      await load();
    } catch (err: any) {
      setError(err.message || "Ошибка сохранения");
    }
  };

  const startEdit = (client: Client) => {
    setEditing(client);
    reset({
      name: client.name,
      phone: client.phone || "",
      email: client.email || "",
      note: client.note || ""
    });
  };

  const removeClient = async (id: string) => {
    await api.deleteClient(token, id);
    await load();
  };

  return (
    <div className="space-y-8">
      <Topbar title="Клиенты" subtitle="База контактов и история взаимодействий" />

      <div className="grid gap-4 lg:grid-cols-[1fr_0.6fr]">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-ink-900">Список клиентов</div>
              <p className="text-sm text-ink-500">Поиск по имени, телефону или email</p>
            </div>
            <input
              className="input max-w-xs"
              placeholder="Поиск..."
              value={query}
              onChange={(event) => {
                setPage(1);
                setQuery(event.target.value);
              }}
            />
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <div className="mt-4 overflow-auto">
            {result && result.data.length === 0 && (
              <EmptyState title="Клиентов пока нет" description="Добавьте первую запись" />
            )}
            {result && result.data.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink-500">
                    <th className="py-2">Клиент</th>
                    <th className="py-2">Контакты</th>
                    <th className="py-2">Активность</th>
                    <th className="py-2">Создан</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {result.data.map((client) => (
                    <tr key={client.id}>
                      <td className="py-3 font-semibold text-ink-900">{client.name}</td>
                      <td className="py-3 text-ink-600">
                        <div>{client.phone || "—"}</div>
                        <div>{client.email || "—"}</div>
                      </td>
                      <td className="py-3 text-ink-600">
                        {client._count?.leads || 0} заявок · {client._count?.deals || 0} сделок
                      </td>
                      <td className="py-3 text-ink-500">{formatDate(client.createdAt)}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button className="btn-secondary" onClick={() => startEdit(client)}>
                            Редактировать
                          </button>
                          {user?.role === "ADMIN" && (
                            <button className="btn-secondary" onClick={() => removeClient(client.id)}>
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
          <div className="font-semibold text-ink-900">
            {editing ? "Редактировать клиента" : "Новый клиент"}
          </div>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-xs text-ink-500">Имя</label>
              <input className="input mt-2" {...register("name")} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-xs text-ink-500">Телефон</label>
              <input className="input mt-2" {...register("phone")} />
            </div>
            <div>
              <label className="text-xs text-ink-500">Email</label>
              <input className="input mt-2" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-xs text-ink-500">Комментарий</label>
              <textarea className="input mt-2 min-h-[90px]" {...register("note")} />
              {errors.note && <p className="text-xs text-red-500 mt-1">{errors.note.message}</p>}
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
                    reset({ name: "", phone: "", email: "", note: "" });
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
