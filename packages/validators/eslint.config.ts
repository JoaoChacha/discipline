import { defineConfig } from "eslint/config";

import { baseConfig } from "@discipline/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**", "src/**/*.test.ts", "vitest.config.ts"],
  },
  baseConfig,
);
