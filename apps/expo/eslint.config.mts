import { defineConfig } from "eslint/config";

import { baseConfig } from "@discipline/eslint-config/base";
import { reactConfig } from "@discipline/eslint-config/react";

export default defineConfig(
  {
    ignores: [".expo/**", "expo-plugins/**"],
  },
  baseConfig,
  reactConfig,
);
