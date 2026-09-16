import type { NextRequest } from "next/server";

import { auth } from "~/auth/server";

const TRUSTED_WEB_ORIGINS = new Set([
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:19006",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8082",
  "http://127.0.0.1:19006",
]);

function applyCors(req: Request, res: Response) {
  const origin = req.headers.get("origin");
  if (origin && TRUSTED_WEB_ORIGINS.has(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      req.headers.get("access-control-request-headers") ??
        "Content-Type, Authorization, Cookie, X-Requested-With",
    );
    res.headers.append("Vary", "Origin");
  }
  return res;
}

export const OPTIONS = (req: NextRequest) =>
  applyCors(req, new Response(null, { status: 204 }));

const handler = async (req: NextRequest) =>
  applyCors(req, await auth.handler(req));

export { handler as GET, handler as POST };
