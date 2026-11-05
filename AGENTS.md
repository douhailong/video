# Project Guide for AI Coding Assistants

## Project

- Next.js 15 App Router application using React 19 and strict TypeScript.
- Tailwind CSS 4 is used for styling; shared UI primitives live under `src/components/ui`.
- The `@/*` TypeScript alias points to `src/*`.

## Structure

- `src/app`: route segments, layouts, and API handlers. Main user routes include `/`, `/watch`, `/shorts`, `/search`, `/feed/*`, and `/studio/*`.
- `src/modules/<domain>`: business features. UI is generally under `ui/views` and `ui/components`; server tRPC routers are under `server` where present.
- `src/components`: shared application components and providers. `src/components/ui` contains reusable UI primitives.
- `src/trpc`: tRPC initialization, router registration, React client, server helpers, and TanStack Query setup.
- `src/db`: Drizzle database connection and PostgreSQL schema.
- `src/lib`, `src/hooks`, and `src/store`: shared utilities, React hooks, and cross-component client state.

## Routes and Feature Entry Points

- The root layout and global providers are in `src/app/layout.tsx`.
- Home, watch, search, feed, and studio route pages are in their corresponding `src/app` route segments and delegate UI to `src/modules`.
- Studio dashboard UI is in `src/modules/studio`; video creation and publishing views are in `src/modules/studio-post`.
- API route handlers are under `src/app/api`, including `/api/trpc` and authentication/webhook endpoints.

## Data and State

- Register tRPC procedures in `src/trpc/routers/index.ts`; define domain procedures in `src/modules/<domain>/server/procedures.ts`.
- Use `publicProcedure` for public operations and `procedure` for authenticated operations. Validate procedure inputs with Zod.
- Client calls use the typed tRPC React client in `src/trpc/client.ts`, backed by TanStack Query. Server components can prefetch through `src/trpc/server.ts` and render with `HydrateClient`.
- Drizzle schema definitions are in `src/db/schema.ts`. Database access is provided by `src/db/index.ts`.
- Do not add database migration SQL files, migration runner scripts, or migration commands unless the user explicitly requests these artifacts. Update the relevant schema and application code directly, and explain any required database changes. Execute database changes only when authorized by the user.
- Zustand is used for shared dialog state; keep component-only interaction state local with React state. Check existing stores before introducing another store for the same feature.
- Upload flows use MinIO helpers and tRPC procedures; inspect the owning feature module before changing upload behavior.

## Working Conventions

- Keep business-specific UI and server logic in its domain module; put reusable primitives and cross-domain components in `src/components`.
- Preserve the server/client boundary: add `'use client'` only to client entry points that need hooks, browser APIs, or client interactions.
- Follow nearby file naming and export patterns; some modules use barrel `index.ts` files while others import concrete files directly.
- When modifying `package.json`, do not separately update, regenerate, or synchronize lockfiles such as `pnpm-lock.yaml`, or run dependency commands solely for lockfile maintenance, unless the user explicitly requests it. Lockfile changes generated automatically by otherwise required dependency operations are acceptable.
- You may read `.env*` files and environment variables when needed for the current task. Limit inspection to relevant configuration.
- Treat environment configuration as read-only: do not create, edit, delete, or overwrite `.env*` files, or set, unset, or change environment variable values.
- Do not reproduce credentials or secret values in responses, logs, documentation, source code, or source comments.
- Do not create test files such as `*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`, or `__tests__` directories unless the user explicitly requests tests.
- Do not add one-off setup, configuration, diagnostic, or verification scripts, or corresponding `package.json` commands, unless the user explicitly requests them. General authorization to implement a feature does not authorize adding these auxiliary artifacts.
- Prefer existing project commands and direct tool invocations for setup and verification. If a temporary helper is needed for authorized work, remove it and its command/documentation references before finishing.

## Commands and Validation

- `pnpm dev`: start the Next.js development server.
- `pnpm build`: create a production build.
- `pnpm start`: run the production server.
- `pnpm lint`: run the configured Next.js lint script.
- `pnpm exec tsc --noEmit`: run TypeScript checking; the repository does not define a dedicated typecheck script.
- `pnpm categories` and `pnpm init:minio` run project setup scripts; use them only when their data/service effects are intended.
- No test script or test/spec files were found during the repository scan.
