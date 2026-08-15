# Surf Mangalore Backend Foundation

This backend is a production-grade architecture foundation for future modules: admin dashboard, bookings, lessons, experiences, events, gallery, coaches, users, settings, contact messages, and payments.

No business features are implemented in this phase. The focus is maintainable architecture, security-first middleware, strict typing, validation infrastructure, and operational readiness.

## Stack

- Node.js + Express + TypeScript
- Prisma ORM + PostgreSQL (prepared, no domain models yet)
- Zod for runtime validation
- Pino + pino-http for structured logging
- Helmet, CORS, compression, rate limiting, cookie parser
- JWT and password utility layer prepared for future auth work

## Folder Structure

- `src/config`: Environment, logger, and Swagger bootstrap.
- `src/controllers`: Route controllers with thin request handling.
- `src/routes`: Versioned routing (`/api/v1`).
- `src/middlewares`: Error handling, async wrappers, validation, and rate limiting.
- `src/repositories`: Database access layer placeholder.
- `src/services`: Business/service orchestration placeholder.
- `src/validators`: Reusable validator definitions.
- `src/schemas`: Feature-level schema definitions placeholder.
- `src/models`: Domain model mapping placeholder.
- `src/utils`: Common response and error helpers.
- `src/types`: Shared app-level types.
- `src/constants`: Shared constants like HTTP status codes.
- `src/lib`: Prisma, JWT, and password utility primitives.
- `src/database`: Database helper layer placeholder.
- `prisma`: Prisma schema and generated client workflow.
- `docs`: OpenAPI source files.
- `tests`: Test architecture placeholder.

## Run

1. Copy `.env.example` to `.env`.
2. Ensure `DATABASE_URL` points to a PostgreSQL instance.
3. Run `npm install`.
4. Run `npm run prisma:generate`.
5. Run `npm run dev`.

Health endpoint: `GET /api/v1/health`
Swagger UI: `GET /api-docs`

## Quality Commands

- `npm run build` compiles TypeScript.
- `npm run lint` checks lint rules.
- `npm run prisma:validate` validates Prisma config.
- `npm run prisma:generate` generates Prisma client.

## Implementation Rules For Next Developers

- Keep controllers thin; business logic belongs in `services`.
- Keep data access in `repositories`; do not query Prisma directly in controllers.
- Validate all route input with Zod middleware.
- Use `ApiError` and central error middleware for failures.
- Return all successful responses through the API response helper.
- Add new modules under `routes/v1` and wire them from `routes/v1/index.ts`.
- Keep changes additive and version APIs when breaking changes are required.
