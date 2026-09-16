import type { BetterAuthOptions, BetterAuthPlugin } from "better-auth";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";

import { db } from "@discipline/db/client";
import { newUserProfileValues, profile } from "@discipline/db/schema";

function configuredSecret(value: string | undefined): value is string {
  return Boolean(value && value !== "replace-me");
}

export function initAuth<
  TExtraPlugins extends BetterAuthPlugin[] = [],
>(options: {
  baseUrl: string;
  productionUrl: string;
  secret: string | undefined;

  googleClientId?: string;
  googleClientSecret?: string;
  appleClientId?: string;
  appleClientSecret?: string;
  appleAppBundleIdentifier?: string;
  extraPlugins?: TExtraPlugins;
}) {
  const config = {
    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    baseURL: options.baseUrl,
    secret: options.secret,
    plugins: [
      oAuthProxy({
        productionURL: options.productionUrl,
      }),
      expo(),
      ...(options.extraPlugins ?? []),
    ],
    databaseHooks: {
      user: {
        create: {
          after: async (createdUser) => {
            await db
              .insert(profile)
              .values(newUserProfileValues(createdUser.id))
              .onConflictDoNothing();
          },
        },
      },
    },
    socialProviders: {
      ...(configuredSecret(options.googleClientId) &&
      configuredSecret(options.googleClientSecret)
        ? {
            google: {
              clientId: options.googleClientId,
              clientSecret: options.googleClientSecret,
              redirectURI: `${options.productionUrl}/api/auth/callback/google`,
            },
          }
        : {}),
      ...(configuredSecret(options.appleClientId) &&
      configuredSecret(options.appleClientSecret)
        ? {
            apple: {
              clientId: options.appleClientId,
              clientSecret: options.appleClientSecret,
              appBundleIdentifier: options.appleAppBundleIdentifier,
              redirectURI: `${options.productionUrl}/api/auth/callback/apple`,
            },
          }
        : {}),
    },
    emailAndPassword: {
      enabled: true,
    },
    trustedOrigins: [
      "discipline://",
      "discipline-preprod://",
      "exp://",
      "http://localhost:8081",
      "http://localhost:19006",
      options.baseUrl,
      options.productionUrl,
    ],
    onAPIError: {
      onError(error, ctx) {
        console.error("BETTER AUTH API ERROR", error, ctx);
      },
    },
  } satisfies BetterAuthOptions;

  return betterAuth(config);
}

export type Auth = ReturnType<typeof initAuth>;
export type Session = Auth["$Infer"]["Session"];
