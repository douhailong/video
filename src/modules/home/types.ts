import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type ManyPostTypes = inferProcedureOutput<AppRouter['posts']['getMany']>;
