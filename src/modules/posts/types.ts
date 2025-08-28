import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type OnePostTypes = inferProcedureOutput<AppRouter['posts']['getOne']>;

export type ManyVideoTypes = inferProcedureOutput<AppRouter['suggestions']['getMany']>;

// export type VideoTypes = typeof videos.$inferSelect;
// export type UserTypes = typeof users.$inferSelect;
