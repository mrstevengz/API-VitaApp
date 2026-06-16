# Vita-App API

Node.js REST API for Vita-App, built with **Express 5**, **Prisma 7** (using the `@prisma/adapter-pg` driver adapter), and **PostgreSQL**. It exposes CRUD endpoints for meals and workouts under `/api`.

---

## Tech stack

| Piece | What it is |
|-------|-----------|
| Express 5 | HTTP server / routing |
| Prisma 7 | ORM + migrations (generates a **TypeScript** client) |
| `@prisma/adapter-pg` + `pg` | Driver adapter that connects Prisma to PostgreSQL |
| PostgreSQL | The database |
| tsx | Runs the server and the generated `.ts` Prisma client without a build step |
| pnpm | Package manager |

---

## Prerequisites

1. **Node.js 22+** — the `dev` script uses `--env-file` and `--experimental-strip-types`, which need a recent Node. Check with `node -v`.
2. **pnpm** — if you don't have it: `npm install -g pnpm` (or `corepack enable`).
3. **PostgreSQL** — a running Postgres server. Either install locally (https://www.postgresql.org/download/) or run it in Docker:
   ```bash
   docker run --name vita-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
   ```

---

## Setup — step by step

### 1. Install dependencies
From the project root (`Vita-App API/`):
```bash
pnpm install
```

### 2. Create the database
```bash
psql -U postgres -c "CREATE DATABASE vitaapp;"
```
(Name it anything — just match it in the `.env` below.)

### 3. Create the `.env` file
Prisma and the server both read `DATABASE_URL` from a `.env` file in the project root. **This file is not committed — you must create it yourself.**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vitaapp?schema=public"
PORT=5000
```

Connection string format:
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```
- `USER` / `PASSWORD` — your Postgres credentials.
- `HOST` — `localhost` for a local/Docker Postgres.
- `PORT` — Postgres port, usually `5432` (not the API port).
- `DATABASE` — the database you created in step 2.

> If your password has special characters (`@`, `:`, `/`, `#`…), URL-encode them (e.g. `@` → `%40`).

### 4. Generate the Prisma client
Reads `prisma/schema.prisma` and generates the client into `src/generated/prisma/` (as `.ts` files):
```bash
pnpm prisma generate
```

### 5. Run migrations (create the tables)
```bash
pnpm prisma migrate dev
```
If prompted for a migration name, type something like `init`.

### 6. Start the server
```bash
pnpm dev
```
You should see:
```
Server started on 5000
```

### 7. Verify it works
```bash
curl http://localhost:5000/api/meals
```
An empty array `[]` on a fresh database is fine.

---

## Available scripts

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Starts the server with hot-reload (`tsx --watch`), loads `.env`, port 5000 |
| `pnpm prisma generate` | Regenerates the Prisma client (run after editing `schema.prisma`) |
| `pnpm prisma migrate dev` | Creates/applies a migration (run after editing models) |
| `pnpm prisma studio` | Opens a browser GUI to view/edit the database |

> There is no `start` (production) script yet — only `dev`. Add one if you deploy.

---

## API endpoints

Base URL: `http://localhost:5000/api`

All request/response bodies are JSON. Send `Content-Type: application/json` on POST/PUT.

### Meals

| Method | Path | Description | Request body |
|--------|------|-------------|--------------|
| GET | `/api/meals` | List all meals | — |
| POST | `/api/meals` | Create a meal | `Meal` (without `id`) |
| PUT | `/api/meals/:id` | Update a meal | `Meal` fields to change |
| DELETE | `/api/meals/:id` | Delete a meal | — |

**`Meal` object:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | Auto-generated; do not send on create |
| `name` | string | **Unique** |
| `calories` | number | |
| `fat` | number | grams |
| `protein` | number | grams |
| `directions` | string | |
| `section` | enum | One of `BREAKFAST`, `LUNCH`, `DINNER`, `SNACKS` |

Example — create a meal:
```bash
curl -X POST http://localhost:5000/api/meals \
  -H "Content-Type: application/json" \
  -d '{"name":"Oatmeal","calories":320,"fat":6,"protein":12,"directions":"","section":"BREAKFAST"}'
```

Example — update a meal:
```bash
curl -X PUT http://localhost:5000/api/meals/1 \
  -H "Content-Type: application/json" \
  -d '{"calories":350}'
```

Example — delete a meal:
```bash
curl -X DELETE http://localhost:5000/api/meals/1
```

### Workouts

| Method | Path | Description | Request body |
|--------|------|-------------|--------------|
| GET | `/api/workouts` | List all workouts | — |
| POST | `/api/workouts` | Create a workout | `Workout` (without `id`) |
| PUT | `/api/workouts/:id` | Update a workout | `Workout` fields to change |
| DELETE | `/api/workouts/:id` | Delete a workout | — |

**`Workout` object:**

| Field | Type | Notes |
|-------|------|-------|
| `id` | int | Auto-generated; do not send on create |
| `name` | string | **Unique** |
| `minutes` | number | |
| `caloriesBurned` | number | |
| `description` | string | |

Example — create a workout:
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Content-Type: application/json" \
  -d '{"name":"Morning run","minutes":30,"caloriesBurned":280,"description":"Easy 5k"}'
```

> **Known issue:** the `POST /api/workouts` handler currently has a bug — it references an undefined `workout` variable (`data: workout`) and never sends a response, so creating a workout fails. Fix it the same way as the meals handler:
> ```js
> router.post("/", async (req, res) => {
>   try {
>     const workout = await prisma.workout.create({ data: req.body });
>     res.status(201).json(workout);
>   } catch (error) {
>     console.error(error);
>     res.status(500).json({ error: "Failed to create workout" });
>   }
> });
> ```

---

## Project structure

```
Vita-App API/
├─ prisma/
│  ├─ schema.prisma        # data models (Meal, Workout, Section enum)
│  └─ migrations/          # generated migration history
├─ src/
│  ├─ server.js            # Express app entry point (port, middleware, routes)
│  ├─ prismaClient.js      # creates the PrismaClient with the pg adapter
│  ├─ routes/
│  │  ├─ index.js          # mounts /meals and /workouts under /api
│  │  ├─ mealRoutes.js
│  │  └─ workoutRoutes.js
│  └─ generated/prisma/    # AUTO-GENERATED Prisma client (.ts) — do not edit
├─ prisma.config.ts        # Prisma CLI config (schema path, DATABASE_URL)
├─ package.json
└─ .env                    # YOU create this (not committed)
```

---

## Troubleshooting — common errors

### 1. `does not provide an export named 'PrismaClient'` / `Cannot find module '.../generated/prisma/client.js'`
**Cause:** Prisma 7 generates the client as **TypeScript**, so the file is `client.ts`, not `client.js`. Importing the `.js` path fails.

**Fix:** import with the `.ts` extension (as `src/prismaClient.js` already does):
```js
import { PrismaClient } from "./generated/prisma/client.ts";
```
This works because `dev` runs with `tsx --experimental-strip-types`, which lets Node import `.ts` directly. Running with plain `node` will break this import — always start with `pnpm dev`.

> In Prisma 7 you do **not** import `PrismaClient` from `@prisma/client` anymore — it comes from your generated output folder.

### 2. `Cannot find module './generated/prisma/client.ts'`
**Cause:** the client hasn't been generated (the `src/generated/prisma/` folder is missing/stale).
**Fix:**
```bash
pnpm prisma generate
```
Run after a fresh clone and after **every** `schema.prisma` change.

### 3. `Unknown argument 'section'` (or any field) when creating/updating
**Cause:** the generated client is out of sync with `schema.prisma`.
**Fix:**
```bash
pnpm prisma generate
pnpm prisma migrate dev
```
Then restart the server (stop it first — Node caches the old client in memory).

### 4. `Environment variable not found: DATABASE_URL` / connection refused / authentication failed
**Cause:** `.env` missing, URL wrong, or Postgres not running.
**Fix checklist:**
- `.env` exists in the project root with a valid `DATABASE_URL`.
- Postgres is running (`docker ps` or check your local service).
- The database in the URL actually exists (step 2).
- Username/password correct; special characters URL-encoded.

### 5. POST error `Argument 'name' is missing` / `req.body` is `undefined`
**Cause:** the JSON body parser isn't registered, so Express never reads the body.
**Fix:** ensure this runs **before** the routes in `src/server.js` (it already does):
```js
app.use(express.json());
```

### 6. `EADDRINUSE: address already in use :::5000`
**Cause:** port 5000 is already taken (often a previous server instance).
**Fix:** change `PORT` in `.env`, or stop the process using port 5000.

### 7. `--env-file` / `--experimental-strip-types` is not a valid Node flag
**Cause:** Node too old for these flags.
**Fix:** upgrade to **Node 22+** (`node -v`).

### 8. POST returns 500/503 with a unique-constraint error
**Cause:** `Meal.name` and `Workout.name` are `@unique`. A second record with the same name violates the constraint.
**Fix:** use a different name, or remove `@unique` in `schema.prisma` (then `pnpm prisma migrate dev`).

---

## Connecting from the Android app (Vita-App)

1. **`localhost` doesn't mean your computer** inside the emulator — it means the emulator itself. Use:
   ```
   http://10.0.2.2:5000/api/
   ```
   (On a physical device on the same Wi-Fi, use your computer's LAN IP, e.g. `http://192.168.1.x:5000/api/`.)

2. **Android blocks cleartext HTTP** on Android 9+. For local dev, add to the `<application>` tag in `AndroidManifest.xml`:
   ```xml
   android:usesCleartextTraffic="true"
   ```
