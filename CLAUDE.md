# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

YouTube clone built with Next.js 15 (App Router), tRPC, Drizzle ORM, and PostgreSQL. Features include video/picture posts, comments, likes, follows, and a creator studio.

## Common Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build production app
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm categories       # Initialize category data (tsx ./src/scripts/init-categories.ts)
pnpm init:minio       # Initialize MinIO storage (tsx scripts/index.ts)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router, React 19
- **Language**: TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: NextAuth.js (v5 beta)
- **API**: tRPC v11
- **State**: TanStack React Query v5
- **Styling**: Tailwind CSS v4, Radix UI primitives
- **Storage**: MinIO (S3-compatible)
- **Caching/Rate Limiting**: Upstash (Redis)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (home)/            # Main YouTube interface
│   │   ├── (close-navbar)/ # Video watch page (no sidebar)
│   │   └── (open-navbar)/  # Home, feed, shorts pages
│   └── (studio)/          # Creator studio
├── components/             # Shared UI components
├── db/                     # Database schema and connection
├── lib/                    # Utilities (minio, constants, zod schemas)
├── modules/                # Feature modules
│   └── {feature}/
│       ├── server/         # tRPC procedures
│       └── ui/             # React components
└── trpc/                  # tRPC initialization and routers
```

### Module Pattern

Features are organized in `src/modules/{feature}/`:
- Server-side: `server/procedures.ts` - tRPC router with queries/mutations
- UI components: `ui/components/` and `ui/views/`

All routers are combined in [src/trpc/routers/index.ts](src/trpc/routers/index.ts).

### Database Schema

Key tables in [src/db/schema.ts](src/db/schema.ts):
- `users` - User accounts (NextAuth)
- `posts` - Video/picture posts
- `videos` / `pictures` - Media files
- `postViews`, `postLikes`, `postCollections` - Post engagement
- `comments`, `commentLikes` - Comments

### tRPC Procedures

Use `publicProcedure` for public endpoints, `procedure` for authenticated. Context provides `userId` from session.

### Environment Variables

Required in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection
- `AUTH_SECRET` - NextAuth secret
- MinIO credentials (`MINIO_`*)
- Upstash credentials (`UPSTASH_`*)