import type { IncomingMessage } from "node:http";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";

import type { Auth } from "@discipline/auth";

import { appRouter } from "./root";
import { createTRPCContext } from "./trpc";

function headersFromUpgrade(
  req: IncomingMessage,
  connectionParams?: Record<string, unknown> | null,
) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (typeof value === "string") headers.set(key, value);
    else if (Array.isArray(value)) headers.set(key, value.join(", "));
  }
  const cookie = connectionParams?.cookie;
  if (typeof cookie === "string" && cookie.length > 0) {
    headers.set("cookie", cookie);
  }
  return headers;
}

export function startWsServer(options: { port: number; auth: Auth }) {
  const wss = new WebSocketServer({ port: options.port });

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: ({ req, info }) =>
      createTRPCContext({
        auth: options.auth,
        headers: headersFromUpgrade(
          req,
          info.connectionParams as Record<string, unknown> | null,
        ),
      }),
  });

  const shutdown = () => {
    handler.broadcastReconnectNotification();
    wss.close();
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);

  console.log(`[WS] tRPC listening on :${options.port}`);
  return { wss, shutdown };
}
