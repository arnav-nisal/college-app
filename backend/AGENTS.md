# Backend Architecture & Agent Instructions (`backend/`)

This document defines the technical standards, project structure, tooling rules, and skill triggers for the FastAPI backend service.

---

## 1. Environment & Package Management Tooling

- **Python Version:** Python 3.13+ (pinned via `.python-version`).
- **Package Manager:** Strictly manage dependencies using [**`uv`**](https://docs.astral.sh/uv/).
  - **NEVER** use bare `pip install` or `pip freeze`.
  - **Add dependencies:** `uv add <package>` (or `uv add --dev <package>`)
  - **Sync dependencies:** `uv sync`
  - **Run development server:** `uv run fastapi dev main.py --port 8000` (or `uv run uvicorn app.main:app --reload`)
  - **Run migrations / scripts:** `uv run alembic upgrade head` / `uv run python script.py`

---

## 2. Architecture & Modular Layout

The backend follows a modular, asynchronous architectural pattern inside `app/`:

```
backend/
├── app/
│   ├── main.py          # FastAPI app initialization, CORS, global middlewares, router inclusion
│   ├── config.py        # Pydantic Settings (BaseSettings) loading environment variables
│   ├── database.py      # Async SQLAlchemy engine (asyncpg), async session factory, get_db dependency
│   ├── models.py        # SQLAlchemy 2.0 declarative models (Mapped, mapped_column, ForeignKey)
│   ├── schemas.py       # Pydantic V2 schemas (input validation, response models, serialization)
│   ├── auth.py          # Google token verification (google-auth), JWT encoding/decoding, RBAC guards
│   └── routers/         # Domain-driven route controllers
│       ├── auth.py      # /auth/google, /auth/refresh
│       ├── users.py     # /users/me, /users/me/onboarding, /users/faculty
│       ├── notices.py   # /notices (role-gated publishing and feed)
│       ├── messages.py  # /messages (direct messages, conversation sync, WebSocket real-time)
│       └── exams.py     # /exams (timetables, hall tickets, scores)
├── tests/               # pytest test suite
│   ├── conftest.py      # Async fixtures, test client, test DB session
│   ├── test_auth.py     # Authentication & token verification tests
│   ├── test_rbac.py     # Role permission & guard tests
│   └── test_api.py      # Endpoint functional tests
├── pyproject.toml       # Project metadata and dependencies
├── uv.lock              # Lockfile managed exclusively by uv
├── .env.example         # Template of required environment variables
└── AGENTS.md            # Backend instructions (this file)
```

### Core Technologies
- **Framework:** FastAPI (utilizing ASGI asynchronous request lifecycle).
- **ORM & Database:** SQLAlchemy 2.0 async with `asyncpg` driver targeting Neon Serverless PostgreSQL.
- **Cache & Real-time:** Redis for WebSocket pub/sub distribution and caching.
- **Security & Auth:** `google-auth` for verifying `@despu.edu.in` tokens, `pyjwt` for signing and validating session bearer tokens.
- **Data Validation:** Pydantic V2 strictly adhering to `snake_case` JSON serialization.

---

## 3. Mandatory Backend Skill Triggers

Antigravity agents must trigger these specialized skills when working in `backend/`:

| Skill | Trigger Conditions | Specific Instructions |
| :--- | :--- | :--- |
| **`@fastapi-pro`** | **Routers, Dependencies, Pydantic V2 models, WebSockets** | Implement clean async route handlers, idiomatic `Depends()` injection, response models with `model_config = ConfigDict(from_attributes=True)`, and async WebSocket connection managers. |
| **`@auth-implementation-patterns`** | **Google OAuth verification, JWT issuance, RBAC security guards** | Validate Google ID tokens against `@despu.edu.in` hosted domain, issue secure short-lived JWTs, handle refresh strategies, and enforce role guards (`get_current_active_user`, `require_roles(["staff", "head", "super_admin"])`). |
| **`@database-design`** | **SQLAlchemy models, schema modifications, Alembic migrations** | Design 3NF normalized tables with explicit foreign keys, composite indices for frequent query paths (e.g. `(receiver_id, created_at)` in messages), cascades, and data integrity constraints. |
| **`@api-security-best-practices`** | **CORS policy, input sanitization, faculty anti-spam logic** | Configure restrictive CORS origins, prevent SQL injection via ORM parameterization, implement rate limiting on chat endpoints, enforce `dm_enabled` checks, and queue messages sent outside office hours. |
| **`@uv-package-manager`** | **Python dependency management and virtual environments** | Execute all dependency additions (`uv add`, `uv add --dev`), environment syncing (`uv sync`), and command execution (`uv run`) exclusively via `uv`. Bare `pip` commands are strictly forbidden. |
| **`@python-testing-patterns`** | **Unit, integration, and security test suites** | Build comprehensive async `pytest` test suites with fixtures for async db sessions, authentication headers, mock Google OAuth tokens, and RBAC endpoint matrix testing. |

---

## 4. Coding Standards & Conventions

1. **Async by Default:**
   - All DB operations must use `await session.execute(...)` with `select()`, `insert()`, etc. Never use legacy `session.query()`.
   - Never run blocking I/O inside async path endpoints. Use `async def` for all route handlers.
2. **Type Safety & Type Annotations:**
   - Use strict Python type annotations everywhere (`Mapped[int]`, `Mapped[str]`, `list[str]`, `Optional[datetime]`).
   - Use Pydantic schemas for request bodies and response models to enforce contract compliance with the frontend.
3. **HTTP Status Codes & Error Responses:**
   - Return semantic HTTP status codes (`201 Created` for resource creation, `204 No Content` for deletions, `401 Unauthorized` for missing/invalid auth, `403 Forbidden` for role mismatch, `422 Unprocessable Entity` for invalid payloads).
   - Use `HTTPException(status_code=..., detail=...)` consistently.
4. **Environment Variables:**
   - Access secrets and configuration exclusively through `app.config.get_settings()`, never via raw `os.environ` inside business logic.
