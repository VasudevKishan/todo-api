# Todo API (todo-api)

A small, typed Node + Express + MongoDB backend that provides authentication (JWT), user management, projects and todos for a single-user-style task manager. It's written in TypeScript and uses Mongoose for data modeling.

## Table of contents

- [Project overview](#project-overview)
- [Features](#features)
- [Requirements](#requirements)
- [Quickstart](#quickstart)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Users](#users)
  - [Projects](#projects)
  - [Todos](#todos)
- [Data models](#data-models)
- [Examples (curl)](#examples-curl)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project overview

This service exposes a REST API for managing users, projects, and todos. Authentication is done via short-lived access tokens (JWT) and a refresh token stored in an HTTP-only cookie. Protected routes require an `Authorization: Bearer <accessToken>` header.

## Features

- JWT-based authentication with refresh tokens (cookie)
- Role support for users (`User`, `Admin`)
- CRUD for projects and todos scoped to a user
- Validation and duplicate checks for usernames/emails/projects

## Requirements

- Node.js 18+ (or a recent LTS)
- A MongoDB connection (URI)

## Quickstart

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root (see Environment variables).

3. Run in development (uses `tsx`):

```bash
npm run dev
```

4. Build for production and run:

```bash
npm run build
npm start
```

By default the server listens on `PORT` (defaults to `3500` if not set).

## Environment variables

Create a `.env` file with at least the following variables:

- `DATABASE_URI` - MongoDB connection string (required)
- `ACCESS_TOKEN_SECRET` - secret used to sign access tokens (required)
- `REFRESH_TOKEN_SECRET` - secret used to sign refresh tokens (required)
- `PORT` - (optional) port to run the server on, default: `3500`
- `NODE_ENV` - (optional) `development` or `production`

Example `.env`:

```
DATABASE_URI=mongodb+srv://user:pw@cluster0.mongodb.net/todo-db
ACCESS_TOKEN_SECRET=your-access-secret
REFRESH_TOKEN_SECRET=your-refresh-secret
PORT=3500
NODE_ENV=development
```

## Scripts

- `npm run dev` - start development server (tsx watch)
- `npm run build` - compile TypeScript to `dist`
- `npm start` - start compiled `dist` server

## API Endpoints

All protected endpoints require the header: `Authorization: Bearer <accessToken>` (obtained from `/auth`). The refresh token is automatically set/cleared via HTTP-only cookie on login/logout.

#### Auth

- `POST /auth` - Login

  - Request body: `{ username: string, password: string }`
  - Response: `{ accessToken: string }` and sets cookie `jwt` (refresh token)

- `GET /auth/refresh` - Refresh access token

  - Reads the `jwt` cookie and returns `{ accessToken: string }`

- `POST /auth/logout` - Logout and clear cookie

#### Users

- `GET /users` - Get all users (protected)

- `POST /users` - Create user

  - Request body: `{ username, email, password }`

- `PATCH /users` - Update user (protected)

  - Request body: `{ id, username, email, password?, roles }`

- `DELETE /users` - Delete user (protected)
  - Request body: `{ userId }`

#### Projects (`/myprojects` - protected)

- `GET /myprojects` - Get projects for authenticated user
- `POST /myprojects` - Create a project `{ projectName }`
- `PATCH /myprojects` - Update a project `{ projectId, projectName }`
- `DELETE /myprojects` - Delete a project `{ projectId }`

#### Todos (`/mytodos` - protected)

- `GET /mytodos` - Get authenticated user's todos. Query params supported:
  - `?filterBy=project&value=PROJECT_ID`
  - `?filterBy=starred&value=true|false`
- `POST /mytodos` - Create todo `{ projectId, title, description, starred: boolean, dueAt?: ISODateString }`
- `PATCH /mytodos` - Update todo `{ todoId, title?, description?, starred?, dueAt?, projectId?, completed? }`
- `DELETE /mytodos` - Delete todo `{ todoId }`

## Data models

#### User

- `username: string`
- `email: string` (unique)
- `password: string` (hashed)
- `roles: ('User'|'Admin')[]` (defaults to `['User']`)

#### Project

- `projectName: string`
- `userId: ObjectId` (ref: `User`)

#### Todo

- `title: string`
- `description?: string`
- `starred: boolean`
- `completed: boolean`
- `dueAt?: Date`
- `projectId: ObjectId` (ref: `Project`)
- `userId: ObjectId` (ref: `User`)

## Examples (curl)

# Login and use access token

curl -c cookie.txt -X POST http://localhost:3500/auth \
 -H "Content-Type: application/json" \
 -d '{"username":"alice","password":"password123"}'

# Response includes accessToken. Use it in Authorization header:

curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3500/myprojects

# Refresh (reads cookie):

curl -b cookie.txt http://localhost:3500/auth/refresh

## Troubleshooting

- Database connection errors: ensure `DATABASE_URI` is correct and reachable from your environment.
- `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` missing: the server will throw on startup if these are not provided.
- CORS: allowed origins are configured in `src/config/allowedOrigins.ts`. Add your front-end origin if necessary.
- Token / authorization errors: ensure you're sending `Authorization: Bearer <token>` for protected routes and that the token hasn't expired.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Open a pull request with descriptive changes

Please keep changes focused and add tests where relevant.

## License

This project is provided under the ISC license.

---
