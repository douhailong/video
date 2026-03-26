import type { inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@/trpc/routers';

export type ManyPlaylistTypes = inferProcedureOutput<AppRouter['playlists']['getMany']>;
