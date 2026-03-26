# StudioFlow CRM (SaaS для малого бизнеса)

Современный full‑stack CRM для салонов, фитнес‑студий и сервисных компаний. Проект демонстрирует полный цикл разработки SaaS: авторизация, роли, CRUD, аналитика, UI/UX и архитектурное разделение.

## Что внутри

- JWT‑аутентификация и регистрация
- Роли: `ADMIN`, `MANAGER`
- Ограничения: удаление сущностей доступно только `ADMIN`
- CRUD: клиенты, заявки, сделки
- Dashboard: динамика заявок, конверсия, последние действия
- Поиск, фильтры, пагинация
- Валидация форм, обработка ошибок
- Современный UI (Notion/Stripe‑стилистика), адаптивность

## Архитектура

```
/ backend   — REST API (Express + Prisma + PostgreSQL)
/ frontend  — SPA (React + Tailwind + Zustand)
/ docs      — скриншоты
```

### Backend (REST)

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/clients` / `POST /api/clients` / `PATCH /api/clients/:id` / `DELETE /api/clients/:id`
- `GET /api/leads` / `POST /api/leads` / `PATCH /api/leads/:id` / `DELETE /api/leads/:id`
- `GET /api/deals` / `POST /api/deals` / `PATCH /api/deals/:id` / `DELETE /api/deals/:id`
- `GET /api/dashboard/overview`

## Запуск локально

### 1) Backend

```
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### 2) Frontend

```
cd frontend
copy .env.example .env
npm install
npm run dev
```

Откройте `http://localhost:5173`.

## Docker (опционально)

```
docker compose up --build
```

При запуске контейнера API автоматически выполняет `prisma db push` и `seed`.

Остановка и очистка данных:

```
docker compose down -v
```

## Скриншоты

![Dashboard](docs/dashboard.svg)
![Clients](docs/clients.svg)
![Login](docs/login.svg)

## Брендинг

**StudioFlow** — CRM для компаний сферы услуг, где важна скорость обработки заявок и повторные продажи.

## Данные для входа (после seed)

- `admin@studioflow.local`
- `admin123`

---

Если нужно расширить проект: роли для маркетолога, интеграции с WhatsApp/Telegram, планирование, счета и платежи.
