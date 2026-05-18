// packages/application/vitest.config.ts

import { defineConfig, mergeConfig } from "vitest/config";

import { sharedVitestConfig } from "../../vitest.shared.js";

export default mergeConfig(
  sharedVitestConfig,

  defineConfig({
    test: {
      name: "application",

      setupFiles: ["./vitest.setup.ts"],

      include: ["src/**/*.test.ts", "testing/**/*.test.ts"],
    },
  })
);
