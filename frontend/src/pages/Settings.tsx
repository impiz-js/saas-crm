import Topbar from "../components/Topbar";

export default function Settings() {
  return (
    <div className="space-y-8">
      <Topbar title="Настройки" subtitle="Профиль и настройки команды" />
      <div className="card p-6">
        <div className="font-semibold text-ink-900">Профиль компании</div>
        <p className="text-sm text-ink-600 mt-2">
          Здесь можно добавить интеграции, правила ролей и бизнес-метрики.
        </p>
      </div>
    </div>
  );
}
