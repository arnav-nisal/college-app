# College App — Monorepo Architecture & Agent Instructions

This document governs architecture, coding standards, API contracts, and skill invocation across the `College_app` monorepo.

---

## 1. Project Overview

The **College App** is the official campus platform designed for seamless communication, academic tracking, notices, and interactions across students and faculty.

- **Frontend (`frontend/`):** React Native + Expo (SDK 58) mobile app featuring an Instagram-style modern interface with 5 primary tabs:
  1. `Home` — Campus feed, highlights, events, and dynamic campus activity.
  2. `Notices` — Official circulars, departmental broadcasts, and urgent announcements.
  3. `Messages` — Real-time direct and departmental messaging with anti-spam controls.
  4. `Exams` — Schedules, seating arrangements, hall tickets, and results.
  5. `Profile` — Student/Staff identity card, academic details, and account settings.
- **Backend (`backend/`):** Cloud-synced, high-performance async REST & WebSocket API built on Python 3.13, FastAPI, PostgreSQL (Neon / SQLAlchemy 2.0 asyncpg), and Redis (pub/sub & caching).

---

## 2. Role-Based Access Control (RBAC) Hierarchy

The application enforces strict four-tier hierarchical role-based permissions:

```
[student] < [staff] < [head] (HOD) < [super_admin]
```

| Role | Scope & Permissions |
| :--- | :--- |
| `student` | Read published notices, view individual exam timetables/grades, initiate DMs with peers and permitted faculty, manage personal profile. |
| `staff` | Post departmental notices, manage class attendance/marks, receive student DMs (subject to office hours and faculty controls), toggle personal DM availability. |
| `head` (HOD) | Department-wide authority: approve departmental circulars, broadcast notices to department branches, oversee faculty and student listings within the department. |
| `super_admin` | College-wide authority: campus-wide broadcast notices, role elevation, auditing logs, compliance oversight of all chat messages and system settings. |

---

## 3. Frontend ↔ Backend Contract Rules

### 3.1 Naming & Serialization
- **`snake_case` Everywhere in Payloads:** All request and response JSON payloads must strictly use `snake_case`.
  - Backend models use Pydantic V2 schemas (`app/schemas.py`).
  - Frontend TypeScript models in `frontend/src/types/` must mirror these schemas with exact matching `snake_case` property names.

### 3.2 Authentication & Onboarding Lifecycle
1. **Domain Restriction:** Google Sign-In is strictly restricted to the official institutional hosted domain (`@despu.edu.in`).
2. **Backend Token Exchange:** Frontend sends Google ID Token / authorization credential via `POST /auth/google`.
3. **Response Payload:** The backend verifies the token with `google-auth`, checks or provisions user in PostgreSQL, and returns:
   - `access_token` (App JWT)
   - `token_type` (`"bearer"`)
   - `is_profile_complete` (boolean)
   - `user` object containing role, email, and basic profile info.
4. **Onboarding Gate:**
   - If `is_profile_complete === false` (first-time login), the frontend gates the user to the `/onboarding` screen.
   - The user submits their profile details (e.g. branch, semester, roll number/faculty ID) via `PATCH /users/me/onboarding`.
   - Upon successful update, `is_profile_complete` becomes `true` and the user proceeds to `/(tabs)`.

### 3.3 Cloud-Synced Messaging & Anti-Spam Controls
- **Persistence & Auditability:** Chat messages are persisted in PostgreSQL for seamless multi-device synchronization and `super_admin` compliance and safety visibility.
- **Faculty Anti-Spam & Boundaries:**
  - Faculty can configure `dm_enabled` (boolean) to accept or disable incoming student direct messages.
  - Office-hours queuing: Messages sent to faculty outside working hours are automatically queued or flagged with office-hour delivery notices.

---

## 4. Global Skill Routing Table

Whenever performing architectural, feature development, debugging, or refactoring tasks, invoke the following skills:

| Skill | Trigger / Context | Purpose |
| :--- | :--- | :--- |
| `@brainstorming` | **Before any multi-file feature or architectural change** | Validate requirements, explore trade-offs, identify edge cases, and establish clean design consensus before touching code. |
| `@ponytail` | **Default for all code generation, refactoring, and diff reviews (`lite` mode)** | Enforce minimal, pragmatic, YAGNI-focused solutions. Produce the shortest working diff while never cutting trust-boundary validation, data-loss error handling, or security. |
| `@systematic-debugging` | **Whenever encountering an error, bug, or test failure** | Investigate root causes systematically before proposing or applying fixes. Grep callers and trace failures defensively. |
| `@database-design` | **Schema changes, migrations, and relationship modeling** | Ensure optimized 3NF normalization, foreign key constraints, proper indexing, and efficient queries. |
| `@api-security-best-practices` | **API endpoints, authentication, input validation, rate limiting** | Enforce zero-trust validation, OWASP API Top 10 protection, and robust defense-in-depth. |

For domain-specific instructions, refer to:
- [backend/AGENTS.md](file:///backend/AGENTS.md) for FastAPI, SQLAlchemy, Alembic, and Python standards.
- [frontend/AGENTS.md](file:///frontend/AGENTS.md) for Expo, React Native, UI/UX, and mobile navigation standards.
