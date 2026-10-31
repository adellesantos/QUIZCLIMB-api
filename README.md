# QuizClimb API

Backend API for **QuizClimb**, a tournament game for the SorSU Bulan Campus library.
CS 313 Software Engineering 1, A.Y. 2026-2027.

- Developer: Adelle Delos Santos (adellesantos), BSCS 3-2
- Group and game concept: Team 4

This is my own build of my group's game concept. Every commit in this repository was made by me, with Git, on my own computer or in my own Codespace.

## Tech stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 22 LTS or newer |
| Web framework | Express 5 |
| Database | PostgreSQL 16 or newer |
| ORM and migrations | Sequelize 6 with sequelize-cli |

## Setup

```
git clone [repository-url]
cd [folder-name]
npm install
```

Copy `.env.example` to `.env`, then put your own PostgreSQL password in `DB_PASSWORD`.

```
npm run db:create     (first time only)
npm run db:migrate
npm run db:seed
npm run db:check
npm run dev
```

## Environment variables

| Key | Example | Purpose |
|---|---|---|
| NODE_ENV | development | Which config block to use |
| PORT | 3001 | Port the API listens on (the library assigns the final port at deployment) |
| DB_HOST | 127.0.0.1 | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | quiz_climb | Database name: your game slug, with underscores |
| DB_USER | postgres | Database user |
| DB_PASSWORD | (your own) | Database password. Never commit this. |
| HUB_API_KEY | dev-hub-key | Key the Library Game Hub sends to read results. The library gives the real one at deployment. |

## Endpoints (Hub Contract v1.2)

Base URL: `http://localhost:3001/api/v1`

| Method | Path | Auth | Purpose | Success |
|---|---|---|---|---|
| GET | /health | none | Is the API up and can it reach the database? | 200 (503 when the database is down) |
| GET | /game-info | none | Slug, name, group, developer, description, player limits, version | 200 |
| GET | /results | `X-Hub-Key` header | Finished games, every player, and the top 3. Optional `?since=` | 200 (401 without the key) |

## Week 11: Module 1 — Question-sets CRUD

| Method | Path | Auth | Purpose | Success |
|---|---|---|---|---|
| GET | /question-sets | `X-Demo-User` | List all question sets | 200 |
| POST | /question-sets | `X-Demo-User` + HOST/ADMIN | Create a question set | 201 |
| GET | /question-sets/:id | `X-Demo-User` | Read a question set by ID | 200 |
| PATCH | /question-sets/:id | `X-Demo-User` + HOST/ADMIN + ownership | Update a question set | 200 |
| DELETE | /question-sets/:id | `X-Demo-User` + HOST/ADMIN + ownership | Delete a question set | 204 |

## Week 11: Module 2 — Sessions and Players

| Method | Path | Auth | Purpose | Success |
|---|---|---|---|---|
| POST | /sessions | `X-Demo-User` + HOST/ADMIN + question_set_id | Create a session (server-generated 6-digit code, linked to a question set) | 201 |
| GET | /sessions/:code | `X-Demo-User` | Read a session by code | 200 |
| PATCH | /sessions/:code | `X-Demo-User` + HOST/ADMIN + ownership | Update session status or question set | 200 |
| POST | /sessions/:code/players | `X-Demo-User` | Join or rejoin a session | 201 (new) / 200 (rejoin) |
| GET | /sessions/:code/players | `X-Demo-User` | List players in a session | 200 |

## Authentication

Week 11 uses the `X-Demo-User` header to identify the current user. The header value is matched against `users.school_id`. Missing or unknown header returns `401 AUTH_REQUIRED`.

Role values: `HOST`, `ADMIN`, `PLAYER`.

## Session Lifecycle

Session statuses: `LOBBY` (joinable), `RUNNING` (in progress, not joinable), `CLOSED` (finished).

- `POST /sessions` creates a session in `LOBBY` status with a server-generated six-digit session code.
- Only `LOBBY` sessions accept new players.
- A player in another `RUNNING` game receives `409 ALREADY_IN_GAME`.
- Rejoining by `(session_id, user_id)` returns the same seat with `200`.
- Nickname must be unique within a session (`UNIQUE(session_id, nickname)`).
- One seat per account per session (`UNIQUE(session_id, user_id)`).

## Error Format

All errors return JSON:
```json
{ "error": { "code": "<CODE>", "message": "<text>" } }
```

Common codes: `AUTH_REQUIRED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `VALIDATION_ERROR` (400), `SESSION_NOT_FOUND` (404), `SESSION_NOT_JOINABLE` (409), `ALREADY_IN_GAME` (409), `NICKNAME_TAKEN` (409), `QUESTION_SET_NOT_FOUND` (404).

## Database Changes

| Table | Change |
|---|---|
| users | `role` now uses `HOST`, `ADMIN`, `PLAYER` |
| question_sets | New table: question_set_id PK, title, host_user_id FK → users |
| game_sessions | Added `host_user_id` FK → users; added `question_set_id` FK → question_sets; status is `LOBBY`/`RUNNING`/`CLOSED` |
| players | Added `UNIQUE(session_id, nickname)` |
| questions | Unchanged (preserved for future question-level functionality) |

## Tables

| Table | Description |
|---|---|
| users | Player accounts: school_id, full_name, email, role (HOST/ADMIN/PLAYER) |
| question_sets | Host-managed question sets: question_set_id, title, host_user_id |
| game_sessions | Game sessions with a six-digit session_code and LOBBY/RUNNING/CLOSED status; host_user_id identifies the session owner; question_set_id links to the question set used |
| players | Seat table: one row per player per session, with nickname, score, completed, finished_at; UNIQUE(session_id, user_id) and UNIQUE(session_id, nickname) |
| questions | Global question bank: question text, options, correct answer, points (preserved, no Week 11 changes) |

## What "completed" means in my game

A session is finished when its status is CLOSED and ended_at is set. A player is completed when completed is true (equivalently, finished_at is set).

## Database scripts

| Command | What it does |
|---|---|
| npm run db:migrate | Runs migrations that have not run yet |
| npm run db:migrate:status | Lists every migration as up or down |
| npm run db:seed | Loads the seed data |
| npm run db:check | Counts the rows in every table |
| npm run db:reset | Empties the database, rebuilds every table and reloads the seed data |
| npm run check | Runs the same automatic check that GitHub runs after every push |
