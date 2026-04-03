# GEMINI.md

## Project Overview
This is a YouTube clone built with **Next.js 15 (App Router)**, **tRPC v11**, **Drizzle ORM**, and **PostgreSQL**. The application supports video and picture posts, comments, likes, follows, and a dedicated creator studio.

### Key Technologies
- **Framework**: Next.js 15, React 19
- **API Layer**: tRPC v11 (with TanStack React Query v5)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js (v5 beta)
- **Styling**: Tailwind CSS v4, Radix UI (shadcn/ui)
- **Storage**: MinIO (S3-compatible)
- **Caching & Workflows**: Upstash (Redis)
- **Validation**: Zod

## Building and Running
The following commands are defined in `package.json`:

- `pnpm dev`: Starts the development server.
- `pnpm dev:server`: Starts the development server along with an ngrok tunnel (if configured).
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint for code quality checks.
- `pnpm categories`: Initializes category data via `src/scripts/init-categories.ts`.
- `pnpm init:minio`: Initializes MinIO storage via `scripts/index.ts`.

## Development Conventions

### Architecture: Modular Pattern
The project follows a modular structure located in `src/modules/`. Each feature module typically contains:
- `server/`: tRPC procedures and routers (`procedures.ts`).
- `ui/`: React components and views.
- `hooks/`: Feature-specific hooks.
- `types.ts`: TypeScript definitions for the module.

All module routers are aggregated in `src/trpc/routers/index.ts`.

### Database Schema
All database tables and relationships are defined in `src/db/schema.ts`.
- Uses `snake_case` for database columns (configured in `drizzle.config.ts`).
- Key tables: `users`, `accounts`, `posts`, `videos`, `pictures`, `postViews`, `postLikes`, `comments`, `follows`, `playlists`.

### tRPC Implementation
- **Context**: The tRPC context (`src/trpc/init.ts`) provides `authUserId` from the NextAuth session.
- **Procedures**:
  - `publicProcedure`: No authentication required.
  - `procedure`: Requires a valid authenticated user (throws `UNAUTHORIZED` if not found).
  - `suspenseProcedure`: Optimized for use with React Suspense.

### UI & Styling
- Components are built using **Tailwind CSS v4** and **Radix UI** primitives (via shadcn/ui).
- Icons are provided by `lucide-react`.
- Shared UI components are located in `src/components/ui/`.

### Storage
- **MinIO** is used for handling file uploads (videos, pictures, thumbnails).
- The client configuration is located in `src/lib/minio.ts`.

### Environment Variables
Ensure the following are configured in `.env.local`:
- `DATABASE_URL`: PostgreSQL connection string.
- `AUTH_SECRET`: NextAuth encryption secret.
- `MINIO_HOST`, `MINIO_PORT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`: Storage configuration.
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: Redis configuration.
