import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type ManyStudioPostTypes = inferProcedureOutput<
  AppRouter['studioPost']['getMany']
>;
