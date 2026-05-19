// packages/core/vitest.config.ts

import { defineConfig, mergeConfig } from "vitest/config";

import { sharedVitestConfig } from "../../vitest.shared";

export default mergeConfig(
  sharedVitestConfig,

  defineConfig({
    test: {
      name: "core",

      include: ["src/**/*.test.ts", "src/**/*.spec.ts"],

      coverage: {
        include: ["src/**/*.ts"],
      },
    },
  })
);
