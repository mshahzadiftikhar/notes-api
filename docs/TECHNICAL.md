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

### User Registration API

Creates a new user account with **secure password hashing**.  
This endpoint validates input, prevents duplicate registrations, and ensures passwords are **never stored in plaintext**.

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

#### Failure Response

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

#### Example

```
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPassword123"
  }'
```
---

### User Login API

Authenticates a registered user and returns a **JWT token** along with user details.  
The token allows the client to access protected APIs without storing session data on the server.

#### Endpoint
POST `/api/v1/auth/login`

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### Failure Response

```json
{
  "message": "Error description",
  "statusCode": 400
}
```

Possible Error Messages
 - Email and password are required – 400
 - User not found – 404
 - Invalid email or password - 400
 - Internal Server Error – 500

#### Example

```
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "StrongPassword123"
  }'
```
---

### Create Notes API

Creates a new note for the authenticated user.  
Each newly created note automatically creates **version 1** in the note version history.

This API requires authentication via **JWT**.
Authorization: Bearer <JWT_TOKEN>

#### Endpoint
POST `/api/v1/notes`

#### Request Body

```json
{
  "title": "My First Note",
  "content": "This is the content of my note."
}
```

#### Success Response

**Status Code:** `200 OK`

```json
{
  "id": 1,
  "title": "My First Note",
  "content": "This is the content of my note.",
  "userId": 1,
  "createdAt": "2026-01-02T12:00:00.000Z",
  "updatedAt": "2026-01-02T12:00:00.000Z"
}
```

#### Failure Response


```json
{
  "message": "Error description",
  "statusCode": 400
}
```
Possible Error Messages:
 - Title and content are required – 400
 - Access token missing – 401
 - Invalid token – 401

#### Example

```
curl -X POST http://localhost:3000/api/v1/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "title": "My First Note",
    "content": "This is the content of my note."
  }'
```
---

### Retrieve All Notes API

Fetches all notes associated with the authenticated user.  
Only the **latest version** of each note is returned.  
Historical versions are not included in this response.

This API requires authentication via **JWT**.  
Authorization: Bearer <JWT_TOKEN>

#### Endpoint
GET `/api/v1/notes`

#### Success Response

**Status Code:** `200 OK`

```json
[
  {
    "id": 2,
    "title": "Meeting Notes",
    "content": "Discussion points..."
  },
  {
    "id": 1,
    "title": "My First Note",
    "content": "This is the content of my note."
  }
]
```

#### Example

```
curl -X GET http://localhost:3000/api/v1/notes \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

### Retrieve Note by ID API

Fetches a specific note by its ID for the authenticated user. Returns the latest note data along with all historical versions.  


This API requires authentication via **JWT**.  
Authorization: Bearer <JWT_TOKEN>

#### Endpoint
GET `/api/v1/notes/:id`

#### Request Parameters

- `id` – ID of the note to retrieve

#### Success Response

**Status Code:** `200 OK`

```json
{
  "id": 1,
  "title": "Latest note title",
  "content": "Latest note content",
  "userId": 1,
  "createdAt": "2026-01-02T09:00:00.000Z",
  "updatedAt": "2026-01-02T12:30:00.000Z",
  "versions": [
    {
      "versionNumber": 1,
      "title": "My First Note",
      "content": "Initial content"
    },
    {
      "versionNumber": 2,
      "title": "My First Note",
      "content": "Updated content"
    }
  ]
}
```

#### Example

```
curl -X GET http://localhost:3000/api/v1/notes/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

### Delete Note API

Soft deletes a note for the authenticated user while **preserving its version history**.  
The note will no longer appear in list or detail APIs after deletion.

This API requires authentication via **JWT**.  
Authorization: Bearer <JWT_TOKEN>

#### Endpoint
DELETE `/api/v1/notes/:id`

#### Request Parameters

- `id` – ID of the note to delete

#### Success Response

**Status Code:** `200 OK`

```json
{
  "message": "Note deleted successfully"
}
```

#### Example
```
curl -X DELETE http://localhost:3000/api/v1/notes/1 \
  -H "Authorization: Bearer <JWT_TOKEN>"
```
---

### Retrieve Notes by Keywords (Full-Text Search)

This API allows users to search for their notes using keywords. It uses MySQL full-text search on the title and content columns of the notes table.
 - This only searches whole words and words longer than 3 characters (controlled by MySQL’s ft_min_word_len)
 - Short words (length < 4) and partial words (e.g., 'con' instead of 'content') are ignored.

#### Endpoint
GET `/api/v1/notes/search?query=<keyword>`

Requires authentication via JWT.
Authorization: Bearer <JWT_TOKEN>

#### Example

```
curl -X GET "http://localhost:3000/api/v1/notes/search?query=meeting" \
  -H "Authorization: Bearer <JWT_TOKEN>"
```