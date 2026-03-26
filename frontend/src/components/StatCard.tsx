import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  change?: string;
  icon?: ReactNode;
}

export default function StatCard({ title, value, change, icon }: Props) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm text-ink-500">
        <span>{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-display text-ink-900">{value}</div>
      {change && <div className="text-xs text-mint-600">{change}</div>}
    </div>
  );
}
