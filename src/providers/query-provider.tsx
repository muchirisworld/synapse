"use client";

import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

const QueryProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ConvexAuthNextjsProvider client={convex}>
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    </ConvexAuthNextjsProvider>
  )
};

export default QueryProvider;