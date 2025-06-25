import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type MixVideoTypes = inferProcedureOutput<AppRouter['videos']['getOne']>;

export type MixManyVideoTypes = inferProcedureOutput<AppRouter['suggestions']['getMany']>;

// export type VideoTypes = typeof videos.$inferSelect;
// export type UserTypes = typeof users.$inferSelect;
