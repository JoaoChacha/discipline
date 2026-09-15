import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@discipline/eslint-config/base";
import { nextjsConfig } from "@discipline/eslint-config/nextjs";
import { reactConfig } from "@discipline/eslint-config/react";

export default defineConfig(
  {
    ignores: [".next/**"],
  },
  baseConfig,
  reactConfig,
  nextjsConfig,
  restrictEnvAccess,
);
