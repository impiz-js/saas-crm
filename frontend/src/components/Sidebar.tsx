import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, ClipboardList, Briefcase, Settings } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutGrid },
  { to: "/clients", label: "Клиенты", icon: Users },
  { to: "/leads", label: "Заявки", icon: ClipboardList },
  { to: "/deals", label: "Сделки", icon: Briefcase },
  { to: "/settings", label: "Настройки", icon: Settings }
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:min-h-screen lg:sticky lg:top-0 p-6">
      <div className="card p-5 mb-6 bg-dots">
        <div className="text-xs uppercase tracking-[0.35em] text-ink-500">StudioFlow</div>
        <div className="mt-2 font-display text-2xl text-ink-900">CRM для сервиса</div>
        <p className="mt-3 text-sm text-ink-600">
          Управляйте клиентами, заявками и сделками в одном окне.
        </p>
      </div>
      <nav className="card p-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-100 text-brand-900"
                    : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
                }`
              }
            >
              <Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="card mt-6 p-4 text-sm text-ink-600">
        <div className="font-semibold text-ink-800">Готово к продажам</div>
        <p className="mt-2">
          Лиды, сделки и конверсии обновляются в реальном времени.
        </p>
      </div>
    </aside>
  );
}
