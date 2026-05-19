// vitest.shared.ts

import { defineConfig } from "vitest/config";

export const sharedVitestConfig = defineConfig({
  test: {
    environment: "node",

    globals: true,

    pool: "forks",

    testTimeout: 10_000,

    passWithNoTests: true,

    sequence: {
      concurrent: false,
    },

    coverage: {
      provider: "v8",

      reporter: ["text", "html", "json-summary"],

      exclude: [
        "**/*.test.ts",

        "**/*.spec.ts",

        "**/__tests__/**",

        "**/*.d.ts",

        "**/dist/**",

        "**/coverage/**",

        "**/node_modules/**",
      ],
    },
  },
});
