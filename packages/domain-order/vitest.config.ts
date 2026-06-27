import { defineConfig, mergeConfig } from 'vitest/config';

import { sharedVitestConfig } from '../../config/vitest/shared.js';

export default mergeConfig(
  sharedVitestConfig,

  defineConfig({
    test: {
      name: 'domain-order',
      include: ['test/**/*.test.ts'],
      coverage: {
        include: ['src/**/*.{ts,tsx}'],

        exclude: ['**/index.ts', '**/*.test.ts', '**/*.spec.ts'],

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
