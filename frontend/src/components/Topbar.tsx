import { Bell, Search } from "lucide-react";
import { useAuthStore } from "../store/auth";

interface Props {
  title: string;
  subtitle?: string;
}

export default function Topbar({ title, subtitle }: Props) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="font-display text-3xl text-ink-900">{title}</h1>
        {subtitle && <p className="text-sm text-ink-600 mt-1">{subtitle}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="glass flex items-center gap-2 rounded-lg px-3 py-2">
          <Search size={16} className="text-ink-500" />
          <input
            placeholder="Быстрый поиск"
            className="bg-transparent text-sm text-ink-700 outline-none"
          />
        </div>
        <button className="btn-secondary" type="button">
          <Bell size={16} />
          Уведомления
        </button>
        <div className="glass rounded-lg px-3 py-2 text-sm">
          <div className="font-semibold text-ink-800">{user?.name || "Пользователь"}</div>
          <div className="text-xs text-ink-500">{user?.role === "ADMIN" ? "Admin" : "Manager"}</div>
        </div>
        <button className="btn-primary" type="button" onClick={logout}>
          Выйти
        </button>
      </div>
    </div>
  );
}
