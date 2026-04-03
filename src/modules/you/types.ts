import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type YouTypes = inferProcedureOutput<AppRouter['you']['getYou']>;
