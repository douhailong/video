import 'server-only';

import { cache } from 'react';
import { createHydrationHelpers } from '@trpc/react-query/rsc';

import { createCallerFactory, createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers';

const caller = createCallerFactory(appRouter)(createTRPCContext);

export const getQueryClient = cache(makeQueryClient);
export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient
);
