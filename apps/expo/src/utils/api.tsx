import { QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  createWSClient,
  loggerLink,
  wsLink,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import superjson from "superjson";

import type { AppRouter } from "@discipline/api";

import { authClient } from "./auth";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ...
    },
  },
});

export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
      colorMode: "ansi",
    }),
    wsLink({
      transformer: superjson,
      client: createWSClient({
        url: process.env.EXPO_PUBLIC_WS_URL ?? "ws://localhost:3001",
        connectionParams: () => ({
          cookie: authClient.getCookie(),
        }),
      }),
    }),
  ],
});

/**
 * A set of typesafe hooks for consuming your API.
 */
export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export type { RouterInputs, RouterOutputs } from "@discipline/api";
