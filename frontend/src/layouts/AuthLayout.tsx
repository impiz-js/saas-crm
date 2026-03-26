import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.2fr_0.8fr] bg-slate-50">
      <div className="hidden lg:flex flex-col p-10 xl:p-12 border-r border-slate-200 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.35em] text-ink-500">StudioFlow</div>
          <div className="text-xs text-ink-500">от 990 ₽ / месяц</div>
        </div>

        <div className="mt-8">
          <h1 className="font-display text-4xl leading-tight text-ink-900 max-w-2xl">
            Управляйте записями, клиентами и доходом в одном месте
          </h1>
          <p className="mt-3 text-sm text-ink-600">
            Облачный сервис • Работает из браузера • Не требует установки
          </p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <div className="text-base font-semibold text-ink-900">500+</div>
            <div className="mt-1 text-xs text-ink-600">студий уже используют</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-base font-semibold text-ink-900">14 дней</div>
            <div className="mt-1 text-xs text-ink-600">бесплатно</div>
          </div>
          <div className="card p-3 text-center">
            <div className="text-base font-semibold text-ink-900">0 ₽</div>
            <div className="mt-1 text-xs text-ink-600">без привязки карты</div>
          </div>
        </div>

        <div className="mt-6 card p-4">
          <div className="text-sm font-semibold text-ink-900">Скриншот интерфейса CRM</div>
          <div className="mt-3 grid gap-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="text-xs text-ink-500 mb-2">Таблица клиентов</div>
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-200 rounded" />
                <div className="h-2.5 bg-slate-200 rounded w-[90%]" />
                <div className="h-2.5 bg-slate-200 rounded w-[78%]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-ink-500">Карточка сделки</div>
                <div className="mt-2 text-sm font-semibold text-ink-900">Абонемент 3 месяца</div>
                <div className="text-xs text-mint-600 mt-1">18 900 ₽ • В работе</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-ink-500">Графики</div>
                <div className="mt-2 flex items-end gap-1 h-12">
                  <div className="w-2 h-4 bg-brand-300 rounded-sm" />
                  <div className="w-2 h-8 bg-brand-500 rounded-sm" />
                  <div className="w-2 h-6 bg-brand-300 rounded-sm" />
                  <div className="w-2 h-10 bg-brand-700 rounded-sm" />
                  <div className="w-2 h-7 bg-brand-500 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 card p-4">
          <div className="text-sm font-semibold text-ink-900">Что внутри</div>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>Все заявки в одном месте</li>
            <li>История клиента и записи</li>
            <li>Уведомления в Telegram</li>
            <li>Контроль загрузки сотрудников</li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
