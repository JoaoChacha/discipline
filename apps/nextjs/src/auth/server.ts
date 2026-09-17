import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { nextCookies } from "better-auth/next-js";

import { initAuth } from "@discipline/auth";

import { env } from "~/env";

function resolveAppUrl() {
  if (env.APP_URL && env.APP_URL !== "http://localhost:3000") {
    return env.APP_URL;
  }
  if (env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }
  return env.APP_URL;
}

const baseUrl = resolveAppUrl();

export const auth = initAuth({
  baseUrl,
  productionUrl: baseUrl,
  secret: env.AUTH_SECRET,
  googleClientId: env.AUTH_GOOGLE_ID,
  googleClientSecret: env.AUTH_GOOGLE_SECRET,
  appleClientId: env.AUTH_APPLE_ID,
  appleClientSecret: env.AUTH_APPLE_SECRET,
  appleAppBundleIdentifier: env.AUTH_APPLE_APP_BUNDLE_IDENTIFIER,
  extraPlugins: [nextCookies()],
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
