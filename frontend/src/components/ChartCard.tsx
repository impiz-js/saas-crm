import { ReactNode } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function ChartCard({ title, children }: Props) {
  return (
    <div className="card p-5">
      <div className="text-sm text-ink-500 mb-4">{title}</div>
      <div className="h-64">{children}</div>
    </div>
  );
}
