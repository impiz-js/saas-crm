import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_0.9fr]">
      <div className="hidden lg:flex flex-col justify-between p-12 text-white bg-[radial-gradient(circle_at_top,_rgba(14,116,144,0.9),_rgba(15,23,42,0.95))]">
        <div>
          <div className="text-xs uppercase tracking-[0.4em]">StudioFlow</div>
          <h1 className="mt-6 font-display text-4xl leading-tight">
            CRM для салонов, студий и клубов
          </h1>
          <p className="mt-4 text-sm text-white/80 max-w-md">
            Одна платформа для заявок, клиентов и выручки. От первого касания до закрытия сделки.
          </p>
        </div>
        <div className="glass rounded-xl p-6 text-sm text-white/90">
          <div className="font-semibold">Что внутри</div>
          <ul className="mt-3 space-y-2">
            <li>Контроль конверсии и источников</li>
            <li>Сквозная работа менеджеров</li>
            <li>Логика ролей для команды</li>
          </ul>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
