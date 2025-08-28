import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type ManyCommentTypes = inferProcedureOutput<AppRouter['comments']['getMany']>;
