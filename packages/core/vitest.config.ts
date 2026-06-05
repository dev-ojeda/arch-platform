// packages/core/vitest.config.ts

import { defineConfig, mergeConfig } from 'vitest/config';

import { sharedVitestConfig } from '../../vitest.shared.js';

export default mergeConfig(
  sharedVitestConfig,

  defineConfig({
    test: {
      name: 'core',

      setupFiles: ['../../vitest.setup.ts'],

      include: ['test/**/*.test.ts', 'test/**/*.spec.ts'],

      coverage: {
        include: ['src/**/*.ts'],

        exclude: ['src/index.ts', '**/*.test.ts', '**/*.spec.ts', '**/index.ts'],

        reportsDirectory: './coverage',

        thresholds: {
          lines: 40,
          functions: 25,
          statements: 40,
          branches: 25,
        },
      },
    },
  }),
);
