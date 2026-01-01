# notes-api

A note taking backend infrastructure using Express.js.

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
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=notes_db
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