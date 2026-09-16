import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@discipline/api";

import { applyCors, corsOptions } from "~/app/api/cors";
import { auth } from "~/auth/server";

export const OPTIONS = (req: NextRequest) => corsOptions(req);

const handler = async (req: NextRequest) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        auth: auth,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  return applyCors(req, response);
};

export { handler as GET, handler as POST };
