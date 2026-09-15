import { defineConfig } from "eslint/config";

import { baseConfig, restrictEnvAccess } from "@discipline/eslint-config/base";

export default defineConfig(
  {
    ignores: ["script/**"],
  },
  baseConfig,
  restrictEnvAccess,
);
