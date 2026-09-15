import { defineConfig } from "eslint/config";

import { baseConfig } from "@discipline/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
