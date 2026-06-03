// vitest.shared.ts

import { defineConfig } from 'vitest/config';

export const sharedVitestConfig = defineConfig({
  test: {
    environment: 'node',

    globals: true,

    pool: 'forks',

    isolate: true,

    testTimeout: 10_000,

    passWithNoTests: true,

    include: ['src/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],

    sequence: {
      concurrent: false,
    },

    coverage: {
      enabled: true,

      provider: 'v8',

      reporter: ['text', 'html', 'json-summary'],

      reportsDirectory: './coverage',

      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/__tests__/**',

        '**/*.d.ts',

        '**/dist/**',
        '**/coverage/**',

        '**/node_modules/**',
        'node_modules/**',

        '**/.turbo/**',

        '**/index.ts',

        '**/*.config.ts',

        '**/vitest.shared.ts',
        '**/vitest.workspace.ts',
        '**/vitest.setup.ts',

        '**/tsup.config.ts',
      ],

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
