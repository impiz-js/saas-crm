import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { LayoutGrid, Users, ClipboardList, Briefcase, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";

interface Props {
  children: ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[auto_1fr]">
      <Sidebar />
      <main className="p-6 lg:p-10 space-y-8">
        <div className="lg:hidden card p-3 sticky top-4 z-10">
          <nav className="flex gap-2 overflow-auto scrollbar-hide">
            {[
              { to: "/", label: "Dashboard", icon: LayoutGrid },
              { to: "/clients", label: "Клиенты", icon: Users },
              { to: "/leads", label: "Заявки", icon: ClipboardList },
              { to: "/deals", label: "Сделки", icon: Briefcase },
              { to: "/settings", label: "Настройки", icon: Settings }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition ${
                      isActive ? "bg-brand-100 text-brand-900" : "text-ink-600 hover:bg-ink-100"
                    }`
                  }
                >
                  <Icon size={14} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </div>
        {children}
      </main>
    </div>
  );
}
