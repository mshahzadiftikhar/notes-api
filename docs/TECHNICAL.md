# Technical Documentation

This document outlines the technical decisions, architecture, and implementation details of the **Notes API** backend project.

---

## Project Overview

The Notes API is a backend service built using **Node.js, Express.js, MySQL, and Sequelize ORM**.  
It provides a secure and scalable foundation for a note-taking application with user authentication, versioning, and future support for caching and full-text search.

---

## Technology Stack

- **Node.js** – JavaScript runtime
- **Express.js** – Web framework
- **MySQL** – Relational database
- **Sequelize** – ORM for database interactions
- **Docker & Docker Compose** – Local infrastructure
- **bcrypt** – Password hashing
- **dotenv** – Environment variable management

---

## Database Architecture

### Tables

- **users**
- **notes**
- **note_versions**

### ORM & Migrations

- Sequelize ORM is used for database access
- Database schema is managed using versioned migrations
- Migrations are the source of truth for schema evolution
- Sequelize CLI is configured via `.sequelizerc`

## Sequelize CLI Configuration

- Avoided `sequelize init` to maintain a clean project structure
- Custom configuration provided using JavaScript instead of JSON
- Environment variables loaded via `.env`

---

## Application Architecture

The application follows a layered architecture to promote separation of concerns and maintainability.

- **Routes Layer**
  - Defines HTTP routes and attaches middleware
- **Controller Layer**
  - Handles request/response logic
  - Performs input validation and error handling
- **Service Layer**
  - Contains business logic
  - Handles database access and caching
- **Model Layer**
  - Sequelize models representing database tables

Controllers remain thin, while services encapsulate core application logic.

---
## Concurrency Control

Optimistic locking is used to prevent concurrent updates to the same note.

### Approach
- Each note contains a `version` field
- Clients must send the current version when updating
- If the stored version does not match the provided version:
  - Update is rejected with `409 Conflict`

### Benefits
- No database locks
- High performance
- Suitable for distributed systems

This approach ensures data integrity while maintaining scalability.

---

## Note Versioning

Each note update creates a new immutable version stored in `note_versions`.

- Version numbers are sequential (1, 2, 3…)
- Reverting a note creates a new version instead of overwriting history
- Version history is preserved even after soft deletion

This ensures:
- Full audit history
- Safe rollbacks
- Non-destructive updates

---



## Redis Caching 

Redis is used as an in-memory caching layer to improve the performance of frequently accessed read APIs in the Notes API. By caching read-heavy responses, we reduce database load, lower response latency, and improve overall scalability.

Redis is integrated using a Singleton pattern, ensuring a single shared Redis connection across the application. Here's the high level workflow:

Client -> Express API -> Service Layer -> Redis (Cache) -> MySQL (on cache miss)

### Cached APIs

Retrieve All Notes
 - Cache Key: notes:user:{userId}
 - TTL: 120 seconds
 - Reason: High-read endpoint

Retrieve Note by ID (with versions)
 - Cache Key: note:{noteId}:user:{userId}
 - TTL: 120 seconds
 - Reason: Frequently accessed detailed view

### Cache Invalidation Strategy

To maintain data consistency, cache is invalidated whenever data changes.
 - New note creation
 - Note update, delete, version revert. 