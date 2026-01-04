# TickerTrends Demo Project

A TypeScript/Express + TypeORM + Postgres backend with a Next.js frontend to scrape (or mock) Muckrack trend timeseries, store them, and visualize growth.

## Features
- Fetch (or mock) Muckrack trend series for any term
- Store in Postgres via TypeORM; migrations included
- Cron refresh every 3 hours
- Next.js neon UI with series chart and growth leaderboard
- Mock/fixture mode to bypass Cloudflare 403 blocks

## Quickstart
### Prereqs
- Node.js
- PostgreSQL reachable at localhost:5432 (defaults: user postgres / pass postgres / db tickertrends)

### Backend
1) Install deps
```
cd backend
npm install
```
2) Env (.env) minimal
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tickertrends
PORT=5002
CRON_SCHEDULE=0 */3 * * *
MOCK_MUCKRACK=0
```
3) Migrate
```
npm run migrate
```
4) Run (real fetch)
```
set PORT=5002; npm run start   # PowerShell
cmd /c "set PORT=5002 && npm run start"  # CMD
```
5) Run in mock mode (guaranteed data)
```
set PORT=5002; set MOCK_MUCKRACK=1; npm run start   # PowerShell
cmd /c "set PORT=5002 && set MOCK_MUCKRACK=1 && npm run start"  # CMD
```
Logs stay in this terminal; leave it open.

### Frontend
1) Install deps
```
cd frontend
npm install
```
2) Env (frontend/.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5002/api
```
3) Run Next.js
```
npm run dev -- --port 3000
```
If 3000 is busy, pick another port and open that URL.

## API (backend)
- POST /api/trends { term, startDate?, endDate? }
- GET /api/trends
- GET /api/trends/:term

## Cloudflare / 403
- Muckrack often challenges with HTTP 403; backend returns `UPSTREAM_BLOCKED` and frontend shows a 502/Network Error.
- Use mock mode (`MOCK_MUCKRACK=1`) to serve fixture data (backend/src/fixtures/mockTrend.json) and demo reliably.

## Notes
- Cron schedule: every 3 hours (`CRON_SCHEDULE=0 */3 * * *`).
- Frontend reads API base from frontend/.env.local.

## License
MIT. Created by: Chester Grudzinski 2026# TickerTrends Demo Project

## Overview
TickerTrends is a demo project that scrapes timeseries data for specified keywords from Muckrack, stores the data in a PostgreSQL database, and visualizes it on a Next.js frontend. The application allows users to enter search terms, view trends data, and sort the results based on growth.

## Features
- Scrapes Muckrack timeseries data for keywords.
- Stores data in a PostgreSQL database using TypeORM.
- Visualizes timeseries data with a black-blue neon GUI.
- Allows users to view and sort trends by growth percentage.

## Setup / Run (what to do)

### Prereqs
- Node.js, PostgreSQL running locally (defaults: host localhost, port 5432, user postgres, pass postgres, db tickertrends).

### Backend
1) From repo root:
```
cd backend
npm install
```
2) Create `.env` (if not present). Minimal defaults:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=tickertrends
PORT=5002
CRON_SCHEDULE=0 */3 * * *
MOCK_MUCKRACK=0
```
3) Run migrations:
```
npm run migrate
```
4) Start backend (real fetch):
```
set PORT=5002; npm run start   # PowerShell
```
   For Windows CMD:
```
cmd /c "set PORT=5002 && npm run start"
```
5) Start backend in mock mode (bypass Muckrack 403, serve fixture):
```
set PORT=5002; set MOCK_MUCKRACK=1; npm run start   # PowerShell
cmd /c "set PORT=5002 && set MOCK_MUCKRACK=1 && npm run start"  # CMD
```
   Logs appear in this terminal; leave it open.

### Frontend
1) From repo root:
```
cd frontend
npm install
```
2) Ensure frontend/.env.local contains:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5002/api
```
3) Start Next.js:
```
npm run dev -- --port 3000
```
If port 3000 is busy, pick another (e.g., 3001) and open that URL.

### API endpoints (backend)
- POST /api/trends { term, startDate?, endDate? }
- GET /api/trends
- GET /api/trends/:term

### Cloudflare blocking / 403 and fixture mode
- The upstream Muckrack endpoint may return a Cloudflare challenge (HTTP 403). The backend then responds with code `UPSTREAM_BLOCKED`; the frontend shows a 502/Network Error. The terminal running the backend shows the 403 log.
- To guarantee demo data, run backend with `MOCK_MUCKRACK=1` (see Backend step 5). Fixture lives at backend/src/fixtures/mockTrend.json.

### Notes
- Cron refresh runs every 3 hours by default (`CRON_SCHEDULE=0 */3 * * *`).
- Frontend reads the API base from frontend/.env.local (`NEXT_PUBLIC_API_BASE_URL`).

## Usage
- Frontend UI at http://localhost:3000 (or your chosen port). Submit a term to fetch/store and view the series + growth leaderboard.
- If blocked upstream, enable mock mode and retry.

## Setup Instructions

### Prerequisites
- Node.js
- PostgreSQL

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on the `.env.example` file and configure your database connection.
4. Run migrations to set up the database:
   ```
   npm run typeorm migration:run
   ```
5. Start the backend server:
   ```
   npm run start
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Next.js application:
   ```
   npm run dev
   ```

## Usage
- Access the frontend application at `http://localhost:3000`.
- Enter a keyword in the search form to fetch and visualize timeseries data.
- View trends sorted by growth percentage.

## Cloudflare blocking / 403 and mock mode
- The upstream Muckrack endpoint may return a Cloudflare challenge (HTTP 403). When that happens you will see `UPSTREAM_BLOCKED`/403 logs in the terminal where you started the backend. The frontend will show a 502/Network Error coming from the backend.
- To guarantee data for the demo, start the backend in mock mode so it serves the fixture instead of calling Muckrack:
   - PowerShell: `set PORT=5002; set MOCK_MUCKRACK=1; npm run start`
   - CMD: `cmd /c "set PORT=5002 && set MOCK_MUCKRACK=1 && npm run start"`
- Ensure the frontend points to the same port (e.g., NEXT_PUBLIC_API_BASE_URL=http://localhost:5002/api).

## License
This project is open-source and available under the MIT License.

Created by: Chester Grudzinski 2026
