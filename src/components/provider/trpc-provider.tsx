'use client';

import { useState } from 'react';
import { httpBatchLink, httpLink, splitLink, isNonJsonSerializable } from '@trpc/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import superjson from 'superjson';

import { trpc } from '@/trpc/client';
import { makeQueryClient } from '@/trpc/query-client';

type TRPCProviderProps = {
  children: React.ReactNode;
};

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  return (clientQueryClientSingleton ??= makeQueryClient());
}

export function TRPCProvider({ children }: TRPCProviderProps) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        // FormData格式参数 https://discord-questions.trpc.io/m/1343947836143960066
        splitLink({
          condition: (opt) => isNonJsonSerializable(opt.input),
          true: httpLink({
            transformer: {
              serialize: (object) => object,
              deserialize: (object) => object.json as JSON
            },
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
            async headers() {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            }
          }),
          false: httpBatchLink({
            transformer: superjson,
            url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
            async headers() {
              const headers = new Headers();
              headers.set('x-trpc-source', 'nextjs-react');
              return headers;
            }
          })
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
}
