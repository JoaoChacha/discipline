import type { NextRequest } from "next/server";

export const TRUSTED_WEB_ORIGINS = new Set([
  "http://localhost:8081",
  "http://localhost:8082",
  "http://localhost:19006",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:8082",
  "http://127.0.0.1:19006",
]);

export function applyCors(req: Request, res: Response) {
  const origin = req.headers.get("origin");
  if (origin && TRUSTED_WEB_ORIGINS.has(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.headers.set(
      "Access-Control-Allow-Headers",
      req.headers.get("access-control-request-headers") ??
        "Content-Type, Authorization, Cookie, X-Requested-With, x-trpc-source",
    );
    res.headers.append("Vary", "Origin");
  }
  return res;
}

export function corsOptions(req: NextRequest) {
  return applyCors(req, new Response(null, { status: 204 }));
}
