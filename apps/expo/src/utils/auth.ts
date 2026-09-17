import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";

import { appScheme } from "./app-env";
import { getBaseUrl } from "./base-url";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  plugins: [
    expoClient({
      scheme: appScheme,
      storagePrefix: appScheme,
      storage: SecureStore,
    }),
  ],
});
