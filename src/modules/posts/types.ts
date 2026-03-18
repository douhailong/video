import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type OnePostTypes = inferProcedureOutput<AppRouter['posts']['getOne']>;
