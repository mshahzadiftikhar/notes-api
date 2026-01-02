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

## APIs

#### User Registration 

Creates a new user account with **secure password hashing**.  
This endpoint validates input, prevents duplicate registrations, and ensures passwords are **never stored in plaintext**.

---

#### Endpint
POST `/api/v1/auth/register`

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

#### Success Response

**Status Code:** `201 Created`

```json
{
  "id": 1,
  "email": "user@example.com",
  "createdAt": "2026-01-02T12:00:00.000Z"
}
```

#### Failure Response Format

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

Possible Error Messages
 - Email and password are required – 400
 - Password must be at least 8 characters long – 400
 - User already exists – 409
 - Internal Server Error – 500