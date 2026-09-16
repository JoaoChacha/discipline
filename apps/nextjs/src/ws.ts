import { startWsServer } from "@discipline/api";

import { auth } from "~/auth/server";
import { env } from "~/env";

declare global {
  var __disciplineWsStarted: boolean | undefined;
}

export function ensureWsServer() {
  if (globalThis.__disciplineWsStarted) return;
  globalThis.__disciplineWsStarted = true;
  startWsServer({
    port: env.WS_PORT,
    auth,
  });
}

ensureWsServer();
