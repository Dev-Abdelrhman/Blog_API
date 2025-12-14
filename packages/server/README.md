# Blog API

A production-ready REST API for a blogging platform built with NestJS, Prisma, and PostgreSQL. It supports user management, authentication, posts, and comments with role-based access control and secure password handling.

## Features

- User registration, login, logout with JWT authentication
- Token blacklist support for logout/invalidation
- Role-based access control (e.g., admin vs user)
- CRUD for Posts
- CRUD for Comments
- User profile and settings management
- Input validation with DTOs
- Hashing with Argon2
- Prisma ORM with migrations
- E2E and unit test scaffolding

## Tech Stack

- Runtime: Node.js
- Framework: NestJS (TypeScript)
- ORM: Prisma
- Database: PostgreSQL (configurable)
- Auth: JWT (access/refresh optional), role middleware, guards
- Lint/Format: ESLint, Prettier
- Package manager: pnpm

## Project Structure

- src/
  - auth/ – authentication controllers, services, guards, middleware
  - users/ – user domain (controllers, services, DTOs)
  - posts/ – posts domain (controllers, services, DTOs)
  - comments/ – comments domain (controllers, services, DTOs)
  - prisma/ – PrismaModule/Service integration
  - utils/ – shared utilities (e.g., Argon2 wrapper)
- prisma/
  - schema.prisma – database schema
  - migrations/ – Prisma migrations
- test/ – e2e tests

## Getting Started

1) Install dependencies

```bash
pnpm install
```

2) Configure environment variables

Create a .env file at the project root. Example:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME?schema=public"

# JWT
JWT_SECRET="your-strong-secret"
JWT_EXPIRES_IN="15m"
REFRESH_TOKEN_SECRET="your-strong-refresh-secret"
REFRESH_TOKEN_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development
```

3) Generate Prisma client and run migrations

```bash
pnpm prisma generate
pnpm prisma migrate deploy
# or for local development to create a new migration from schema changes
# pnpm prisma migrate dev --name init
```

4) Seed data (optional)

If you have a seed script, run it here. Otherwise, you can create data through the API.

5) Start the application

```bash
# development
pnpm run start:dev

# production
pnpm run build && pnpm run start:prod
```

The API will be available at http://localhost:3000

## NPM Scripts

- start – start in production mode
- start:dev – start with hot reload
- start:prod – start compiled dist
- build – compile TypeScript
- test – run unit tests
- test:e2e – run e2e tests
- test:cov – coverage report
- lint – run ESLint (if defined)
- format – run Prettier (if defined)

## API Overview

Routes may be protected with JWT and role middleware. Send the Authorization header: `Bearer <token>`.

- Auth
  - POST /auth/register – create a new user
  - POST /auth/login – obtain JWT
  - POST /auth/logout – invalidate current token (blacklist)

- Users
  - GET /users – list users (restricted)
  - GET /users/:id – get a user
  - PATCH /users/:id – update user (self or admin)
  - DELETE /users/:id – delete user (admin)

- Posts
  - GET /posts – list posts
  - GET /posts/:id – get a post by id
  - POST /posts – create post (auth required)
  - PATCH /posts/:id – update post (owner/admin)
  - DELETE /posts/:id – delete post (owner/admin)

- Comments
  - GET /comments?postId= – list comments for a post
  - POST /comments – create comment (auth required)
  - PATCH /comments/:id – update comment (owner/admin)
  - DELETE /comments/:id – delete comment (owner/admin)

Note: Exact route names may vary; check the controllers under src/ for authoritative definitions.

## Development Notes

- DTOs enforce validation and shape of requests (class-validator/class-transformer conventions)
- Middleware:
  - JWT middleware validates token and attaches user to the request
  - Role middleware enforces required roles
- Prisma service provides a single DB client via dependency injection
- Argon2 utility is used for hashing passwords

## Testing

Run tests locally:

```bash
pnpm run test
pnpm run test:e2e
```

## Migrations

Prisma migration workflow:

```bash
# create migration from changes in prisma/schema.prisma
pnpm prisma migrate dev --name <change-name>

# apply existing migrations
pnpm prisma migrate deploy
```

## License

MIT