# StudioFlow CRM

StudioFlow CRM is a full-stack SaaS CRM template for service businesses: salons, fitness studios, and local service teams.

The project demonstrates a production-style architecture with separated frontend/backend, role-based access, analytics dashboard, and Docker-first local launch.

## Product Scope

- Authentication with JWT (`register`, `login`, `me`)
- Role model: `ADMIN`, `MANAGER`
- CRUD modules:
  - Clients
  - Leads
  - Deals
- Dashboard:
  - Leads dynamics chart
  - Conversion summary
  - Recent activity feed
- Search and filtering in all core lists
- Pagination
- Form validation and backend error handling

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Zustand, React Hook Form, Zod, Recharts
- Backend: Node.js, Express, Prisma, Zod
- Database: PostgreSQL
- Auth: JWT
- Infra: Docker Compose

## Repository Structure

```text
.
├─ frontend/               # React app (admin panel)
├─ backend/                # REST API
├─ backend/prisma/         # schema + seed
├─ docs/screenshots/       # real UI screenshots
└─ docker-compose.yml      # local full-stack orchestration
```

## API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

Clients:
- `GET /api/clients`
- `POST /api/clients`
- `PATCH /api/clients/:id`
- `DELETE /api/clients/:id` (`ADMIN` only)

Leads:
- `GET /api/leads`
- `POST /api/leads`
- `PATCH /api/leads/:id`
- `DELETE /api/leads/:id` (`ADMIN` only)

Deals:
- `GET /api/deals`
- `POST /api/deals`
- `PATCH /api/deals/:id`
- `DELETE /api/deals/:id` (`ADMIN` only)

Dashboard:
- `GET /api/dashboard/overview`

Health:
- `GET /api/health`

## Local Run (Docker)

Start full stack:

```bash
docker compose up --build
```

Stop and remove volumes:

```bash
docker compose down -v
```

URLs:
- Frontend: `http://localhost:5173`
- API: `http://localhost:4000/api`
- API health: `http://localhost:4000/api/health`

## Local Run (Without Docker)

Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

Frontend:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Seed Credentials

After seed:
- Email: `admin@studioflow.local`
- Password: `admin123`

## Screenshots

### Login
![Login](docs/screenshots/login.png)

### Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Clients
![Clients](docs/screenshots/clients.png)

### Leads
![Leads](docs/screenshots/leads.png)

### Deals
![Deals](docs/screenshots/deals.png)

## Notes

- `MANAGER` can create and edit entities, but delete actions are restricted to `ADMIN`.
- Leads and deals support client linking directly from the form.
- The UI is responsive and built as a clean admin workspace rather than a landing page.