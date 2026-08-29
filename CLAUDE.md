# IntelliStock+ Documentation Hub

**For AI models:** This is your central reference. Read section-specific docs from `docs/` folder based on task context. Don't load everything at once.

---

## 📚 Documentation Structure

The original AGENTS.md has been split into focused sections for efficient navigation:

| Section | File | Purpose |
|---------|------|---------|
| **Overview** | `docs/00-index.md` | Quick navigation guide |
| **Project** | `docs/01-project-context.md` | Project overview & visual style |
| **Tech** | `docs/02-tech-stack.md` | Frontend & backend technologies |
| **Features** | `docs/03-core-features.md` | MVP scope & features |
| **Business Logic** | `docs/04-business-logic-rules.md` | Reorder, stock, demand formulas |
| **Design** | `docs/05-design-system.md` | Colors, UI, dashboard design |
| **Frontend Structure** | `docs/06-frontend-file-structure.md` | Directory structure |
| **Frontend Rules** | `docs/07-frontend-coding-rules.md` | Component, API, type rules |
| **Backend Structure** | `docs/08-backend-file-structure.md` | Directory structure |
| **Backend Dependencies** | `docs/09-backend-dependency-rules.md` | Dependencies, Lombok usage |
| **Backend Rules** | `docs/10-backend-coding-rules.md` | Controllers, services, logging |
| **API Design** | `docs/11-api-design-rules.md` | REST, response format |
| **Security** | `docs/12-security-rules.md` | Auth, RBAC, roles |
| **Database** | `docs/13-database-rules.md` | Schema, migrations |
| **Testing** | `docs/14-testing-rules.md` | Frontend & backend tests |
| **Quality** | `docs/15-code-quality-rules.md` | Linting, builds |
| **Environment** | `docs/16-environment-rules.md` | Env variables |
| **A11y** | `docs/17-accessibility-rules.md` | Accessibility requirements |
| **Git** | `docs/18-git-rules.md` | Commit messages |
| **AI Behavior** | `docs/19-agent-behavior-rules.md` | AI coding guidelines |
| **Done Criteria** | `docs/20-definition-of-done.md` | Feature completion |

---

## 📋 Reference Resources

### IntelliStock Blueprint
**File:** `IntelliStock_Blueprint.docx`

Complete system blueprint with:
- Feature specifications
- UI/UX wireframes
- Database schema
- API endpoints
- User workflows
- Business requirements

**Use this for:**
- UI design reference & wireframes
- Understanding complete feature requirements
- Database structure & relationships
- API specifications & data models
- User workflows & interactions

---

## 🚀 Build & Development Tools

### Frontend (Next.js)

**Package manager:** `bun`

```bash
# Install dependencies
bun install

# Development
bun run dev

# Build
bun run build

# Production
bun start

# Lint & type check
bun run lint
bun run typecheck

# Tests
bun run test
```

### Backend (Spring Boot)

**Build tool:** Maven (mvnw)

```bash
# Run tests
./mvnw test

# Run application
./mvnw spring-boot:run

# Build package
./mvnw package

# Clean build
./mvnw clean install
```

---

## 📋 Quick Reference for AI

### When Starting a Task:

1. **Read relevant docs only** — don't load the entire hub
   - Working on frontend? → `docs/06-*`, `docs/07-*`, `docs/05-*`
   - Working on backend? → `docs/08-*`, `docs/09-*`, `docs/10-*`
   - Need design guidance? → `docs/05-design-system.md`
   - Need API structure? → `docs/11-api-design-rules.md`

2. **Check project context** — `docs/01-project-context.md`

3. **Verify done criteria** — `docs/20-definition-of-done.md`

### Tech Stack Summary

**Frontend:**
- Next.js with App Router
- TypeScript, Tailwind CSS, shadcn/ui
- React Hook Form, Zod
- TanStack Query, Recharts

**Backend:**
- Java 21+, Spring Boot
- PostgreSQL/MySQL, Spring Data JPA
- Lombok, MapStruct
- JUnit 5, Mockito

**Package Manager:** Bun (frontend), Maven (backend)

---

## 🔒 Key Constraints

- **No magic strings** — use constants
- **No direct API calls in components** — use hooks/services
- **DTOs everywhere** — never expose entities
- **Small files** — max ~250 lines per file
- **Tests required** — for important logic
- **No secrets in code** — use `.env` files

---

## 📞 Project: IntelliStock+

A full-stack **warehouse management system** featuring:
- Inventory & product management
- Supplier & order management
- Auto-reorder engine
- Notifications & reporting
- Role-based access control

**Design:** Clean fintech/SaaS dashboard with lime-green accent, soft background, rounded cards.

---

*Last updated: 2026-06-09 | Use `docs/` folder for detailed guidance*
