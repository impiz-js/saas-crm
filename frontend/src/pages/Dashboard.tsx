import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { DashboardOverview } from "../types";
import { useAuthStore } from "../store/auth";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";
import EmptyState from "../components/EmptyState";
import Loading from "../components/Loading";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, Users, Briefcase } from "lucide-react";
import { formatDate } from "../lib/format";

export default function Dashboard() {
  const token = useAuthStore((state) => state.token);
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    api
      .getDashboard(token)
      .then((payload) => setData(payload))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-8">
      <Topbar title="Dashboard" subtitle="Ключевые метрики и активность команды" />
      {loading && <Loading />}
      {!loading && data && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Всего заявок" value={data.totalLeads} icon={<Users size={18} />} />
            <StatCard title="Всего сделок" value={data.totalDeals} icon={<Briefcase size={18} />} />
            <StatCard
              title="Конверсия" 
              value={`${data.conversionRate}%`}
              change={`Закрыто: ${data.closedDeals}`}
              icon={<TrendingUp size={18} />}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
            <ChartCard title="Заявки за последние 14 дней">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.leadsSeries}>
                  <XAxis dataKey="date" tickFormatter={(value) => value.slice(5)} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="leads" stroke="#0ea5e9" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard title="Статусы заявок">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Object.entries(data.leadsByStatus).map(([status, count]) => ({
                    status,
                    count
                  }))}
                >
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0e7490" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-ink-900">Последние действия</div>
                <p className="text-sm text-ink-600">Команда и системные события</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              {data.recentActivities.length === 0 && (
                <EmptyState title="Пока нет активности" description="Создайте первую запись в CRM" />
              )}
              {data.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b border-ink-100 pb-4">
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{activity.message}</div>
                    <div className="text-xs text-ink-500">
                      {activity.user.name} · {activity.user.role} · {formatDate(activity.createdAt)}
                    </div>
                  </div>
                  <div className="text-xs text-ink-400">{activity.entityType}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
