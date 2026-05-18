// vitest.shared.ts
import { defineConfig } from "vitest/config";

export const sharedVitestConfig = defineConfig({
  test: {
    environment: "node",

    globals: true,

    pool: "forks",

    testTimeout: 10000,

    setupFiles: ["./vitest.setup.ts"],

    sequence: {
      concurrent: false,
    },

    coverage: {
      provider: "v8",

      reporter: ["text", "html", "json-summary"],
      include: ["src/**/*.ts"],
      exclude: [
        "**/*.test.ts",

        "**/__tests__/**",

        "**/dist/**",

        "**/node_modules/**",
      ],
    },
  },
});
