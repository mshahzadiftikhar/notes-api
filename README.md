# notes-api

A note taking backend infrastructure using Express.js.

## Quick start — get running locally

Follow these steps to get the project running locally from a clean machine.

1. Clone and install dependencies

```bash
git clone https://github.com/mshahzadiftikhar/notes-api.git
cd notes-api
npm install
```

2. Create a `.env` file in the project root (example values below).

```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=notes_db
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=some_value

REDIS_HOST=localhost
REDIS_PORT=6379

CACHE_TTL=120
```

3. Start the local database (uses Docker Compose)
Make sure docker is installed.
```bash
npm run db:start
```

4. Run database migrations

```bash
npm run db:migrate
```

5. Start the server

```bash
npm start
# or for development with auto-reload:
npm run dev
```

6. Stop local DB when finished

```bash
npm run db:stop
```

If you need to reset the DB (removes volumes):

```bash
npm run db:reset
```

Troubleshooting quick tips:
- If you see `JWT_SECRET is not defined` set a value for `JWT_SECRET` in `.env`.
- If the app can't connect to the DB, verify Docker is running and that `DB_HOST`/`DB_PORT` match the Compose service.

## APIs

APIs detailed can be found at: [API Details](docs/APIs.md)

## Overview

`notes-api` is a small backend service built with Node.js and Express for storing and serving notes. The project uses Sequelize as an ORM and a MySQL database (via Docker Compose) for persistence.

## Requirements

- Node.js (recommend v16+)
- npm
- Docker & Docker Compose (for the bundled MySQL service)

## Install

Clone the repo and install dependencies:

```bash
git clone https://github.com/mshahzadiftikhar/notes-api.git
cd notes-api
npm install
```

## Environment

Create a `.env` file in the project root to configure the app and database. Example variables the app expects:

```
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=notes_db
DB_USER=root
DB_PASSWORD=root

JWT_SECRET=some_secret_here

REDIS_HOST=localhost
REDIS_PORT=6379

CACHE_TTL=120
```

(Adjust values to match your Docker Compose service or your external DB.)

## Database (local using Docker Compose)

This project includes npm scripts to manage a local MySQL instance via Docker Compose.

- Start DB in background:

```bash
npm run db:start
# runs: docker-compose up -d
```

- Stop DB and remove containers (keeps volumes by default):

```bash
npm run db:stop
# runs: docker-compose down
```

- Tail DB logs (service named `mysql`):

```bash
npm run db:logs
# runs: docker-compose logs -f mysql
```

- Reset DB (removes volumes then recreates containers):

```bash
npm run db:reset
# runs: docker-compose down -v && docker-compose up -d
```

Notes:
- The Docker Compose file should be present at the project root (if not, create one matching these scripts).
- `db:reset` will remove volumes — use with caution on important data.

## Migrations & Seeders (Sequelize)

This project uses `sequelize` as an ORM and `sequelize-cli` (installed as a dev dependency) to manage database schema changes and seed data.

Typical workflow:

- Ensure the database is running (local Docker Compose):

```bash
npm run db:start
```

- Run migrations (apply all pending migrations):

```bash
npm run db:migrate
# or: npx sequelize-cli db:migrate
```

- Undo the last migration:

```bash
npm run db:migrate:undo
# or: npx sequelize-cli db:migrate:undo
```

- Undo all migrations:

```bash
npm run db:migrate:undo:all
# or: npx sequelize-cli db:migrate:undo:all
```

- Generate a new migration scaffold (name your migration):

```bash
npm run db:migration:generate -- --name create-notes-table
# or: npx sequelize-cli migration:generate --name create-notes-table
```

## Scripts

- Start (production):

```bash
npm start
# runs: node src/server.js
```

- Development (auto-reload with nodemon):

```bash
npm run dev
# runs: nodemon src/server.js
```

- DB management scripts (use Docker & Docker Compose):

```bash
npm run db:start   # docker-compose up -d
npm run db:stop    # docker-compose down
npm run db:logs    # docker-compose logs -f mysql
npm run db:reset   # docker-compose down -v && docker-compose up -d
```

## Dependencies

- express
- dotenv
- sequelize (ORM)
- mysql2 (MySQL driver)

## Repository

Repository: https://github.com/mshahzadiftikhar/notes-api