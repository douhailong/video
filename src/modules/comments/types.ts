import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type MixCommentTypes = inferProcedureOutput<AppRouter['comments']['getMany']>;
