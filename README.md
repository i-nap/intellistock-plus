# IntelliStock+

Warehouse management system — inventory, products, suppliers, purchase orders, an
auto-reorder engine, notifications, and reporting, with role-based access control.

**Stack:** Next.js (App Router) + TypeScript + Tailwind + shadcn/ui · Spring Boot 4 (Java 21) + PostgreSQL

## Running locally

Requires Docker, Java 21, and [Bun](https://bun.sh).

```bash
# 1. Database (Postgres on host port 5433)
docker compose up -d

# 2. Backend config
cp backend/.env.example backend/.env
#    then set JWT_SECRET — generate one with: openssl rand -hex 32

# 3. Backend → http://localhost:8080
cd backend && ./mvnw spring-boot:run

# 4. Frontend → http://localhost:3000
cd frontend && cp .env.example .env.local && bun install && bun run dev
```

Seed data loads on first boot. Sign in with `admin@email.com` / `Admin@123`.

## Tests

```bash
cd backend && ./mvnw test
```

## Layout

```
backend/    Spring Boot API — feature-per-package (product, inventory, order, reorder, …)
frontend/   Next.js app — app/ routes, features/ API+hooks, components/ UI
docs/       Coding rules, business logic, design system, definition of done
```

Start at [`CLAUDE.md`](CLAUDE.md) for the documentation index.

## Notes

- Schema is managed by Hibernate `ddl-auto=update` for development; Flyway is present
  but disabled, and the migrations in `backend/src/main/resources/db/migration` do not
  yet cover every table. Re-enabling Flyway is a prerequisite for a production deploy.
- eSewa billing runs against the published sandbox credentials by default.
