# SmartSeason Field Monitoring System

A full-stack field monitoring application for agricultural operations. Coordinators and field agents track crop stages, field assignments, and health status in one place, with role-based access and a backend-driven status model.

## Features

- **Authentication** — JWT-based login and signup with admin and field-agent roles.
- **Field management** — Create fields, assign or unassign agents, and record progress updates.
- **Dashboard** — Role-scoped summaries (totals, active, at risk, completed).
- **Status logic (backend)** — Single source of truth for field status: _Active_, _At Risk_, or _Completed_, derived from stage, assignment, last update, and planting timeline.
- **Web UI** — React Router + Tailwind CSS: home, about, contact, login, signup, and role-aware dashboard.

## Tech Stack

| Layer    | Technology                                                                         |
| -------- | ---------------------------------------------------------------------------------- |
| Backend  | Python 3.8+, FastAPI, SQLAlchemy, Alembic, PostgreSQL (psycopg), Pydantic Settings |
| Auth     | JWT (python-jose), bcrypt                                                          |
| Frontend | React 19, React Router 7, TypeScript, Vite, Tailwind CSS 4                         |
| Tooling  | Alembic migrations, pytest (backend)                                               |

## Repository layout

```
smartseason_field_monitoring_system/
├── backend/                 # FastAPI app
│   ├── app/
│   │   ├── main.py
│   │   ├── api/             # Routes, dependencies
│   │   ├── core/            # Settings
│   │   ├── db/              # Session & Base
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Security, field status, etc.
│   │   └── scripts/         # seed_reference_data
│   ├── alembic/             # Migrations
│   ├── tests/               # Pytest
│   └── requirements.txt
├── frontend/                # React app
│   ├── app/                 # Routes, context, components
│   ├── public/              # Static assets
│   └── package.json
└── README.md
```

## Prerequisites

- **Python**
- **Node.js** and npm
- **PostgreSQL**
- `psql` - manages databases and users

## Environment variables (backend)

Create `backend/.env`

| Variable                      | Description                             |
| ----------------------------- | --------------------------------------- |
| `DATABASE_URL`                | SQLAlchemy URL                          |
| `JWT_SECRET_KEY`              | Strong random string for signing tokens |
| `JWT_ALGORITHM`               | e.g. `HS256`                            |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token lifetime                   |

## Database setup

1. Create a PostgreSQL user and database (adjust names to match your `.env`):

   ```bash
   sudo -u postgres psql
   ```

   ```sql
   CREATE USER youruser WITH PASSWORD 'yourpassword';
   CREATE DATABASE yourdb OWNER youruser;
   GRANT ALL PRIVILEGES ON DATABASE yourdb TO youruser;
   \q
   ```

2. From `backend/`, run migrations:

   ```bash
   source .venv/bin/activate
   pip install -r requirements.txt
   alembic upgrade head
   ```

## Run the backend

From `backend/`:

```bash
source .venv/bin/activate
python -m uvicorn app.main:app --reload
```

- API base: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- Interactive docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health: `GET /health`

CORS is configured for local development (`http://localhost:5173` and `http://127.0.0.1:5173`). Extend in `app/main.py` for other origins in production.

## Run the frontend

From `frontend/`:

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (i.e [http://localhost:5173](http://localhost:5173)).

```bash
npm run build   # production build
npm run start   # serve built app
npm run typecheck
```

## API overview (high level)

| Area          | Examples                                                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| Auth          | `POST /auth/login`, `POST /auth/signup`                                                                  |
| Users (admin) | `GET /users/agents`                                                                                      |
| Fields        | `GET/POST /fields`, `PATCH /fields/{id}/assign`, `POST /fields/{id}/updates`, `GET /fields/{id}/updates` |
| Dashboard     | `GET /dashboard/summary`                                                                                 |

Business rules: admins manage all fields; agents see and update only assigned fields, where applicable.

## Viewing the database

Use `psql`, pgAdmin, or a VS Code / Cursor PostgreSQL extension. Connect with the same credentials as `DATABASE_URL`, then e.g.:

```sql
\dt
SELECT * FROM users;
SELECT * FROM fields;
```

## Licenses

MIT
